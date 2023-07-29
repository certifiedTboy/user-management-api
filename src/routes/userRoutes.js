const express = require("express");
const {
  createUser,
  verifyUser,
  updateUserName,
  getCurrentUser,
} = require("../controllers/userController");
const {
  checkEmailValidity,
  checkNameDataLength,
  checkUserDataInputIsEmpty,
  checkUserDataInputForUpdateIsEmpty,
} = require("../middlewares/validators/authDataValidator");
const {
  checkUserAccountOwnership,
} = require("../middlewares/authorization/userAuthorization");
const {
  checkVerificationDataInputIsEmpty,
} = require("../middlewares/validators/verificationDataValidator");
const Authenticate = require("../middlewares/authorization/Authenticate");

const router = express.Router();

router.post(
  "/create-user",
  checkUserDataInputIsEmpty,
  checkEmailValidity,
  checkNameDataLength,
  createUser
);
router.post("/verify-user", checkVerificationDataInputIsEmpty, verifyUser);
router.put(
  "/update-username",
  Authenticate,
  checkUserAccountOwnership,
  checkUserDataInputForUpdateIsEmpty,
  checkNameDataLength,
  updateUserName
);

router.get("/me", Authenticate, getCurrentUser);

module.exports = router;
