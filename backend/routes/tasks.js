// routes/tasks.js
// Endpoints for game‐flow, CRUD, and stats under /api/tasks

const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const gameController = require("../controllers/gameControllers");

//Protect all /api/tasks routes
router.use(authMiddleware);

// Game‐flow: claim & complete

router.post("/:taskId/assign", gameController.assign);
router.post("/:taskId/complete", gameController.complete);

// CRUD: list, create, delete
// GET /api/tasks
router.get("/", gameController.getTasks);

// POST /api/tasks
router.post(
  "/",
  [
    body("taskName").notEmpty().withMessage("Task name is required"),
    body("points")
      .isInt({ min: 1 })
      .withMessage("Points must be a positive integer"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return gameController.createTask(req, res);
  }
);

// DELETE /api/tasks/:id
router.delete("/:id", gameController.deleteTask);

// Stats & Leaderboard
router.get("/stats", gameController.stats);
router.get("/weekly", gameController.weeklyStats);
router.get("/leaderboard", gameController.weeklyLeader);

module.exports = router;
