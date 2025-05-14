const Task = require('../models/task');
const User = require('../models/user');


//The game logic has 2 main blocks: 
//Block 1  - Deals with finding the user and task and awarding points
//Block 2 - Deals with the leaderboard and ranking the users based on their points


//Block 1
//Game logic steps using the async function - mark a task as completed by a user

// Create a new task assigned to a user
async function createTask(userId, title, points) {
    const task = new Task({
      taskName,
      points,
      assignedTo: userId,  //required field from Task model
      status: "claimed" // Or "unclaimed" if task is not yet assigned"
    });
  
    await task.save();
    return task;
  }

async function completeTask(userId, taskId) { 
    //Step 1 - find the task by its id
    //find the task by its id
    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error('Task not found'); //error handling if no task is found
    }

    if (task.completedBy) {
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

//Block 2
//Game logic steps using the async function - define the status of the user based on points and then add to the public leaderboard

async function getUserStats(userId) {
    //fetch the user by id
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found'); //error handling if no user is found
    }

    // calculate personal stats
    const totalPoints = user.points || 0;
    const level = Math.floor(totalPoints / 100);

    // Find all users, sort by descending points, take top 10, and only return name+points.
    const leaderboard = await User.find()
    .sort({ points: -1 })
    .limit(10)
    .select('name points');



    return { totalPoints, level, leaderboard };

}


module.exports = { completeTask, getUserStats, createTask };







