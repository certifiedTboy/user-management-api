const express = require("express");
const { viewDashboard } = require("../controllers/userController");
const Authenticate = require("../middlewares/authorization/Authenticate");
const router = express.Router();

router.get("/", Authenticate, viewDashboard);

module.exports = router;
