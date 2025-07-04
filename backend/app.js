const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupSwagger = require("./swagger");
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/users");

dotenv.config();
const app = express();
connectDB(); // Connect to MongoDB

//Test route -health check
app.get("/health", (req, res) => res.sendStatus(200));
app.get("/", (req, res) => {
  res.send("hometasker api running");
});

// Middleware setup: Enable CORS and JSON parsing
//app.use(cors()); // Allows frontend to access backend APIs
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(
  "*",
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
); // Pre-flight request handling
// This allows the browser to make pre-flight requests to check if the server accepts the actual request
// This is necessary for CORS to work properly, especially for non-simple requests like PUT or

// Allows requests from FRONTEND_URL
//the allowed request prevent browsers from sending any other request types unless specified
app.use(express.json()); // Allows parsing JSON requests

// authRoutes is the route for authentication
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Setup Swagger API documentation
setupSwagger(app);

// Error handling middleware Gloabal handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON. Please check your request body.",
    });
  }
  next();
});

// 4. Connect to Mongo
// Delay this until after you've potentially overridden process.env.MONGO_URI in tests
connectDB();
module.exports = app;
