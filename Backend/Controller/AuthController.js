const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const Organizer = require("../Models/Organizer");
const Admin = require("../Models/Admin");
const sendMail = require("../Utils/sendMail");
const Otp = require("../Models/Otp");

const verifyPin = async (req, res) => {
  try {
    const { role, email, pin } = req.body;
    let user;

    if (role === "organizer") {
      user = await Organizer.findOne({
        officialEmail: email,
      });
    } else if (role === "admin") {
      user = await Admin.findOne({
        officialEmail: email,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `${role} not found`,
      });
    }

    if (user.pin !== pin) {
      return res.status(400).json({
        success: false,
        message: "Invalid PIN",
      });
    }

    return res.status(200).json({
      success: true,
      message: "PIN verified",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const sendPinResetOtp = async (req, res) => {
  try {
    const { role, email } = req.body;
    let user;

    if (role === "organizer") {
      user = await Organizer.findOne({ officialEmail: email });
    } else if (role === "admin") {
      user = await Admin.findOne({ officialEmail: email });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found with this email" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (valid for 10 minutes)
    user.resetPinOtp = otp;
    user.resetPinOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Use your custom sendMail function
    const textMessage = `Your PIN reset OTP is ${otp}. It is valid for 10 minutes.`;
    const htmlMessage = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0f172a;">Reset Your Security PIN</h2>
        <p style="color: #334155; font-size: 16px;">You requested to reset the security PIN for your DevGallery account.</p>
        <p style="color: #334155; font-size: 16px;">Your One-Time Password (OTP) is:</p>
        <h1 style="color: #06b6d4; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
        <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendMail({
      to: user.officialEmail,
      subject: "DevGallery - PIN Reset OTP",
      text: textMessage,
      html: htmlMessage,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const verifyPinResetOtp = async (req, res) => {
  try {
    const { role, email, otp } = req.body;

    // 1. Validate input
    if (!role || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Role, email and OTP are required",
      });
    }

    let user;

    // 2. Find user based on role
    if (role === "organizer") {
      user = await Organizer.findOne({ officialEmail: email });
    } else if (role === "admin") {
      user = await Admin.findOne({ officialEmail: email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // 3. Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // 4. Check if OTP exists in database
    if (!user.resetPinOtp || !user.resetPinOtpExpire) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    // 5. Check if OTP is expired
    if (user.resetPinOtpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // 6. Verify OTP match
    if (String(user.resetPinOtp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 7. Success Response
    // Note: If your flow requires it, you may want to issue a temporary
    // reset token here so the user can securely proceed to the actual PIN reset step.
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("verifyPinResetOtp Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const resetPin = async (req, res) => {
  try {
    const { role, email, otp, newPin } = req.body;
    let user;

    if (role === "organizer") {
      user = await Organizer.findOne({ officialEmail: email });
    } else if (role === "admin") {
      user = await Admin.findOne({ officialEmail: email });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // Final check before committing the change
    if (
      !user.resetPinOtp ||
      user.resetPinOtp !== otp ||
      user.resetPinOtpExpire < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Update PIN and clear OTP fields
    user.pin = newPin;
    user.resetPinOtp = undefined;
    user.resetPinOtpExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Security PIN reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendPasswordResetOtp = async (req, res) => {
  try {
    const { role, email } = req.body;
    let user;

    if (role === "organizer") {
      user = await Organizer.findOne({ officialEmail: email });
    } else if (role === "admin") {
      user = await Admin.findOne({ officialEmail: email });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found with this email" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (valid for 10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const textMessage = `Your Password reset OTP is ${otp}. It is valid for 10 minutes.`;
    const htmlMessage = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0f172a;">Reset Your Password</h2>
        <p style="color: #334155; font-size: 16px;">You requested to reset the password for your DevGallery account.</p>
        <p style="color: #334155; font-size: 16px;">Your One-Time Password (OTP) is:</p>
        <h1 style="color: #8b5cf6; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
        <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendMail({
      to: user.officialEmail,
      subject: "DevGallery - Password Reset OTP",
      text: textMessage,
      html: htmlMessage,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { role, email, otp } = req.body;

    if (!role || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Role, email and OTP are required",
      });
    }

    let user;

    if (role === "organizer") {
      user = await Organizer.findOne({ officialEmail: email });
    } else if (role === "admin") {
      user = await Admin.findOne({ officialEmail: email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpire) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    if (user.resetPasswordOtpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (String(user.resetPasswordOtp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("verifyPasswordResetOtp Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { role, email, otp, newPassword } = req.body;
    let user;

    if (role === "organizer") {
      user = await Organizer.findOne({ officialEmail: email });
    } else if (role === "admin") {
      user = await Admin.findOne({ officialEmail: email });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    if (
      !user.resetPasswordOtp ||
      user.resetPasswordOtp !== otp ||
      user.resetPasswordOtpExpire < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const signup = async (req, res) => {
  try {
    // 1. Extract the exact variable names sent by your frontend
    const { organizationName, officialEmail, password, otp } = req.body;

    // 2. Verify the OTP using officialEmail
    const validOtp = await Otp.findOne({ officialEmail, otp });

    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid or expired OTP. Please verify your email first.",
        success: false,
      });
    }

    // 3. Check if user already exists (mapping officialEmail to the db's email field)
    const user = await UserModel.findOne({ email: officialEmail });
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. MAPPING FIX: Assign organizationName to 'name' and officialEmail to 'email'
    const userModel = new UserModel({
      name: organizationName,
      email: officialEmail,
      password: hashedPassword,
    });

    // This will now pass Mongoose validation
    await userModel.save();

    // 6. Delete the OTP so it cannot be reused
    await Otp.deleteOne({ _id: validOtp._id });

    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      token,
      email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server errror",
      success: false,
    });
  }
};

// Add to your auth controller
const sendSignupOtp = async (req, res) => {
  try {
    const { officialEmail } = req.body;

    // Safety check: Prevent crashes if the frontend sends an empty request
    if (!officialEmail) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // 1. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save to your existing OTP database model
    await Otp.deleteMany({ officialEmail: officialEmail });
    await Otp.create({ officialEmail: officialEmail, otp });

    // 3. Send email using your existing mailer (Awaited so Vercel doesn't kill it early)
    await sendMail({
      to: officialEmail,
      subject: "Verify your DevGallery Application",
      text: `Your signup verification code is ${otp}.`,
    });

    // 4. Send success response only AFTER the email successfully leaves the server
    res.status(200).json({ success: true, message: "OTP sent!" });
    
  } catch (error) {
    console.error("OTP Route Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};
const verifySignupOtp = async (req, res) => {
  try {
    const { officialEmail, otp } = req.body;

    // 1. Safety check: Ensure both fields were actually provided
    if (!officialEmail || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // 2. Find the OTP in the database
    const existingOtp = await Otp.findOne({ officialEmail, otp });

    if (!existingOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 3. Expiration check (Optional but recommended)
    // Assuming you have a 'createdAt' timestamp in your Otp schema
    // This checks if the OTP is older than 10 minutes (600,000 milliseconds)
    if (existingOtp.createdAt) {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      if (existingOtp.createdAt < tenMinutesAgo) {
        // Delete the expired OTP so it can't be used again
        await Otp.deleteOne({ _id: existingOtp._id });
        return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
      }
    }

    // Note: Do NOT delete the OTP here yet! We will delete it inside the signup function
    // to ensure the email is actually verified during the final save.
    res.status(200).json({ success: true, message: "OTP is valid." });
    
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyPin,
  sendPinResetOtp,
  verifyPinResetOtp,
  resetPin,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  signup,
  login,
  sendSignupOtp,
  verifySignupOtp,
};
