// service/gameLogic.js

// Core game logic: task creation, assignment, completion,
// point-awarding, and stats/leaderboard computations.


const Task = require('../models/task');
const User = require('../models/user');

/*
  List every task in the system, populating the assigned user's name.
  GET /api/tasks
 */
async function listAllTasks() {
  return Task
    .find()
    .populate('assignedTo', 'name');
}

/*
 Create a new task - POST /api/tasks
 
 * @param {string} creatorId  – userId of who created this task
 * @param {string} taskName   – text of the task
 * @param {number} points     – reward points for completion
 * @param {string} [assignedTo] – optional userId to assign immediately
 */
async function createTask(creatorId, taskName, points, assignedTo) {

  
   // Don’t default to creatorId—only assign if the front end passed a different user
  const assignee = (assignedTo && assignedTo !== creatorId) ? assignedTo : null;
  // If we pre-assigned someone, status='inProgress', otherwise leave it 'available'
  const status = assignedTo === creatorId ? 'inProgress' : 'available';
  
 
  const task = new Task({
    creator:    creatorId,
    taskName,
    points,
    assignedTo: assignee, // null if not assigned
    status,

  });

  await task.save();
  return task.populate('assignedTo', 'name');
}

/*
 * Claim (assign) an unclaimed task.
 * POST /api/tasks/:taskId/assign
 *
 * @param {string} userId  – id of the user claiming it
 * @param {string} taskId  – id of the task to claim
 */
async function assignTask(userId, taskId) {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');
  if (task.assignedTo) throw new Error('Task already claimed');

  task.assignedTo = userId;
  task.status     = 'inProgress';
  await task.save();
  return task.populate('assignedTo', 'name');
}

/*
 * Complete a claimed task and award points to the user.
 * POST /api/tasks/:taskId/complete
 *
 * @param {string} userId  – id of the user completing it
 * @param {string} taskId  – id of the task to complete
 * @returns { task, user } – updated task and user with new points
 */
async function completeTask(userId, taskId) {
  // 1) Load task and its assignee
  const task = await Task.findById(taskId).populate('assignedTo');
  if (!task) {
    throw new Error('Task not found');
  }

  // 2) Ownership check: must be the assigned user
  if (!task.assignedTo || task.assignedTo._id.toString() !== userId) {
    throw new Error('Not your task');
  }

  // 3) Prevent double‐completion: only award once
  if (task.status === 'completed') {
    throw new Error('Task already completed');
  }

  // 4) Mark task complete
  task.completed   = true;
  task.completedBy = userId;
  task.completedAt = new Date();
  task.status      = 'completed';
  await task.save();

  // 5) Award points to user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.points = (user.points || 0) + (task.points || 0);
  await user.save();

  return { task, user };
}

/*
 * Delete a task (only if you’re the assignee).
 * DELETE /api/tasks/:id
 *
 * @param {string} userId  – id of the user requesting deletion
 * @param {string} taskId  – id of the task to delete
 */
async function deleteTask(userId, taskId) {
  const task = await Task.findById(taskId);
  if (!task) throw new Error('Task not found');
  if (task.assignedTo.toString() !== userId) {
    throw new Error('Not your task');
  }
  await task.remove();
}

/*
  Get overall stats for a user: total points, level, badges.
  GET /api/tasks/stats
 */
async function getUserStats(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const totalPoints = user.points || 0;
  const level       = Math.floor(totalPoints / 100) + 1; // e.g. every 100 pts is a level
  return {
    totalPoints,
    level,
    badges: user.badges || []
  };
}

/*
 * Get this week’s stats for a user.
 * GET /api/tasks/weekly
 */
async function getWeeklyStats(userId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Sum points for tasks completed by this user in the last 7 days
  const tasks = await Task.find({
    completedBy: userId,
    completedAt: { $gte: oneWeekAgo }
  });

  const weeklyPoints = tasks.reduce((sum, t) => sum + (t.points || 0), 0);
  // Example goal: 100 points per week
  const goalMet = weeklyPoints >= 100;

  return { weeklyPoints, goalMet };
}

/*
 * Get the top 5 users by points in the last week.
 * GET /api/tasks/leaderboard
 */
async function getWeeklyLeaderboard() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Aggregate completed tasks over the last week, grouped by user
  const pipeline = [
    { $match: { completed: true, completedAt: { $gte: oneWeekAgo } }},
    { $group: { _id: '$completedBy', weeklyPoints: { $sum: '$points' } }},
    { $sort: { weeklyPoints: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from:     'users',
        localField: '_id',
        foreignField: '_id',
        as:       'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id:   '$user._id',
        name:  '$user.name',
        points:'$weeklyPoints'
      }
    }
  ];

  return Task.aggregate(pipeline);
}

module.exports = {
  listAllTasks,
  createTask,
  assignTask,
  completeTask,
  deleteTask,
  getUserStats,
  getWeeklyStats,
  getWeeklyLeaderboard
};








