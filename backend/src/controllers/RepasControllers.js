// controllers/RepasControllers.js

const models = require("../models")

class RepasControllers {
  // GET /repas
  static browse(req, res) {
    models.repas
      .findAll()
      .then(([rows]) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /repas/:id
  static read(req, res) {
    const id = parseInt(req.params.id, 10)

    models.repas
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

  // GET /repas/:id
  static getRepasByPartyId(req, res) {
    const id = parseInt(req.params.id, 10)

    models.repas
      .getRepasByPartyId(id)
      .then(([rows]) => {
        console.info("Repas trouvés dans la base de données :", rows) // vérification des données avant de les renvoyer
        res.status(200).json(rows) // Renvoie tous les repas, même si le tableau est vide
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500) // Problème côté serveur
      })
  }

  // POST /repas
  static add(req, res) {
    const repas = req.body

    // TODO: Validations (length, format...)
    console.info("Données reçues pour l'ajout de repas :", req.body)
    models.repas
      .insert(repas)
      .then(([result]) => {
        res.status(201).json({ id: result.insertId, ...repas })
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // PUT /repas/:id
  static edit(req, res) {
    const id = parseInt(req.params.id, 10)
    const repas = req.body
    repas.id = id

    console.info("repas", repas)
    console.info("repas.id", repas.id)

    // TODO: Validations (length, format...)

    models.repas
      .update(repas)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
        } else {
          res.status(200).json(repas)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // DELETE /repas/:id
  static destroy(req, res) {
    const id = parseInt(req.params.id, 10)

    models.repas
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
}

module.exports = RepasControllers
