const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { updateUserProfile, deleteUserAccount } = require('../controllers/userController');

const router = express.Router();

router.put('/profile', authenticateToken, updateUserProfile);
router.delete('/account', authenticateToken, deleteUserAccount);

module.exports = router;