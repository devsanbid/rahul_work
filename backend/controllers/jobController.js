import { Job, User, Proposal } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      requirements,
      category,
      skills,
      budget,
      budgetType,
      experienceLevel,
      projectType,
      location,
      deadline
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      category,
      skills,
      budget,
      budgetType,
      experienceLevel,
      projectType,
      location,
      deadline,
      clientId: req.user.id
    });

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      experienceLevel,
      budgetType,
      location,
      search,
      status = 'open'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { status };

    if (category) whereClause.category = category;
    if (experienceLevel) whereClause.experienceLevel = experienceLevel;
    if (budgetType) whereClause.budgetType = budgetType;
    if (location && location !== 'all') whereClause.location = location;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
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
        totalJobs: count,
        hasNext: page * limit < count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'rating', 'totalProjects', 'location']
        },
        {
          model: Proposal,
          as: 'proposals',
          include: [
            {
              model: User,
              as: 'developer',
              attributes: ['id', 'name', 'rating', 'experienceLevel']
            }
          ]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.increment('viewsCount');

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findOne({
      where: { id, clientId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    await job.update(updates);

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      where: { id, clientId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    await job.destroy();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
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
      include: [
        {
          model: Proposal,
          as: 'proposals',
          include: [
            {
              model: User,
              as: 'developer',
              attributes: ['id', 'name', 'rating']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};