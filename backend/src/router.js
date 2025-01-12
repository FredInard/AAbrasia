// routeur.js

const express = require("express")
const multer = require("multer")
const path = require("path")
const router = express.Router()
const PasswordResetController = require("./controllers/PasswordResetController")
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js")

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/uploads")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only image files are allowed!"
      return cb(new Error("Only image files are allowed!"), false)
    }
    cb(null, true)
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max-size
  },
})

// Importation des contrôleurs
const UtilisateurControllers = require("./controllers/UtilisateurControllers")
const PartieControllers = require("./controllers/PartieControllers")
const ParticipationControllers = require("./controllers/ParticipationControllers")
const RepasControllers = require("./controllers/RepasControllers")
const CovoiturageControllers = require("./controllers/CovoiturageControllers")
const LogControllers = require("./controllers/LogControllers")
const ExportController = require("./controllers/ExportController")

// Routes pour les utilisateurs
router.post("/login", UtilisateurControllers.verifyUtilisateur, verifyPassword)
router.post("/utilisateurs", hashPassword, UtilisateurControllers.add)
router.get("/utilisateurs", UtilisateurControllers.browse)
router.get("/utilisateurs/:id", verifyToken, UtilisateurControllers.read)
router.put(
  "/utilisateurs/:id",
  verifyToken,
  upload.single("photo_profil"), // Gestion du fichier avec multer
  UtilisateurControllers.edit
)
router.delete("/utilisateurs/:id", verifyToken, UtilisateurControllers.destroy)

// Route pour changer le mot de passe de l'utilisateur
router.put(
  "/utilisateurs/:id/changerMotDePasse",
  verifyToken,
  hashPassword,
  UtilisateurControllers.changerMotDePasse
)

// Route pour mettre à jour la photo de profil de l'utilisateur
router.put(
  "/utilisateurs/:id/upload",
  verifyToken,
  upload.single("photo_profil"),
  UtilisateurControllers.updatePhotoProfil
)
// Anonymiser toutes les infos sauf l'ID et la date d'inscription
router.put(
  "/utilisateurs/:id/anonymize",
  verifyToken, // si vous souhaitez protéger la route
  UtilisateurControllers.anonymize
)

// Routes pour les parties
// router.get("/parties", PartieControllers.browse)
router.get("/parties/affichage", PartieControllers.affichageInfoPartie)
router.get("/parties/player/:id", PartieControllers.getPartieByUtilisateurId)
router.get("/parties/:id", PartieControllers.read)
// router.post("/parties", verifyToken, PartieControllers.add)
router.post(
  "/parties",
  verifyToken,
  upload.single("photo_scenario"),
  PartieControllers.add
)
// PUT /parties/:id
router.put(
  "/parties/:id",
  verifyToken,
  upload.single("photo_scenario"),
  PartieControllers.edit
)

router.delete("/parties/:id", verifyToken, PartieControllers.deleteByPartyId)

// Routes pour les participations
router.get("/participations", ParticipationControllers.browse)
// router.get("/participations/:id", ParticipationControllers.read)
router.get(
  "/participations/:id",
  ParticipationControllers.getparticipationsByPartyId
)
router.get(
  "/participations/:idPartie/:idPlayer",
  ParticipationControllers.getparticipationsByPartyIdAndPlayerId
)
router.post("/participations", verifyToken, ParticipationControllers.add)
router.post(
  "/participations/:idPartie/:idPlayer",
  verifyToken,
  ParticipationControllers.addByPartiId
)
router.put("/participations/:id", verifyToken, ParticipationControllers.edit)
router.delete(
  "/participations/:idPartie/:idPlayer",
  verifyToken,
  ParticipationControllers.deleteParticipationsByPartyIdAndPlayerId
)
router.delete(
  "/participations/:id",
  verifyToken,
  ParticipationControllers.destroy
)

// Routes pour les repas
router.get("/repas", RepasControllers.browse)
// router.get("/repas/:id", RepasControllers.read)
router.get("/repas/:id", RepasControllers.getRepasByPartyId)
router.post("/repas", verifyToken, RepasControllers.add)
router.put("/repas/:id", verifyToken, RepasControllers.edit)
router.delete("/repas/:id", verifyToken, RepasControllers.destroy)

// Routes pour les covoiturages
router.get("/covoiturages", CovoiturageControllers.browse)
// router.get("/covoiturages/:id", CovoiturageControllers.read)
router.get("/covoiturages/:id", CovoiturageControllers.getCovoiturageByPartyId)
router.post("/covoiturages", verifyToken, CovoiturageControllers.add)
router.put("/covoiturages/:id", verifyToken, CovoiturageControllers.edit)
router.delete("/covoiturages/:id", verifyToken, CovoiturageControllers.destroy)

// Routes pour les logs (optionnel, généralement pour les admins)
router.get("/logs", verifyToken, LogControllers.browse)
router.get("/logs/:id", verifyToken, LogControllers.read)

// Route pour exporter toutes les données
router.get("/export/all", ExportController.exportAllTables)

// Route pour demander une réinitialisation de mot de passe
router.post("/password-reset-request", PasswordResetController.requestReset)

// Route pour confirmer la réinitialisation du mot de passe
router.post("/password-reset-confirm", PasswordResetController.confirmReset)

module.exports = router
