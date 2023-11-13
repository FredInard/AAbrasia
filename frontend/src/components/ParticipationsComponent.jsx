import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import poubel from "../assets/pics/poubel.png"
import "./ParticipationsComponent.scss"

function ParticipationsComponent() {
  const [participations, setParticipations] = useState([])
  // const [editingParticipationId, setEditingParticipationId] = useState(null)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  useEffect(() => {
    // Chargez les données des participations depuis votre API ou source de données ici
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participation`, { headers })
      .then((response) => {
        setParticipations(response.data)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des participations :", error)
      })
  }, [])

  const handleDeleteParticipation = (participationId) => {
    // Envoyez une requête DELETE pour supprimer la participation dans votre API
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/participation/${participationId}`,
        { headers }
      )
      .then((response) => {
        // Mettez à jour l'état des participations après la suppression
        setParticipations((prevParticipations) =>
          prevParticipations.filter(
            (participation) => participation.id !== participationId
          )
        )
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la suppression de la participation :",
          error
        )
      })
  }

  return (
    <div className="divParticipationComponent">
      <h1 className="h1ParticipationComponent">Liste des Participations</h1>
      <table className="tableParticipationComponent">
        <thead>
          <tr className="trTableParticipationComponent">
            <th className="thtableParticipationComponent">Participation ID</th>
            <th className="thtableParticipationComponent">Utilisateur ID</th>
            <th className="thtableParticipationComponent">Partie ID</th>
            <th className="thtableParticipationComponent">Maitre du Jeu</th>
            <th className="thtableParticipationComponent">Actions</th>
          </tr>
        </thead>
        <tbody>
          {participations.map((participation) => (
            <tr
              className="trTableParticipationComponent"
              key={participation.id}
            >
              <td className="tdtableParticipationComponent">
                {participation.id}
              </td>
              <td className="tdtableParticipationComponent">
                {participation.Utilisateurs_Id}
              </td>
              <td className="tdtableParticipationComponent">
                {participation.Partie_Id}
              </td>
              <td className="tdtableParticipationComponent">
                {participation.Partie_IdMaitreDuJeu}
              </td>
              <td className="tdtableParticipationComponent">
                <button
                  className="buttonParticipationComponent"
                  onClick={() => handleDeleteParticipation(participation.id)}
                >
                  {/* Supprimer */}
                  <img
                    src={poubel}
                    alt="poubel"
                    className="poubelParticipationComponent"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ParticipationsComponent
