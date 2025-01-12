const crypto = require("crypto")
const models = require("../models")
const sendEmail = require("../utils/sendEmail")
const bcrypt = require("bcrypt")

class PasswordResetController {
  // 1. Gérer la requête de réinitialisation
  static async requestReset(req, res) {
    const { email } = req.body

    try {
      // Vérifier si l'utilisateur existe
      const [users] = await models.utilisateur.findByEmail(email)
      if (users.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé." })
      }

      const utilisateur = users[0]

      // Générer un token unique
      const token = crypto.randomBytes(32).toString("hex")
      const expiration = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

      // Stocker le token dans la base de données
      await models.passwordResetToken.insert({
        utilisateur_id: utilisateur.id,
        token,
        expiration,
      })

      // Envoyer l'email avec le lien de réinitialisation
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
      await sendEmail(
        email,
        "Réinitialisation de votre mot de passe",
        `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`
      )

      res.status(200).json({
        message: "Email de réinitialisation envoyé. Vérifiez votre boîte mail.",
      })
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation :", error)
      res.status(500).json({ message: "Erreur interne du serveur." })
    }
  }

  // 2. Gérer la confirmation de réinitialisation
  static async confirmReset(req, res) {
    const { token, newPassword } = req.body

    try {
      // Rechercher le token dans la base de données
      const [tokens] = await models.passwordResetToken.findByToken(token)
      if (tokens.length === 0) {
        return res.status(400).json({ message: "Token invalide ou expiré." })
      }

      const resetToken = tokens[0]

      // Vérifier l'expiration
      if (new Date(resetToken.expiration) < new Date()) {
        return res.status(400).json({ message: "Token expiré." })
      }

      // Réinitialiser le mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await models.utilisateur.updatePassword(
        resetToken.utilisateur_id,
        hashedPassword
      )

      // Supprimer le token utilisé
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
      // Rechercher l'utilisateur dans la base de données
      const [utilisateur] = await models.utilisateur.findByEmail(email)
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur introuvable." })
      }

      // Générer un token de réinitialisation
      const token = require("crypto").randomBytes(32).toString("hex")
      const expiration = new Date(Date.now() + 3600000) // 1 heure

      // Enregistrer le token en base de données
      await models.passwordReset.insert({
        utilisateur_id: utilisateur.id,
        token,
        expiration,
      })

      // Construire l'email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
      const subject = "Réinitialisation de votre mot de passe"
      const text = `Bonjour, cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`
      const html = `<p>Bonjour,</p><p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">Réinitialiser le mot de passe</a>`

      // Envoyer l'email
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
