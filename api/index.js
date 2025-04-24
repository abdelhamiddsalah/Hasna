const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("../config/database");
const ApiError = require("../Utils/api-error");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
app.use("/api/v1/morningazkar", require("../routes/morning-azkar-route"));
app.use("/api/v1/eveningazkar", require("../routes/evening-azkar-route"));
app.use("/api/v1/beforesleepazkar", require("../routes/before-sleep-route"));
app.use("/api/v1/prayers", require("../routes/prayers-route"));
app.use("/api/v1", require("../routes/prayerstimers-route"));

// 404 handler
app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});
