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
  static async add(req, res) {
    try {
      console.info("Requête reçue pour ajouter une partie.")
      console.info("req.body :", req.body)
      console.info("req.file :", req.file)

      // Validations
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.info("Erreurs de validation trouvées :", errors.array())
        return res.status(400).json({ errors: errors.array() })
      }

      // Create partie object from req.body
      const partie = { ...req.body }

      // Add the file path to the partie object if a file was uploaded
      if (req.file) {
        // Convert Windows-style path to URL-style path
        const filePath = req.file.path.replace(/\\/g, "/")
        // Remove 'public' from the beginning of the path as it's typically served as static
        partie.photo_scenario = filePath.replace("public", "")
      } else {
        partie.photo_scenario = null
      }

      console.info("Données de la partie à insérer :", partie)

      const [result] = await models.partie.insert(partie)
      console.info("Partie insérée avec succès, ID :", result.insertId)
      res.status(201).json({ id: result.insertId, ...partie })
    } catch (err) {
      console.error("Erreur lors de l'insertion de la partie :", err)
      res.sendStatus(500)
    }
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
