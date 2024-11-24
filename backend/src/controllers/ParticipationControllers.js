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
          res.status(200).json(rows[0]) // Retourner l'objet unique
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /participations/party/:id
  static getparticipationsByPartyId(req, res) {
    const id = parseInt(req.params.id, 10)

    models.participation
      .findParticipationsByPartyId(id)
      .then(([rows]) => {
        console.info("Participants trouvés dans la base de données :", rows) // Vérification des données avant de les renvoyer
        res.status(200).json(rows) // Renvoie tous les résultats, même s'ils sont vides
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500) // Problème côté serveur
      })
  }

  // GET /participations/:idPartie/:idPlayer
  static getparticipationsByPartyIdAndPlayerId(req, res) {
    const partyId = parseInt(req.params.idPartie, 10)
    const userId = parseInt(req.params.idPlayer, 10)

    console.info("Vérification de la participation de l'utilisateur :", {
      partyId,
      userId,
    })

    if (!partyId || !userId) {
      return res
        .status(400)
        .json({ error: "L'ID de la partie et de l'utilisateur sont requis." })
    }

    models.participation
      .findByPartyAndUserId(partyId, userId)
      .then(([existingParticipant]) => {
        if (existingParticipant.length > 0) {
          console.info("L'utilisateur est déjà inscrit à cette partie.")
          return res.status(200).json({ isJoined: true })
        } else {
          console.info("L'utilisateur n'est pas encore inscrit à cette partie.")
          return res.status(200).json({ isJoined: false })
        }
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la vérification de la participation :",
          err
        )
        res.status(500).json({
          error: "Erreur serveur lors de la vérification de la participation.",
        })
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

  // POST /participations/:idPartie/:idPlayer
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

  // DELETE /participations/:idPartie/:idPlayer
  static deleteParticipationsByPartyIdAndPlayerId(req, res) {
    const partyId = parseInt(req.params.idPartie, 10)
    const userId = parseInt(req.params.idPlayer, 10)

    console.info(
      "Suppression de la participation, covoiturages et repas pour l'utilisateur :",
      {
        partyId,
        userId,
      }
    )

    if (!partyId || !userId) {
      return res
        .status(400)
        .json({ error: "L'ID de la partie et de l'utilisateur sont requis." })
    }

    // Suppression des covoiturages, repas, et participation
    Promise.all([
      models.covoiturage.deleteByPartyAndUserId(partyId, userId), // Suppression des covoiturages
      models.repas.deleteByPartyAndUserId(partyId, userId), // Suppression des repas
      models.participation.deleteByPartyAndUserId(partyId, userId), // Suppression de la participation
    ])
      .then(([covoiturageResult, repasResult, participationResult]) => {
        if (participationResult.affectedRows === 0) {
          console.info(
            "Aucune participation trouvée pour l'utilisateur dans la partie :",
            partyId
          )
          return res.status(404).json({ message: "Participation non trouvée." })
        } else {
          console.info(
            "Participation, covoiturages et repas supprimés pour l'utilisateur dans la partie :",
            partyId
          )
          return res.status(204).send() // Succès de suppression
        }
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la suppression des données de l'utilisateur dans la partie :",
          err
        )
        res.status(500).json({
          error: "Erreur serveur lors de la suppression des données.",
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

  // PUT /participations/:id
  static edit(req, res) {
    const id = parseInt(req.params.id, 10)
    const participation = req.body
    participation.id = id

    // TODO: Validations (length, format...)

    models.participation
      .update(participation)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
        } else {
          res.status(200).json(participation)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }
}

module.exports = ParticipationControllers
