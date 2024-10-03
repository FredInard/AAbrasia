const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
}

const hashPassword = (req, res, next) => {
  console.info("password is :", req.body.password)
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword
      console.info("hashedPassword is :", hashedPassword)
      delete req.body.password
      next()
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

// Générer un JWT avec une courte durée de vie
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Expiration du token d'accès : 15 minutes
  })
}

// Générer un refresh token avec une durée de vie plus longue
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d", // Expiration du refresh token : 7 jours
    }
  )
}

// Fonction de vérification et login
const verifyPassword = (req, res) => {
  // Vérifier le mot de passe de l'utilisateur comme dans ta fonction actuelle...
  argon2
    .verify(req.utilisateur.hashedPassword, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const user = req.utilisateur

        // Générer le JWT (access token) et le refresh token
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        // Stocker le JWT dans un cookie HTTP-Only
        res.cookie("authToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Utiliser HTTPS en production
          sameSite: "Strict", // Protection contre les attaques CSRF
          maxAge: 15 * 60 * 1000, // Durée de vie du cookie : 15 minutes
        })

        // Renvoie le refresh token dans la réponse (ou l'enregistre dans la base de données)
        res.send({ refreshToken, user }) // Le client stockera ce refresh token
      } else {
        res.sendStatus(401) // Mot de passe incorrect
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}
// Route pour renouveler le JWT en utilisant le refresh token
// Route pour renouveler le JWT en utilisant le refresh token
const refreshToken = (req, res) => {
  const { token } = req.body // Le refresh token envoyé par le client

  if (!token) {
    console.error(
      "Aucun token reçu ou token manquant dans la requête : ",
      req.body
    ) // Log plus détaillé sur l'état de la requête
    return res.sendStatus(401) // Pas de token, accès refusé
  }

  console.info("Refresh token reçu : ", token) // Vérifier que le refresh token est bien reçu

  // Vérifier le refresh token
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Erreur lors de la vérification du refresh token :", err) // Log en cas d'erreur de validation du refresh token
      return res.sendStatus(403) // Refresh token invalide ou expiré
    }

    console.info("Refresh token valide, utilisateur : ", user) // Log quand le refresh token est valide

    // Générer un nouveau JWT (access token)
    const newAccessToken = generateAccessToken(user)
    console.info("Nouveau access token généré : ", newAccessToken) // Log du nouveau token d'accès

    // Renouveler le JWT dans un cookie HTTP-Only
    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    console.info("Access token envoyé dans le cookie HTTP-Only") // Log pour confirmer que le token est bien envoyé dans le cookie

    res.send({ accessToken: newAccessToken })
  })
}

/* // Fonction de vérification et login
const verifyPassword = (req, res) => {
  console.info("req verifyPassword :", req.body.password)
  console.info("req.utilisateur :", req.utilisateur)
  console.info(
    "req.utilisateur.hashedPassword :",
    req.utilisateur.hashedPassword
  )
  console.info("req.body.password :", req.body.password)

  argon2
    .verify(req.utilisateur.hashedPassword, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        // Créer le payload avec l'ID de l'utilisateur et son rôle
        const payload = {
          id: req.utilisateur.id,
          role: req.utilisateur.role, // Ajoute l'info si l'utilisateur est admin ou membre
        }

        // Générer le token JWT avec ce payload
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "12h", // Durée de vie du token
        })

        // Supprimer le mot de passe avant d'envoyer les données de l'utilisateur
        delete req.utilisateur.password

        // Création du cookie contenant le JWT
        res.cookie("authToken", token, {
          httpOnly: true, // Empêche l'accès JavaScript au cookie
          secure: process.env.NODE_ENV === "production", // Utilise HTTPS en production
          sameSite: "Strict", // Prévient les attaques CSRF
          maxAge: 12 * 60 * 60 * 1000, // Durée de vie : 12 heures
        })

        // Envoyer une réponse avec les informations utilisateur
        res.send({ token, utilisateur: req.utilisateur })
      } else {
        res.sendStatus(401) // Mot de passe incorrect
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
} */

const verifyPassword2 = (req, res) => {
  argon2
    .verify(req.utilisateur.hashedPassword, req.body.hashedPassword)
    .then((isVerified) => {
      if (isVerified) {
        res.send(true)
      } else {
        res.send(false)
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
}

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization")

    if (req.url.startsWith("/assets/images/profilPictures")) {
      return next()
    }

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing")
    }

    const [type, token] = authorizationHeader.split(" ")

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type")
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET)

    next()
  } catch (err) {
    console.error(err)
    res.sendStatus(401)
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  hashingOptions,
  verifyPassword2,
  refreshToken,
}
