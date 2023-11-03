import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"

function PartiesComponent() {
  const [parties, setParties] = useState([])
  const [editingParty, setEditingParty] = useState(null)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  useEffect(() => {
    // Chargez les données des parties depuis votre API ou source de données ici
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie`, { headers })
      .then((response) => {
        setParties(response.data)
      })
  }, [])

  const handleEditParty = (party) => {
    setEditingParty({
      ...party, // Copiez toutes les propriétés de la partie
      idMaitreDuJeu: party.MaitreDuJeu, // Assurez-vous que la clé correspond à la base de données
    })
  }

  const handleUpdateParty = (updatedParty) => {
    // Convertissez la date et formatez-la correctement
    const date = new Date(updatedParty.Date)
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ")
    console.info("editingParty before update", editingParty)

    // Envoyez une requête PUT pour mettre à jour la partie dans votre API
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/partie/${editingParty.id}`,
        { ...editingParty, Date: formattedDate },
        {
          headers,
        }
      )

      .then((response) => {
        setEditingParty(null)
        // Gérez la réponse ou mettez à jour l'état si nécessaire
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de la partie :", error)
        console.info("editingParty after put", editingParty)
      })
  }

  console.info("editingParty", editingParty)
  // console.info("MaitreDuJeu", editingParty.MaitreDuJeu)
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
            <th>Maitre du Jeu</th>
            <th>Description</th>
            <th>Nombre de Joueurs</th>
            <th>Type de Jeux</th>
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
                {editingParty?.id === party.id ? (
                  <input
                    type="number"
                    value={editingParty.idMaitreDuJeu}
                    onChange={(e) => {
                      const maitreDuJeuValue = parseInt(e.target.value, 10)
                      setEditingParty({
                        ...editingParty,
                        idMaitreDuJeu: maitreDuJeuValue,
                      })
                    }}
                  />
                ) : (
                  party.MaitreDuJeu
                )}
              </td>
              <td>
                {editingParty?.id === party.id ? (
                  <input
                    type="text"
                    value={editingParty.Description}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        Description: e.target.value,
                      })
                    }
                  />
                ) : (
                  party.Description
                )}
              </td>
              <td>
                {editingParty?.id === party.id ? (
                  <input
                    type="text"
                    value={editingParty.NombreJoueur}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        NombreJoueur: e.target.value,
                      })
                    }
                  />
                ) : (
                  party.NombreJoueur
                )}
              </td>
              <td>
                {editingParty?.id === party.id ? (
                  <input
                    type="text"
                    value={editingParty.TypeDeJeux}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        TypeDeJeux: e.target.value,
                      })
                    }
                  />
                ) : (
                  party.TypeDeJeux
                )}
              </td>
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
