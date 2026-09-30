const Project = require("../Models/Project");
const { uploadToCloudinary } = require("./claudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

let cloudinaryResult;

const createProject = async (req, res) => {
  try {
    const {
      projectName,
      teamName,
      teamLeaderName,
      eventName,
      eventOrganisedBy,
      phoneNumber,
      description,
    } = req.body;

    const uploadedBy = req.organizer.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    const project = await Project.create({
      projectName,
      teamName,
      teamLeaderName,
      eventName,
      eventOrganisedBy,
      phoneNumber,
      uploadedBy,
      description,
      imageUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    if (cloudinaryResult.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id, {
        invalidate: true,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllProjects = async (req, res) => {
  try {
    // 1. Fetch projects and include 'uploadedBy' in the select
    // Populate the 'uploadedBy' field to get the organizer's 'hideProjects' status
    let projects = await Project.find()
      .select(
        "teamName teamLeaderName eventOrganisedBy eventName createdAt imageUrl projectName description uploadedBy",
      )
      .populate("uploadedBy", "hideProjects");

    // 2. Filter out projects where the admin has explicitly hidden them
    projects = projects.filter((project) => {
      // If the organizer exists and hideProjects is true, exclude it. Otherwise, keep it.
      return !(project.uploadedBy && project.uploadedBy.hideProjects === true);
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const jwt = require("jsonwebtoken"); // Ensure this is imported at the top
const Vote = require("../models/Vote"); // Ensure your Vote model is imported

const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Fetch the project data
    const project = await Project.findById(projectId).select(
      "teamName teamLeaderName eventOrganisedBy eventName createdAt imageUrl projectName description",
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    let voteCount = undefined;
    const authHeader = req.headers.authorization;

    // Verify token if it exists in the headers
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        // Decode the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token belongs to an admin or organizer
        if (decoded.role === "admin" || decoded.role === "organizer") {
          voteCount = await Vote.countDocuments({ project: projectId });
        }
      } catch (err) {
        // Token is invalid, expired, or missing roles.
        // We safely ignore the error, and voteCount remains undefined.
      }
    }

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(), // Convert Mongoose document to a standard JavaScript object
        votes: voteCount, // Append the vote count (undefined for unauthorized users)
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getProjectsByName = async (req, res) => {
  try {
    // Changed "name:" to "projectName:" to match your database schema
    const projects = await Project.find({
      projectName: { $regex: req.params.name, $options: "i" },
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete image from Cloudinary
    if (project.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(project.cloudinaryPublicId, {
        invalidate: true,
      });
    }

    // Delete project from MongoDB
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project and image deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByName,
  deleteProject,
  getMyProjects,
};
