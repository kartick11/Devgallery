const express = require("express");

const router = express.Router();
const upload = require("../Middlewares/upload");

const organizerAuth = require("../Middlewares/organizerAuth");

const {
  applyOrganizer,
  organizerLogin,
  getMyProjects,
  getOrganizerProfile,
  requestAccountDeletion,
  cancelAccountDeletion,
} = require("../Controller/organizerController");

const {
  createProject,
  deleteProject,
} = require("../Controller/projectController");

router.get("/profile", organizerAuth, getOrganizerProfile);
router.post("/create", organizerAuth, upload.single("image"), createProject);
router.post("/request-deletion", organizerAuth, requestAccountDeletion);
router.patch("/cancel-deletion", organizerAuth, cancelAccountDeletion);
router.get("/my-projects", organizerAuth, getMyProjects);

router.delete("/:id", organizerAuth, deleteProject);
router.post("/apply", applyOrganizer);
router.post("/login", organizerLogin);

module.exports = router;
