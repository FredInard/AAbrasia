const models = require("../models")

const browse = (req, res) => {
  models.participation
    .findAll()
    .then(([rows]) => {
      res.send(rows)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const add = (req, res) => {
  const participation = req.body

  // TODO validations (length, format...)

  models.participation
    .insert(participation)
    .then(([result]) => {
      console.info("inscription à la partie réussit")
      res.json(result.insertId)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}
const read = (req, res) => {
  models.participation
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
  const participation = req.body

  // TODO validations (length, format...)

  participation.id = parseInt(req.params.id, 10)

  models.participation
    .update(participation)
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
const destroy = (req, res) => {
  models.participation
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

const countUserParticipation = (req, res) => {
  const utilisateurId = req.params.utilisateurId
  const partieId = req.params.partieId

  models.participation
    .getCountUserParticipation(utilisateurId, partieId)
    .then((result) => {
      const count = result[0][0].count // Extraire la valeur de "count" de la réponse
      if (count > 0) {
        console.info("L'utilisateur est déjà inscrit à cette partie.")
        res.json({ isSubscribed: true })
      } else {
        res.json({ isSubscribed: false })
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

module.exports = {
  browse,
  add,
  read,
  edit,
  destroy,
  countUserParticipation,
}
