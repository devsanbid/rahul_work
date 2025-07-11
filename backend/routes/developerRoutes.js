import express from 'express';
import { body } from 'express-validator';
import { 
  getDashboard, 
  getAvailableJobs, 
  getMyProjects, 
  getMyProposals, 
  getMyEarnings, 
  updateProjectProgress, 
  getMyReviews,
  getJobRequests,
  updateJobRequestStatus,
  getEarnings,
  createWithdrawal,
  getWithdrawals,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/developerController.js';
import { getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { CreateMessageReviews, getMessageReviews } from '../controllers/MessageController.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('developer'), getDashboard);

router.post('/message', CreateMessageReviews  );
router.get('/message', getMessageReviews  );

router.get('/jobs', authenticateToken, authorizeRoles('developer'), getAvailableJobs);

router.get('/projects', authenticateToken, authorizeRoles('developer'), getMyProjects);

router.get('/proposals', authenticateToken, authorizeRoles('developer'), getMyProposals);

router.get('/earnings', authenticateToken, authorizeRoles('developer'), getEarnings);

router.post('/withdrawals', authenticateToken, authorizeRoles('developer'), [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').isIn(['bank', 'paypal', 'stripe']).withMessage('Invalid payment method')
], createWithdrawal);

router.get('/withdrawals', authenticateToken, authorizeRoles('developer'), getWithdrawals);

router.put('/projects/:id/progress', authenticateToken, authorizeRoles('developer'), [
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
], updateProjectProgress);

router.get('/reviews', authenticateToken, authorizeRoles('developer'), getMyReviews);

router.get('/job-requests', authenticateToken, authorizeRoles('developer'), getJobRequests);

router.put('/job-requests/:id/status', authenticateToken, authorizeRoles('developer'), [
  body('status').isIn(['accepted', 'declined']).withMessage('Status must be accepted or declined')
], updateJobRequestStatus);

router.get('/notifications', getNotifications);

router.put('/notifications/:id/read', markNotificationAsRead);

router.put('/notifications/read-all', markAllNotificationsAsRead);

router.delete('/notifications/:id', deleteNotification);

router.get('/profile', authenticateToken, authorizeRoles('developer'), getProfile);

router.put('/profile', authenticateToken, authorizeRoles('developer'), [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('hourlyRate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number')
], updateProfile);

export default router;
