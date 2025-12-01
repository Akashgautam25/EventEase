const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getStats,
  getAllEvents,
  getAllRegistrations,
  getPopularEvents
} = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', authenticateToken, getStats);
router.get('/events', authenticateToken, getAllEvents);
router.get('/registrations', authenticateToken, getAllRegistrations);
router.get('/popular-events', authenticateToken, getPopularEvents);

module.exports = router;