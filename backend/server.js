const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupSwagger = require("./swagger");
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

connectDB(); // Connect to MongoDB

// Middleware setup: Enable CORS and JSON parsing
app.use(express.json()); // Allows parsing JSON requests
//app.use(cors()); // Allows frontend to access backend APIs
app.use(cors({ origin: "*", credentials: true, methods: ["GET", "POST", "PUT", "DELETE"] })); // Allows requests from any frontend origin * (change * to your frontend URL in production)  

// authRoutes is the route for authentication
app.use("/auth", authRoutes);



// Setup Swagger API documentation
setupSwagger(app);


//Import task routes
//const taskRoutes = require("./routes/tasks"); We have already imported it above
app.use("/tasks", taskRoutes);


//Test route
app.get("/", (req, res) => {
    res.send("hometasker api running");
});


// Error handling middleware Gloabal handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        error: "Invalid JSON. Please check your request body.",
      });
    }
    next();
  });
  

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});