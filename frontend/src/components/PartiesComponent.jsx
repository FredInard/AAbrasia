import React, { useState, useEffect } from "react"
import axios from "axios"

function PartiesComponent() {
  const [parties, setParties] = useState([])
  const [editingParty, setEditingParty] = useState(null)

  useEffect(() => {
    // Chargez les données des parties depuis votre API ou source de données ici
    axios.get("/votre-endpoint-api-parties").then((response) => {
      setParties(response.data)
    })
  }, [])

  const handleEditParty = (party) => {
    setEditingParty(party)
  }

  const handleUpdateParty = (updatedParty) => {
    // Envoyez une requête PUT pour mettre à jour la partie dans votre API
    axios
      .put(`/votre-endpoint-api-parties/${updatedParty.id}`, updatedParty)
      .then((response) => {
        setEditingParty(null) // Arrêtez l'édition après la mise à jour
        // Vous pouvez gérer la réponse ou mettre à jour l'état si nécessaire
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de la partie :", error)
      })
  }

  return (
    <div>
      <h1>Liste des Parties</h1>
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((party) => (
            <tr key={party.id}>
              <td>
                {editingParty?.id === party.id ? (
                  <input
                    type="text"
                    value={editingParty.Titre}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        Titre: e.target.value,
                      })
                    }
                  />
                ) : (
                  party.Titre
                )}
              </td>
              <td>{party.Date}</td>
              <td>{party.Heure}</td>
              <td>{party.Lieu}</td>
              <td>
                <button onClick={() => handleEditParty(party)}>Modifier</button>
                {editingParty?.id === party.id && (
                  <button onClick={() => handleUpdateParty(editingParty)}>
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

export default PartiesComponent
