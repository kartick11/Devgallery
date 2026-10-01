const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Must be a Gmail App Password
  },
  // CRITICAL FIX: Forces IPv4 to bypass Vercel's ENETUNREACH error
  family: 4 
});

const sendMail = async ({
  to,
  subject,
  text = "",
  html = "",
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"DevGallery Team" <${process.env.EMAIL}>`, 
      replyTo: process.env.EMAIL, 
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.error("Mail Error:", error);
    throw error; // Passes the error to your route controller so you can see it
  }
};

module.exports = sendMail;
