//this file calls the gamelogic from the services folder to handle http requestes and responses
const gameLogic = require('../services/gameLogic');

//controller to handle assigning a task to a user - POST /tasks/:taskId/assign

exports.assign = async (req, res) => { 
    try {
      const task = await gameLogic.assignTask(req.body.userId, req.params.taskId);//userIdfrom the auth middleware
    
        return res.json({ task });
  } catch (error) {
        return res.status(400).json({error: error.message});
    }

    //controller to handle completion of a task -/tasks/:taskId/complete
    //





}
