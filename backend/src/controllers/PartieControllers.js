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
        // Set default photo if none is provided
        partie.photo_scenario =
          "public/assets/images/profilPictures/dragonBook.webp"
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
  // Méthode pour éditer une partie existante
  static edit(req, res) {
    const id = parseInt(req.params.id, 10)
    console.info(`Modification de la partie avec l'ID: ${id}`)

    // Récupération des données de la partie depuis le corps de la requête
    const partie = req.body
    console.info("Données de la partie reçues:", partie)

    // Assignation de l'ID à l'objet partie
    partie.id = id
    console.info("Objet partie après assignation de l'ID:", partie)

    // Gestion de la photo_scenario
    if (req.file) {
      // Si un nouveau fichier est téléchargé, utilisez son chemin
      partie.photo_scenario = req.file.path.replace(/\\/g, "/") // Convertir les antislashs en slashs
      console.info("Nouvelle photo_scenario définie:", partie.photo_scenario)
    } else if (partie.photo_scenario) {
      // Sinon, utilisez la photo existante (envoyée via formData)
      console.info("Photo_scenario existante conservée:", partie.photo_scenario)
      // La valeur de photo_scenario est déjà définie dans req.body
    } else {
      // Si aucune photo n'est fournie, vous pouvez définir une valeur par défaut ou gérer l'erreur
      partie.photo_scenario = null
      console.info("Aucune photo_scenario fournie. Définie à null.")
    }

    console.info("Objet partie final pour mise à jour:", partie)

    models.partie
      .update(partie)
      .then(([result]) => {
        console.info("Résultat de la mise à jour:", result)

        if (result.affectedRows === 0) {
          console.info(
            `Aucune partie trouvée avec l'ID: ${id}. Envoi d'un statut 404.`
          )
          res.sendStatus(404)
        } else {
          console.info(
            `Partie avec l'ID: ${id} mise à jour avec succès. Envoi de la réponse.`
          )
          res.status(200).json(partie)
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour de la partie:", err)
        res.sendStatus(500)
      })
  }

  static async deleteByPartyId(req, res) {
    const partyId = parseInt(req.params.id, 10)

    if (!partyId) {
      return res.status(400).json({ error: "L'ID de la partie est requis." })
    }

    try {
      console.info(`Suppression des dépendances pour la partie ID: ${partyId}`)

      // Suppression des dépendances
      await Promise.all([
        models.participation.deleteByPartyId(partyId), // Supprime les participations
        models.repas.deleteByPartyId(partyId), // Supprime les repas
        models.covoiturage.deleteByPartyId(partyId), // Supprime les covoiturages
      ])

      // Suppression de la partie elle-même
      const result = await models.partie.delete(partyId)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Partie non trouvée." })
      }

      console.info(`Partie ID: ${partyId} et dépendances supprimées.`)
      res.status(204).send() // Succès sans contenu
    } catch (err) {
      console.error("Erreur lors de la suppression de la partie :", err)
      res.status(500).json({ error: "Erreur serveur." })
    }
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
  // static destroyeurDePartie(req, res) {
  //   const id = parseInt(req.params.id, 10)

  //   models.partie
  //     .getDestroyeurDePartie(id)
  //     .then(() => {
  //       res.sendStatus(204) // La suppression a réussi
  //       console.info(
  //         "La suppression de la partie et des participations a réussi"
  //       )
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       res.sendStatus(500) // Erreur de serveur
  //       console.info(
  //         "Échec de la suppression de la partie et des participations"
  //       )
  //     })
  // }
}

module.exports = PartieControllers
