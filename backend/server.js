const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware setup: Enable CORS and JSON parsing
app.use(express.json()); // Allows parsing JSON requests
app.use(cors()); // Allows frontend to access backend APIs


//Import task routes
const taskRoutes = require("./routes/tasks");
app.use("/tasks", taskRoutes);


//Test route
app.get("/", (req, res) => {
    res.send("hometask test");
});

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});