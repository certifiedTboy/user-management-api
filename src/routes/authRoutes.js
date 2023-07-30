const express = require("express");
const {
  setUserPassword,
  userLogin,
  passwordResetRequest,
  verifyPasswordResetData,
  userLogout,
} = require("../controllers/authController");
const {
  checkPasswordInputIsEmpty,
  checkPasswordValidity,
  checkPasswordMatch,
  checkEmailValidity,
} = require("../middlewares/validators/authDataValidator");

const {
  checkPasswordResetDataInputIsEmpty,
} = require("../middlewares/validators/verificationDataValidator");

const router = express.Router();

router.post(
  "/user/set-password",
  checkPasswordInputIsEmpty,
  checkEmailValidity,
  checkPasswordValidity,
  checkPasswordMatch,
  setUserPassword
);
router.post("/login", checkEmailValidity, userLogin);
router.get("/logout", userLogout);

router.post("/user/reset-password", checkEmailValidity, passwordResetRequest);

router.post(
  "/user/verify-resettoken",
  checkPasswordResetDataInputIsEmpty,
  verifyPasswordResetData
);

module.exports = router;
