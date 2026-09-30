const { Resend } = require("resend");

// Initialize Resend with your environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({
  to,
  subject,
  text = "",
  html = "",
}) => {
  try {
    const data = await resend.emails.send({
      // Note: While testing, Resend requires you to use this specific 'from' address
      // and you can only send emails to the email address you signed up with.
      // To send to any user, you will need to add your own domain in the Resend dashboard later.
      from: "DevGallery Team <onboarding@resend.dev>", 
      
      reply_to: process.env.EMAIL, // Keeps your existing reply-to logic
      to,
      subject,
      text,
      html,
    });

    return data;
  } catch (error) {
    console.error("Mail Error:", error);
    throw error;
  }
};

module.exports = sendMail;
