const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupSwagger = require("./swagger");
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/users');


dotenv.config();

const app = express();

connectDB(); // Connect to MongoDB

// Middleware setup: Enable CORS and JSON parsing
//app.use(cors()); // Allows frontend to access backend APIs
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true, methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ['Content-Type', 'Authorization'] })); // Allows requests from FRONTEND_URL
//the allowed request prevent browsers from sending any other request types unless specified
app.use(express.json()); // Allows parsing JSON requests


// authRoutes is the route for authentication
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);



// Setup Swagger API documentation
setupSwagger(app);


//Test route -health check
app.get("/", (req, res) => {
    res.send("hometasker api running");
});



//testing in dev tools to verify protected route - mainly for testing jwt 
// const authenticateToken = require('./middleware/authMiddleware');

// app.get("/api/protected", authenticateToken, (req, res) => {
//   res.json({
//     message: "You are authenticated!",
//     user: req.user,
//   });
// });


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