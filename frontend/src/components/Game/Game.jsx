import React, { useState, useEffect, useCallback } from "react"
import Game from "./Game"
import GameDetails from "../GameDetails/GameDetails"
import axios from "axios"

const ParentComponent = () => {
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [error, setError] = useState(null)

  const fetchGames = useCallback(async () => {
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
    }
  }, []) // Notez l'utilisation de `useCallback` avec une dépendance vide

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const handleGameClick = (game) => {
    setSelectedGame(game)
  }

  const closeModal = () => {
    setSelectedGame(null)
  }

  if (!games.length) return <p>Chargement des parties...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {games.map((game) => (
        <Game
          key={game.id}
          title={game.title}
          maxPlayers={game.maxPlayers}
          gameMasterPhoto={game.gameMasterPhoto}
          onClick={() => handleGameClick(game)}
        />
      ))}
      {selectedGame && <GameDetails game={selectedGame} onClose={closeModal} />}
    </div>
  )
}

export default ParentComponent
