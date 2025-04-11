const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// POST /auth/login
router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
