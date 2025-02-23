const express = require("express"); //create api routes
const router = express.Router();

// Temporary array to store tasks - will be updated to DB later
// store tasks in memory inside an array. - Each task is an object with:
/*id → Unique identifier.
name → Task description.
points → Points rewarded for completing the task.
completedBy → Stores the name of the user who completed the task (null means it’s not completed yet).*/
/* let tasks = [
    { id: 1, name: "Take out the trash", points: 10, completedBy: null },
    { id: 2, name: "Wash the dishes", points: 15, completedBy: null },
]; */

// GET all tasks
router.get("/", async (req, res) => {
    const tasks = await Task.find(); // Find all tasks from Mongo and fetch them and returns an array
    res.json(tasks);
});

// POST: Add a new task
/* adds a new task when a POST request is made to /tasks. 
Extracts name and points from req.body.
If either name or points is missing, it returns a 400 error (Bad Request).
Otherwise, it:
Creates a new task object.
Adds it to the tasks array.
Responds with the newly created task. */

router.post("/", async (req, res) => {
    const { name, points } = req.body;
    if (!name || !points) {
        return res.status(400).json({ error: "Task name and points are required" });
    }
    const newTask = new Task({ name, points });
    await newTask.save(); // Save the new task to the database
    res.status(201).json(newTask);
});




// PUT: Mark a task as completed
/*
marks a task as completed when a PUT request is sent to /tasks/:id.
Extracts id from req.params.id (URL parameter).
Extracts user from req.body (who completed the task).
Finds the task in the tasks array.
If the task does not exist, it returns a 404 error.
Otherwise, it:
Updates completedBy with the user's name.
Sends back the updated task.
*/ 
router.put("/:id", async (req, res) => {
    const { user } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completedBy = user;
    await task.save();
    res.json(task);
});

module.exports = router;
