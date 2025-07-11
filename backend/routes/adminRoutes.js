import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllJobs,
  getFinancialData,
  getAdminSettings,
  updateAdminSettings,
  updateAdminPassword,
  getAdminEarnings,
  updateEarningStatus,
  getWithdrawalEarnings
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('admin'), getDashboardStats);

router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);

router.get('/users/:id', authenticateToken, authorizeRoles('admin'), getUserById);

router.post('/users', authenticateToken, authorizeRoles('admin'), [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('role').optional().isIn(['admin', 'developer', 'user']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
], createUser);

router.put('/users/:id', authenticateToken, authorizeRoles('admin'), [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('role').optional().isIn(['client', 'developer', 'admin']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
], updateUser);

router.put('/users/:id/status', authenticateToken, authorizeRoles('admin'), [
  body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
], updateUserStatus);

router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

router.get('/jobs', authenticateToken, authorizeRoles('admin'), getAllJobs);

router.get('/financials', authenticateToken, authorizeRoles('admin'), getFinancialData);

// Admin settings
router.get('/settings', authenticateToken, authorizeRoles('admin'), getAdminSettings);
router.put('/settings', authenticateToken, authorizeRoles('admin'), updateAdminSettings);
router.put('/settings/password', authenticateToken, authorizeRoles('admin'), updateAdminPassword);

// Admin earnings from withdrawals
router.get('/earnings', authenticateToken, authorizeRoles('admin'), getAdminEarnings);
router.put('/earnings/:id/status', authenticateToken, authorizeRoles('admin'), [
  body('status').isIn(['pending', 'completed']).withMessage('Invalid status')
], updateEarningStatus);
router.get('/withdrawal-earnings', authenticateToken, authorizeRoles('admin'), getWithdrawalEarnings);

export default router;