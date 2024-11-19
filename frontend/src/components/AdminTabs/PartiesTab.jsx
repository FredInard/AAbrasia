// src/components/AdminTabs/PartiesTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./PartiesTab.scss"

const PartiesTab = () => {
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedParty, setSelectedParty] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    titre: "",
    type: "jeux",
    description: "",
    date: "",
    nb_max_joueurs: "",
    id_maitre_du_jeu: "",
    duree_estimee: "",
    lieu: "",
    // Ajoutez d'autres champs si nécessaire
  })

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/parties`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setParties(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des parties :", error)
        setError("Erreur lors du chargement des parties.")
        setLoading(false)
      })
  }

  const handleDelete = (partyId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette partie ?")) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          fetchParties()
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de la partie :", error)
          setError("Erreur lors de la suppression de la partie.")
        })
    }
  }

  const handleEdit = (party) => {
    setSelectedParty(party)
    setFormData({
      titre: party.titre,
      type: party.type,
      description: party.description,
      date: party.date ? new Date(party.date).toISOString().slice(0, 16) : "",
      nb_max_joueurs: party.nb_max_joueurs,
      id_maitre_du_jeu: party.id_maitre_du_jeu,
      duree_estimee: party.duree_estimee,
      lieu: party.lieu,
      // Ajoutez d'autres champs si nécessaire
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setFormData({
      titre: "",
      type: "jeux",
      description: "",
      date: "",
      nb_max_joueurs: "",
      id_maitre_du_jeu: "",
      duree_estimee: "",
      lieu: "",
      // Ajoutez d'autres champs si nécessaire
    })
    setIsCreating(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      // Mettre à jour la partie
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/parties/${selectedParty.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          setIsEditing(false)
          setSelectedParty(null)
          fetchParties()
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de la partie :", error)
          setError("Erreur lors de la mise à jour de la partie.")
        })
    } else if (isCreating) {
      // Créer une nouvelle partie
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/parties`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          setIsCreating(false)
          fetchParties()
        })
        .catch((error) => {
          console.error("Erreur lors de la création de la partie :", error)
          setError("Erreur lors de la création de la partie.")
        })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedParty(null)
    setFormData({
      titre: "",
      type: "jeux",
      description: "",
      date: "",
      nb_max_joueurs: "",
      id_maitre_du_jeu: "",
      duree_estimee: "",
      lieu: "",
      // Ajoutez d'autres champs si nécessaire
    })
  }

  if (loading) {
    return <p>Chargement des parties...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="parties-tab">
      <h2>Gestion des parties</h2>
      <button onClick={handleCreate}>Créer une nouvelle partie</button>
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="party-form">
          <div>
            <label htmlFor="titre">Titre :</label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="type">Type :</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="jeux">Jeux</option>
              <option value="événement">Événement</option>
            </select>
          </div>
          <div>
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="date">Date et heure :</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="nb_max_joueurs">Nombre maximal de joueurs :</label>
            <input
              type="number"
              id="nb_max_joueurs"
              name="nb_max_joueurs"
              value={formData.nb_max_joueurs}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="id_maitre_du_jeu">ID du maître du jeu :</label>
            <input
              type="number"
              id="id_maitre_du_jeu"
              name="id_maitre_du_jeu"
              value={formData.id_maitre_du_jeu}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="duree_estimee">Durée estimée (en heures) :</label>
            <input
              type="number"
              id="duree_estimee"
              name="duree_estimee"
              value={formData.duree_estimee}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lieu">Lieu :</label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
            />
          </div>
          {/* Ajoutez d'autres champs si nécessaire */}
          <button type="submit">
            {isEditing ? "Mettre à jour la partie" : "Créer la partie"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <table className="parties-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Type</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>ID MJ</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party) => (
              <tr key={party.id}>
                <td>{party.id}</td>
                <td>{party.titre}</td>
                <td>{party.type}</td>
                <td>
                  {new Date(party.date).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{party.lieu}</td>
                <td>{party.id_maitre_du_jeu}</td>
                <td>
                  <button onClick={() => handleEdit(party)}>Modifier</button>
                  <button onClick={() => handleDelete(party.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PartiesTab
