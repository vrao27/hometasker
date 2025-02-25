const express = require("express"); //create api routes
const router = express.Router();
const Task = require("../models/task"); // Import the Task model

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
/** comments tell Swagger how to document and display API endpoints.
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     description: Fetch all tasks stored in the database.
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully.
 */
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

/** comments tell Swagger how to document and display API endpoints.
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Add a new task with a name and points.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               points:
 *                 type: number
 *     responses:
 *       201:
 *         description: Task successfully created.
 */

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

/** . comments tell Swagger how to document and display API endpoints.
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Mark a task as completed
 *     description: Updates a task's `completedBy` field.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task successfully updated.
 *       404:
 *         description: Task not found.
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
