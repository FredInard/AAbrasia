const models = require("../models")

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

  // TODO validations (length, format...)

  partie.id = parseInt(req.params.id, 10)
  console.info("id envoyé a partie/:id", partie.id)
  console.info("req.body", req.body)

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
  console.info("poulet", partie)
  // TODO validations (length, format...)

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
        console.info("result de findpartieByUtilisateurId", result)
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
}
