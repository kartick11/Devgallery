// cronJobs.js
const cron = require("node-cron");
const cloudinary = require("cloudinary").v2;
const Organizer = require("../Models/Organizer"); 
const Project = require("../Models/Project"); // Changed from Item to Project
const sendMail = require("./sendMail");

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily account deletion cleanup...");

  try {
    const now = new Date();

    // Find organizers past their 7-day grace period
    const organizersToDelete = await Organizer.find({
      isPendingDeletion: true,
      deletionScheduledAt: { $lte: now }, 
    });

    for (const organizer of organizersToDelete) {
      console.log(`Deleting organizer: ${organizer._id}`);

      try {
        // 1. Fetch projects associated with this organizer
        const projects = await Project.find({ organizerId: organizer._id });
        const projectCount = projects.length; // Count the projects

        // 2. Extract Cloudinary IDs
        const cloudinaryPublicIds = [];
        
        // Add organizer's profile image (if they have one)
        if (organizer.profileImagePublicId) {
          cloudinaryPublicIds.push(organizer.profileImagePublicId);
        }
        
        // Add all project images
        projects.forEach((project) => {
          if (project.imagePublicId) {
            cloudinaryPublicIds.push(project.imagePublicId);
          }
        });

        // 3. Delete all accumulated images from Cloudinary
        if (cloudinaryPublicIds.length > 0) {
          await cloudinary.api.delete_resources(cloudinaryPublicIds);
        }

        // 4. Delete all projects from DB
        await Project.deleteMany({ organizerId: organizer._id });

        // 5. Save the email address and name BEFORE deleting the user
        const userEmail = organizer.officialEmail; 
        const userName = organizer.name || "Organizer"; 

        // 6. Delete organizer from DB
        await Organizer.findByIdAndDelete(organizer._id);

        console.log(`Successfully deleted organizer ${organizer._id} and ${projectCount} projects.`);

        // 7. Send the "Account Deleted" Email including the project count
        try {
          await sendMail({
            to: userEmail,
            subject: "Your DevGallery Account Has Been Permanently Deleted",
            text: `Hello ${userName},\n\nWe are writing to confirm that your DevGallery account and all ${projectCount} of your uploaded projects have been permanently deleted from our system, as requested 7 days ago.\n\nIf you wish to use our platform again in the future, you will need to register for a new account.\n\nThank you for using our service!\n\nBest regards,\nThe DevGallery Team`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h3 style="color: #2c3e50;">Hello ${userName},</h3>
                <p>We are writing to confirm that your DevGallery account and all <strong>${projectCount}</strong> of your uploaded projects have been permanently deleted from our system, as requested 7 days ago.</p>
                <p>If you wish to use our platform again in the future, you will need to register for a new account.</p>
                <p>Thank you for using our service!</p>
                <br/>
                <p>Best regards,<br/><strong>The DevGallery Team</strong></p>
              </div>
            `
          });
          console.log(`Deletion confirmation email sent to ${userEmail}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${userEmail}:`, emailError);
        }

      } catch (innerError) {
        console.error(`Failed to process deletion for organizer ${organizer._id}:`, innerError);
      }
    }
  } catch (error) {
    console.error("Error fetching organizers for scheduled deletion:", error);
  }
});