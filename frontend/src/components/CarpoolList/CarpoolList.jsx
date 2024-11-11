import React, { useState, useEffect } from "react"
import axios from "axios"

const CarpoolList = ({ partyId }) => {
  const [carpools, setCarpools] = useState([])
  console.info("carpools :", carpools)
  console.info("CarpoolList partyId :", partyId)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/covoiturages/${partyId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data] // Si `res.data` est un objet, le transformer en tableau
        setCarpools(data)
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des covoiturages :", err)
      )
  }, [partyId])

  return (
    <div>
      <h3>Covoiturages</h3>
      {Array.isArray(carpools) && carpools.length > 0 ? (
        carpools.map((carpool) => (
          <div key={carpool.id}>
            <p>
              <strong>Conducteur :</strong> {carpool.pseudo}
            </p>
            <p>
              <strong>Départ :</strong> {carpool.ville_depart}
            </p>
            <p>
              <strong>Arrivée :</strong> {carpool.ville_arrivee}
            </p>
          </div>
        ))
      ) : (
        <p>Aucun covoiturage disponible.</p>
      )}
    </div>
  )
}

export default CarpoolList
