import express from 'express';
import { body } from 'express-validator';
import { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  getMyJobs 
} from '../controllers/jobController.js';
import { 
  createProposal, 
  getProposalsByJob, 
  getMyProposals, 
  updateProposalStatus, 
  withdrawProposal,
  markProposalCompleted 
} from '../controllers/proposalController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('budgetType').isIn(['fixed', 'hourly']).withMessage('Invalid budget type'),
  body('experienceLevel').isIn(['Entry Level', 'Intermediate', 'Expert']).withMessage('Invalid experience level'),
  body('projectType').isIn(['One-time project', 'Ongoing work', 'Contract to hire']).withMessage('Invalid project type')
], createJob);

router.get('/', getAllJobs);

router.get('/my-jobs', authenticateToken, getMyJobs);

router.get('/:id', getJobById);

router.put('/:id', authenticateToken, updateJob);

router.delete('/:id', authenticateToken, deleteJob);

router.post('/:id/proposals', authenticateToken, authorizeRoles('developer'), [
  body('coverLetter').notEmpty().withMessage('Cover letter is required'),
  body('proposedBudget').isNumeric().withMessage('Proposed budget must be a number')
], createProposal);

router.get('/:id/proposals', authenticateToken, getProposalsByJob);

router.get('/proposals/my-proposals', authenticateToken, getMyProposals);

router.put('/proposals/:id/status', authenticateToken, [
  body('status').isIn(['accepted', 'rejected']).withMessage('Invalid status')
], updateProposalStatus);

router.put('/proposals/:id/withdraw', authenticateToken, withdrawProposal);

router.put('/proposals/:id/complete', authenticateToken, authorizeRoles('developer'), markProposalCompleted);

export default router;