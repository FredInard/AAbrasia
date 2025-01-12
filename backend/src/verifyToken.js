const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] // Récupérer le token

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé." })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Vérifie le token
    req.user = decoded

    // Vérifie si l'utilisateur est inactif
    if (decoded.role === "inactif") {
      return res.status(403).json({
        error: "Ce compte est désactivé. Veuillez contacter un administrateur.",
      })
    }

    next() // Token valide
  } catch (err) {
    console.error("Erreur lors de la vérification du token :", err)
    return res.status(403).json({ error: "Token invalide." })
  }
}

module.exports = { verifyToken }
