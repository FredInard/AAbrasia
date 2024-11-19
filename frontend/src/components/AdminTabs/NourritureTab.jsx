// src/components/AdminTabs/NourritureTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./NourritureTab.scss"

const NourritureTab = () => {
  const [nourritures, setNourritures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedNourriture, setSelectedNourriture] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    partie_id: "",
    utilisateur_id: "",
    item: "",
    quantite: "",
    // Ajoutez d'autres champs si nécessaire
  })

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchNourritures()
  }, [])

  const fetchNourritures = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/repas`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setNourritures(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des nourritures :", error)
        setError("Erreur lors du chargement des nourritures.")
        setLoading(false)
      })
  }

  const handleDelete = (nourritureId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      axios
        .delete(
          `${import.meta.env.VITE_BACKEND_URL}/nourritures/${nourritureId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          fetchNourritures()
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de l'élément :", error)
          setError("Erreur lors de la suppression de l'élément.")
        })
    }
  }

  const handleEdit = (nourriture) => {
    setSelectedNourriture(nourriture)
    setFormData({
      partie_id: nourriture.partie_id,
      utilisateur_id: nourriture.utilisateur_id,
      item: nourriture.item,
      quantite: nourriture.quantite,
      // Ajoutez d'autres champs si nécessaire
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setFormData({
      partie_id: "",
      utilisateur_id: "",
      item: "",
      quantite: "",
      // Ajoutez d'autres champs si nécessaire
    })
    setIsCreating(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      // Mettre à jour l'élément
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/nourritures/${
            selectedNourriture.id
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
          setSelectedNourriture(null)
          fetchNourritures()
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de l'élément :", error)
          setError("Erreur lors de la mise à jour de l'élément.")
        })
    } else if (isCreating) {
      // Créer un nouvel élément
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/nourritures`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          setIsCreating(false)
          fetchNourritures()
        })
        .catch((error) => {
          console.error("Erreur lors de la création de l'élément :", error)
          setError("Erreur lors de la création de l'élément.")
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
    setSelectedNourriture(null)
    setFormData({
      partie_id: "",
      utilisateur_id: "",
      item: "",
      quantite: "",
      // Ajoutez d'autres champs si nécessaire
    })
  }

  if (loading) {
    return <p>Chargement des éléments de nourriture...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="nourriture-tab">
      <h2>Gestion des éléments de nourriture</h2>
      <button onClick={handleCreate}>Ajouter un élément</button>
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="nourriture-form">
          <div>
            <label htmlFor="partie_id">Partie :</label>
            <input
              type="number"
              id="partie_id"
              name="partie_id"
              value={formData.partie_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="utilisateur_id">Utilisateur :</label>
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
            <label htmlFor="item">Item :</label>
            <input
              type="text"
              id="item"
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="quantite">Quantité :</label>
            <input
              type="text"
              id="quantite"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
            />
          </div>
          {/* Ajoutez d'autres champs si nécessaire */}
          <button type="submit">
            {isEditing ? "Mettre à jour l'élément" : "Ajouter l'élément"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <table className="nourriture-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Partie ID</th>
              <th>Utilisateur ID</th>
              <th>Item</th>
              <th>Quantité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {nourritures.map((nourriture) => (
              <tr key={nourriture.id}>
                <td>{nourriture.id}</td>
                <td>{nourriture.partie_id}</td>
                <td>{nourriture.utilisateur_id}</td>
                <td>{nourriture.item}</td>
                <td>{nourriture.quantite}</td>
                <td>
                  <button onClick={() => handleEdit(nourriture)}>
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(nourriture.id)}>
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

export default NourritureTab
