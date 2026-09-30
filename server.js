require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Database initialization
require("./Models/Db");
require("./Utils/cronJobs")

// Route Imports
const authRouter = require("./Routes/authroutes");
const projectRoutes = require("./Routes/projectRoutes");
const organizerRoutes = require("./Routes/organizerRoutes");
const adminRoutes = require("./Routes/adminRoutes");


// Controller & Middleware Imports
const { streamAndUpload, deleteFile } = require("./controller/claudinary");
// const organizerAuth = require("./Middlewares/organizerAuth"); // Imported but not used globally

const app = express();
const PORT = process.env.PORT || 8080;

// --------------------------------------------------------
// Global Middleware
// --------------------------------------------------------
app.use(morgan("dev")); // HTTP request logger
app.use(cors({ origin: "*" })); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// --------------------------------------------------------
// API Routes
// --------------------------------------------------------
app.use("/auth", authRouter);
app.use("/project", projectRoutes);
app.use("/organizer", organizerRoutes);
app.use("/admin", adminRoutes);

// Base route for health check
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is running successfully" 
  });
});

// Utility Routes (File Handling) - Wrapped in arrow functions to delay execution and prevent crashes
app.post("/upload", (req, res) => streamAndUpload(req, res));
app.post("/delete", (req, res) => deleteFile(req, res));

// --------------------------------------------------------
// Global Error Handler
// --------------------------------------------------------
// Catches unhandled errors and prevents the server from crashing silently
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------------------------------------------------------
// Server Initialization
// --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});