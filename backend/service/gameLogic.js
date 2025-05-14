const Task = require('../models/task');
const User = require('../models/user');


//The game logic has 2 main blocks: 
//Block 1  - Deals with finding the user and task and awarding points
//Block 2 - Deals with the leaderboard and ranking the users based on their points


//Block 1
//Game logic steps using the async function - mark a task as completed by a user

// Create a new task assigned to a user - updated to be able to assigne unclaimed tasks to other users
async function createTask(userId, taskName, points, assignee = userId) {
    const task = new Task({
      taskName,
      points,
      assignedTo: assignee,  // The user who is assigned to the task
      status: assignee === userId ? "inProgress" : "available", // Set status based on whether the task is assigned to the user
    });
  
    await task.save();
    return task;
}
  async function assignTask(userId, taskId) {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.assignedTo) throw new Error("Task already claimed");

  task.assignedTo = userId;
  task.status = "inProgress";
  await task.save();
  return await task.populate("assignedTo", "name");
}

async function completeTask(userId, taskId) { 
    //Step 1 - find the task by its id
   
    const task = await Task.findById(taskId);
    
    if (!task) {
        throw new Error('Task not found'); //error handling if no task is found
    }

    if (task.completedBy) {
        throw new Error('Task already completed'); //error handling if task is already completed
    }
    //Step 2 - mark the task as completed
    if (!task.assignedTo || task.assignedTo.toString() !== userId) {
        throw new Error('Task not claimed by this user');
      }
      if (task.completedBy) {
        throw new Error('Task already completed');
      }
    
     // 2.3. Mark completed fields
  task.status      = 'completed';// update status
  task.completedBy = userId;// who completed
  task.completedAt = new Date();// timestamp
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


module.exports = { completeTask, getUserStats, createTask, assignTask };







