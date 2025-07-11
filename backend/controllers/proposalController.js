import { Proposal, Job, User, Notification } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const createProposal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: jobId } = req.params;
    const { coverLetter, proposedBudget, proposedTimeline } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is no longer accepting proposals' });
    }

    if (job.clientId === req.user.id) {
      return res.status(400).json({ message: 'Cannot apply to your own job' });
    }

    const existingProposal = await Proposal.findOne({
      where: { jobId, developerId: req.user.id }
    });

    if (existingProposal) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const proposal = await Proposal.create({
      jobId,
      developerId: req.user.id,
      coverLetter,
      proposedBudget,
      proposedTimeline
    });

    await job.increment('proposalsCount');

    const proposalWithDetails = await Proposal.findByPk(proposal.id, {
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['id', 'name', 'rating', 'experienceLevel']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title']
        }
      ]
    });

    res.status(201).json({
      message: 'Proposal submitted successfully',
      proposal: proposalWithDetails
    });
  } catch (error) {
    console.error('Create proposal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProposalsByJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findOne({
      where: { id: jobId, clientId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const proposals = await Proposal.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['id', 'name', 'rating', 'experienceLevel', 'location', 'skills']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ proposals });
  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyProposals = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = { developerId: req.user.id };
    
    if (status) whereClause.status = status;

    const proposals = await Proposal.findAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'client',
              attributes: ['id', 'name', 'rating']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ proposals });
  } catch (error) {
    console.error('Get my proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const proposal = await Proposal.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.job.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await proposal.update({ status });

    if (status === 'accepted') {
      await Job.update(
        { 
          status: 'in_progress',
          assignedDeveloperId: proposal.developerId
        },
        { where: { id: proposal.jobId } }
      );

      await Proposal.update(
        { status: 'rejected' },
        { 
          where: { 
            jobId: proposal.jobId,
            id: { [Op.ne]: proposal.id }
          }
        }
      );

      try {
        await Notification.create({
          userId: proposal.developerId,
          type: 'proposal_accepted',
          title: 'Proposal Accepted',
          message: `Your proposal for "${proposal.job.title}" has been accepted!`,
          relatedId: proposal.id,
          relatedType: 'proposal'
        });
      } catch (notificationError) {
        console.error('Failed to create acceptance notification:', notificationError);
      }
    } else if (status === 'rejected') {
      try {
        await Notification.create({
          userId: proposal.developerId,
          type: 'proposal_rejected',
          title: 'Proposal Rejected',
          message: `Your proposal for "${proposal.job.title}" has been rejected.`,
          relatedId: proposal.id,
          relatedType: 'proposal'
        });
      } catch (notificationError) {
        console.error('Failed to create rejection notification:', notificationError);
      }
    }

    res.json({
      message: 'Proposal status updated successfully',
      proposal
    });
  } catch (error) {
    console.error('Update proposal status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const withdrawProposal = async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await Proposal.findOne({
      where: { id, developerId: req.user.id }
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw this proposal' });
    }

    await proposal.update({ status: 'withdrawn' });

    const job = await Job.findByPk(proposal.jobId);
    await job.decrement('proposalsCount');

    res.json({ message: 'Proposal withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw proposal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markProposalCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await Proposal.findOne({
      where: { id, developerId: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'client',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    if (proposal.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted proposals can be marked as completed' });
    }

    // Update proposal status to completed
    await proposal.update({ status: 'completed' });

    // Update job status to completed
    await Job.update(
      { status: 'completed' },
      { where: { id: proposal.jobId } }
    );

    // Create notification for the client
    try {
      const { Notification } = await import('../models/index.js');
      await Notification.create({
        userId: proposal.job.client.id,
        type: 'project_completed',
        title: 'Project Completed',
        message: `Your project "${proposal.job.title}" has been marked as completed by the developer.`,
        relatedId: proposal.jobId,
        relatedType: 'job'
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Continue execution even if notification fails
    }

    res.json({
      message: 'Proposal marked as completed successfully',
      proposal
    });
  } catch (error) {
    console.error('Mark proposal completed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};