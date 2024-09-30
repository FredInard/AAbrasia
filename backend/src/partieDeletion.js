// auth.js

const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

// Options de hachage pour Argon2
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 5,
  parallelism: 1,
}

// Middleware pour hacher le mot de passe avant de le stocker
const hashPassword = async (req, res, next) => {
  try {
    const { motDePasse } = req.body

    if (!motDePasse) {
      return res.status(400).send("Le mot de passe est requis.")
    }

    // Hachage du mot de passe
    const hashedPassword = await argon2.hash(motDePasse, hashingOptions)

    // Remplacer le mot de passe en clair par le mot de passe haché
    req.body.mot_de_passe = hashedPassword

    next()
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

// Vérification du mot de passe lors de la connexion
const verifyPassword = async (req, res) => {
  try {
    const { motDePasse } = req.body
    const { mot_de_passe: hashedPassword } = req.utilisateur

    if (!motDePasse) {
      return res.status(400).send("Le mot de passe est requis.")
    }

    // Vérification du mot de passe
    const isVerified = await argon2.verify(hashedPassword, motDePasse)

    if (isVerified) {
      // Génération du token JWT
      const payload = { sub: req.utilisateur.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "12h",
      })

      // Suppression du mot de passe avant de renvoyer l'utilisateur
      delete req.utilisateur.mot_de_passe

      res.status(200).send({ token, utilisateur: req.utilisateur })
    } else {
      res.status(401).send("Mot de passe incorrect.")
    }
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization")

    if (!authorizationHeader) {
      return res.status(401).send("Header d'authentification manquant.")
    }

    const [type, token] = authorizationHeader.split(" ")

    if (type !== "Bearer" || !token) {
      return res.status(401).send("Type d'authentification invalide.")
    }

    // Vérification du token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Ajout des informations du token à la requête
    req.payload = payload

    next()
  } catch (err) {
    console.error(err)
    res.status(401).send("Token invalide ou expiré.")
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
}

// const mysql = require("mysql2")

// const deletePartie = (id) => {
//   const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   })

//   // Début de la transaction
//   connection.beginTransaction(function (err) {
//     if (err) {
//       throw err
//     }

//     // Suppression des entrées dans la table "participation" qui font référence à la partie
//     connection.query(
//       "DELETE FROM participation WHERE Partie_Id = ?",
//       [id],
//       function (err, results) {
//         if (err) {
//           // En cas d'erreur, annuler la transaction
//           return connection.rollback(function () {
//             throw err
//           })
//         }

//         // Suppression de la ligne dans la table "partie"
//         connection.query(
//           "DELETE FROM partie WHERE id = ?",
//           [id],
//           function (err, results) {
//             if (err) {
//               // En cas d'erreur, annuler la transaction
//               return connection.rollback(function () {
//                 throw err
//               })
//             }

//             // Commit de la transaction si tout s'est bien passé
//             connection.commit(function (err) {
//               if (err) {
//                 return connection.rollback(function () {
//                   throw err
//                 })
//               }

//               console.info(
//                 "La partie et les participations associées ont été supprimées avec succès."
//               )
//             })
//           }
//         )
//       }
//     )
//   })
// }

// module.exports = {
//   deletePartie,
// }
