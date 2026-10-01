const sendMail = async ({ to, subject, text = "", html = "" }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // This grabs your API key from Render
        "api-key": process.env.BREVO_API_KEY, 
      },
      body: JSON.stringify({
        // MUST match the Gmail address you verified in Step 1
        sender: { name: "DevGallery Team", email: "mallavkartick9921@gmail.com" }, 
        to: [{ email: to }],
        subject: subject,
        // Brevo uses htmlContent and textContent
        htmlContent: html ? html : undefined,
        textContent: text && !html ? text : undefined, 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Brevo");
    }

    return data;
  } catch (error) {
    console.error("Brevo Mail Error:", error);
    throw error;
  }
};

module.exports = sendMail;
