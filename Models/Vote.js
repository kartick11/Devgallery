const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true, // Indexed for faster querying by project
    },
    name: {
      type: String,
      required: true,
    },
    facialPattern: {
      type: [Number], // Stores the 128-element array from face-api.js
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer", // or 'Organizer'
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Vote || mongoose.model('Vote', voteSchema);
