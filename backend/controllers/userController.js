import { User, Job, JobRequest, Project, Payment, Notification, Review } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const postedJobs = await Job.count({
      where: { clientId: userId }
    });

    const activeProjects = await Project.count({
      where: { 
        clientId: userId,
        status: 'active'
      }
    });

    const totalSpent = await Payment.sum('amount', {
      where: {
        payerId: userId,
        status: 'completed'
      }
    }) || 0;

    const recentJobs = await Job.findAll({
      where: { clientId: userId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'status', 'proposalsCount', 'createdAt']
    });

    const recentProjects = await Project.findAll({
      where: { clientId: userId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['name', 'rating']
        }
      ]
    });

    const notifications = await Notification.findAll({
      where: { 
        userId,
        isRead: false
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      stats: {
        postedJobs,
        activeProjects,
        totalSpent
      },
      recentJobs,
      recentProjects,
      notifications
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = { clientId: req.user.id };
    
    if (status) whereClause.status = status;

    const jobs = await Job.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'assignedDeveloper',
          attributes: ['id', 'name', 'rating']
        }
      ]
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = { clientId: req.user.id };
    
    if (status) whereClause.status = status;

    const projects = await Project.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['id', 'name', 'rating', 'avatar']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'category']
        }
      ]
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const { type = 'sent' } = req.query;
    const whereClause = type === 'sent' 
      ? { payerId: req.user.id }
      : { payeeId: req.user.id };

    const payments = await Payment.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: type === 'sent' ? 'payee' : 'payer',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title']
        }
      ]
    });

    res.json({ payments });
  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false, userId } = req.query;
    const offset = (page - 1) * limit;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const whereClause = { userId: parseInt(userId) };
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalNotifications: count
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const notification = await Notification.findOne({
      where: { id, userId: parseInt(userId) }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ isRead: true });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    await Notification.update(
      { isRead: true },
      { where: { userId: parseInt(userId), isRead: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const notification = await Notification.findOne({
      where: { id, userId: parseInt(userId) }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDevelopers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      skills,
      minRate,
      maxRate,
      experienceLevel,
      availability = 'active'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      role: 'developer',
      status: availability
    };

    // Search by name, bio, or skills
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { bio: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by hourly rate range
    if (minRate || maxRate) {
      whereClause.hourlyRate = {};
      if (minRate) whereClause.hourlyRate[Op.gte] = parseFloat(minRate);
      if (maxRate) whereClause.hourlyRate[Op.lte] = parseFloat(maxRate);
    }

    // Filter by experience level
    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel;
    }

    let developers = await User.findAll({
      where: whereClause,
      attributes: {
        exclude: ['password']
      },
      order: [['rating', 'DESC'], ['totalProjects', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Filter by skills if provided
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      developers = developers.filter(dev => {
        if (!dev.skills || !Array.isArray(dev.skills)) return false;
        return skillsArray.some(skill => 
          dev.skills.some(devSkill => 
            devSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    // Get total count for pagination
    const totalCount = await User.count({
      where: {
        role: 'developer',
        status: availability
      }
    });

    res.json({
      developers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalDevelopers: totalCount
      }
    });
  } catch (error) {
    console.error('Get developers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password']
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      location,
      bio,
      website,
      linkedin,
      timezone
    } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      company: company || user.company,
      location: location || user.location,
      bio: bio || user.bio,
      website: website || user.website,
      linkedin: linkedin || user.linkedin,
      timezone: timezone || user.timezone
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password']
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyJobRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { clientId: req.user.id };
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows: jobRequests } = await JobRequest.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['id', 'name', 'rating', 'avatar']
        }
      ]
    });

    res.json({
      jobRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalRequests: count
      }
    });
  } catch (error) {
    console.error('Get my job requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const hireDeveloper = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { developerId, jobTitle, description, budget, deadline } = req.body;

    const developer = await User.findOne({
      where: { id: developerId, role: 'developer' }
    });

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Check if user has sufficient balance
    const user = await User.findByPk(req.user.id);
    if (user.balance < budget) {
      return res.status(400).json({ message: 'Insufficient balance. Please top up your account.' });
    }

    // Deduct balance from user (held in escrow until developer accepts)
    await user.update({
      balance: user.balance - budget
    });

    const jobRequest = await JobRequest.create({
      title: jobTitle,
      description,
      budget,
      budgetType: 'fixed',
      experienceLevel: developer.experienceLevel || 'Intermediate',
      projectType: 'One-time project',
      location: 'remote',
      deadline,
      clientId: req.user.id,
      developerId,
      status: 'pending',
      category: 'Direct Hire'
    });

    // Notify developer about the job request
    await Notification.create({
      userId: developerId,
      title: 'New Job Request',
      message: `You have received a job request for: ${jobTitle}`,
      type: 'job',
      relatedId: jobRequest.id,
      relatedType: 'job_request'
    });

    // Notify client about the request being sent
    await Notification.create({
      userId: req.user.id,
      title: 'Job Request Sent',
      message: `Your job request "${jobTitle}" has been sent to ${developer.name}`,
      type: 'job',
      relatedId: jobRequest.id,
      relatedType: 'job_request'
    });

    res.status(201).json({
      message: 'Job request sent successfully. Waiting for developer approval.',
      jobRequest,
      remainingBalance: user.balance - budget
    });
  } catch (error) {
    console.error('Hire developer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Balance management endpoints
export const getBalance = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['balance']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const topUpBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount. Amount must be greater than 0.' });
    }

    if (amount > 10000) {
      return res.status(400).json({ message: 'Maximum top-up amount is $10,000.' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newBalance = parseFloat(user.balance) + parseFloat(amount);

    await user.update({
      balance: newBalance
    });

    // Create a payment record for the top-up
    await Payment.create({
      payerId: req.user.id,
      payeeId: null,
      projectId: null,
      amount: amount,
      netAmount: amount,
      status: 'completed',
      paymentMethod: 'balance_topup',
      description: `Balance top-up of $${amount}`
    });

    res.json({
      message: 'Balance topped up successfully',
      newBalance: newBalance,
      topUpAmount: amount
    });
  } catch (error) {
    console.error('Top up balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Review functionality
export const createReview = async (req, res) => {
  try {
    const { developerId, projectId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has hired this developer
    const project = await Project.findOne({
      where: {
        id: projectId,
        clientId: req.user.id,
        developerId: developerId,
        status: 'completed'
      }
    });

    if (!project) {
      return res.status(403).json({ message: 'You can only review developers you have hired and completed projects with' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: {
        projectId: projectId,
        reviewerId: req.user.id,
        revieweeId: developerId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this developer for this project' });
    }

    const review = await Review.create({
      projectId: projectId,
      reviewerId: req.user.id,
      revieweeId: developerId,
      rating: rating,
      comment: comment || '',
      reviewType: 'client_to_developer'
    });

    // Update developer's average rating
    const allReviews = await Review.findAll({
      where: { revieweeId: developerId, reviewType: 'client_to_developer' }
    });
    
    const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
    
    await User.update(
      { rating: Math.round(averageRating * 10) / 10 },
      { where: { id: developerId } }
    );

    // Notify developer about the review
    await Notification.create({
      userId: developerId,
      title: 'New Review Received',
      message: `You received a ${rating}-star review for project: ${project.title}`,
      type: 'review',
      relatedId: review.id,
      relatedType: 'review'
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markProjectCompleted = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      where: {
        id: projectId,
        clientId: req.user.id,
        status: 'active'
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or already completed' });
    }

    await project.update({
      status: 'completed',
      endDate: new Date()
    });

    await Notification.create({
      userId: project.developerId,
      title: 'Project Completed',
      message: `Project "${project.title}" has been marked as completed by the client`,
      type: 'project',
      relatedId: project.id,
      relatedType: 'project'
    });

    res.json({
      message: 'Project marked as completed successfully',
      project
    });
  } catch (error) {
    console.error('Mark project completed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getHiredDevelopers = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        clientId: req.user.id,
        status: 'completed'
      },
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['id', 'name', 'avatar', 'rating']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Get existing reviews to mark which developers have been reviewed
    const existingReviews = await Review.findAll({
      where: {
        reviewerId: req.user.id,
        reviewType: 'client_to_developer'
      },
      attributes: ['projectId', 'revieweeId']
    });

    const reviewedProjects = new Set(existingReviews.map(r => r.projectId));

    const developersToReview = projects.map(project => ({
      projectId: project.id,
      projectTitle: project.title,
      developer: project.developer,
      completedAt: project.updatedAt,
      hasReviewed: reviewedProjects.has(project.id)
    }));

    res.json({ developersToReview });
  } catch (error) {
    console.error('Get hired developers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};