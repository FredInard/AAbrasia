import React, { useState, useEffect } from "react"
import axios from "axios"
import "./GameDetails.scss"
import ParticipantsList from "../ParticipantsList/ParticipantsList"
import MealList from "../MealList/MealList"
import CarpoolList from "../CarpoolList/CarpoolList"

const GameDetails = ({ partyId, onClose }) => {
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isJoined, setIsJoined] = useState(false) // pour vérifier si l'utilisateur a rejoint la partie
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    const token = localStorage.getItem("authToken")
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]))
      setUser(decodedToken)
    }

    if (!partyId) return
    console.info("Fetching game details for partyId:", partyId)

    const fetchGameDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`
        )
        console.info("Données complètes du jeu dans gameDetails:", res.data)
        setGameDetails(res.data)
      } catch (err) {
        console.error(
          "Erreur lors du chargement des détails de la partie :",
          err
        )
        setError("Erreur lors du chargement des détails de la partie.")
      } finally {
        setLoading(false)
        console.info("Loading set to false in GameDetails")
      }
    }

    fetchGameDetails()
  }, [partyId])

  const handleJoinParty = async () => {
    if (!user) {
      console.info(
        "Utilisateur non connecté, annulation de la tentative de rejoindre."
      )
      return
    }

    console.info("Tentative de rejoindre la partie avec :", {
      partyId,
      userId: user.id,
    })

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
          user.id
        }`,
        null, // Pas de corps de requête nécessaire, les données sont dans l'URL
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )

      console.info(
        "Réponse de l'API après tentative d'inscription :",
        response.data
      )
      setIsJoined(true) // Confirme que l'utilisateur a rejoint la partie
    } catch (err) {
      console.error("Erreur lors de l'inscription à la partie :", err)
      setError("Impossible de rejoindre la partie. Veuillez réessayer.")
    }
  }

  if (loading) return <p>Chargement des détails de la partie...</p>
  if (error) return <p>{error}</p>

  console.info("Rendering GameDetails with data:", gameDetails)

  // Vérifie si l'utilisateur est connecté et n'est pas le maître du jeu
  const canJoin = user && user.id !== gameDetails.id_maitre_du_jeu && !isJoined

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-labelledby="game-title"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          ✕
        </button>

        <h1 id="game-title" className="game-title">
          {gameDetails.titre}
        </h1>

        <div className="game-master-info">
          {gameDetails.maitre_du_jeu_photo && (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/${
                gameDetails.maitre_du_jeu_photo
              }`}
              alt={`Maître du jeu ${gameDetails.maitre_du_jeu_pseudo}`}
              className="game-master-photo"
            />
          )}
          <span className="game-master-pseudo">
            {gameDetails.maitre_du_jeu_pseudo}
          </span>
        </div>

        <div className="game-description">
          <h3>Description :</h3>
          <p>{gameDetails.description}</p>
        </div>

        <div className="game-details">
          <div className="game-info-item">
            <h2>
              Heure :{" "}
              {gameDetails.date
                ? new Date(gameDetails.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) +
                  " à " +
                  new Date(gameDetails.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Non précisé"}
            </h2>
          </div>
          <div className="game-info-item">
            <h2>Lieu : {gameDetails.lieu || "Lieu non précisé"}</h2>
          </div>
          <div className="game-info-item">
            <h2>
              Nombre de joueurs max : x
              {gameDetails.nb_max_joueurs || "Non précisé"}
            </h2>
          </div>
        </div>

        <h3>Participants :</h3>
        <ParticipantsList partyId={partyId} />

        <h3>Autres infos :</h3>
        <CarpoolList partyId={partyId} />
        <MealList partyId={partyId} />

        {canJoin && (
          <button onClick={handleJoinParty} className="join-btn">
            Rejoindre l'aventure
          </button>
        )}
      </div>
    </div>
  )
}

export default GameDetails
