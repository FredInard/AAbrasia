const partieDeletion = require("./partieDeletion")
const express = require("express")
const multer = require("multer")

const router = express.Router()
const {
  hashPassword,
  verifyPassword,
  verifyPassword2,
  verifyToken,
} = require("./auth.js")

const upload = multer({ dest: "public/assets/tmp" })
const ParticipationControllers = require("./controllers/ParticipationControllers")
const PartieControllers = require("./controllers/PartieControllers")
const UtilisateursControllers = require("./controllers/UtilisateursControllers.js")
// const CreateGameControllers = require("./controllers/CreateGameControllers")

router.post("/login", UtilisateursControllers.verifyUtilisateur, verifyPassword)

router.post("/utilisateurs", hashPassword, UtilisateursControllers.add)
router.get(
  "/utilisateurs/pseudo/:pseudoInscription",
  UtilisateursControllers.browsePseudo
)
router.get("/utilisateurs", UtilisateursControllers.browse)
router.get(
  "/utilisateurs/displayPlayers/:id",
  UtilisateursControllers.displayPlayer
)
router.get("/utilisateurs/displayMJ/:id", UtilisateursControllers.displayMJ)
router.get("/utilisateurs/:id", UtilisateursControllers.read)
router.get("/utilisateurs/profil/:id", UtilisateursControllers.read2)

router.get("/partie", PartieControllers.browse)
router.get("/partie/affichage", PartieControllers.affichageInfoPartie)
router.get("/partie/affichage/:date", PartieControllers.affichageInfoPartieDate)
router.get("/partie/:id", PartieControllers.read)
router.get("/partie/count/:id", PartieControllers.countPartieById)

router.get("/participation", ParticipationControllers.browse)

router.use(verifyToken)

router.post(
  "/verifPW",
  UtilisateursControllers.verifyUtilisateur,
  verifyPassword2
)

router.put(
  "/utilisateurs/changerMotDePasse/:id",
  hashPassword,
  UtilisateursControllers.changerMotDePasse
)
router.put(
  "/utilisateurs/:id/upload",
  upload.single("myFile"),
  UtilisateursControllers.updateProfilPicture
)
router.put("/utilisateurs/:id", UtilisateursControllers.edit)
router.delete("/utilisateurs/:id", UtilisateursControllers.destroy)
router.get(
  "/utilisateurs/profil/:id",
  UtilisateursControllers.readPartieByUtilisateurId
)
router.get("/partie/profil/:id", PartieControllers.partieByUtilisateurId)
router.get("/partie/meneur/:id", PartieControllers.partieMeneurByUtilisateurId)
// router.get("partie/holdGamePlayer/:id", PartieControllers.holdGamePlayer)
// router.get("partie/HoldGameMJ/:id", PartieControllers.HoldGameMJ)

router.put("/partie/:id", PartieControllers.edit)
router.post("/partie", PartieControllers.add)
router.delete("/partie/:id", PartieControllers.destroy)
// router.delete("/partie/participation/:id", PartieControllers.destroyeurDePartie)

router.delete("/partie/participation/:id", (req, res) => {
  const id = req.params.id

  // Appel de la fonction de suppression de partie
  partieDeletion
    .deletePartie(id)
    .then(() => {
      res.sendStatus(204) // La suppression a réussi
      console.info("La suppression de la partie et des participations a réussi")
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500) // Erreur de serveur
      console.info("Échec de la suppression de la partie et des participations")
    })
})

router.put("/participation/:id", ParticipationControllers.edit)
router.post("/participation", ParticipationControllers.add)
router.delete("/participation/:id", ParticipationControllers.destroy)
router.get(
  "/participation/count/:utilisateurId/:partieId",
  ParticipationControllers.countUserParticipation
)
router.delete(
  "/participation/delete/:utilisateurId/:partieId",
  ParticipationControllers.deleteUserParticipation
)
module.exports = router
