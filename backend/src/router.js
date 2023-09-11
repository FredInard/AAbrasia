const express = require("express")

const router = express.Router()

const PartieControllers = require("./controllers/PartieControllers")
const UtilisateurControllers = require("./controllers/utilisateurControllers")
// const CreateGameControllers = require("./controllers/CreateGameControllers")

router.get("/utilisateur", UtilisateurControllers.browse)
router.get("/utilisateur/:id", UtilisateurControllers.read)
router.post("/utilisateur", UtilisateurControllers.add)
router.put("/utilisateur/:id", UtilisateurControllers.edit)
router.delete("/utilisateur/:id", UtilisateurControllers.destroy)

router.get("/partie", PartieControllers.browse)
router.get("/partie/:id", PartieControllers.read)
router.put("/partie/:id", PartieControllers.edit)
router.post("/partie", PartieControllers.add)
router.delete("/partie/:id", PartieControllers.destroy)

module.exports = router
