// controllers/PartieControllers.js

const models = require("../models")
// const { validationResult } = require("express-validator")
const { sendDiscordMessage } = require("../utils/discord")
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
console.info("URL Discord Webhook :", DISCORD_WEBHOOK_URL)

const axios = require("axios")

class PartieControllers {
  // GET /parties
  static browse(req, res) {
    models.partie
      .findAll()
      .then(([rows]) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/:id
  static read(req, res) {
    const id = parseInt(req.params.id, 10)

    models.partie
      .find(id)
      .then(([rows]) => {
        if (rows[0]) {
          res.status(200).json(rows[0])
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/utilisateur/:id
  static getPartieByUtilisateurId(req, res) {
    const id = parseInt(req.params.id, 10)

    models.partie
      .findPartieByUtilisateurId(id)
      .then(([rows]) => {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // POST /parties
  static async add(req, res) {
    try {
      console.info("Requête reçue pour ajouter une partie.")
      const partie = { ...req.body }

      if (req.file) {
        const filePath = req.file.path.replace(/\\/g, "/")
        partie.photo_scenario = filePath.startsWith("public")
          ? filePath
          : `public/${filePath}`
      } else {
        partie.photo_scenario =
          "public/assets/images/profilPictures/dragonBook.webp"
      }

      const [result] = await models.partie.insert(partie)

      // Préparer le message pour Discord
      const discordMessage = `🎲 **Nouvelle partie créée !**
**Titre :** ${partie.titre}
**Description :** ${partie.description}
**Date :** ${partie.date}
**Lieu :** ${partie.lieu}`

      // Envoyer le message sur Discord
      await sendDiscordMessage(DISCORD_WEBHOOK_URL, discordMessage)

      res.status(201).json({ id: result.insertId, ...partie })
    } catch (err) {
      console.error("Erreur lors de l'ajout de la partie :", err)
      res.sendStatus(500)
    }
  }

  // PUT /parties/:id
  // Méthode pour éditer une partie existante
  // PUT /parties/:id
  static async edit(req, res) {
    const id = parseInt(req.params.id, 10)
    console.info(`Modification de la partie avec l'ID: ${id}`)

    const partie = { ...req.body }
    partie.id = id

    // Gestion du chemin de l'image
    if (req.file) {
      partie.photo_scenario = req.file.path.replace(/\\/g, "/") // Convertir les antislashs en slashs
      if (!partie.photo_scenario.startsWith("public/")) {
        partie.photo_scenario =
          "public/" + partie.photo_scenario.replace(/^\/+/, "") // Ajouter "public/" si absent
      }
    }

    console.info("Données de la partie pour mise à jour:", partie)

    try {
      // Mise à jour de la base de données
      const [result] = await models.partie.update(partie)

      if (result.affectedRows === 0) {
        console.info(`Aucune partie trouvée avec l'ID: ${id}`)
        return res.status(404).json({ error: "Partie non trouvée." })
      }

      console.info(`Partie avec l'ID ${id} mise à jour avec succès.`)

      // Préparation du message Discord
      const discordMessage = {
        content: `📢 Une partie a été modifiée !`,
        embeds: [
          {
            title: `Partie : ${partie.titre || "Non spécifié"}`,
            description: partie.description || "Aucune description fournie.",
            color: 3447003,
            fields: [
              {
                name: "Date",
                value: partie.date || "Non spécifiée",
                inline: true,
              },
              {
                name: "Lieu",
                value: partie.lieu || "Non spécifié",
                inline: true,
              },
              {
                name: "Niveau de difficulté",
                value: partie.niveau_difficulte || "Non spécifié",
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: `ID de la partie : ${id}` },
          },
        ],
      }

      try {
        // Envoi du message à Discord
        await axios.post(process.env.DISCORD_WEBHOOK_URL, discordMessage)
        console.info("Message envoyé à Discord avec succès.")
      } catch (discordError) {
        console.error(
          "Erreur lors de l'envoi du message à Discord :",
          discordError.message
        )
      }

      // Réponse au client
      return res
        .status(200)
        .json({ message: "Partie mise à jour avec succès.", partie })
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la partie :", err.message)
      return res
        .status(500)
        .json({ error: "Erreur serveur lors de la mise à jour." })
    }
  }

  static async deleteByPartyId(req, res) {
    const partyId = parseInt(req.params.id, 10)

    if (!partyId) {
      return res.status(400).json({ error: "L'ID de la partie est requis." })
    }

    try {
      console.info(`Suppression des dépendances pour la partie ID: ${partyId}`)

      // Suppression des dépendances
      await Promise.all([
        models.participation.deleteByPartyId(partyId), // Supprime les participations
        models.repas.deleteByPartyId(partyId), // Supprime les repas
        models.covoiturage.deleteByPartyId(partyId), // Supprime les covoiturages
      ])

      // Suppression de la partie elle-même
      const result = await models.partie.delete(partyId)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Partie non trouvée." })
      }

      console.info(`Partie ID: ${partyId} et dépendances supprimées.`)
      res.status(204).send() // Succès sans contenu
    } catch (err) {
      console.error("Erreur lors de la suppression de la partie :", err)
      res.status(500).json({ error: "Erreur serveur." })
    }
  }

  // GET /parties/affichage
  static affichageInfoPartie(req, res) {
    models.partie
      .getAffichageInfoPartie()
      .then(([rows]) => {
        res.status(200).json(rows)
        // console.info("rows de affichageInfoPartie", rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/affichage/:date
  static affichageInfoPartieDate(req, res) {
    const date = req.params.date

    models.partie
      .getAffichageInfoPartieDate(date)
      .then(([rows]) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/utilisateur/:id
  static partieByUtilisateurId(req, res) {
    const utilisateurId = parseInt(req.params.id, 10)

    models.partie
      .findPartieByUtilisateurId(utilisateurId)
      .then(([rows]) => {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/joueurs/:id
  static joueursByPartieId(req, res) {
    const partieId = parseInt(req.params.id, 10)

    models.partie
      .findJoueursByPartieId(partieId)
      .then(([rows]) => {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/meneur/:id
  static partieMeneurByUtilisateurId(req, res) {
    const utilisateurId = parseInt(req.params.id, 10)

    models.partie
      .findPartieMeneurByUtilisateurId(utilisateurId)
      .then(([rows]) => {
        if (rows.length > 0) {
          res.status(200).json(rows)
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /parties/count/:id
  static countPartieById(req, res) {
    const partieId = parseInt(req.params.id, 10)

    models.partie
      .getCountPartieById(partieId)
      .then(([rows]) => {
        if (rows[0]) {
          res.status(200).json(rows[0])
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // DELETE /parties/destroyer/:id
  // static destroyeurDePartie(req, res) {
  //   const id = parseInt(req.params.id, 10)

  //   models.partie
  //     .getDestroyeurDePartie(id)
  //     .then(() => {
  //       res.sendStatus(204) // La suppression a réussi
  //       console.info(
  //         "La suppression de la partie et des participations a réussi"
  //       )
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       res.sendStatus(500) // Erreur de serveur
  //       console.info(
  //         "Échec de la suppression de la partie et des participations"
  //       )
  //     })
  // }
}

module.exports = PartieControllers
