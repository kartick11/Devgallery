const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  officialEmail: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // This automatically deletes the document after 300 seconds (5 minutes)
  },
});

module.exports = mongoose.model("Otp", otpSchema);