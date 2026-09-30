const OrganizerApplication = require("../Models/OrganizerApplication");
const Organizer = require("../Models/Organizer");
const Admin = require("../Models/Admin");
const BlockedEmail = require("../Models/BlockedEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utils/sendMail");

const approveOrganizer = async (req, res) => {
  try {
    const application = await OrganizerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Create Organizer
    const organizer = await Organizer.create({
      organizationName: application.organizationName,
      officialEmail: application.officialEmail,
      password: application.password,
      pin: application.pin,
      isVerified: true,
    });

    // Send approval email
    try {
      const mailInfo = await sendMail({
        to: application.officialEmail,
        // Removed the emoji and softened the spam-trigger words
        subject: "Your DevGallery Organization has been approved",
        text: `Hello,\n\nYour organization ${application.organizationName} has been approved on DevGallery.\n\nYou can now log in and start uploading projects.\n\nBest regards,\nThe DevGallery Team`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Organization Approved</h2>
        <p>Hello,</p>
        <p>Your organization <b>${application.organizationName}</b> has been successfully approved on DevGallery.</p>
        <p>You can now log in to your dashboard and start uploading projects.</p>
        <br>
        <p>Best regards,<br><strong>The DevGallery Team</strong></p>
      </body>
      </html>
    `,
      });
    } catch (mailError) {
      console.error("Approval Email Error:", mailError);
    }

    // Remove application after successful approval
    await OrganizerApplication.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Organizer approved successfully",
      organizer,
    });
  } catch (error) {
    console.error("Approve Organizer Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getPendingApplications = async (req, res) => {
  try {
    const applications = await OrganizerApplication.find({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const rejectOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, blockEmail } = req.body;

    // 1. Find the application first
    const application = await OrganizerApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 2. Block the email if the admin checked the box
    if (blockEmail) {
      await BlockedEmail.findOneAndUpdate(
        { email: application.officialEmail },
        { email: application.officialEmail },
        { upsert: true, new: true }, // upsert creates it if it doesn't exist
      );
    }

    // 3. Send the rejection email with the dynamic reason
    try {
      await sendMail({
        to: application.officialEmail,
        subject: "Update on your DevGallery Application",
        text: `Hello, we regret to inform you that your application for ${application.organizationName} has been declined. Reason: ${reason || "Does not meet our current requirements."}`,
        html: `
          <h2>Application Update</h2>
          <p>Hello,</p>
          <p>We regret to inform you that your application for the organization <b>${application.organizationName}</b> has not been approved at this time.</p>
          ${
            reason
              ? `<p><strong>Reason for rejection:</strong><br/> ${reason}</p>`
              : `<p>Unfortunately, the application does not meet our current requirements.</p>`
          }
          <p>Thank you for your interest in DevGallery.</p>
        `,
      });
    } catch (mailError) {
      console.error("Rejection Email Error:", mailError);
    }

    // 4. Finally, delete the application
    await OrganizerApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: blockEmail
        ? "Application rejected and email blocked"
        : "Application rejected",
    });
  } catch (error) {
    console.error("Reject API Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find().select("-password");

    res.status(200).json({
      success: true,
      count: organizers.length,
      organizers,
    });
  } catch (error) {
    console.error("Error fetching organizers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch organizers",
    });
  }
};
const adminLogin = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    const admin = await Admin.findOne({ officialEmail });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // --- NEW LOGIC ---
    // This assigns the new token and overwrites any existing one
    admin.tempJwtToken = token;
    await admin.save();
    // -----------------

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const adminDeleteOrganizer = async (req, res) => {
  try {
    const { organizerId, hideProjects, deletionCustomReason } = req.body;

    // 1. Session Validation
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }
    const currentToken = authHeader.replace("Bearer ", "");

    const adminFromDB = await Admin.findOne({ tempJwtToken: currentToken });
    if (!adminFromDB) {
      return res.status(404).json({
        success: false,
        message: "Admin not found or session expired.",
      });
    }
    const trueAdminId = adminFromDB._id;

    // 2. Find the Organizer FIRST (Do not update yet)
    const organizer = await Organizer.findById(organizerId);
    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found." });
    }

    // 3. Attempt to send the email FIRST
    const scheduledDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const scheduledDateString = scheduledDate.toDateString();

    // If sendMail fails, it will immediately stop execution and jump to the catch block
    await sendMail({
      to: organizer.officialEmail,
      subject: "Important: Your DevGallery Account is Scheduled for Deletion",
      text: `Hello ${organizer.organizationName}, your account has been scheduled for deletion on ${scheduledDateString}.`,
      html: `
        <h2>Account Deletion Notice</h2>
        <p>Hello <b>${organizer.organizationName}</b>,</p>
        <p>This is an important notification that your DevGallery organizer account has been scheduled for deletion.</p>
        <p><strong>Scheduled Deletion Date:</strong> ${scheduledDateString}</p>
        ${
          deletionCustomReason
            ? `<p><strong>Reason:</strong> ${deletionCustomReason}</p>`
            : ""
        }
        <p>If you believe this is a mistake, please contact support immediately.</p>
        <p>Thank you,<br/>The DevGallery Team</p>
      `,
    });

    // 4. ONLY if the email succeeds do we update and save the database
    organizer.isPendingDeletion = true;
    organizer.deletionScheduledAt = scheduledDate;
    organizer.deletionRequestedByRole = "admin";
    organizer.deletionRequesterId = trueAdminId;
    organizer.hideProjects = hideProjects;
    organizer.deletionCustomReason = deletionCustomReason;

    await organizer.save();

    res.status(200).json({
      success: true,
      message: "Email sent successfully and organizer scheduled for deletion.",
    });
  } catch (error) {
    console.error("Delete Organizer Error:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to process request. If the email failed, the account was NOT scheduled for deletion.",
      error: error.message,
    });
  }
};

const adminCancelAccountDeletion = async (req, res) => {
  try {
    const { organizerId } = req.body;

    // 1. Admin Session Validation
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }
    const currentToken = authHeader.replace("Bearer ", "");

    const adminFromDB = await Admin.findOne({ tempJwtToken: currentToken });
    if (!adminFromDB) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Admin not found or session expired.",
        });
    }

    // 2. Find the Organizer
    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    if (!organizer.isPendingDeletion) {
      return res.status(400).json({
        success: false,
        message: "This account is not currently scheduled for deletion.",
      });
    }

    // 3. Attempt to send the email FIRST
    // If sendMail fails, it stops execution and jumps to the catch block
    await sendMail({
      to: organizer.officialEmail,
      subject: "Account Restored: Your DevGallery Deletion was Cancelled",
      text: `Hello ${organizer.organizationName}, your account deletion has been cancelled by an administrator.`,
      html: `
        <h2>Account Deletion Cancelled</h2>
        <p>Hello <b>${organizer.organizationName}</b>,</p>
        <p>Good news! An administrator has cancelled the scheduled deletion of your DevGallery organizer account.</p>
        <p>Your account is now fully active, and any hidden projects have been restored to the public gallery.</p>
        <p>If you have any questions, please contact support.</p>
        <p>Thank you,<br/>The DevGallery Team</p>
      `,
    });

    // 4. Update the database ONLY if the email succeeds
    organizer.isPendingDeletion = false;
    organizer.deletionScheduledAt = null;
    organizer.deletionRequestedByRole = null;
    organizer.deletionRequesterId = null;
    organizer.deletionReason = null;
    organizer.deletionCustomReason = null;

    // Unhide projects in case the admin hid them when scheduling the deletion
    organizer.hideProjects = false;

    // Clear the cooldown so the user gets a clean slate
    organizer.deletionCooldownUntil = null;

    await organizer.save();

    return res.status(200).json({
      success: true,
      message: "Account deletion cancelled and organizer notified via email.",
    });
  } catch (error) {
    console.error("Admin Cancel Deletion Error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Failed to process request. If the email failed, the account deletion was NOT cancelled.",
      error: error.message,
    });
  }
};
module.exports = {
  approveOrganizer,
  getPendingApplications,
  rejectOrganizer,
  getAllOrganizers,
  adminLogin,
  adminDeleteOrganizer,
  adminCancelAccountDeletion,
};
