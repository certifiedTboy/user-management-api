const express = require("express");
const {
  createUser,
  verifyUser,
  updateUser,
  deleteUser,
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
  checkUserIsAdmin,
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
  "/user/update",
  Authenticate,
  checkUserAccountOwnership,
  checkUserDataInputForUpdateIsEmpty,
  checkNameDataLength,
  updateUser
);

router.get("/me", Authenticate, getCurrentUser);

router.delete("/:userId/delete", Authenticate, checkUserIsAdmin, deleteUser);

module.exports = router;
