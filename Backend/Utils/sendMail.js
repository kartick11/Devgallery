const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // Using explicit host and port with TLS is slightly better for deliverability 
  // than relying solely on the "gmail" service alias.
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Must be an App Password, not your real password
  },
});

const sendMail = async ({
  to,
  subject,
  text = "",
  html = "",
}) => {
  try {
    const info = await transporter.sendMail({
      // 1. Ensure the sender name is professional and clear
      from: `"DevGallery Team" <${process.env.EMAIL}>`, 
      
      // 2. Add a explicit reply-to address (Spam filters look for this)
      replyTo: process.env.EMAIL, 
      
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error("Mail Error:", error);
    throw error;
  }
};

module.exports = sendMail;