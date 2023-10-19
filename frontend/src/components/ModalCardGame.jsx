import React, { useEffect, useState } from "react"
import axios from "axios"

function Modal({ isOpen, onClose, partyId }) {
  const [partyDetails, setPartyDetails] = useState(null)
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (isOpen) {
      // Chargez les détails de la partie en utilisant l'ID de la partie
      axios
        .get(`/utilisateurs/displayPlayers/${partyId}`)
        .then((res) => {
          setPartyDetails(res.data.partyDetails)
          setPlayers(res.data.players)
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des détails de la partie",
            error
          )
        })
    }
  }, [isOpen, partyId])

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {partyDetails && (
          <>
            <h2>{partyDetails.TitrePartie}</h2>
            <p>Date : {partyDetails.DatePartie}</p>
            <p>Heure : {partyDetails.HeurePartie}</p>
            <p>Lieu : {partyDetails.LieuPartie}</p>
            <p>Maitre du jeu : {partyDetails.PseudoMaitreDuJeu}</p>
            <p>Type : {partyDetails.TypeDeJeuxPartie}</p>
            <p>Description : {partyDetails.DescriptionPartie}</p>
          </>
        )}
        <h3>Liste des joueurs :</h3>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.NomJoueur}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Modal
