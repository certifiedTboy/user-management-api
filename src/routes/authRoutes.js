const express = require("express");

const {
  setUserPassword,
  userLogin,
  passwordResetRequest,
  verifyPasswordResetData,
} = require("../controllers/authController");
const {
  checkPasswordInputIsEmpty,
  checkPasswordValidity,
  checkPasswordMatch,
  checkEmailValidity,
} = require("../middlewares/validators/authDataValidator");

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

router.post(
  "/request-password-reset",
  checkEmailValidity,
  passwordResetRequest
);

router.post("/verify-password-resettoken", verifyPasswordResetData);

module.exports = router;
