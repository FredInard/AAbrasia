const express = require("express")
const multer = require("multer")

const router = express.Router()
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js")

const upload = multer({ dest: "public/assets/uploads" })
const ParticipationControllers = require("./controllers/ParticipationControllers")
const PartieControllers = require("./controllers/PartieControllers")
const UtilisateursControllers = require("./controllers/UtilisateursControllers.js")
// const CreateGameControllers = require("./controllers/CreateGameControllers")

router.post("/login", UtilisateursControllers.verifyUtilisateur, verifyPassword)
router.post("/utilisateurs", hashPassword, UtilisateursControllers.add)

router.get("/utilisateurs", UtilisateursControllers.browse)
router.get(
  "/utilisateurs/displayPlayers/:id",
  UtilisateursControllers.displayPlayer
)
router.get("/utilisateurs/:id", UtilisateursControllers.read)
router.get("/utilisateurs/profil/:id", UtilisateursControllers.read2)
router.post("/utilisateurs", UtilisateursControllers.add)

router.get("/partie", PartieControllers.browse)
router.get("/partie/affichage", PartieControllers.affichageInfoPartie)
router.get("/partie/:id", PartieControllers.read)

router.get("/participation", ParticipationControllers.browse)

router.use(verifyToken)

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
router.put("/partie/:id", PartieControllers.edit)
router.post("/partie", PartieControllers.add)
router.delete("/partie/:id", PartieControllers.destroy)

router.put("/participation/:id", ParticipationControllers.edit)
router.post("/participation", ParticipationControllers.add)
router.delete("/participation/:id", ParticipationControllers.destroy)

module.exports = router
