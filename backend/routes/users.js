// routes/users.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// List everyone in my household
router.get(
  '/household',
  authMiddleware,
  userController.listHouseholdMembers
);

// “Who am I?” route for the current user
router.get(
  '/me',
  authMiddleware,
  userController.getMe
);

module.exports = router;
