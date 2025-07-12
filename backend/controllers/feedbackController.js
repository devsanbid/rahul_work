import { ProposalFeedback, Proposal, User, Job } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const createFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { proposalId, message, rating, feedbackType = 'message' } = req.body;
    const senderId = req.user.id;

    const proposal = await Proposal.findByPk(proposalId, {
      include: [
        { model: User, as: 'developer' },
        { model: Job, as: 'job', include: [{ model: User, as: 'client' }] }
      ]
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    let receiverId;
    if (req.user.role === 'user' && proposal.job.clientId === senderId) {
      receiverId = proposal.developerId;
    } else if (req.user.role === 'developer' && proposal.developerId === senderId) {
      receiverId = proposal.job.clientId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to send feedback for this proposal'
      });
    }

    const feedback = await ProposalFeedback.create({
      proposalId,
      senderId,
      receiverId,
      message,
      rating: feedbackType === 'review' ? rating : null,
      feedbackType
    });

    const feedbackWithDetails = await ProposalFeedback.findByPk(feedback.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'role'] },
        { model: Proposal, as: 'proposal' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Feedback sent successfully',
      feedback: feedbackWithDetails
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProposalFeedbacks = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const userId = req.user.id;

    const proposal = await Proposal.findByPk(proposalId, {
      include: [
        { model: User, as: 'developer' },
        { model: Job, as: 'job', include: [{ model: User, as: 'client' }] }
      ]
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    if (proposal.developerId !== userId && proposal.job.clientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view feedbacks for this proposal'
      });
    }

    const feedbacks = await ProposalFeedback.findAll({
      where: { proposalId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'role'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    await ProposalFeedback.update(
      { isRead: true },
      {
        where: {
          proposalId,
          receiverId: userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type = 'all' } = req.query;

    let whereClause = {
      [Op.or]: [
        { senderId: userId },
        { receiverId: userId }
      ]
    };

    if (type !== 'all') {
      whereClause.feedbackType = type;
    }

    const feedbacks = await ProposalFeedback.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'role'] },
        {
          model: Proposal,
          as: 'proposal',
          include: [
            { model: Job, as: 'job', attributes: ['id', 'title'] },
            { model: User, as: 'developer', attributes: ['id', 'name'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Error fetching user feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const markFeedbackAsRead = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user.id;

    const feedback = await ProposalFeedback.findByPk(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (feedback.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to mark this feedback as read'
      });
    }

    await feedback.update({ isRead: true });

    res.json({
      success: true,
      message: 'Feedback marked as read'
    });
  } catch (error) {
    console.error('Error marking feedback as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};