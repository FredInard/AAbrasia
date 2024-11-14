// src/components/GameEditModal/GameEditModal.jsx

import React, { useState } from "react"
import "./GameEditModal.scss"

const GameEditModal = ({ gameDetails, onClose, onSubmit }) => {
  // Initialiser formData avec tous les détails de gameDetails
  const [formData, setFormData] = useState(() => {
    return {
      ...gameDetails,
      date: gameDetails.date
        ? new Date(gameDetails.date).toISOString().slice(0, 16)
        : "",
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData) // Envoyer toutes les données de formData, y compris les champs non modifiables
  }

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div
        className="edit-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          ✕
        </button>
        <h2>Modifier la partie</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          {/* Champs modifiables */}
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="lieu">Lieu :</label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nb_max_joueurs">Nombre maximal de joueurs :</label>
            <input
              type="number"
              id="nb_max_joueurs"
              name="nb_max_joueurs"
              value={formData.nb_max_joueurs}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="duree_estimee">Durée estimée (en heures) :</label>
            <input
              type="number"
              id="duree_estimee"
              name="duree_estimee"
              value={formData.duree_estimee}
              onChange={handleChange}
            />
          </div>

          {/* Champs non modifiables (inclus dans formData mais non affichés) */}
          {/* Si nécessaire, vous pouvez inclure des inputs cachés */}
          {/* Exemple :
          <input type="hidden" name="id" value={formData.id} />
          */}
          {/* Bouton de soumission */}
          <button type="submit" className="submit-btn">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  )
}

export default GameEditModal
