// controllers/PartieControllers.js

const models = require("../models")
const { validationResult } = require("express-validator")

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
  static add(req, res) {
    // Validations
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const partie = req.body

    models.partie
      .insert(partie)
      .then(([result]) => {
        res.status(201).json({ id: result.insertId, ...partie })
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // PUT /parties/:id
  static edit(req, res) {
    const id = parseInt(req.params.id, 10)
    const partie = req.body
    partie.id = id

    models.partie
      .update(partie)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
        } else {
          res.status(200).json(partie)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // DELETE /parties/:id
  static destroy(req, res) {
    const id = parseInt(req.params.id, 10)

    models.partie
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

  // GET /parties/affichage
  static affichageInfoPartie(req, res) {
    models.partie
      .getAffichageInfoPartie()
      .then(([rows]) => {
        res.status(200).json(rows)
        console.info("rows de affichageInfoPartie", rows)
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
  static destroyeurDePartie(req, res) {
    const id = parseInt(req.params.id, 10)

    models.partie
      .getDestroyeurDePartie(id)
      .then(() => {
        res.sendStatus(204) // La suppression a réussi
        console.info(
          "La suppression de la partie et des participations a réussi"
        )
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500) // Erreur de serveur
        console.info(
          "Échec de la suppression de la partie et des participations"
        )
      })
  }
}

module.exports = PartieControllers
