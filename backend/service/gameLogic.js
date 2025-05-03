const Task = require('../models/task');
const User = require('../models/user');


//The game logic has 2 main blocks: 
//Block 1  - Deals with finding the user and task and awarding points
//Block 2 - Deals with the leaderboard and ranking the users based on their points


//Block 1
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

    //Step 3: find the user and award points for the completed task
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found'); //error handling if no user is found
    }

    //if the user is new, default the value to 0 and then add the points
    user.points = (user.points || 0) + task.points;
    // Save the change back to MongoDB.
    await user.save();

    //Step 4: return the updated results
    return { task, user };

}
