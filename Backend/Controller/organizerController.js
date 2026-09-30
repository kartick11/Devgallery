const bcrypt = require("bcrypt");
const OrganizerApplication = require("../Models/OrganizerApplication");
const BlockedEmail = require("../Models/BlockedEmail");
const Organizer = require("../Models/Organizer");
const jwt = require("jsonwebtoken");
const Projects = require("../Models/Project");
const sendMail = require("../Utils/sendMail");
const Vote = require("..//Models/Vote");

const applyOrganizer = async (req, res) => {
  try {
    const { organizationName, officialEmail, password, pin, phoneNumber } =
      req.body;

    // =================================================================
    // 1. THE BOUNCER CHECK: Is this email on the blocklist?
    // =================================================================
    const isBlocked = await BlockedEmail.findOne({
      // Use .toLowerCase() to ensure "User@email.com" doesn't bypass the block for "user@email.com"
      email: officialEmail.toLowerCase(),
    });

    if (isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This email address is blocked from submitting applications.",
      });
    }

    // =================================================================
    // 2. DUPLICATE CHECK: Prevent applying multiple times
    // =================================================================
    const existingApplication = await OrganizerApplication.findOne({
      officialEmail: officialEmail.toLowerCase(),
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists.",
      });
    }

    // =================================================================
    // 3. PROCEED WITH APPLICATION: Create and save
    // =================================================================
    const hashedPassword = await bcrypt.hash(password, 10);
    const application = await OrganizerApplication.create({
      organizationName,
      officialEmail: officialEmail.toLowerCase(), // Save as lowercase for consistency
      password: hashedPassword,
      pin,
      phoneNumber,
    });

    // Send email to admin
    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: "🚀 New Organization Application - DevGallery",
        html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2 style="color:#4f46e5;">
            New Organization Application
          </h2>
          <table style="border-collapse:collapse;">
            <tr>
              <td><strong>Organization:</strong></td>
              <td>${organizationName}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>${officialEmail}</td>
            </tr>
            <tr>
              <td><strong>Phone:</strong></td>
              <td>${phoneNumber}</td>
            </tr>
          </table>
          <br/>
          <p>A new organization has applied for approval on DevGallery.</p>
          <p>Please review it from the Admin Dashboard.</p>
        </div>
      `,
      });
    } catch (mailError) {
     
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const organizerLogin = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    const organizer = await Organizer.findOne({
      officialEmail,
    });
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found",
      });
    }

    const isMatch = await bcrypt.compare(password, organizer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: organizer._id,
        role: "organizer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      token,
      organizer: {
        id: organizer._id,
        organizationName: organizer.organizationName,
        officialEmail: organizer.officialEmail,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const organizerId = req.organizer.id;

    // 1. Fetch the projects
    const projects = await Projects.find({
      uploadedBy: organizerId,
    }).sort({ createdAt: -1 });

    // 2. Map through projects and count votes for each
    const projectsWithVotes = await Promise.all(
      projects.map(async (project) => {
        // Use projectId to match your Vote schema
        const voteCount = await Vote.countDocuments({ projectId: project._id });

        return {
          ...project.toObject(),
          votes: voteCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      projects: projectsWithVotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrganizerProfile = async (req, res) => {
  try {
    // Assuming you have an authentication middleware that sets req.user.id
    const organizerId = req.organizer.id;
    // 1. Fetch the organizer (exclude the password and sensitive data)
    const organizer = await Organizer.findById(organizerId).select("-password");

    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    // 2. Count the total projects uploaded by this organizer
    const projectCount = await Projects.countDocuments({
      organizerId: organizerId,
    });

    // 3. Send the combined data back to the frontend
    return res.status(200).json({
      success: true,
      profile: {
        name: organizer.name,
        email: organizer.officialEmail,
        profileImage: organizer.profileImagePublicId || null,
        createdAt: organizer.createdAt,
        totalProjects: projectCount,
        isPendingDeletion: organizer.isPendingDeletion,
        deletionScheduledAt: organizer.deletionScheduledAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const requestAccountDeletion = async (req, res) => {
  try {
    const organizerId = req.organizer.id; // Assuming you have auth middleware
    const { reason, customReason } = req.body; // Extract reasons sent from the frontend form

    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    // NEW: Check if the user is in a cooldown period
    if (
      organizer.deletionCooldownUntil &&
      new Date() < organizer.deletionCooldownUntil
    ) {
      return res.status(403).json({
        success: false,
        message: `You recently cancelled a deletion request. You can re-apply after ${organizer.deletionCooldownUntil.toDateString()}.`,
      });
    }
    if (organizer.isPendingDeletion) {
      return res.status(400).json({
        success: false,
        message: "Account deletion is already scheduled.",
      });
    }

    // Set deletion date to 7 days from now
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Update deletion status and timer
    organizer.isPendingDeletion = true;
    organizer.deletionScheduledAt = sevenDaysFromNow;

    // Track role permissions
    organizer.deletionRequestedByRole = "organizer";
    organizer.deletionRequesterId = organizerId;

    // Store the reasons
    organizer.deletionReason = reason;
    organizer.deletionCustomReason = customReason || "";

    await organizer.save();

    return res.status(200).json({
      success: true,
      message: "Your account is scheduled for permanent deletion in 7 days.",
    });
  } catch (error) {
    console.error("Deletion Request Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const cancelAccountDeletion = async (req, res) => {
  try {
    const organizerId = req.organizer.id;

    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res
        .status(404)
        .json({ success: false, message: "Organizer not found" });
    }

    if (!organizer.isPendingDeletion) {
      return res.status(400).json({
        success: false,
        message: "No account deletion is currently scheduled.",
      });
    }

    // NEW: Prevent cancellation if deletion was scheduled by an admin
    if (organizer.deletionRequestedByRole === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Your account deletion is scheduled by admin. Please contact admin as soon as possible.",
      });
    }

    // Set cooldown date to 7 days from exactly right now
    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() + 7);

    // Reset all deletion tracking fields
    organizer.isPendingDeletion = false;
    organizer.deletionScheduledAt = null;
    organizer.deletionRequestedByRole = null;
    organizer.deletionRequesterId = null;
    organizer.deletionReason = null;
    organizer.deletionCustomReason = null;

    // Apply the 7-day cooldown
    organizer.deletionCooldownUntil = cooldownDate;

    await organizer.save();

    return res.status(200).json({
      success: true,
      message:
        "Account deletion cancelled. You must wait 7 days before you can request deletion again.",
      cooldownUntil: cooldownDate,
    });
  } catch (error) {
    console.error("Cancel Deletion Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  applyOrganizer,
  organizerLogin,
  getMyProjects,
  requestAccountDeletion,
  cancelAccountDeletion,
  getOrganizerProfile,
};
