import React from "react"
import "./GameDetails.scss" // Styles associés
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa" // Icons (font-awesome)

const GameDetails = ({ game, isOpen, onClose }) => {
  if (!isOpen) return null // Ne pas afficher si la modal n'est pas ouverte

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Titre de la Partie */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h1 className="game-title">{game.title}</h1>

        {/* Maître du jeu */}
        <div className="game-master-info">
          <img
            src={game.gameMasterPhoto}
            alt="Maître du jeu"
            className="game-master-photo"
          />
          <span className="game-master-pseudo">{game.gameMasterPseudo}</span>
        </div>

        {/* Description */}
        <div className="game-description">
          <h3>Description :</h3>
          <p>{game.description}</p>
        </div>

        {/* Détails de la partie */}
        <div className="game-details">
          <div className="game-info-item">
            <FaClock /> {game.time}
          </div>
          <div className="game-info-item">
            <FaMapMarkerAlt /> {game.location}
          </div>
          <div className="game-info-item">
            <FaUsers /> x{game.maxPlayers}
          </div>
        </div>

        {/* Participants */}
        <h3>Participants :</h3>
        <div className="participants">
          {game.participants.map((participant, index) => (
            <div key={index} className="participant">
              <img
                src={participant.photo}
                alt={participant.name}
                className="participant-photo"
              />
              <span>{participant.name}</span>
            </div>
          ))}
        </div>

        {/* Autres informations */}
        <h3>Autres infos :</h3>
        <div className="extra-info">
          {game.extraInfo.map((info, index) => (
            <p key={index}>{info}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameDetails
