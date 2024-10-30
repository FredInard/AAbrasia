// CarpoolList.jsx
import React, { useState, useEffect } from "react"
import axios from "axios"

const CarpoolList = ({ partyId }) => {
  const [carpools, setCarpools] = useState([])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/covoiturages/${partyId}`)
      .then((res) => setCarpools(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement du covoiturage :", err)
      )
  }, [partyId])

  if (carpools.length === 0)
    return <p>Aucune option de covoiturage pour cette partie.</p>

  return (
    <div>
      <h3>Covoiturages</h3>
      {carpools.map((carpool, index) => (
        <div key={index} className="carpool-item">
          <p>
            <strong>Conducteur :</strong> {carpool.pseudo}
          </p>
          <img
            src={carpool.photo_profil}
            alt="Conducteur"
            className="carpool-driver-photo"
          />
          <p>
            <strong>Départ :</strong> {carpool.lieu_depart}
          </p>
          <p>
            <strong>Arrivée :</strong> {carpool.lieu_arrivee}
          </p>
          <p>
            <strong>Heure de départ :</strong> {carpool.heure_depart}
          </p>
          <p>
            <strong>Places disponibles :</strong> {carpool.places_disponibles}
          </p>
        </div>
      ))}
    </div>
  )
}

export default CarpoolList
