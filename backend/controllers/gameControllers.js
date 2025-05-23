// controllers/gameControllers.js

/* Maps HTTP requests to gameLogic service functions,
 enforcing request/response and error handling.
 Each method assumes `req.user.userId` has been set
 by authMiddleware (JWT). */

const Task = require('../models/task');
const gameLogic = require('../service/gameLogic');

/*
 * GET /api/tasks
 * List all tasks, including the assigned user’s name.
 */
exports.getTasks = async (req, res) => {
  try {
    // Retrieves every task from the DB (no filtering)
    let tasks = await gameLogic.listAllTasks();

    // Convert each document to a plain object and add `completed`
    tasks = tasks.map(t => {
      const obj = t.toObject ? t.toObject() : {}; // turn doc into POJO
      return {
        ...obj, // return all task properties - id, taskName, points, assignedTo.

        // Expose the task’s “status” string so the frontend can decide:
        //     - 'available'  → show Claim button
        //     - 'inProgress' → show Complete button
        //     - 'completed'  → show Completed badge
        status: t.status, // <-- string for UI

        // Expose the assignee’s name (or null) so the UI knows
        // if the current user “me.name” matches and can complete it.
        assignedTo: t.assignedTo && t.assignedTo.name ? t.assignedTo.name : null,
        completed: t.status === 'completed', // <-- boolean flag for UI
      };
    });

    // return the augmented array based on the patched boolean
    return res.json(tasks);
  } catch (err) {
    console.error('ERROR getTasks:', err);
    return res.status(500).json({ error: err.message });
  }
}

/*
 * POST /api/tasks
 * Create a new task.
 * Body: { taskName: string, points: number, assignedTo?: string }
 */
exports.createTask = async (req, res) => {
  try {
    const creatorId = req.user.userId;
    const { taskName, points, assignedTo } = req.body;

    // Create and optionally assign (defaults to creator)
    const task = await gameLogic.createTask(
      creatorId,
      taskName,
      Number(points),
      assignedTo
    );

    return res.status(201).json(task);
  } catch (err) {
    console.error('ERROR createTask:', err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/tasks/:taskId/assign
 * Claim an unassigned task (or re-claim your own).
 * No body needed.
 */
exports.assign = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.taskId;

    // Mark the task as “in progress” under your userId
    const task = await gameLogic.assignTask(userId, taskId);
    return res.json(task);
  } catch (err) {
    console.error('ERROR assign:', err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/tasks/:taskId/complete
 * Complete a task you’ve claimed, award points to the user.
 */
exports.complete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.taskId;

    // Returns { task, user } after updating both
    const { task, user } = await gameLogic.completeTask(userId, taskId);
    return res.json({ task, user });
  } catch (err) {
    console.error('ERROR complete:', err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task you’ve claimed. Others’ tasks cannot be deleted.
 */
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    //check that only the assigned user can delete the task
    if (!task.assignedTo || task.assignedTo.toString() !== userId) {
      return res.status(403).json({ message: 'Only the assigned user can delete this task' });
    }

    // Delete the task
       await Task.deleteOne({ _id: taskId });
        return res.json({ message: 'Task deleted successfully' });
      } catch (err) {
        console.error('ERROR deleteTask:', err);
        return res.status(500).json({ message: 'Server error deleting task' });
      }
}

/**
 * GET /api/tasks/stats
 * Retrieves overall stats for the current user (points, level, badges, etc.).
 */
exports.stats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await gameLogic.getUserStats(userId);
    return res.json(data);
  } catch (err) {
    console.error('ERROR stats:', err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * GET /api/tasks/weekly
 * Retrieves this week’s points for the current user & whether they hit their goal.
 */
exports.weeklyStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await gameLogic.getWeeklyStats(userId);
    return res.json(data);
  } catch (err) {
    console.error('ERROR weeklyStats:', err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * GET /api/tasks/leaderboard
 * Retrieves the top-10 users by points this week.
 * Publicly visible (no auth middleware required if you mount it separately).
 */
exports.weeklyLeader = async (req, res) => {
  try {
    const board = await gameLogic.getWeeklyLeaderboard();
    return res.json(board);
  } catch (err) {
    console.error('ERROR weeklyLeader:', err);
    return res.status(400).json({ error: err.message });
  }
};
