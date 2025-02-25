const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupSwagger = require("./swagger");
const taskRoutes = require("./routes/tasks");

dotenv.config();

const app = express();

connectDB(); // Connect to MongoDB

// Middleware setup: Enable CORS and JSON parsing
app.use(express.json()); // Allows parsing JSON requests
app.use(cors()); // Allows frontend to access backend APIs

// Setup Swagger API documentation
setupSwagger(app);


//Import task routes
//const taskRoutes = require("./routes/tasks"); We have already imported it above
app.use("/tasks", taskRoutes);


//Test route
app.get("/", (req, res) => {
    res.send("hometasker api running");
});

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});