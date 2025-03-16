const express = require("express");
const dotenv = require("dotenv");

const connectDB = require('./config/database');
const helmet = require('helmet');
const cors = require('cors');

dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
app.use("/api/v1/morningazkar", require("./routes/morning-azkar-route"));

app.all("*", (req, res, next) => {
    next(new Apierror(`Can't find ${req.originalUrl} on this server!`, 404));
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`1Server started on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});