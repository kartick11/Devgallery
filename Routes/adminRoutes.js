const express = require("express");
const router = express.Router();

const {
  getPendingApplications,
  approveOrganizer,
  rejectOrganizer,
  getAllOrganizers,
  adminLogin,
  adminDeleteOrganizer,
  adminCancelAccountDeletion,
} = require("../controller/adminController");
const adminAuth = require("../middlewares/adminAuth");

router.get("/organizers", adminAuth, getAllOrganizers);

router.get("/pending-organizers",adminAuth, getPendingApplications);

router.put("/approve/:id",adminAuth, approveOrganizer);

router.delete("/reject/:id",adminAuth, rejectOrganizer);

router.post("/login", adminLogin);
router.post("/delete",adminAuth,adminDeleteOrganizer);
router.post("/cancel-deletion", adminAuth, adminCancelAccountDeletion);

module.exports = router;