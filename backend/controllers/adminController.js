import { User, Job, Project, Payment, Review, Withdrawal, AdminEarnings } from '../models/index.js';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalJobs = await Job.count();
    const totalProjects = await Project.count();
    const activeProjects = await Project.count({ where: { status: 'active' } });
    
    const totalRevenue = await Payment.sum('platformFee', {
      where: { status: 'completed' }
    }) || 0;

    const monthlyRevenue = await Payment.sum('platformFee', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }) || 0;

    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    const recentJobs = await Job.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name']
        }
      ]
    });

    res.json({
      stats: {
        totalUsers,
        totalJobs,
        totalProjects,
        activeProjects,
        totalRevenue,
        monthlyRevenue
      },
      usersByRole,
      recentUsers,
      recentJobs
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (role) whereClause.role = role;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalUsers: count
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin user' });
    }

    await user.update({ status });

    res.json({
      message: 'User status updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, location, role, status } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userData = {
      name,
      email,
      password,
      phone: phone || null,
      location: location || null,
      role: role || 'user',
      status: status || 'active'
    };

    const user = await User.create(userData);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, location, role, status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ message: 'Cannot modify admin user' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (role && user.role !== 'admin') updateData.role = role;
    if (status && user.role !== 'admin') updateData.status = status;

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Job,
          as: 'postedJobs',
          attributes: ['id', 'title', 'status', 'budget', 'createdAt']
        },
        {
          model: Job,
          as: 'assignedJobs',
          attributes: ['id', 'title', 'status', 'budget', 'createdAt']
        },
        {
          model: Project,
          as: 'clientProjects',
          attributes: ['id', 'title', 'status', 'budget', 'createdAt']
        },
        {
          model: Project,
          as: 'developerProjects',
          attributes: ['id', 'title', 'status', 'budget', 'createdAt']
        },
        {
          model: Review,
          as: 'receivedReviews',
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          include: [{
            model: User,
            as: 'reviewer',
            attributes: ['name']
          }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate user statistics
    const totalJobs = (user.postedJobs?.length || 0) + (user.assignedJobs?.length || 0);
    const totalProjects = (user.clientProjects?.length || 0) + (user.developerProjects?.length || 0);
    const averageRating = user.receivedReviews?.length > 0 
      ? (user.receivedReviews.reduce((sum, review) => sum + review.rating, 0) / user.receivedReviews.length).toFixed(1)
      : 0;

    res.json({
      user: {
        ...user.toJSON(),
        stats: {
          totalJobs,
          totalProjects,
          averageRating,
          totalReviews: user.receivedReviews?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedDeveloper',
          attributes: ['id', 'name', 'email']
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
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminSettings = async (req, res) => {
  try {
    const adminUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const settings = {
      profile: {
        firstName: adminUser.name ? adminUser.name.split(' ')[0] : '',
        lastName: adminUser.name ? adminUser.name.split(' ').slice(1).join(' ') : '',
        email: adminUser.email,
        phone: adminUser.phone || '',
        bio: adminUser.bio || ''
      },
      company: {
        name: adminUser.companyName || 'DevHire Inc.',
        website: adminUser.companyWebsite || 'https://devhire.com',
        address: adminUser.companyAddress || ''
      },
      preferences: {
        notifications: {
          email: adminUser.emailNotifications !== false,
          push: adminUser.pushNotifications !== false,
          sms: adminUser.smsNotifications === true,
          marketing: adminUser.marketingNotifications === true
        },
        theme: adminUser.theme || 'light',
        language: adminUser.language || 'english'
      }
    };

    res.json({ settings });
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const { profile, company, preferences } = req.body;
    const adminUser = await User.findByPk(req.user.id);

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const updateData = {};

    if (profile) {
      if (profile.firstName || profile.lastName) {
        updateData.name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      }
      if (profile.email && profile.email !== adminUser.email) {
        const existingUser = await User.findOne({ where: { email: profile.email } });
        if (existingUser && existingUser.id !== adminUser.id) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        updateData.email = profile.email;
      }
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.bio !== undefined) updateData.bio = profile.bio;
    }

    if (company) {
      if (company.name !== undefined) updateData.companyName = company.name;
      if (company.website !== undefined) updateData.companyWebsite = company.website;
      if (company.address !== undefined) updateData.companyAddress = company.address;
    }

    if (preferences) {
      if (preferences.notifications) {
        if (preferences.notifications.email !== undefined) {
          updateData.emailNotifications = preferences.notifications.email;
        }
        if (preferences.notifications.push !== undefined) {
          updateData.pushNotifications = preferences.notifications.push;
        }
        if (preferences.notifications.sms !== undefined) {
          updateData.smsNotifications = preferences.notifications.sms;
        }
        if (preferences.notifications.marketing !== undefined) {
          updateData.marketingNotifications = preferences.notifications.marketing;
        }
      }
      if (preferences.theme !== undefined) updateData.theme = preferences.theme;
      if (preferences.language !== undefined) updateData.language = preferences.language;
    }

    await adminUser.update(updateData);

    const updatedSettings = {
      profile: {
        firstName: adminUser.name ? adminUser.name.split(' ')[0] : '',
        lastName: adminUser.name ? adminUser.name.split(' ').slice(1).join(' ') : '',
        email: adminUser.email,
        phone: adminUser.phone || '',
        bio: adminUser.bio || ''
      },
      company: {
        name: adminUser.companyName || 'DevHire Inc.',
        website: adminUser.companyWebsite || 'https://devhire.com',
        address: adminUser.companyAddress || ''
      },
      preferences: {
        notifications: {
          email: adminUser.emailNotifications !== false,
          push: adminUser.pushNotifications !== false,
          sms: adminUser.smsNotifications === true,
          marketing: adminUser.marketingNotifications === true
        },
        theme: adminUser.theme || 'light',
        language: adminUser.language || 'english'
      }
    };

    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Update admin settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminUser = await User.findByPk(req.user.id);

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const isCurrentPasswordValid = await adminUser.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    await adminUser.update({ password: newPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update admin password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFinancialData = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'weekly':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarterly':
        dateFilter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'yearly':
        dateFilter = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Financial Stats
    const totalRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: { [Op.gte]: dateFilter }
      }
    }) || 0;

    const totalExpenses = await Payment.sum('platformFee', {
      where: {
        status: 'completed',
        createdAt: { [Op.gte]: dateFilter }
      }
    }) || 0;

    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1)
        }
      }
    }) || 0;

    const netProfit = totalRevenue - totalExpenses;

    // Additional Stats
    const pendingPayments = await Payment.sum('amount', {
      where: { status: 'pending' }
    }) || 0;

    const totalProjects = await Project.count();
    const averageProjectValue = totalProjects > 0 ? totalRevenue / totalProjects : 0;

    // Monthly chart data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthRevenue = await Payment.sum('amount', {
        where: {
          status: 'completed',
          createdAt: {
            [Op.gte]: monthStart,
            [Op.lte]: monthEnd
          }
        }
      }) || 0;

      const monthExpenses = await Payment.sum('platformFee', {
        where: {
          status: 'completed',
          createdAt: {
            [Op.gte]: monthStart,
            [Op.lte]: monthEnd
          }
        }
      }) || 0;

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses
      });
    }

    // Payment methods distribution
    const paymentMethods = await Payment.findAll({
      attributes: [
        'paymentMethod',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: 'completed',
        paymentMethod: { [Op.ne]: null }
      },
      group: ['paymentMethod']
    });

    const totalPaymentAmount = paymentMethods.reduce((sum, method) => sum + parseFloat(method.dataValues.totalAmount), 0);
    const paymentMethodsData = paymentMethods.map(method => ({
      method: method.paymentMethod || 'Unknown',
      amount: parseFloat(method.dataValues.totalAmount),
      percentage: totalPaymentAmount > 0 ? Math.round((parseFloat(method.dataValues.totalAmount) / totalPaymentAmount) * 100) : 0
    }));

    // Recent transactions
    const recentTransactions = await Payment.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'payee',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title']
        }
      ]
    });

    res.json({
      financialStats: {
        totalRevenue,
        monthlyRevenue,
        totalExpenses,
        netProfit
      },
      additionalStats: {
        pendingPayments,
        averageProjectValue: Math.round(averageProjectValue)
      },
      monthlyData,
      paymentMethods: paymentMethodsData,
      recentTransactions: recentTransactions.map(transaction => ({
        id: transaction.id,
        type: transaction.amount > 0 ? 'income' : 'expense',
        description: transaction.description || `Payment for ${transaction.project?.title || 'Project'}`,
        amount: Math.abs(transaction.amount),
        date: transaction.createdAt.toISOString().split('T')[0],
        project: transaction.project?.title || 'N/A',
        status: transaction.status,
        paymentMethod: transaction.paymentMethod || 'N/A',
        payer: transaction.payer?.name || 'Unknown',
        payee: transaction.payee?.name || 'Unknown'
      }))
    });
  } catch (error) {
    console.error('Get financial data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminEarnings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count, rows: earnings } = await AdminEarnings.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'developer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Withdrawal,
          as: 'withdrawal',
          attributes: ['id', 'amount', 'status', 'paymentMethod', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate total earnings
    const totalEarningsData = await AdminEarnings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('feeAmount')), 'totalEarnings']
      ],
      where: { status: 'completed' }
    });

    const totalEarnings = totalEarningsData[0]?.dataValues?.totalEarnings || 0;

    // Calculate pending earnings
    const pendingEarningsData = await AdminEarnings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('feeAmount')), 'pendingEarnings']
      ],
      where: { status: 'pending' }
    });

    const pendingEarnings = pendingEarningsData[0]?.dataValues?.pendingEarnings || 0;

    res.json({
      earnings,
      summary: {
        totalEarnings: parseFloat(totalEarnings),
        pendingEarnings: parseFloat(pendingEarnings)
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalEarnings: count
      }
    });
  } catch (error) {
    console.error('Get admin earnings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEarningStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const earning = await AdminEarnings.findByPk(id);
    if (!earning) {
      return res.status(404).json({ message: 'Admin earning not found' });
    }

    earning.status = status;
    await earning.save();

    res.json({
      message: 'Admin earning status updated successfully',
      earning
    });
  } catch (error) {
    console.error('Update earning status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWithdrawalEarnings = async (req, res) => {
  try {
    // Get total admin earnings from withdrawals
    const totalEarningsData = await AdminEarnings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('feeAmount')), 'totalEarnings']
      ],
      where: { status: 'completed' }
    });

    const totalEarnings = totalEarningsData[0]?.dataValues?.totalEarnings || 0;

    // Get pending earnings
    const pendingEarningsData = await AdminEarnings.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('feeAmount')), 'pendingEarnings']
      ],
      where: { status: 'pending' }
    });

    const pendingEarnings = pendingEarningsData[0]?.dataValues?.pendingEarnings || 0;

    // Get monthly earnings for chart
    const monthlyEarnings = await AdminEarnings.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('feeAmount')), 'earnings']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1) // This year
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      totalEarnings: parseFloat(totalEarnings),
      pendingEarnings: parseFloat(pendingEarnings),
      monthlyEarnings
    });
  } catch (error) {
    console.error('Get withdrawal earnings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};