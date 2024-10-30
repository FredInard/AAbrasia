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

  // GET /participations/:id
  static getparticipationsByPartyId(req, res) {
    const id = parseInt(req.params.id, 10)

    models.participation
      .findParticipationsByPartyId(id)
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
