const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  createEvent,
  getEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent
} = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// User routes (authenticated)
router.post('/:id/register', authenticateToken, registerForEvent);

// Admin routes (admin only)
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

module.exports = router;