import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"

function ParticipationsComponent() {
  const [participations, setParticipations] = useState([])
  const [editingParticipation, setEditingParticipation] = useState(null)
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
  }, [])

  const handleEditParticipation = (participation) => {
    setEditingParticipation(participation)
  }

  const handleUpdateParticipation = (updatedParticipation) => {
    // Envoyez une requête PUT pour mettre à jour la participation dans votre API
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/participation/${
          updatedParticipation.id
        }`,
        updatedParticipation,
        { headers }
      )
      .then((response) => {
        setEditingParticipation(null) // Arrêtez l'édition après la mise à jour
        // Vous pouvez gérer la réponse ou mettre à jour l'état si nécessaire
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour de la participation :",
          error
        )
      })
  }

  return (
    <div>
      <h1>Liste des Participations</h1>
      <table>
        <thead>
          <tr>
            <th>Utilisateur ID</th>
            <th>Partie ID</th>
            <th>Maitre du Jeu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participations.map((participation) => (
            <tr key={participation.id}>
              <td>
                {editingParticipation?.id === participation.id ? (
                  <input
                    type="number"
                    value={editingParticipation.Utilisateurs_Id}
                    onChange={(e) =>
                      setEditingParticipation({
                        ...editingParticipation,
                        Utilisateurs_Id: e.target.value,
                      })
                    }
                  />
                ) : (
                  participation.Utilisateurs_Id
                )}
              </td>
              <td>
                {editingParticipation?.id === participation.id ? (
                  <input
                    type="number"
                    value={editingParticipation.Partie_Id}
                    onChange={(e) =>
                      setEditingParticipation({
                        ...editingParticipation,
                        Partie_Id: e.target.value,
                      })
                    }
                  />
                ) : (
                  participation.Partie_Id
                )}
              </td>
              <td>
                {editingParticipation?.id === participation.id ? (
                  <input
                    type="number"
                    value={editingParticipation.Partie_IdMaitreDuJeu}
                    onChange={(e) =>
                      setEditingParticipation({
                        ...editingParticipation,
                        Partie_IdMaitreDuJeu: e.target.value,
                      })
                    }
                  />
                ) : (
                  participation.Partie_IdMaitreDuJeu
                )}
              </td>
              <td>
                <button onClick={() => handleEditParticipation(participation)}>
                  Modifier
                </button>
                {editingParticipation?.id === participation.id && (
                  <button
                    onClick={() =>
                      handleUpdateParticipation(editingParticipation)
                    }
                  >
                    Valider
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ParticipationsComponent
