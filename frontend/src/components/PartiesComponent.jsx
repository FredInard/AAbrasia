import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./PartiesComponent.scss"
import poubel from "../assets/pics/poubel.png"

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
  }, [{ setParties }])

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
      })
  }

  const handleDeleteParty = (partyId) => {
    // Envoyez une requête DELETE pour supprimer la partie dans votre API
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/partie/participation/${partyId}`,
        {
          headers,
        }
      )
      .then((response) => {
        // Mettez à jour la liste des parties après la suppression
        setParties((prevParties) =>
          prevParties.filter((party) => party.id !== partyId)
        )
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la partie :", error)
      })
  }

  return (
    <div className="parties-container">
      <h1 className="parties-heading">Liste des Parties</h1>
      <table className="parties-table">
        <thead className="parties-table-head">
          <tr>
            <th>ID</th>
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
        <tbody className="parties-table-body">
          {parties.map((party) => (
            <tr key={party.id} className="parties-table-row">
              <td className="parties-table-data">{party.id}</td>
              <td className="parties-table-data">
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
              <td className="parties-table-data">
                {editingParty?.id === party.id ? (
                  <input
                    type="date"
                    value={editingParty.Date}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        Date: e.target.value,
                      })
                    }
                  />
                ) : (
                  new Date(party.Date).toLocaleDateString("fr-FR")
                )}
              </td>
              <td className="parties-table-data">
                {editingParty?.id === party.id ? (
                  <input
                    type="time"
                    value={editingParty.Heure}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        Heure: e.target.value,
                      })
                    }
                  />
                ) : (
                  party.Heure
                )}
              </td>
              <td className="parties-table-data">
                {editingParty?.id === party.id ? (
                  <input
                    type="text"
                    value={editingParty.Lieu}
                    onChange={(e) =>
                      setEditingParty({
                        ...editingParty,
                        Lieu: e.target.value,
                      })
                    }
                  />
                ) : (
                  party.Lieu
                )}
              </td>
              <td className="parties-table-data">
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
              <td className="parties-table-data">
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
              <td className="parties-table-data">
                {editingParty?.id === party.id ? (
                  <input
                    type="number"
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
              <td className="parties-table-data">
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
              <td className="parties-table-data">
                <button onClick={() => handleEditParty(party)}>Modifier</button>
                <button
                  onClick={() => handleDeleteParty(party.id)}
                  className="buttonParties-table-data"
                >
                  {/* Supprimer */}
                  <img
                    src={poubel}
                    alt="poubel"
                    className="poubelPartiesComponent"
                  />
                </button>
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
