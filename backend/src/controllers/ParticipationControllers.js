// controllers/ParticipationControllers.js

const models = require("../models")

class ParticipationControllers {
  // GET /participations
  static browse(req, res) {
    models.participation
      .findAll()
      .then(([rows]) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /participations/:id
  static read(req, res) {
    const id = parseInt(req.params.id, 10)

    models.participation
      .find(id)
      .then(([rows]) => {
        if (rows[0]) {
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

  // GET /participations/:id
  static getparticipationsByPartyId(req, res) {
    const id = parseInt(req.params.id, 10)

    models.participation
      .findParticipationsByPartyId(id)
      .then(([rows]) => {
        console.info("Participants trouvés dans la base de données :", rows) // vérification des données avant de les renvoyer
        res.status(200).json(rows) // Renvoie tous les résultats, même s'il est vide
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500) // Problème côté serveur
      })
  }

  // POST /participations
  static add(req, res) {
    const participation = req.body

    // TODO: Validations (length, format...)

    models.participation
      .insert(participation)
      .then(([result]) => {
        console.info("Inscription à la partie réussie")
        res.status(201).json({ id: result.insertId, ...participation })
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // POST /participations by idPartie et idPlayer
  static addByPartiId(req, res) {
    const partyId = parseInt(req.params.idPartie, 10)
    const userId = parseInt(req.params.idPlayer, 10)

    console.info("Requête reçue pour ajouter un participant :", {
      partyId,
      userId,
    })

    // Vérifie que partyId et userId sont valides
    if (!partyId || !userId) {
      console.info("ID de partie ou d'utilisateur manquant ou invalide", {
        partyId,
        userId,
      })
      return res
        .status(400)
        .json({ error: "L'ID de la partie et de l'utilisateur sont requis." })
    }

    // Vérifie si l'utilisateur est déjà inscrit à cette partie
    models.participation
      .findByPartyAndUserId(partyId, userId)
      .then(([existingParticipant]) => {
        console.info(
          "Vérification de l'existence de la participation :",
          existingParticipant
        )

        if (existingParticipant.length > 0) {
          console.info("Utilisateur déjà inscrit à cette partie :", {
            partyId,
            userId,
          })
          return res
            .status(409)
            .json({ error: "L'utilisateur est déjà inscrit à cette partie." })
        }

        // Ajoute l'utilisateur à la participation
        return models.participation
          .addParticipantToParty(partyId, userId)
          .then(([result]) => {
            console.info(
              "Utilisateur ajouté à la participation avec succès :",
              { partyId, userId }
            )
            res
              .status(201)
              .json({ message: "Utilisateur ajouté à la partie avec succès." })
          })
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout de la participation :", err)
        res.status(500).json({
          error: "Erreur serveur lors de l'ajout de la participation.",
        })
      })
  }

  // DELETE /participations/:id
  static destroy(req, res) {
    const id = parseInt(req.params.id, 10)

    models.participation
      .delete(id)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
        } else {
          res.sendStatus(204)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /participations/count/:utilisateurId/:partieId
  static countUserParticipation(req, res) {
    const utilisateurId = parseInt(req.params.utilisateurId, 10)
    const partieId = parseInt(req.params.partieId, 10)

    models.participation
      .getCountUserParticipation(utilisateurId, partieId)
      .then(([rows]) => {
        const count = rows[0]?.count || 0
        if (count > 0) {
          console.info("L'utilisateur est déjà inscrit à cette partie.")
          res.status(200).json({ isSubscribed: true })
        } else {
          res.status(200).json({ isSubscribed: false })
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // DELETE /participations/delete/:utilisateurId/:partieId
  static deleteUserParticipation(req, res) {
    const utilisateurId = parseInt(req.params.utilisateurId, 10)
    const partieId = parseInt(req.params.partieId, 10)

    models.participation
      .deleteByUserAndPartie(utilisateurId, partieId)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          console.info(
            "Une erreur s'est produite lors de la tentative de suppression de la participation"
          )
          res.sendStatus(404)
        } else {
          console.info("L'utilisateur a été retiré de la partie")
          res.sendStatus(204)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }
}

module.exports = ParticipationControllers
