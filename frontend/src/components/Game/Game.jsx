import React, { useState, useEffect } from "react"
import Game from "./Game"
import axios from "axios"

const ParentComponent = () => {
  const [games, setGames] = useState([])
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
  }, []) // Assurez-vous que `[]` empêche les appels répétés

  if (loading) return <p>Chargement des parties...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {games.map((game) => (
        <Game
          key={game.id}
          title={game.title}
          maxPlayers={game.maxPlayers}
          gameMasterPhoto={game.gameMasterPhoto}
        />
      ))}
    </div>
  )
}

export default ParentComponent
