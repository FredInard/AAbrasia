const nodemailer = require("nodemailer")

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    const mailOptions = {
      from: process.env.GMAIL_USER, // Adresse de l'expéditeur
      to, // Destinataire
      subject, // Sujet
      text, // Corps en texte brut
      html, // Corps en HTML (optionnel)
    }
    console.info("Mail Options:", mailOptions)

    const info = await transporter.sendMail(mailOptions)
    console.info("Email envoyé avec succès : %s", info.messageId)
    return info
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error)
    throw new Error("Une erreur est survenue lors de l'envoi de l'email.")
  }
}

module.exports = sendEmail
