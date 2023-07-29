const express = require("express");
const { getCurrentUser } = require("../controllers/userController");
const Authenticate = require("../middlewares/authorization/Authenticate");
const router = express.Router();

router.get("/", Authenticate, getCurrentUser);

module.exports = router;
