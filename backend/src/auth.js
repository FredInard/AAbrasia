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
}

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
}
