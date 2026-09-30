const express = require("express");
const router = express.Router();


const upload = require("../middlewares/upload");

const {
  // createProject,
  getAllProjects,
  getProjectById,
  getProjectsByName,
  // deleteProject,
  getMyProjects,
} = require("../controller/projectController");
const { submitVote } = require("../controller/voteController");

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