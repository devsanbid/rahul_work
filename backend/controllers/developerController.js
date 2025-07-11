import { User, Job, Proposal, Project, Review, Payment, Withdrawal, Notification, AdminEarnings, JobRequest } from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeProjects = await Project.count({
      where: { 
        developerId: userId,
        status: 'active'
      }
    });

    const completedProjects = await Project.count({
      where: { 
        developerId: userId,
        status: 'completed'
      }
    });

    const totalEarnings = await Payment.sum('netAmount', {
      where: {
        payeeId: userId,
        status: 'completed'
      }
    }) || 0;

    const pendingProposals = await Proposal.count({
      where: {
        developerId: userId,
        status: 'pending'
      }
    });

    const recentProjects = await Project.findAll({
      where: { developerId: userId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'rating']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'category']
        }
      ]
    });

    const recentProposals = await Proposal.findAll({
      where: { developerId: userId },
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'budget', 'budgetType'],
          include: [
            {
              model: User,
              as: 'client',
              attributes: ['name']
            }
          ]
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
        activeProjects,
        completedProjects,
        totalEarnings,
        pendingProposals
      },
      recentProjects,
      recentProposals,
      notifications
    });
  } catch (error) {
    console.error('Get developer dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEarnings = async (req, res) => {
  try {
    const developerId = req.user.id;
    const { period = 'all' } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      };
    } else if (period === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = {
        createdAt: {
          [Op.gte]: startOfYear
        }
      };
    }

    const completedPayments = await Payment.findAll({
      where: {
        payeeId: developerId,
        status: 'completed',
        ...dateFilter
      },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['title'],
          include: [
            {
              model: User,
              as: 'client',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const pendingPayments = await Payment.findAll({
      where: {
        payeeId: developerId,
        status: 'pending'
      }
    });

    const withdrawals = await Withdrawal.findAll({
      where: {
        developerId
      },
      order: [['createdAt', 'DESC']]
    });

    const totalEarnings = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.netAmount), 0);
    const pendingAmount = pendingPayments.reduce((sum, payment) => sum + parseFloat(payment.netAmount), 0);
    const totalWithdrawn = withdrawals
      .filter(w => w.status === 'completed')
      .reduce((sum, withdrawal) => sum + parseFloat(withdrawal.amount), 0);
    const availableBalance = totalEarnings - totalWithdrawn;

    const thisMonthPayments = completedPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    });
    const thisMonthEarnings = thisMonthPayments.reduce((sum, payment) => sum + parseFloat(payment.netAmount), 0);

    const lastMonthPayments = completedPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return paymentDate >= lastMonth && paymentDate < thisMonth;
    });
    const lastMonthEarnings = lastMonthPayments.reduce((sum, payment) => sum + parseFloat(payment.netAmount), 0);

    const monthlyGrowth = lastMonthEarnings > 0 
      ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1)
      : thisMonthEarnings > 0 ? 100 : 0;

    const transactions = [
      ...completedPayments.map(payment => ({
        id: payment.id,
        type: 'payment',
        description: payment.project?.title || payment.description,
        amount: parseFloat(payment.netAmount),
        date: payment.createdAt,
        status: payment.status,
        client: payment.project?.client?.name || null
      })),
      ...withdrawals.map(withdrawal => ({
        id: `w_${withdrawal.id}`,
        type: 'withdrawal',
        description: `${withdrawal.paymentMethod.charAt(0).toUpperCase() + withdrawal.paymentMethod.slice(1)} Withdrawal`,
        amount: -parseFloat(withdrawal.amount),
        date: withdrawal.createdAt,
        status: withdrawal.status,
        client: null
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      summary: {
        availableBalance,
        pendingPayments: pendingAmount,
        totalEarnings,
        thisMonthEarnings,
        monthlyGrowth: `${monthlyGrowth > 0 ? '+' : ''}${monthlyGrowth}% from last month`
      },
      transactions
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod, bankDetails, paypalEmail, stripeAccountId } = req.body;
    const developerId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    if (!['bank', 'paypal', 'stripe'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const completedPayments = await Payment.findAll({
      where: {
        payeeId: developerId,
        status: 'completed'
      }
    });

    const withdrawals = await Withdrawal.findAll({
      where: {
        developerId,
        status: 'completed'
      }
    });

    const totalEarnings = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.netAmount), 0);
    const totalWithdrawn = withdrawals.reduce((sum, withdrawal) => sum + parseFloat(withdrawal.amount), 0);
    const availableBalance = totalEarnings - totalWithdrawn;

    if (amount > availableBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawalData = {
      developerId,
      amount,
      paymentMethod,
      status: 'pending'
    };

    if (paymentMethod === 'bank' && bankDetails) {
      withdrawalData.bankDetails = bankDetails;
    } else if (paymentMethod === 'paypal' && paypalEmail) {
      withdrawalData.paypalEmail = paypalEmail;
    } else if (paymentMethod === 'stripe' && stripeAccountId) {
      withdrawalData.stripeAccountId = stripeAccountId;
    }

    const withdrawal = await Withdrawal.create(withdrawalData);

    // Calculate 10% admin fee
    const adminFeePercentage = 10;
    const adminFeeAmount = (amount * adminFeePercentage) / 100;
    const netWithdrawalAmount = amount - adminFeeAmount;

    // Create admin earnings record
    await AdminEarnings.create({
      withdrawalId: withdrawal.id,
      developerId,
      originalAmount: amount,
      feeAmount: adminFeeAmount,
      feePercentage: adminFeePercentage,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        ...withdrawal.toJSON(),
        originalAmount: amount,
        adminFee: adminFeeAmount,
        netAmount: netWithdrawalAmount
      }
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWithdrawals = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { developerId: req.user.id };
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows: withdrawals } = await Withdrawal.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      withdrawals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalWithdrawals: count
      }
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      experienceLevel,
      budgetType,
      location,
      search,
      minBudget,
      maxBudget
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { 
      status: 'open',
      clientId: { [Op.ne]: req.user.id }
    };

    if (category) whereClause.category = category;
    if (experienceLevel) whereClause.experienceLevel = experienceLevel;
    if (budgetType) whereClause.budgetType = budgetType;
    if (location && location !== 'all') whereClause.location = location;
    if (minBudget) whereClause.budget = { [Op.gte]: minBudget };
    if (maxBudget) {
      whereClause.budget = whereClause.budget 
        ? { ...whereClause.budget, [Op.lte]: maxBudget }
        : { [Op.lte]: maxBudget };
    }
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const appliedJobIds = await Proposal.findAll({
      where: { developerId: req.user.id },
      attributes: ['jobId']
    }).then(proposals => proposals.map(p => p.jobId));

    if (appliedJobIds.length > 0) {
      whereClause.id = { [Op.notIn]: appliedJobIds };
    }

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'rating', 'totalProjects']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalJobs: count
      }
    });
  } catch (error) {
    console.error('Get available jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = { developerId: req.user.id };
    
    if (status) whereClause.status = status;

    const projects = await Project.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'rating', 'avatar']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'category', 'budget', 'budgetType']
        }
      ]
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get my projects error:', error);
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
      order: [['createdAt', 'DESC']],
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
      ]
    });

    res.json({ proposals });
  } catch (error) {
    console.error('Get my proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyEarnings = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    let dateFilter = {};
    
    if (period !== 'all') {
      const now = new Date();
      switch (period) {
        case 'week':
          dateFilter.createdAt = {
            [Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          };
          break;
        case 'month':
          dateFilter.createdAt = {
            [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1)
          };
          break;
        case 'year':
          dateFilter.createdAt = {
            [Op.gte]: new Date(now.getFullYear(), 0, 1)
          };
          break;
      }
    }

    const payments = await Payment.findAll({
      where: {
        payeeId: req.user.id,
        status: 'completed',
        ...dateFilter
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['title']
        }
      ]
    });

    const totalEarnings = payments.reduce((sum, payment) => sum + parseFloat(payment.netAmount), 0);

    res.json({
      totalEarnings,
      payments
    });
  } catch (error) {
    console.error('Get my earnings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, description } = req.body;

    const project = await Project.findOne({
      where: { id, developerId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    await project.update({ progress });

    await Notification.create({
      userId: project.clientId,
      title: 'Project Progress Updated',
      message: `${project.title} progress updated to ${progress}%`,
      type: 'project',
      relatedId: project.id,
      relatedType: 'project'
    });

    res.json({
      message: 'Project progress updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { revieweeId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['name', 'avatar']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['title']
        }
      ]
    });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { developerId: req.user.id };
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
          as: 'client',
          attributes: ['id', 'name', 'rating', 'avatar']
        }
      ]
    });

    const formattedJobRequests = jobRequests.map(request => ({
      id: request.id,
      title: request.title,
      description: request.description,
      requirements: request.requirements,
      category: request.category,
      skills: request.skills,
      budget: request.budget,
      budgetType: request.budgetType,
      experienceLevel: request.experienceLevel,
      projectType: request.projectType,
      location: request.location,
      deadline: request.deadline,
      duration: request.duration,
      status: request.status,
      message: request.message,
      isUrgent: request.isUrgent,
      createdAt: request.createdAt,
      client: {
        id: request.client.id,
        name: request.client.name,
        rating: request.client.rating || 0,
        avatar: request.client.avatar
      }
    }));

    res.json({
      jobRequests: formattedJobRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalRequests: count
      }
    });
  } catch (error) {
    console.error('Get job requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJobRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const jobRequest = await JobRequest.findOne({
      where: { id, developerId: req.user.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'balance']
        }
      ]
    });

    if (!jobRequest) {
      return res.status(404).json({ message: 'Job request not found' });
    }

    if (jobRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Job request already processed' });
    }

    await jobRequest.update({ status });

    if (status === 'accepted') {
      const developer = await User.findByPk(req.user.id);
      const newBalance = parseFloat(developer.balance) + parseFloat(jobRequest.budget);
      
      await developer.update({ balance: newBalance });

      await Payment.create({
        payerId: jobRequest.clientId,
        payeeId: req.user.id,
        projectId: null,
        amount: jobRequest.budget,
        netAmount: jobRequest.budget,
        status: 'completed',
        paymentMethod: 'project_payment',
        description: `Payment for accepted job request: ${jobRequest.title}`
      });

      const project = await Project.create({
        title: jobRequest.title,
        description: jobRequest.description,
        budget: jobRequest.budget,
        budgetType: jobRequest.budgetType,
        deadline: jobRequest.deadline,
        status: 'active',
        clientId: jobRequest.clientId,
        developerId: jobRequest.developerId,
        jobRequestId: jobRequest.id
      });

      await Notification.create({
        userId: jobRequest.clientId,
        title: 'Job Request Accepted',
        message: `Your job request "${jobRequest.title}" has been accepted and project has been created`,
        type: 'project',
        relatedId: project.id,
        relatedType: 'project'
      });

      await Notification.create({
        userId: req.user.id,
        title: 'Payment Received',
        message: `You received $${jobRequest.budget} for accepting job request: ${jobRequest.title}`,
        type: 'payment',
        relatedId: jobRequest.id,
        relatedType: 'job_request'
      });
    } else {
      // Refund the budget to client when request is declined
      const client = await User.findByPk(jobRequest.clientId);
      const refundAmount = parseFloat(jobRequest.budget);
      const newClientBalance = parseFloat(client.balance) + refundAmount;
      
      await client.update({ balance: newClientBalance });

      await Payment.create({
        payerId: null,
        payeeId: jobRequest.clientId,
        projectId: null,
        amount: refundAmount,
        netAmount: refundAmount,
        status: 'completed',
        paymentMethod: 'refund',
        description: `Refund for declined job request: ${jobRequest.title}`
      });

      await Notification.create({
        userId: jobRequest.clientId,
        title: 'Job Request Declined',
        message: `Your job request "${jobRequest.title}" has been declined. $${refundAmount} has been refunded to your balance.`,
        type: 'payment',
        relatedId: jobRequest.id,
        relatedType: 'job_request'
      });
    }

    res.json({
      message: `Job request ${status} successfully`,
      jobRequest
    });
  } catch (error) {
    console.error('Update job request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false, type, userId } = req.query;
    const offset = (page - 1) * limit;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const whereClause = { userId: parseInt(userId) };
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }
    if (type && type !== 'all') {
      whereClause.type = type;
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