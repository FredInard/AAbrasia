import React, { useState, useEffect } from "react"
import axios from "axios"
import "./GameList.scss"

const GameList = ({ selectedDate }) => {
  console.info("GameList component rendered with selectedDate:", selectedDate)
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("authToken")
        console.info("Fetched authToken:", token)
        const headers = { Authorization: `Bearer ${token}` }
        console.info("Headers for request:", headers)
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/affichage`,
          { headers }
        )
        console.info("Response from API:", response)
        setGames(response.data)
        console.info("Games set in state:", response.data)
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
    console.info("selectedDate changed:", selectedDate)
    console.info("Current games in state:", games)
    if (selectedDate) {
      const formattedSelectedDate = selectedDate // Already in YYYY-MM-DD
      console.info("Formatted selectedDate:", formattedSelectedDate)
      const filtered = games.filter((game) => {
        const gameDate = new Date(game.date).toISOString().split("T")[0]
        console.info(
          "Comparing gameDate:",
          gameDate,
          "with selectedDate:",
          formattedSelectedDate
        )
        return gameDate === formattedSelectedDate
      })
      console.info("Filtered games:", filtered)
      setFilteredGames(filtered)
    } else {
      console.info("No selectedDate provided, resetting filteredGames")
      setFilteredGames([])
    }
  }, [selectedDate, games])

  useEffect(() => {
    console.info("filteredGames updated:", filteredGames)
  }, [filteredGames])

  if (loading) {
    console.info("Loading is true, displaying loading message")
    return <p>Chargement des parties...</p>
  }
  if (error) {
    console.info("An error occurred:", error)
    return <p>{error}</p>
  }

  console.info("Rendering game list with selectedDate:", selectedDate)
  console.info("Final filteredGames to render:", filteredGames)

  return (
    <div>
      {selectedDate ? (
        filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            console.info("Rendering game:", game)
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
