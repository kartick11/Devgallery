const mongoose = require("mongoose");

const OrganizerApplicationSchema = new mongoose.Schema(
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
    pin: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {  
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "OrganizerApplication",
  OrganizerApplicationSchema,
);
