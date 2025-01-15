const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

// Options de hachage Argon2 conformes aux recommandations OWASP
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MiB
  timeCost: 5, // 5 itérations
  parallelism: 1, // 1 thread
  saltLength: 32, // Sel de 32 octets
  hashLength: 32, // Hachage de 32 octets
}

// Middleware de hachage de mot de passe
const hashPassword = async (req, res, next) => {
  try {
    // Validation de la présence et de la longueur minimale du mot de passe
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).json({
        error: "Le mot de passe doit comporter au moins 8 caractères",
      })
    }

    const hashedPassword = await argon2.hash(req.body.password, hashingOptions)
    req.body.hashedPassword = hashedPassword
    delete req.body.password
    next()
  } catch (err) {
    console.error("Erreur de hachage du mot de passe :", err)
    res.status(500).json({
      error: "Erreur interne lors du traitement du mot de passe",
    })
  }
}

// Génération du token JWT avec des mesures de sécurité supplémentaires
const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET doit comporter au moins 32 caractères")
  }

  // Log de l'objet user
  console.info("Objet user :", user)

  const payload = {
    id: user.id,
    role: user.role,
    pseudo: user.pseudo,
    photoDeProfil: user.photo_profil, // Ajout de photoDeProfil au payload
    tokenVersion: user.tokenVersion || 0,
    iat: Math.floor(Date.now() / 1000),
  }

  console.info("Payload utilisé pour le token :", payload)

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h",
    algorithm: "HS256", // Spécification explicite de l'algorithme
  })

  // Log du token généré
  console.info("Token généré :", token)

  return token
}

// Vérification du mot de passe et génération du token
const verifyPassword = async (req, res) => {
  try {
    // Log de req.utilisateur
    console.info("Utilisateur authentifié :", req.utilisateur)

    if (!req.utilisateur?.hashedPassword || !req.body?.password) {
      return res.status(400).json({
        error: "Identifiants manquants",
      })
    }

    const isVerified = await argon2.verify(
      req.utilisateur.hashedPassword,
      req.body.password
    )

    if (isVerified) {
      const token = generateAccessToken(req.utilisateur)

      // Décodage du token pour vérifier le payload
      const decodedPayload = jwt.decode(token)

      // Log du payload décodé
      console.info("Payload du token envoyé :", decodedPayload)

      // Ne pas renvoyer de données sensibles au client
      const safeUser = {
        id: req.utilisateur.id,
        pseudo: req.utilisateur.pseudo,
        role: req.utilisateur.role,
        photoDeProfil: req.utilisateur.photo_profil,
      }

      res.json({ token, user: safeUser })
    } else {
      res.status(401).json({
        error: "Identifiants invalides",
      })
    }
  } catch (err) {
    console.error("Erreur de vérification du mot de passe :", err)
    res.status(500).json({
      error: "Erreur interne lors de l'authentification",
    })
  }
}

// Middleware de vérification du token avec des contrôles de sécurité supplémentaires
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")

    if (!authHeader) {
      return res.status(401).json({
        error: "En-tête d'autorisation manquant",
      })
    }

    const [type, token] = authHeader.split(" ")

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        error: "Format d'autorisation invalide",
      })
    }

    // Log du token reçu dans l'en-tête Authorization
    console.info("Token reçu :", token)

    // Vérification du token et des revendications supplémentaires
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], // Autoriser uniquement l'algorithme HS256
    })

    // Log du payload du token vérifié
    console.info("Payload du token vérifié :", payload)

    // Vérification explicite de l'expiration du token
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        error: "Le token a expiré",
      })
    }

    req.payload = payload
    next()
  } catch (err) {
    console.error("Erreur de vérification du token :", err)
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Token invalide",
      })
    } else {
      res.status(500).json({
        error: "Erreur interne lors de la vérification du token",
      })
    }
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  hashingOptions,
}
