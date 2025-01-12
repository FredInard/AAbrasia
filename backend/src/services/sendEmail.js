const nodemailer = require("nodemailer")

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Vous pouvez utiliser un autre service comme Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER, // Votre adresse email
        pass: process.env.EMAIL_PASSWORD, // Votre mot de passe ou token d'application
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER, // L'adresse de l'expéditeur
      to, // Adresse(s) du destinataire
      subject, // Objet de l'email
      text, // Corps de l'email en texte brut
      html, // Corps de l'email en HTML (optionnel)
    }

    const info = await transporter.sendMail(mailOptions)
    console.info("Email envoyé : %s", info.messageId)
    return info
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error)
    throw error
  }
}

module.exports = sendEmail
