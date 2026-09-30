const express = require("express");
const router = express.Router();


const upload = require("../Middlewares/upload");

const {
  // createProject,
  getAllProjects,
  getProjectById,
  getProjectsByName,
  // deleteProject,
  getMyProjects,
} = require("../Controller/projectController");
const { submitVote } = require("../Controller/voteController");

// router.post(
//   "/create",
//   upload.single("image"),
//   createProject
// );
router.get("/my-projects", getMyProjects);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.get('/search/:name', getProjectsByName);
router.post("/submit", submitVote);
// router.delete("/:id", deleteProject);

module.exports = router;
