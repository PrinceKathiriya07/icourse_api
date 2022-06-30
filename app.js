require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");

PORT = process.env.PORT || 3001;

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const URL = process.env.MONGO_CONNECTION_URL;

const app = express();
// app.use(express.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-www-form-urlencoded,Origin,X-Requested-With,Content-Type,Accept,Authorization,*"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  // res.setHeader("Content-Type", "application/json");
  // res.header("Access-Control-Allow-Origin", "http://192.168.1.12:3001");
  // res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, x-requested-with,Accept,Authorization"
  // );
  next();
});

app.use("/auth", authRoutes);
app.use(courseRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use((req, res, next) => {
  const status = 404;
  res.status(status).json({ message: "404 Not found" });
});

// connection server and db
mongoose
  .connect(URL)
  .then((result) => {
    app.listen(PORT);
    console.log(`Listening on port ${PORT}`);
  })
  .catch((err) => console.log(err));
