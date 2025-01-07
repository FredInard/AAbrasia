const axios = require("axios")

/**
 * Envoie un message à un webhook Discord
 * @param {string} webhookUrl - https://discord.com/api/webhooks/1326228374896640010/YXdkjFeDc2iwZQ6peKzygH1-ViL0QVYS93XSfIThBtU7rHQGMzfhQz5XppLd1F93Ebj1
 * @param {string} content - Contenu du message à envoyer
 */
async function sendDiscordMessage(webhookUrl, content) {
  try {
    await axios.post(webhookUrl, { content })
    console.info("Message envoyé sur Discord avec succès.")
  } catch (error) {
    console.error("Erreur lors de l'envoi du message sur Discord :", error)
  }
}

module.exports = { sendDiscordMessage }
