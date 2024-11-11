import React, { useState, useEffect } from "react"
import axios from "axios"

const ParticipantsList = ({ partyId }) => {
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
  }, [partyId])

  if (loading) return <p>Chargement des participants...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h3>Participants</h3>
      {participants.length > 0 || null || undefined ? (
        participants.map((participant) => (
          <p key={participant.id}>{participant.pseudo}</p>
        ))
      ) : (
        <p>Aucun participant disponible pour cette partie.</p>
      )}
    </div>
  )
}

export default ParticipantsList
