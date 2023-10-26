const models = require("../models")
const fs = require("fs")
const sharp = require("sharp")

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
  console.info("utilisateurs de edit", utilisateurs)
  // TODO validations (length, format...)

  utilisateurs.id = parseInt(req.params.id, 10)

  models.utilisateurs
    .update(utilisateurs)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404)
        console.info("404", res.sendStatus(404))
      } else {
        res.sendStatus(204)
        console.info("la modification de profil à fonctionnée")
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
      console.info("l'axios coté back pour displayPlayer n'a pas fonctionné")
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

  // Utilisez sharp pour redimensionner l'image
  sharp(req.file.path)
    .resize(1023, 1024) // Redimensionnez l'image à 1023x1024 pixels
    .toFile(
      `public/assets/images/profilPictures/${req.file.originalname}`,
      (err, info) => {
        if (err) {
          console.error(err)
          res
            .status(500)
            .send("Error while resizing and moving the uploaded file")
        } else {
          // La mise à jour de la base de données se fait après le redimensionnement
          models.utilisateurs
            .updateProfilPicture(
              utilisateurs,
              `assets/images/profilPictures/${req.file.originalname}`
            )
            .then(([result]) => {
              if (result.affectedRows === 0) {
                res.sendStatus(404)
              } else {
                // Supprimez le fichier temporaire une fois la mise à jour terminée
                fs.unlink(req.file.path, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error(unlinkErr)
                  }
                  res.sendStatus(204)
                })
              }
            })
            .catch((dbErr) => {
              console.error(dbErr)
              res.sendStatus(500)
            })
        }
      }
    )
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

// const changerMotDePasse = async (req, res) => {
//   const { id } = req.params
//   const { ancienMotDePasse, nouveauMotDePasse } = req.body

//   try {
//     // Récupérez l'utilisateur depuis la base de données
//     const utilisateur = await models.utilisateurs.find(id)

//     if (!utilisateur) {
//       return res.sendStatus(404)
//     }

//     // Vérifiez l'ancien mot de passe
//     const isMotDePasseValide = await argon2.verify(
//       utilisateur.password, // Remplacez par le champ de mot de passe de votre modèle
//       ancienMotDePasse
//     )

//     if (!isMotDePasseValide) {
//       return res.sendStatus(401) // Mot de passe incorrect
//     }

//     // Hash du nouveau mot de passe
//     const hashedNouveauMotDePasse = await argon2.hash(nouveauMotDePasse)

//     // Mettez à jour le mot de passe dans la base de données
//     utilisateur.password = hashedNouveauMotDePasse // Remplacez par le champ de mot de passe de votre modèle
//     await utilisateur.save()

//     res.sendStatus(204) // Mot de passe mis à jour avec succès
//   } catch (err) {
//     console.error(err)
//     res.sendStatus(500) // Erreur serveur
//   }
// }

const changerMotDePasse = async (req, res) => {
  const { id } = req.params
  const { hashedPassword } = req.body

  console.info("hashedPassword", hashedPassword)
  console.info("id passé en back pour le changement de PW", id)

  const utilisateurs = req.body
  console.info("utilisateurs de edit", utilisateurs)
  // TODO validations (length, format...)

  utilisateurs.id = parseInt(req.params.id, 10)

  models.utilisateurs
    .update(utilisateurs)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404)
        console.info("404", res.sendStatus(404))
      } else {
        res.sendStatus(204)
        console.info("la modification de profil à fonctionnée")
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
  changerMotDePasse,
}
