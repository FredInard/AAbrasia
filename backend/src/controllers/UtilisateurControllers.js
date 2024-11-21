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
    console.info("id incontroler", id)
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
    console.info("utilisateur back is :", utilisateur)
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
    console.info("Contenu de req.body :", req.body)
    const utilisateur = {
      ...req.body,
      id: parseInt(req.params.id, 10),
    }

    // Remplacez les champs vides ou contenant "null" par null pour éviter les erreurs de base de données
    Object.keys(utilisateur).forEach((key) => {
      if (utilisateur[key] === "" || utilisateur[key] === "null") {
        utilisateur[key] = null
      }
    })
    console.info("Utilisateur avant traitement:", utilisateur)
    // Si un fichier est inclus, ajoutez son chemin
    if (req.file) {
      utilisateur.photo_profil = req.file.path
    }

    console.info("Utilisateur après traitement:", utilisateur)

    // Appel du modèle pour mettre à jour l'utilisateur
    models.utilisateur
      .update(utilisateur)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
          console.info("Aucune mise à jour effectuée. Result:", result)
        } else {
          res.status(200).json(utilisateur)
          console.info("Mise à jour réussie. Result:", result)
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour:", err)
        res.sendStatus(500)
      })
  }

  // DELETE /utilisateurs/:id
  // static destroy(req, res) {
  //   const id = parseInt(req.params.id, 10)

  //   models.utilisateur
  //     .delete(id)
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

  // POST /login
  static verifyUtilisateur(req, res, next) {
    const { email } = req.body
    console.info("email reçu :", email)

    models.utilisateur
      .findByEmailWithPassword(email)
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

  // DELETE /utilisateurs/:id
  static destroy(req, res) {
    const id = parseInt(req.params.id, 10)

    console.info(
      `Suppression de l'utilisateur avec l'ID : ${id} et ses données associées`
    )

    // Supprimer les données associées via les managers
    const deletions = [
      models.repas.deleteByUtilisateurId(id), // Supprime les repas
      models.covoiturage.deleteByUtilisateurId(id), // Supprime les covoiturages
      models.participation.deleteByUtilisateurId(id), // Supprime les participations
      models.partie.deleteByMaitreDuJeuId(id), // Supprime les parties
    ]

    // Exécuter les suppressions en parallèle
    Promise.all(deletions)
      .then(() => {
        // Supprimer l'utilisateur une fois les données associées supprimées
        return models.utilisateur.delete(id)
      })
      .then(([result]) => {
        if (result.affectedRows === 0) {
          console.info(`Utilisateur avec l'ID ${id} non trouvé.`)
          res.sendStatus(404)
        } else {
          console.info(`Utilisateur avec l'ID ${id} supprimé avec succès.`)
          res.sendStatus(204)
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression des données :", err)
        res.sendStatus(500)
      })
  }
}

module.exports = UtilisateurControllers
