const Task = require('../models/task');
const User = require('../models/user');



//Game logic steps using the async function - mark a task as completed by a user

async function completeTask(userId, taskId) { 
    //Step 1 - find the task by its id
    //find the task by its id
    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error('Task not found'); //error handling if no task is found
    }

    if (task.completed) {
        throw new Error('Task already completed'); //error handling if task is already completed
    }
    //Step 2 - mark the task as completed
    task.completedBy = userId;
    // Save the change back to MongoDB.
    await task.save();








}
