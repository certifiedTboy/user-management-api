const express = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

const apiV1 = express.Router();

apiV1.use("/user", userRoutes);
apiV1.use("/auth", authRoutes);

module.exports = apiV1;
