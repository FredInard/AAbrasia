import React, { useState, useEffect } from "react"
import axios from "axios"

import "./CarpoolList.scss"
import IconCar from "../../assets/pics/iconCar.svg"

const CarpoolList = ({ partyId, isUpdated }) => {
  const [carpools, setCarpools] = useState([])
  const [error, setError] = useState(null) // Ajout d'un état pour l'erreur

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/covoiturages/${partyId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCarpools(res.data) // Si res.data est bien un tableau
        } else {
          console.warn("Format inattendu des données :", res.data)
          setCarpools([res.data]) // Si res.data n'est pas un tableau, le transformer en tableau
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des covoiturages :", err)
        setError("Impossible de charger les covoiturages.")
      })
  }, [partyId, isUpdated])

  if (error) return <p>{error}</p>

  return (
    <div>
      {/* <h4>Covoiturages</h4> */}
      {Array.isArray(carpools) && carpools.length > 0 ? (
        carpools.map((carpool) => (
          <div key={carpool.id}>
            <p>
              <div className="carpoolListBox">
                <img
                  className="iconCar"
                  src={IconCar}
                  alt="icone d'une petite voiture rouge"
                />
                {carpool.pseudo} propose un covoiturage de{" "}
                {carpool.ville_depart} à {carpool.ville_arrivee}, départ à{" "}
                {new Date(carpool.heure_depart).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </p>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default CarpoolList
