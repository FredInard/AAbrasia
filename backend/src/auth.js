const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
}

// Hash le mot de passe lors de l'inscription
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
      console.error("Error hashing password:", err)
      res.sendStatus(500)
    })
}

// Vérifie le mot de passe lors de la connexion
const verifyPassword = (req, res) => {
  const hashedPassword = req.utilisateur.hashedPassword
  const password = req.body.password
  console.info("req verifyPassword, hashedPassword:", hashedPassword)
  console.info("password provided:", password)

  if (!hashedPassword || typeof hashedPassword !== "string") {
    console.error("Le mot de passe haché est manquant ou invalide")
    return res.sendStatus(500)
  }

  argon2
    .verify(hashedPassword, password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.utilisateur.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "12h",
        })
        delete req.utilisateur.hashedPassword
        res.send({ token, utilisateur: req.utilisateur })
      } else {
        console.error("Mot de passe incorrect")
        res.sendStatus(401)
      }
    })
    .catch((err) => {
      console.error("Error during password verification:", err)
      res.sendStatus(500)
    })
}

// Vérifie le mot de passe pour d'autres opérations, comme changer de mot de passe
const verifyPassword2 = (req, res) => {
  const hashedPassword = req.utilisateur.hashedPassword
  const password = req.body.password

  if (!hashedPassword || typeof hashedPassword !== "string") {
    console.error("Le mot de passe haché est manquant ou invalide")
    return res.sendStatus(500)
  }

  argon2
    .verify(hashedPassword, password)
    .then((isVerified) => {
      if (isVerified) {
        res.send(true)
      } else {
        res.send(false)
      }
    })
    .catch((err) => {
      console.error("Error during password verification:", err)
      res.sendStatus(500)
    })
}

// Vérification du token pour les routes protégées
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
    console.error("Error verifying token:", err)
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
