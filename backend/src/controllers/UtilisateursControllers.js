const models = require("../models")
const fs = require("fs")

const browse = (req, res) => {
  models.utilisateurs
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
  const utilisateurs = req.body

  // TODO validations (length, format...)

  models.utilisateurs
    .insert(utilisateurs)
    .then(([result]) => {
      res.location(`/utilisateurs/${result.insertId}`).sendStatus(201)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const browsePseudo = (req, res) => {
  const pseudoInscription = req.params.pseudoInscription

  models.utilisateurs
    .findAllPseudo(pseudoInscription)
    .then(([result]) => {
      const isPseudoExist = result.length > 0
      res.json({ isPseudoExist }) // renvois true ou fals via "isPseudoExist" en fonction de la correspondance du pseudo. true s'il y a une correspondance et false s'il n'y en a pas.
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const read = (req, res) => {
  models.utilisateurs
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

const read2 = (req, res) => {
  models.utilisateurs

    .readlessPW(req.params.id)
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
  const utilisateurs = req.body

  // TODO validations (length, format...)

  utilisateurs.id = parseInt(req.params.id, 10)

  models.utilisateurs
    .update(utilisateurs)
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
  models.utilisateurs
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

const displayPlayer = (req, res) => {
  models.utilisateurs
    .getDisplayPlayer(req.params.id)
    .then(([rows]) => {
      res.send(rows)
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const verifyUtilisateur = (req, res, next) => {
  models.utilisateurs
    .getUserByPseudoWithPassword(req.body.Pseudo)
    .then(([utilisateurs]) => {
      if (utilisateurs[0] != null) {
        req.utilisateur = utilisateurs[0]
        next()
      } else {
        res.sendStatus(401)
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send("Error retrieving data from the database")
    })
}

const updateProfilPicture = async (req, res) => {
  const utilisateurs = req.body

  // TODO validations (length, format...)

  utilisateurs.id = parseInt(req.params.id, 10)

  models.utilisateurs
    .updateProfilPicture(
      utilisateurs,
      `assets/images/profilPictures/${req.file.originalname}`
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404)
      } else {
        // Déplacez la photo après avoir effectué l'opération de mise à jour
        fs.rename(
          req.file.path,
          `public/assets/images/profilPictures/${req.file.originalname}`,
          (err) => {
            if (err) {
              console.error(err)
              res.status(500).send("Error while moving the uploaded file")
            } else {
              res.sendStatus(204)
            }
          }
        )
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const readPartieByUtilisateurId = (req, res) => {
  models.utilisateurs
    .getReadPartieByUtilisateurId(req.params.id)
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
  add,
  read,
  read2,
  edit,
  destroy,
  displayPlayer,
  verifyUtilisateur,
  updateProfilPicture,
  readPartieByUtilisateurId,
  browsePseudo,
}
