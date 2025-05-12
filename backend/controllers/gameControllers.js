//this file calls the gamelogic from the services folder to handle http requests and responses
// before (wrong path)
const gameLogic = require('../service/gameLogic');


//controller to handle assigning a task to a user - POST /tasks/:taskId/assign
/* * This controller “claims” a task for the current user.
 * - Reads `req.user.id` (set by your auth middleware)
 * - Reads `req.params.taskId` from the URL
 * - Calls GL.assignTask(userId, taskId)
 * - Returns the updated task JSON or a 400 with an error message
 * 
 * 
 *  * Note: we must use req.user.id (set by authMiddleware), not req.body.userId,
 * so we know exactly which authenticated user is claiming.
 */

exports.assign = async (req, res) => {
    try {
        const task = await gameLogic.assignTask(req.user.userId, req.params.taskId);//userIdfrom the auth middleware poins to who is claiming the task
    
        return res.json({ task });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.complete = async (req, res) => {
    try {
        const { task, user } = await gameLogic.completeTask(req.user.userId, req.params.taskId);
        return res.json({ task, user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

//controller to handle completion of a task -/tasks/:taskId/complete
/* POST /tasks/:taskId/complete
*
* Marks the task as done and awards points:
* - Ensures only the user who claimed it can finish it
* - Returns both the updated task and the updated user
*/
    

}

//controller to handle getting user stats - GET /tasks/stats
/* GET /users/me/stats
*
* Retrieves the user’s game stats:
* - Total points
* - Current level - Math.floor(totalPoints/100)
* - Global top-5 leaderboard (by total points)
*/

//this controller gets the user stats and returns the data
exports.createTask = async (req, res) => {
    try {
      const { title, points } = req.body;
  
      // Call gameLogic and pass the logged-in user ID from the auth middleware
      const task = await gameLogic.createTask(req.user.id, title, points);
  
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
exports.stats = async (req, res) => {
    try {
        const data = await gameLogic.getUserStats(req.user.id);
        // data === { totalPoints, level, leaderboard  }
        return res.json(data);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

/**
 * Weekly Stats
 * GET /users/me/weekly
 *
 * Returns for *this* week (Mon→Fri):
 *  - weeklyPoints: points earned between weekStart and weekEnd
 *  - hasHitGoal: boolean (weeklyPoints >= 100)
 */

exports.weeklyStats = async (req, res) => {
    try {
      const data = await gameLogic.getWeeklyStats(req.user.id);
      // data === { weeklyPoints, hasHitGoal }
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};
  
/**
 * Weekly Leaderboard
 * GET /leaderboard/weekly
 *
 * Returns top-10 users by points *this* week:
 *
 */
exports.weeklyLeader = async (req, res) => {
    try {
      const board = await gameLogic.getWeeklyLeaderboard();
      res.json(board);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };