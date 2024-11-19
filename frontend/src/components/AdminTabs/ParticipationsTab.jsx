// src/components/AdminTabs/ParticipationsTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./ParticipationsTab.scss"

const ParticipationsTab = () => {
  const [participations, setParticipations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedParticipation, setSelectedParticipation] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    utilisateur_id: "",
    partie_id: "",
    // Ajoutez d'autres champs si nécessaire
  })

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchParticipations()
  }, [])

  const fetchParticipations = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setParticipations(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des participations :", error)
        setError("Erreur lors du chargement des participations.")
        setLoading(false)
      })
  }

  const handleDelete = (participationId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette participation ?")
    ) {
      axios
        .delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/participations/${participationId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          fetchParticipations()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de la participation :",
            error
          )
          setError("Erreur lors de la suppression de la participation.")
        })
    }
  }

  const handleEdit = (participation) => {
    setSelectedParticipation(participation)
    setFormData({
      utilisateur_id: participation.utilisateur_id,
      partie_id: participation.partie_id,
      // Ajoutez d'autres champs si nécessaire
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setFormData({
      utilisateur_id: "",
      partie_id: "",
      // Ajoutez d'autres champs si nécessaire
    })
    setIsCreating(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      // Mettre à jour la participation
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/participations/${
            selectedParticipation.id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          setIsEditing(false)
          setSelectedParticipation(null)
          fetchParticipations()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la mise à jour de la participation :",
            error
          )
          setError("Erreur lors de la mise à jour de la participation.")
        })
    } else if (isCreating) {
      // Créer une nouvelle participation
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/participations`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          setIsCreating(false)
          fetchParticipations()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la création de la participation :",
            error
          )
          setError("Erreur lors de la création de la participation.")
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
    setSelectedParticipation(null)
    setFormData({
      utilisateur_id: "",
      partie_id: "",
      // Ajoutez d'autres champs si nécessaire
    })
  }

  if (loading) {
    return <p>Chargement des participations...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="participations-tab">
      <h2>Gestion des participations</h2>
      <button onClick={handleCreate}>Ajouter une participation</button>
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="participation-form">
          <div>
            <label htmlFor="utilisateur_id">ID de l'utilisateur :</label>
            <input
              type="number"
              id="utilisateur_id"
              name="utilisateur_id"
              value={formData.utilisateur_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="partie_id">ID de la partie :</label>
            <input
              type="number"
              id="partie_id"
              name="partie_id"
              value={formData.partie_id}
              onChange={handleChange}
              required
            />
          </div>
          {/* Ajoutez d'autres champs si nécessaire */}
          <button type="submit">
            {isEditing
              ? "Mettre à jour la participation"
              : "Ajouter la participation"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <table className="participations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Utilisateur</th>
              <th>ID Partie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participations.map((participation) => (
              <tr key={participation.id}>
                <td>{participation.id}</td>
                <td>{participation.utilisateur_id}</td>
                <td>{participation.partie_id}</td>
                <td>
                  <button onClick={() => handleEdit(participation)}>
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(participation.id)}>
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

export default ParticipationsTab
