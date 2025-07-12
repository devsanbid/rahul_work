import express from 'express';
import { body } from 'express-validator';
import { 
  getDashboard, 
  getMyJobs, 
  getMyProjects, 
  getMyPayments, 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  getDevelopers,
  getProfile,
  updateProfile,
  hireDeveloper,
  getMyJobRequests,
  getBalance,
  topUpBalance,
  createReview,
  getHiredDevelopers,
  markProjectCompleted
} from '../controllers/userController.js';
import { createFeedback, getProposalFeedbacks, getUserFeedbacks, markFeedbackAsRead } from '../controllers/feedbackController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('user'), getDashboard);

router.get('/jobs', authenticateToken, authorizeRoles('user'), getMyJobs);

router.get('/projects', authenticateToken, authorizeRoles('user'), getMyProjects);

router.get('/job-requests', authenticateToken, authorizeRoles('user'), getMyJobRequests);

router.get('/payments', authenticateToken, authorizeRoles('user'), getMyPayments);

router.get('/notifications', getNotifications);

router.put('/notifications/:id/read', markNotificationAsRead);

router.put('/notifications/read-all', markAllNotificationsAsRead);

router.delete('/notifications/:id', deleteNotification);

router.get('/developers', authenticateToken, authorizeRoles('user'), getDevelopers);

router.get('/profile', authenticateToken, authorizeRoles('user'), getProfile);

router.put('/profile', authenticateToken, authorizeRoles('user'), [
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
], updateProfile);

router.post('/hire-developer', authenticateToken, authorizeRoles('user'), [
  body('developerId').isInt().withMessage('Developer ID is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number')
], hireDeveloper);

// Balance management routes
router.get('/balance', authenticateToken, authorizeRoles('user'), getBalance);

router.post('/balance/topup', authenticateToken, authorizeRoles('user'), [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').custom(value => {
    if (value <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (value > 10000) {
      throw new Error('Maximum top-up amount is $10,000');
    }
    return true;
  })
], topUpBalance);

// Review routes
router.post('/reviews', authenticateToken, authorizeRoles('user'), [
  body('developerId').isInt().withMessage('Developer ID is required'),
  body('projectId').isInt().withMessage('Project ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string')
], createReview);

router.get('/hired-developers', authenticateToken, authorizeRoles('user'), getHiredDevelopers);

// Project management routes
router.put('/projects/:projectId/complete', authenticateToken, authorizeRoles('user'), markProjectCompleted);

router.post('/feedback', authenticateToken, authorizeRoles('user'), [
  body('proposalId').isInt().withMessage('Valid proposal ID is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('feedbackType').optional().isIn(['message', 'review']).withMessage('Invalid feedback type'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], createFeedback);

router.get('/feedback', authenticateToken, authorizeRoles('user'), getUserFeedbacks);

router.get('/proposals/:proposalId/feedback', authenticateToken, authorizeRoles('user'), getProposalFeedbacks);

router.put('/feedback/:feedbackId/read', authenticateToken, authorizeRoles('user'), markFeedbackAsRead);

export default router;