import React, { useState, useEffect } from "react"
import axios from "axios"
import jwtDecode from "jwt-decode" // Import pour décoder le token
import "./PlayerGames.scss"

const PlayerGames = () => {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // États pour les filtres
  const [isMaster, setIsMaster] = useState(false)
  const [showUpcoming, setShowUpcoming] = useState(true)

  let playerId

  try {
    const token = localStorage.getItem("authToken")
    if (token) {
      const decodedToken = jwtDecode(token)
      playerId = decodedToken.id // Récupère l'id de l'utilisateur
    }
  } catch (err) {
    console.error("Erreur lors du décodage du token :", err)
  }

  useEffect(() => {
    const fetchPlayerGames = async () => {
      if (!playerId) {
        setError("Utilisateur non authentifié.")
        setIsLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("authToken")
        const headers = { Authorization: `Bearer ${token}` }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/player/${playerId}`,
          { headers }
        )
        setGames(response.data)
      } catch (err) {
        setError("Erreur lors du chargement des parties.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayerGames()
  }, [playerId])

  useEffect(() => {
    filterGames()
  }, [games, isMaster, showUpcoming])

  const filterGames = () => {
    const now = new Date()
    const filtered = games.filter((game) => {
      const isPlayerMaster = game.id_maitre_du_jeu === playerId
      if (isMaster && !isPlayerMaster) return false
      if (!isMaster && isPlayerMaster) return false

      const gameDate = new Date(game.date)
      if (showUpcoming && gameDate < now) return false
      if (!showUpcoming && gameDate >= now) return false

      return true
    })

    setFilteredGames(filtered)
  }

  if (isLoading) return <p>Chargement des parties...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Parties de l'utilisateur</h2>

      {/* Filtres */}
      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={isMaster}
            onChange={(e) => setIsMaster(e.target.checked)}
          />
          Maître du jeu uniquement
        </label>
        <label>
          <input
            type="radio"
            name="dateFilter"
            checked={showUpcoming}
            onChange={() => setShowUpcoming(true)}
          />
          À venir
        </label>
        <label>
          <input
            type="radio"
            name="dateFilter"
            checked={!showUpcoming}
            onChange={() => setShowUpcoming(false)}
          />
          Passé
        </label>
      </div>

      {/* Liste des parties filtrées */}
      <div className="game-list">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            console.info(
              "game:",
              game,
              "game.id_maitre_du_jeu:",
              game.id_maitre_du_jeu,
              "playerId:",
              playerId
            )
            return (
              <div key={game.id} className="game-item">
                <h3>{game.titre}</h3>
                <p>{game.description}</p>
                <p>
                  <strong>Lieu :</strong> {game.lieu}
                </p>
                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(game.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Rôle :</strong>{" "}
                  {Number(game.id_maitre_du_jeu) === Number(playerId)
                    ? "Maître du jeu"
                    : "Participant"}
                </p>
              </div>
            )
          })
        ) : (
          <p>Aucune partie trouvée avec les filtres actuels.</p>
        )}
      </div>
    </div>
  )
}

export default PlayerGames
