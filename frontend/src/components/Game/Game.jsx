import React, { useState, useEffect } from "react"
import Game from "./Game"
import GameDetails from "../GameDetails/GameDetails"
import axios from "axios"

const ParentComponent = () => {
  const [games, setGames] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("authToken")
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/partie/affichage`,
          { headers }
        )
        setGames(response.data)
        console.info("response.data", response.data)
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

  const handleGameClick = (game) => {
    setSelectedGame(game)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedGame(null)
  }

  if (loading) return <p>Chargement des parties...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {/* Liste de toutes les parties */}
      {games.map((game) => (
        <Game
          key={game.id}
          title={game.title}
          maxPlayers={game.maxPlayers}
          gameMasterPhoto={game.gameMasterPhoto}
          onClick={() => handleGameClick(game)}
        />
      ))}

      {/* Modal des détails de la partie sélectionnée */}
      {selectedGame && (
        <GameDetails
          game={selectedGame}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default ParentComponent
