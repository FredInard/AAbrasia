const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

// Options de hachage pour argon2
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
}

// Fonction pour hacher le mot de passe
const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword
      delete req.body.password // Suppression du mot de passe en clair
      next()
    })
    .catch((err) => {
      console.error("Erreur lors du hachage du mot de passe :", err)
      res.sendStatus(500)
    })
}

// Générer un token JWT avec une durée de 12 heures
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "12h", // Expiration du token : 12 heures
  })
}

// Vérification du mot de passe et génération du token
const verifyPassword = (req, res) => {
  argon2
    .verify(req.utilisateur.hashedPassword, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const user = req.utilisateur

        // Générer le token JWT
        const token = generateAccessToken(user)

        // Envoyer le token dans la réponse pour que le frontend puisse le stocker dans le localStorage
        res.send({ token, user })
      } else {
        res.sendStatus(401) // Mot de passe incorrect
      }
    })
    .catch((err) => {
      console.error("Erreur lors de la vérification du mot de passe :", err)
      res.sendStatus(500)
    })
}

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization")

    if (!authorizationHeader) {
      throw new Error("Authorization header is missing")
    }

    const [type, token] = authorizationHeader.split(" ")

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type")
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET) // Vérification du token

    next() // Passer au middleware suivant
  } catch (err) {
    console.error("Erreur lors de la vérification du token :", err)
    res.sendStatus(401) // Accès refusé si le token est invalide
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
}
