//The tasks.js constists of endpoints for game logic and for regurlar CRUD operations


/**
 * Game-Flow Endpoints:
 *  - /:taskId/assign    : Claim a task (inProgress)
 *  - /:taskId/complete  : Complete a claimed task, award points
 *
 * CRUD Endpoints:
 *  - POST /            : Create a task
 *  - GET  /            : List tasks
 *  - DELETE /:id       : Delete a task
 *
 * (Old PUT /:id is commented out—replaced by game-flow above.)
 */




const express = require("express"); //create api routes
const { body, validationResult } = require("express-validator"); // for validation
const router = express.Router();
const Task = require("../models/task"); // Import the Task model
const authenticateToken = require("../middleware/authMiddleware");
const gameController = require("../controllers/gameControllers");


// The game logic enpoints are to complte tasks, enforce assignment conditions and award points
router.post("/:taskId/assign", authenticateToken, gameController.assign); // Assign a task to a user
router.post("/:taskId/complete", authenticateToken, gameController.complete); // Complete a task

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
router.get("/", authenticateToken, async (req, res) => {
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
 *     description: Add a new task with a task name and points.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *               points:
 *                 type: number
 *     responses:
 *       201:
 *         description: Task successfully created.
 */
//Manual validation test
// router.post("/", async (req, res) => {
//     const { name, points } = req.body;
//     if (!name || !points) {
//         return res.status(400).json({ error: "Task name and points are required" });
//     }
//     const newTask = new Task({ name, points });
//     await newTask.save(); // Save the new task to the database
//     res.status(201).json(newTask);
// });

//express validator code for POST 

router.post(
    "/",
    authenticateToken, // Middleware to check if the user is authenticated
    // Validation rules
    // Check if taskName is not empty and points is a valid positive number
    // points must be a pure number without letters or symbols
    // points must be a positive integer
    // points must be a number
    // points must be a positive integer
    [
      body("taskName")
        .notEmpty()
        .withMessage("Task name is required"),
  
      body("points")
        .custom((value) => {
          // Reject anything that is not a pure number
          const isValid = /^([1-9]\d*)$/.test(value);
          if (!isValid) {
            throw new Error("Points must be a valid positive number without letters or symbols");
          }
          return true;
        }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { taskName, points } = req.body;
      const newTask = new Task({ taskName, points: parseInt(points) });
      await newTask.save();
      res.status(201).json(newTask);
    }
  );

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


//NOTE: 
// PUT /tasks/:id was previously used here to mark a task completed, but
// we have replaced it with the game flow endpoints above (assign/complete).
// Keeping the old route commented out for reference and to maintain history.

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
//Manual validation test for PUT
// router.put("/:id", async (req, res) => {
//     const { user } = req.body;
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ error: "Task not found" });

//     task.completedBy = user;
//     await task.save();
//     res.json(task);
// });

//express validator code for POST 
/*
router.put(
    "/:id",
    authenticateToken, // Middleware to check if the user is authenticated
    // Validation rules
    // Check if user is not empty 
    body("user").notEmpty().withMessage("User name is required"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { user } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.completedBy = user;
        await task.save();
        res.json(task);
    }
)
 */   

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */

router.delete("/:id", authenticateToken, async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
});


//Game stats for the user, weekly stats and leaderboard 
// All‐time stats for the authenticated user
// GET /tasks/stats
router.get(
  "/stats",
  authenticateToken,       // protects the route
  gameController.stats     // calls gameLogic.getUserStats()
);

// This week’s stats for the authenticated user
// GET /tasks/weekly
router.get(
  "/weekly",
  authenticateToken,
  gameController.weeklyStats
);

// This week’s top‐10 leaderboard (public)
// GET /tasks/leaderboard
router.get(
  "/leaderboard",
  gameController.weeklyLeader
);

// Export the router to use in server.js
module.exports = router;
