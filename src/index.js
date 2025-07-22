require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const router = require("./routes/_index.routes");

const PORT = process.env.PORT || 5000;
const dbUrl = process.env.MONGO_URI;

const app = express();

console.log("Starting server...");

app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

app.get("/", (req, res, next) => {
  try {
    res.json({ msg: "Success", error: false, data: "Server is running!" });
  } catch (error) {
    next(error);
  }
});

app.use("/v1/api", router);
console.log("Routes loaded successfully");

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB database successfully");
  })
  .catch((err) => {
    console.log("Connection to MongoDB failed");
    console.log(err);
  });

try {
  app.listen(PORT, () => {
    console.log(`Server successfully running on port ${PORT}`);
  });
} catch (serverError) {
  console.error("Failed to start server:", serverError);
  process.exit(1);
}
