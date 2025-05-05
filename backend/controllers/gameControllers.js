//this file calls the gamelogic from the services folder to handle http requests and responses
const gameLogic = require('../services/gameLogic');

//controller to handle assigning a task to a user - POST /tasks/:taskId/assign
/* * This controller “claims” a task for the current user.
 * - Reads `req.user.id` (set by your auth middleware)
 * - Reads `req.params.taskId` from the URL
 * - Calls GL.assignTask(userId, taskId)
 * - Returns the updated task JSON or a 400 with an error message
 */

exports.assign = async (req, res) => {
    try {
        const task = await gameLogic.assignTask(req.body.userId, req.params.taskId);//userIdfrom the auth middleware poins to who is claiming the task
    
        return res.json({ task });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//controller to handle completion of a task -/tasks/:taskId/complete
/* POST /tasks/:taskId/complete
*
* Marks the task as done and awards points:
* - Ensures only the user who claimed it can finish it
* - Returns both the updated task and the updated user
*/
    
exports.complete = async (req, res) => {
    try {
        const { task, user } = await gameLogic.completeTask(req.user.id, req.params.taskId);
        return res.json({ task, user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//controller to handle getting user stats - GET /tasks/stats
/* GET /users/me/stats
*
* Retrieves the user’s game stats:
* - Total points
* - Current level - Math.floor(totalPoints/100)
* - Global top-5 leaderboard (by total points)
*/

exports.stats = async (req, res) => {
    try {
        const data = await gameLogic.getUserStats(req.user.id);
        return res.json(data);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
