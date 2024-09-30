// controllers/UtilisateurControllers.js

const models = require("../models")
const fs = require("fs")
const sharp = require("sharp")

class UtilisateurControllers {
  // GET /utilisateurs
  static browse(req, res) {
    models.utilisateur
      .findAll()
      .then(([rows]) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /utilisateurs/:id
  static read(req, res) {
    const id = parseInt(req.params.id, 10)

    models.utilisateur
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

  // POST /utilisateurs
  static add(req, res) {
    const utilisateur = req.body

    // TODO: Validations (length, format...)

    models.utilisateur
      .insert(utilisateur)
      .then(([result]) => {
        res.status(201).json({ id: result.insertId, ...utilisateur })
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // PUT /utilisateurs/:id
  static edit(req, res) {
    const utilisateur = req.body
    utilisateur.id = parseInt(req.params.id, 10)

    // TODO: Validations (length, format...)

    models.utilisateur
      .update(utilisateur)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
        } else {
          res.status(200).json(utilisateur)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // DELETE /utilisateurs/:id
  static destroy(req, res) {
    const id = parseInt(req.params.id, 10)

    models.utilisateur
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

  // POST /login
  static verifyUtilisateur(req, res, next) {
    const { pseudo } = req.body

    models.utilisateur
      .findByPseudoWithPassword(pseudo)
      .then(([utilisateurs]) => {
        if (utilisateurs[0]) {
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

  // PUT /utilisateurs/:id/changerMotDePasse
  static changerMotDePasse(req, res) {
    const id = parseInt(req.params.id, 10)
    const { motDePasse } = req.body

    // Le mot de passe est déjà haché par le middleware hashPassword

    models.utilisateur
      .updatePassword(id, motDePasse)
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

  // PUT /utilisateurs/:id/upload
  static updatePhotoProfil(req, res) {
    const id = parseInt(req.params.id, 10)
    const filePath = req.file.path
    const fileName = req.file.originalname

    // Utilisation de sharp pour redimensionner l'image
    sharp(filePath)
      .resize(1024, 1024)
      .toFile(
        `public/assets/images/profilPictures/${fileName}`,
        (err, info) => {
          if (err) {
            console.error(err)
            res.status(500).send("Erreur lors du redimensionnement de l'image")
          } else {
            const photoProfil = `assets/images/profilPictures/${fileName}`

            models.utilisateur
              .updatePhotoProfil(id, photoProfil)
              .then(([result]) => {
                if (result.affectedRows === 0) {
                  res.sendStatus(404)
                } else {
                  // Suppression du fichier temporaire
                  fs.unlink(filePath, (unlinkErr) => {
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

  // GET /utilisateurs/pseudo/:pseudo
  static browsePseudo(req, res) {
    const pseudo = req.params.pseudo

    models.utilisateur
      .findByPseudo(pseudo)
      .then(([result]) => {
        const isPseudoExist = result.length > 0
        res.json({ isPseudoExist }) // Retourne true si le pseudo existe, false sinon
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /utilisateurs/profil/:id
  static readProfile(req, res) {
    const id = parseInt(req.params.id, 10)

    models.utilisateur
      .findProfileById(id)
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
}

module.exports = UtilisateurControllers

// const models = require("../models")
// const fs = require("fs")
// const sharp = require("sharp")

// const browse = (req, res) => {
//   models.utilisateurs
//     .findAll()
//     .then(([rows]) => {
//       res.send(rows)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const add = (req, res) => {
//   const utilisateurs = req.body

//   // TODO validations (length, format...)

//   models.utilisateurs
//     .insert(utilisateurs)
//     .then(([result]) => {
//       res.location(`/utilisateurs/${result.insertId}`).sendStatus(201)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const browsePseudo = (req, res) => {
//   const pseudoInscription = req.params.pseudoInscription

//   models.utilisateurs
//     .findAllPseudo(pseudoInscription)
//     .then(([result]) => {
//       const isPseudoExist = result.length > 0
//       res.json({ isPseudoExist }) // renvois true ou fals via "isPseudoExist" en fonction de la correspondance du pseudo. true s'il y a une correspondance et false s'il n'y en a pas.
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const read = (req, res) => {
//   models.utilisateurs
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

// const read2 = (req, res) => {
//   models.utilisateurs

//     .readlessPW(req.params.id)
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
//   const utilisateurs = req.body
//   console.info("utilisateurs de edit", utilisateurs)
//   // TODO validations (length, format...)

//   utilisateurs.id = parseInt(req.params.id, 10)

//   models.utilisateurs
//     .update(utilisateurs)
//     .then(([result]) => {
//       if (result.affectedRows === 0) {
//         res.sendStatus(404)
//         console.info("404", res.sendStatus(404))
//       } else {
//         res.sendStatus(204)
//         console.info("la modification de profil à fonctionnée")
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// const destroy = (req, res) => {
//   models.utilisateurs
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

// const displayPlayer = (req, res) => {
//   models.utilisateurs
//     .getDisplayPlayer(req.params.id)
//     .then(([rows]) => {
//       res.send(rows)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//       // console.info("l'axios coté back pour displayPlayer n'a pas fonctionné")
//     })
// }
// const displayMJ = (req, res) => {
//   models.utilisateurs
//     .getDisplayMJ(req.params.id)
//     .then(([rows]) => {
//       res.send(rows)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//       // console.info("l'axios coté back pour displayMJ n'a pas fonctionné")
//     })
// }

// const verifyUtilisateur = (req, res, next) => {
//   models.utilisateurs
//     .getUserByPseudoWithPassword(req.body.Pseudo)
//     .then(([utilisateurs]) => {
//       if (utilisateurs[0] != null) {
//         req.utilisateur = utilisateurs[0]
//         next()
//       } else {
//         res.sendStatus(401)
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.status(500).send("Error retrieving data from the database")
//     })
// }

// const updateProfilPicture = async (req, res) => {
//   const utilisateurs = req.body

//   // TODO validations (length, format...)

//   utilisateurs.id = parseInt(req.params.id, 10)

//   // Utilisez sharp pour redimensionner l'image
//   sharp(req.file.path)
//     .resize(1023, 1024) // Redimensionnez l'image à 1023x1024 pixels
//     .toFile(
//       `public/assets/images/profilPictures/${req.file.originalname}`,
//       (err, info) => {
//         if (err) {
//           console.error(err)
//           res
//             .status(500)
//             .send("Error while resizing and moving the uploaded file")
//         } else {
//           // La mise à jour de la base de données se fait après le redimensionnement
//           models.utilisateurs
//             .updateProfilPicture(
//               utilisateurs,
//               `assets/images/profilPictures/${req.file.originalname}`
//             )
//             .then(([result]) => {
//               if (result.affectedRows === 0) {
//                 res.sendStatus(404)
//               } else {
//                 // Supprimez le fichier temporaire une fois la mise à jour terminée
//                 fs.unlink(req.file.path, (unlinkErr) => {
//                   if (unlinkErr) {
//                     console.error(unlinkErr)
//                   }
//                   res.sendStatus(204)
//                 })
//               }
//             })
//             .catch((dbErr) => {
//               console.error(dbErr)
//               res.sendStatus(500)
//             })
//         }
//       }
//     )
// }

// const readPartieByUtilisateurId = (req, res) => {
//   models.utilisateurs
//     .getReadPartieByUtilisateurId(req.params.id)
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

// const changerMotDePasse = async (req, res) => {
//   // const { id } = req.params
//   // const { hashedPassword } = req.body
//   // console.info("hashedPassword", hashedPassword)
//   // console.info("id passé en back pour le changement de PW", id)

//   const utilisateurs = req.body
//   console.info("utilisateurs de edit", utilisateurs)
//   // TODO validations (length, format...)

//   utilisateurs.id = parseInt(req.params.id, 10)

//   models.utilisateurs
//     .update(utilisateurs)
//     .then(([result]) => {
//       if (result.affectedRows === 0) {
//         res.sendStatus(404)
//         console.info("404", res.sendStatus(404))
//       } else {
//         res.sendStatus(204)
//         console.info("la modification de profil à fonctionnée")
//       }
//     })
//     .catch((err) => {
//       console.error(err)
//       res.sendStatus(500)
//     })
// }

// module.exports = {
//   browse,
//   add,
//   read,
//   read2,
//   edit,
//   destroy,
//   displayPlayer,
//   displayMJ,
//   verifyUtilisateur,
//   updateProfilPicture,
//   readPartieByUtilisateurId,
//   browsePseudo,
//   changerMotDePasse,
// }
