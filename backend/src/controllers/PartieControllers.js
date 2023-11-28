const models = require("../models")
const { validationResult, body } = require("express-validator")

const browse = (req, res) => {
  models.partie
    .findAll()
    .then(([rows]) => {
      res.send(rows)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const read = (req, res) => {
  models.partie
    .find(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404)
      } else {
        res.send(rows[0])
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const edit = (req, res) => {
  const partie = req.body
  console.info("partie", partie)
  // TODO validations (length, format...)

  partie.id = parseInt(req.params.id, 10)

  models.partie
    .update(partie)
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

const add = [
  // Ajoutez les validations ici en utilisant express-validator
  body("Titre")
    .isLength({ max: 50 })
    .withMessage("Le titre ne peut pas dépasser 50 caractères"),
  body("Lieu")
    .isLength({ max: 50 })
    .withMessage("Le lieu ne peut pas dépasser 50 caractères"),
  body("TypeDeJeux")
    .isLength({ max: 50 })
    .withMessage("Le type de jeux ne peut pas dépasser 50 caractères"),
  body("Date")
    .isISO8601()
    .toDate()
    .withMessage("La date doit être au format ISO8601"),
  body("Description")
    .optional() // Si la description n'est pas obligatoire
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),
  // ... Ajoutez d'autres validations selon vos besoins

  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const partie = req.body

    models.partie
      .insert(partie)
      .then(([result]) => {
        res.location(`/partie/${result.insertId}`).sendStatus(201)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  },
]

const destroyeurDePartie = (req, res) => {
  const id = req.params.id
  console.info("id", id)
  models.partie
    .getDestroyeurDePartie(id)
    .then(() => {
      res.sendStatus(204) // La suppression a réussi
      console.info(
        "La suppression de la partie et des participation ont réussi"
      )
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500) // Erreur de serveur
      console.info("Echec de la suppression de la partie et des participation")
    })
}

const destroy = (req, res) => {
  models.partie
    .delete(req.params.id)
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

const affichageInfoPartie = (req, res) => {
  models.partie
    .getAffichageInfoPartie()
    .then(([rows]) => {
      res.send(rows)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const partieByUtilisateurId = (req, res) => {
  models.partie
    .findpartieByUtilisateurId(req.params.id)
    .then(([result]) => {
      if (result[0] == null) {
        res.sendStatus(404)
      } else {
        // res.send(result[0])
        res.json(result)
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const partieMeneurByUtilisateurId = (req, res) => {
  models.partie

    .findpartieMeneurByUtilisateurId(req.params.id)

    .then(([result]) => {
      // console.info("result succes findpartieMeneurByUtilisateurId", result)
      res.json(result)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const countPartieById = (req, res) => {
  models.partie
    .getCountPartieById(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404)
      } else {
        res.send(rows[0])
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  affichageInfoPartie,
  partieByUtilisateurId,
  countPartieById,
  partieMeneurByUtilisateurId,
  destroyeurDePartie,
}
