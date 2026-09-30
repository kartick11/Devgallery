// Models/Organizer.js

const mongoose = require("mongoose");

const OrganizerSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },

    officialEmail: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
    pin: {
      type: String,
      required: true,
    },
    resetPinOtp: {
      type: String,
      default: null,
    },

    resetPinOtpExpire: {
      type: Date,
      default: null,
    },

    resetPasswordOtp: {
      type: String,
      default: null,
    },

    resetPasswordOtpExpire: {
      type: Date,
      default: null,
    },
    isPendingDeletion: {
      type: Boolean,
      default: false,
    },
    deletionScheduledAt: {
      type: Date,
      default: null,
    },
    deletionRequestedByRole: {
      type: String,
      enum: ["organizer", "admin"],
      default: null,
    },
    deletionRequesterId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    hideProjects: {
      type: Boolean,
      default: false,
    },
    deletionReason: {
      type: String,
      default: "",
    },
    deletionCustomReason: {
      type: String,
      default: "",
    },
    deletionCooldownUntil: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Organizer", OrganizerSchema);
