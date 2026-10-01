const { Resend } = require("resend");

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, text = "", html = "" }) => {
  try {
    const data = await resend.emails.send({
      // IMPORTANT: While on the free testing tier, you MUST use this exact 'from' address
      from: "DevGallery Team <onboarding@resend.dev>",
      reply_to: "kartickmallav1811@gmail.com",
      to,
      subject,
      text,
      html,
    });
    
    return data;
  } catch (error) {
    console.error("Resend Mail Error:", error);
    throw error;
  }
};

module.exports = sendMail;
