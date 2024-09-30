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

// const models = require("../models")
// const { validationResult, body } = require("express-validator")

// const browse = (req, res) => {
//   models.partie
//     .findAll()
//     .then(([rows]) => {
//       res.send(rows)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const read = (req, res) => {
//   models.partie
//     .find(req.params.id)
//     .then(([rows]) => {
//       if (rows[0] == null) {
//         res.sendStatus(404)
//       } else {
//         res.send(rows[0])
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const edit = (req, res) => {
//   const partie = req.body
//   console.info("partie", partie)
//   // TODO validations (length, format...)

//   partie.id = parseInt(req.params.id, 10)

//   models.partie
//     .update(partie)
//     .then(([result]) => {
//       if (result.affectedRows === 0) {
//         res.sendStatus(404)
//       } else {
//         res.sendStatus(204)
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const add = [
//   // Ajoutez les validations ici en utilisant express-validator
//   body("Titre")
//     .isLength({ max: 50 })
//     .withMessage("Le titre ne peut pas dépasser 50 caractères"),
//   body("Lieu")
//     .isLength({ max: 50 })
//     .withMessage("Le lieu ne peut pas dépasser 50 caractères"),
//   body("TypeDeJeux")
//     .isLength({ max: 50 })
//     .withMessage("Le type de jeux ne peut pas dépasser 50 caractères"),
//   body("Date")
//     .isISO8601()
//     .toDate()
//     .withMessage("La date doit être au format ISO8601"),
//   body("Description")
//     .optional() // Si la description n'est pas obligatoire
//     .isString()
//     .withMessage("La description doit être une chaîne de caractères"),
//   // ... Ajoutez d'autres validations selon vos besoins

//   (req, res) => {
//     const errors = validationResult(req)

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() })
//     }

//     const partie = req.body

//     models.partie
//       .insert(partie)
//       .then(([result]) => {
//         res.location(`/partie/${result.insertId}`).sendStatus(201)
//       })
//       .catch((err) => {
//         console.error(err)
//         res.sendStatus(500)
//       })
//   },
// ]

// const destroyeurDePartie = (req, res) => {
//   const id = req.params.id
//   console.info("id", id)
//   models.partie
//     .getDestroyeurDePartie(id)
//     .then(() => {
//       res.sendStatus(204) // La suppression a réussi
//       console.info(
//         "La suppression de la partie et des participation ont réussi"
//       )
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500) // Erreur de serveur
//       console.info("Echec de la suppression de la partie et des participation")
//     })
// }

// const destroy = (req, res) => {
//   models.partie
//     .delete(req.params.id)
//     .then(([result]) => {
//       if (result.affectedRows === 0) {
//         res.sendStatus(404)
//       } else {
//         res.sendStatus(204)
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const affichageInfoPartie = (req, res) => {
//   models.partie
//     .getAffichageInfoPartie()
//     .then(([rows]) => {
//       res.send(rows)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const affichageInfoPartieDate = (req, res) => {
//   const date = req.params.date
//   console.info("Date reçue dans l'endpoint affichageInfoPartieDate:", date)
//   models.partie
//     .getAffichageInfoPartieDate(date)
//     .then(([rows]) => {
//       res.send(rows)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const partieByUtilisateurId = (req, res) => {
//   models.partie
//     .findpartieByUtilisateurId(req.params.id)
//     .then(([result]) => {
//       console.info("result succes findpartieByUtilisateurId", result)
//       if (result[0] == null) {
//         res.sendStatus(404)
//       } else {
//         // res.send(result[0])
//         res.json(result)
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const joueursByPartieId = (req, res) => {
//   const id = req.params.id
//   console.info("id joueursByPartieId :", id)
//   models.partie
//     .findJoueursByPartieId(id)
//     .then(([result]) => {
//       console.info("result succes findjoueursByPartieId", result)
//       if (result[0] == null) {
//         res.sendStatus(404)
//       } else {
//         // res.send(result[0])
//         res.json(result)
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const partieMeneurByUtilisateurId = (req, res) => {
//   models.partie

//     .findpartieMeneurByUtilisateurId(req.params.id)

//     .then(([result]) => {
//       console.info("result succes findpartieMeneurByUtilisateurId", result)
//       res.json(result)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const countPartieById = (req, res) => {
//   models.partie
//     .getCountPartieById(req.params.id)
//     .then(([rows]) => {
//       if (rows[0] == null) {
//         res.sendStatus(404)
//       } else {
//         res.send(rows[0])
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// module.exports = {
//   browse,
//   read,
//   edit,
//   add,
//   destroy,
//   affichageInfoPartie,
//   partieByUtilisateurId,
//   countPartieById,
//   partieMeneurByUtilisateurId,
//   destroyeurDePartie,
//   affichageInfoPartieDate,
//   joueursByPartieId,
// }
