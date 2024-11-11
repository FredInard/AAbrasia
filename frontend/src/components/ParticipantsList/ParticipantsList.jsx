import React, { useState, useEffect } from "react"
import axios from "axios"

const ParticipantsList = ({ partyId }) => {
  const [participants, setParticipants] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}`)
      .then((res) => {
        setParticipants(Array.isArray(res.data) ? res.data : []) // Assurez-vous que participants est un tableau
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des participants :", err)
        setError("Participants non trouvés ou problème avec l'API.")
      })
  }, [partyId])

  if (error) return <p>{error}</p>

  return (
    <div>
      <h3>Participants</h3>
      {participants.length > 0 ? (
        participants.map((participant) => (
          <p key={participant.id}>{participant.nom}</p>
        ))
      ) : (
        <p>Aucun participant disponible.</p>
      )}
    </div>
  )
}

export default ParticipantsList
