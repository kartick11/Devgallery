const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/Authvalidation");
const rateLimit = require("express-rate-limit");
const {
  sendSignupOtp, 
  verifySignupOtp,
  verifyPin,
  sendPinResetOtp,
  verifyPinResetOtp,
  resetPin,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  signup,
  login,
} = require("../Controller/AuthController");
const router = require("express").Router();

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message:
      "Too many OTP requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many incorrect attempts. Please request a new OTP later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post("/send-otp", sendSignupOtp);
router.post("/verify-otp", verifySignupOtp);

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/verify-pin", otpVerifyLimiter, verifyPin);

router.post("/forgot-pin/send-otp", otpRequestLimiter, sendPinResetOtp);
router.post("/forgot-pin/verify-otp", otpVerifyLimiter, verifyPinResetOtp);
router.post("/forgot-pin/reset", resetPin);

router.post(
  "/forgot-password/send-otp",
  otpRequestLimiter,
  sendPasswordResetOtp,
);
router.post(
  "/forgot-password/verify-otp",
  otpVerifyLimiter,
  verifyPasswordResetOtp,
);
router.post("/forgot-password/reset", resetPassword);

module.exports = router;
