import React, { useState, useEffect } from "react"
import axios from "axios"
import "./GameDetails.scss"
import ParticipantsList from "../ParticipantsList/ParticipantsList"
import MealList from "../MealList/MealList"
import CarpoolList from "../CarpoolList/CarpoolList"

const GameDetails = ({ partyId }) => {
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!partyId) return

    const fetchGameDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`
        )
        console.info("gameDetails :", gameDetails)
        setGameDetails(res.data)
      } catch (err) {
        console.error(
          "Erreur lors du chargement des détails de la partie :",
          err
        )
        setError("Erreur lors du chargement des détails de la partie.")
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [partyId])

  // if (!isOpen) return null
  if (loading) return <p>Chargement des détails de la partie...</p>
  if (error) return <p>{error}</p>

  return (
    <div
      className="modal-overlay"
      // onClick={onClose}
      role="dialog"
      aria-labelledby="game-title"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          // onClick={onClose}
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
              src={gameDetails.maitre_du_jeu_photo}
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
            <h2>Heure : {gameDetails.time || "Non précisé"}</h2>
          </div>
          <div className="game-info-item">
            <h2>Lieu : {gameDetails.location || "Lieu non précisé"}</h2>
          </div>
          <div className="game-info-item">
            <h2>
              Nombre de joueurs max : x{gameDetails.maxPlayers || "Non précisé"}
            </h2>
          </div>
        </div>

        <h3>Participants :</h3>
        <ParticipantsList partyId={partyId} />

        <h3>Autres infos :</h3>
        <CarpoolList partyId={partyId} />
        <MealList partyId={partyId} />
      </div>
    </div>
  )
}

export default GameDetails
