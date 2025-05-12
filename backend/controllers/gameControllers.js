// This file calls the gameLogic functions from the services folder 
// to handle HTTP requests and responses. Each controller maps to a route
// and uses authMiddleware to access the authenticated user's ID.

const gameLogic = require('../service/gameLogic');

/**
 * Controller to handle assigning a task to a user
 * Route: POST /tasks/:taskId/assign
 *
 * - This endpoint allows the currently logged-in user to "claim" a task.
 * - It reads the task ID from the URL param and the user ID from the decoded JWT (req.user.userId).
 * - The logic layer (gameLogic.assignTask) handles the DB update.
 */
exports.assign = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.userId; // Set by your auth middleware after decoding JWT

    const task = await gameLogic.assignTask(userId, taskId);
    return res.json({ task });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to handle completing a task
 * Route: POST /tasks/:taskId/complete
 *
 * - This endpoint marks a task as completed by the user.
 * - Only the user who claimed the task can complete it.
 * - Points are awarded and the user is updated accordingly.
 */
exports.complete = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.userId;

    const { task, user } = await gameLogic.completeTask(userId, taskId);
    return res.json({ task, user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to handle creating a new task
 * Route: POST /tasks
 *
 * - This endpoint allows the logged-in user to create a new task.
 * - The task is automatically assigned to them (using req.user.userId).
 * - Task creation is handled in the gameLogic layer.
 */
exports.createTask = async (req, res) => {
  try {
    const { title, points } = req.body;
    const userId = req.user.userId;

    const task = await gameLogic.createTask(userId, title, points);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to return user statistics
 * Route: GET /users/me/stats
 *
 * - Retrieves the total points, current level, and the top-10 leaderboard.
 */
exports.stats = async (req, res) => {
  try {
    const data = await gameLogic.getUserStats(req.user.userId);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Controller to return weekly user stats
 * Route: GET /users/me/weekly
 *
 * - Calculates and returns weekly points and whether the user hit their goal.
 */
exports.weeklyStats = async (req, res) => {
  try {
    const data = await gameLogic.getWeeklyStats(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Controller to return the weekly leaderboard
 * Route: GET /leaderboard/weekly
 *
 * - Fetches the top-10 users by points this week.
 */
exports.weeklyLeader = async (req, res) => {
  try {
    const board = await gameLogic.getWeeklyLeaderboard();
    res.json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
