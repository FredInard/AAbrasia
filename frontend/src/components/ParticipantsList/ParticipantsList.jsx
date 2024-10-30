// ParticipantsList.jsx
import React, { useState, useEffect } from "react"
import axios from "axios"

const ParticipantsList = ({ partyId }) => {
  const [participants, setParticipants] = useState([])
  console.info("participants", participants)
  console.info("ParticipantsList partyId", partyId)
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}`)
      .then((res) => setParticipants(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement des participants :", err)
      )
  }, [partyId])

  if (participants.length === 0)
    return <p>Aucun participant pour cette partie.</p>

  return (
    <div>
      <h3>Participants</h3>
      {participants.map((participant) => (
        <div key={participant.pseudo}>
          <p>{participant.pseudo}</p>
          <img src={participant.photo_profil} alt="Participant" />
        </div>
      ))}
    </div>
  )
}

export default ParticipantsList
