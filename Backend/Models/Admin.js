const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    officialEmail: {
      type: String,
      required: true,
      unique: true,
    },

    pin: {
      type: String,
      required: true,
    },

    password: {
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
    tempJwtToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Admin", AdminSchema);
