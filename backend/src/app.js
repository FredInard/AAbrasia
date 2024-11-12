// Importation de modules Node.js pour plus tard
require("dotenv").config()
// const port = process.env.APP_PORT ?? 5000;
// Lors de la phase de déploiement, le serveur nous donnera un numéro de port qui remplacera les ??, sinon il prendra le port 5000 par défaut.

const fs = require("node:fs")
const path = require("node:path")

// Création de l'application Express
const express = require("express")
const app = express()

// Utilisation de middlewares au niveau de l'application
app.use(express.json())

const cors = require("cors")
const cookieParser = require("cookie-parser")

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true, // Autorise les requêtes avec des informations d'identification
    optionsSuccessStatus: 200,
  })
)

// Importation et montage des routes de l'API
const router = require("./router")
app.use(router)

// Servir le dossier `backend/public` pour les ressources publiques
app.use("/public", express.static(path.join(__dirname, "../public")))

// Servir l'application REACT
const reactIndexFile = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "index.html"
)

if (fs.existsSync(reactIndexFile)) {
  // Servir les ressources REACT
  app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")))

  // Rediriger toutes les requêtes vers le fichier index de REACT
  app.get("*", (req, res) => {
    res.sendFile(reactIndexFile)
  })
}

// Prêt à être exporté
module.exports = app
