const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getStats,
  getAllEvents,
  getAllUsers,
  updateUserRole,
  updateUserStatus
} = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', authenticateToken, getStats);
router.get('/events', authenticateToken, getAllEvents);
router.get('/users', authenticateToken, getAllUsers);
router.put('/users/:userId/role', authenticateToken, updateUserRole);
router.put('/users/:userId/status', authenticateToken, updateUserStatus);

module.exports = router;