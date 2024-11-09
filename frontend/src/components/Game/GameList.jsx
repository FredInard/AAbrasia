import React, { useState, useEffect } from "react"
import axios from "axios"
import "./GameList.scss"

const GameList = ({ selectedDate }) => {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  console.info("games GameList :", games)
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("authToken")
        console.info("GameList authToken", token)
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
        console.info("Loading set to false")
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

  if (loading) {
    return <p>Chargement des parties...</p>
  }
  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="gameBox">
      {selectedDate ? (
        filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            return (
              <div key={game.id} className="game-item">
                <h3>{game.titre}</h3>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                    game.photo_scenario
                  }`}
                  alt="illustration de la partie"
                  className="illustrationPartie"
                />

                <p>
                  <strong>Lieu :</strong> {game.nb_max_joueurs}
                </p>
              </div>
            )
          })
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
