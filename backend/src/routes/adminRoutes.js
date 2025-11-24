const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Simple mock routes for now
router.get('/stats', authenticateToken, (req, res) => {
  res.json({ totalEvents: 0, totalUsers: 0, ticketsSold: 0, totalRevenue: 0 });
});

router.get('/events', authenticateToken, (req, res) => {
  res.json([]);
});

router.get('/users', authenticateToken, (req, res) => {
  res.json([]);
});

module.exports = router;