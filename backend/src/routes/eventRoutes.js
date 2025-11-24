const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  createEvent,
  getEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/my-events', authenticateToken, getEvents);
router.get('/:id', getEventById);

// Protected routes (authenticated users only)
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

module.exports = router;