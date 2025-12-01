const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  createRegistration,
  getUserRegistrations,
  getEventRegistrations,
  cancelRegistration,
  deleteRegistration
} = require('../controllers/registrationController');

const router = express.Router();

// All routes require authentication
router.post('/', authenticateToken, createRegistration);
router.get('/:userId', authenticateToken, getUserRegistrations);
router.get('/event/:eventId', authenticateToken, getEventRegistrations);
router.delete('/cancel/:id', authenticateToken, cancelRegistration);
router.delete('/:id', authenticateToken, deleteRegistration);

module.exports = router;