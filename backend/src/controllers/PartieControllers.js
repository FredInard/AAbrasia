const models = require("../models")
const DOMPurify = require("dompurify")
// const { validationResult } = require('express-validator');

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
  // Nettoyer la description avant de mettre à jour
  partie.description = DOMPurify.sanitize(partie.description)

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

const add = (req, res) => {
  const partie = req.body
  // TODO validations (length, format...)

  // Nettoyer la description avant de l'insérer
  partie.Description = DOMPurify.sanitize(partie.Description)

  models.partie
    .insert(partie)
    .then(([result]) => {
      res.location(`/partie/${result.insertId}`).sendStatus(201)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

// const destroyeurDePartie = (req, res) => {
//   models.partie
//     .getDestroyeurDePartie(req.params.id)
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
      if (result[0] == null) {
        console.info("result 404", result)
        res.sendStatus(404)
      } else {
        res.json(result)
      }
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
