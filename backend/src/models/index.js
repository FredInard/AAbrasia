// index.js

require("dotenv").config()

const mysql = require("mysql2/promise")

// Création d'une connexion à la base de données
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
})

// Vérification de la connexion
pool.getConnection().catch(() => {
  console.warn(
    "Warning:",
    "Failed to get a DB connection.",
    "Did you create a .env file with valid credentials?",
    "Routes using models won't work as intended"
  )
})

// Déclaration et enregistrement des modèles (managers)
const models = {}

const ParticipationManager = require("./ParticipationManager")
const PartieManager = require("./PartieManager")
const UtilisateurManager = require("./UtilisateurManager")
const RepasManager = require("./RepasManager")
const CovoiturageManager = require("./CovoiturageManager")
const LogManager = require("./LogManager")

models.participation = new ParticipationManager()
models.participation.setDatabase(pool)

models.partie = new PartieManager()
models.partie.setDatabase(pool)

models.utilisateur = new UtilisateurManager()
models.utilisateur.setDatabase(pool)

models.repas = new RepasManager()
models.repas.setDatabase(pool)

models.covoiturage = new CovoiturageManager()
models.covoiturage.setDatabase(pool)

models.log = new LogManager()
models.log.setDatabase(pool)

// Gestionnaire pour les références de modèles non définies
const handler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    const pascalize = (string) =>
      string.slice(0, 1).toUpperCase() + string.slice(1)

    throw new ReferenceError(
      `models.${prop} is not defined. Did you create ${pascalize(
        prop
      )}Manager.js, and did you register it in backend/src/models/index.js?`
    )
  },
}

module.exports = new Proxy(models, handler)

// require("dotenv").config()

// const mysql = require("mysql2/promise")

// // create a connection pool to the database

// const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

// const pool = mysql.createPool({
//   host: DB_HOST,
//   port: DB_PORT,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_NAME,
// })

// // try a connection

// pool.getConnection().catch(() => {
//   console.warn(
//     "Warning:",
//     "Failed to get a DB connection.",
//     "Did you create a .env file with valid credentials?",
//     "Routes using models won't work as intended"
//   )
// })

// // declare and fill models: that's where you should register your own managers

// const models = {}

// const ParticipationManager = require("./ParticipationManager")
// const PartieManager = require("./partieManager")
// const UtilisateursManager = require("./utilisateursManager")

// models.participation = new ParticipationManager()
// models.participation.setDatabase(pool)

// models.partie = new PartieManager()
// models.partie.setDatabase(pool)

// models.utilisateurs = new UtilisateursManager()
// models.utilisateurs.setDatabase(pool)

// const handler = {
//   get(obj, prop) {
//     if (prop in obj) {
//       return obj[prop]
//     }

//     const pascalize = (string) =>
//       string.slice(0, 1).toUpperCase() + string.slice(1)

//     throw new ReferenceError(
//       `models.${prop} is not defined. Did you create ${pascalize(
//         prop
//       )}Manager.js, and did you register it in backend/src/models/index.js?`
//     )
//   },
// }

// module.exports = new Proxy(models, handler)
