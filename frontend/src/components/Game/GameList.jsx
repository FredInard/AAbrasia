import React, { useState, useEffect } from "react"
import axios from "axios"
import "./GameList.scss"

const GameList = ({ selectedDate }) => {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const headers = { Authorization: `Bearer ${token}` }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/affichage`,
          { headers }
        )
        setGames(response.data)
      } catch (err) {
        console.error("Erreur lors du chargement des parties :", err)
        setError(
          "Impossible de charger les parties. Veuillez vérifier la connexion réseau."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = selectedDate // Already in YYYY-MM-DD
      const filtered = games.filter((game) => {
        const gameDate = new Date(game.date).toISOString().split("T")[0]
        return gameDate === formattedSelectedDate
      })
      setFilteredGames(filtered)
    } else {
      setFilteredGames([])
    }
  }, [selectedDate, games])

  if (loading) return <p>Chargement des parties...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {selectedDate ? (
        filteredGames.length > 0 ? (
          filteredGames.map((game) => (
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
            </div>
          ))
        ) : (
          <p>Aucune partie trouvée pour la date sélectionnée.</p>
        )
      ) : (
        <p>Veuillez sélectionner une date pour afficher les parties.</p>
      )}
    </div>
  )
}

export default GameList
