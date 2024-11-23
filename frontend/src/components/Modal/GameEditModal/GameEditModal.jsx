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

  // Fonction pour normaliser l'URL
  const normalizeUrl = (url) => url.replace(/([^:]\/)\/+/g, "$1")
  // Pour prévisualiser la photo téléchargée
  const [photoPreview, setPhotoPreview] = useState(
    normalizeUrl(
      `${import.meta.env.VITE_BACKEND_URL}/${gameDetails.photo_scenario}`
    ) || null
  )
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photo_scenario: file, // Stocker le fichier pour l'envoi
      }))
      setPhotoPreview(URL.createObjectURL(file)) // Prévisualisation
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedFormData = new FormData()
    // Ajouter les champs texte au FormData
    Object.keys(formData).forEach((key) => {
      if (key === "photo_scenario" && formData[key] instanceof File) {
        updatedFormData.append(key, formData[key]) // Ajouter la photo seulement si modifiée
      } else {
        updatedFormData.append(key, formData[key])
      }
    })

    onSubmit(updatedFormData) // Envoyer les données au parent
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
          <div className="form-group">
            <label htmlFor="photo_scenario">Photo du scénario :</label>
            {photoPreview && (
              <img
                src={normalizeUrl(photoPreview)}
                alt="Prévisualisation"
                className="photo-preview"
              />
            )}
            <input
              type="file"
              id="photo_scenario"
              name="photo_scenario"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  )
}

export default GameEditModal
