const crypto = require("crypto")
const argon2 = require("argon2")
const { hashingOptions } = require("../auth")
const models = require("../models")
const sendEmail = require("../services/sendEmail")

class PasswordResetController {
  static async requestReset(req, res) {
    const { email } = req.body

    try {
      console.info(
        "Email reçu pour la réinitialisation du mot de passe :",
        email
      )

      const [users] = await models.utilisateur.findByEmail(email)
      console.info("Utilisateurs trouvés :", users)

      if (users.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé." })
      }

      const utilisateur = users[0]
      console.info("Utilisateur trouvé :", utilisateur)

      const token = crypto.randomBytes(32).toString("hex")
      console.info("Token généré :", token)

      const expiration = new Date(Date.now() + 60 * 60 * 1000) // 1 heure
      console.info("Date d'expiration du token :", expiration)

      await models.passwordResetToken.insert({
        utilisateur_id: utilisateur.id,
        token,
        expiration,
      })
      console.info("Token de réinitialisation inséré dans la base de données.")

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
      console.info("Lien de réinitialisation généré :", resetLink)

      const emailOptions = {
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
        html: `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a></p>`,
      }

      console.info("Options de l'email :", emailOptions)

      await sendEmail(emailOptions)
      console.info("Email de réinitialisation envoyé avec succès.")

      res.status(200).json({
        message: "Email de réinitialisation envoyé. Vérifiez votre boîte mail.",
      })
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation :", error)
      res.status(500).json({ message: "Erreur interne du serveur." })
    }
  }

  static async confirmReset(req, res) {
    const { token, newPassword } = req.body

    try {
      const [tokens] = await models.passwordResetToken.findByToken(token)
      if (tokens.length === 0) {
        return res.status(400).json({ message: "Token invalide ou expiré." })
      }

      const resetToken = tokens[0]

      if (new Date(resetToken.expiration) < new Date()) {
        return res.status(400).json({ message: "Token expiré." })
      }

      // Vérification de la longueur minimale du nouveau mot de passe
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({
          message: "Le mot de passe doit comporter au moins 8 caractères.",
        })
      }

      // Hachage du mot de passe avec Argon2 et les mêmes options (hashingOptions)
      const hashedPassword = await argon2.hash(newPassword, hashingOptions)

      // Mise à jour du mot de passe en base de données
      await models.utilisateur.updatePassword(
        resetToken.utilisateur_id,
        hashedPassword
      )

      // Suppression du token de réinitialisation
      await models.passwordResetToken.delete(resetToken.id)

      res
        .status(200)
        .json({ message: "Mot de passe réinitialisé avec succès." })
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error)
      res.status(500).json({ message: "Erreur interne du serveur." })
    }
  }

  static async sendResetEmail(req, res) {
    const { email } = req.body

    try {
      const [utilisateur] = await models.utilisateur.findByEmail(email)
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur introuvable." })
      }

      const token = crypto.randomBytes(32).toString("hex")
      const expiration = new Date(Date.now() + 3600000) // 1 heure

      await models.passwordReset.insert({
        utilisateur_id: utilisateur.id,
        token,
        expiration,
      })

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
      const subject = "Réinitialisation de votre mot de passe"
      const text = `Bonjour, cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`
      const html = `<p>Bonjour,</p><p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">Réinitialiser le mot de passe</a>`

      await sendEmail({ to: email, subject, text, html })

      res.status(200).json({ message: "Email de réinitialisation envoyé." })
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de réinitialisation :",
        error
      )
      res.status(500).json({ error: "Erreur interne du serveur." })
    }
  }
}

module.exports = PasswordResetController
