const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const port = process.env.PORT || 5000;

// Database connection
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "*"}));
app.use(express.urlencoded({ extended: false }));

// mount points
app.use("/users", require("./routes/userRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));

app.listen(port, () =>
  console.log(`Server running on port: ${port}`.cyan.italic.bold)
);
