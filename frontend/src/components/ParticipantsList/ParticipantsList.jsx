import React, { useState, useEffect } from "react"
import axios from "axios"

import "./ParticipantsList.scss"

const ParticipantsList = ({ partyId, isUpdated }) => {
  const [participants, setParticipants] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  console.info("participants de ParticipantsList", participants)
  useEffect(() => {
    setLoading(true) // Active le chargement avant la requête
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}`)
      .then((res) => {
        console.info("Données reçues de l'API :", res.data)
        // Vérifie si res.data est un tableau et le met à jour
        setParticipants(Array.isArray(res.data) ? res.data : [])
        setError(null) // Réinitialise l'erreur si les données sont bien reçues
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des participants :", err)
        setError("Il n'y a pas encore d'aventuriers")
      })
      .finally(() => {
        setLoading(false) // Arrête le chargement après la réponse de l'API
      })
  }, [partyId, isUpdated])

  if (loading) return <p>Chargement des participants...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <div className="participantsListBox">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div className="participantsAffichage" key={participant.id}>
              <img
                src={`${
                  import.meta.env.VITE_BACKEND_URL
                }/${participant.photo_profil.replace(/\\/g, "/")}`}
                alt="Photo de profil participant"
                className="ProfilPhoto"
              />
              {participant.pseudo}
            </div>
          ))
        ) : (
          <p>Aucun participant disponible pour cette partie.</p>
        )}
      </div>
    </div>
  )
}

export default ParticipantsList
