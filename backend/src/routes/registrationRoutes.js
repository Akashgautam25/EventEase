const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  createRegistration,
  getUserRegistrations,
  getEventRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');

const router = express.Router();

// All routes require authentication
router.post('/', authenticateToken, createRegistration);
router.get('/:userId', authenticateToken, getUserRegistrations);
router.get('/event/:eventId', authenticateToken, getEventRegistrations);
router.delete('/:id', authenticateToken, cancelRegistration);

module.exports = router;