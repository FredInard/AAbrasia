const nodemailer = require("nodemailer")

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER, // Votre email généré par Mailgun
        pass: process.env.EMAIL_PASSWORD, // Votre clé API Mailgun
      },
      tls: {
        rejectUnauthorized: false, // Pour éviter les erreurs de certificats
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER, // Adresse de l'expéditeur
      to, // Destinataire
      subject, // Sujet
      text, // Corps en texte brut
      html, // Corps en HTML (optionnel)
    }

    console.info("EMAIL_HOST:", process.env.EMAIL_HOST)
    console.info("EMAIL_PORT:", process.env.EMAIL_PORT)
    console.info("EMAIL_USER:", process.env.EMAIL_USER)
    console.info("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD)
    const info = await transporter.sendMail(mailOptions)
    console.info("Email envoyé avec succès : %s", info.messageId)
    return info
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error)
    throw new Error("Une erreur est survenue lors de l'envoi de l'email.")
  }
}

module.exports = sendEmail
