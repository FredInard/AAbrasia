import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "./ModificationProfil.scss"

export default function ModificationProfil({ utilisateur, setUtilisateur }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    pseudo: "",
    date_naissance: "",
    adresse: "",
    ville: "",
    telephone: "",
    bio: "",
    photo_profil: null, // Pour la gestion de la photo de profil
  })

  // Charger les données utilisateur dans le formulaire
  useEffect(() => {
    if (utilisateur) {
      setFormData({
        nom: utilisateur.nom || "",
        prenom: utilisateur.prenom || "",
        email: utilisateur.email || "",
        pseudo: utilisateur.pseudo || "",
        date_naissance: utilisateur.date_naissance || "",
        adresse: utilisateur.adresse || "",
        ville: utilisateur.ville || "",
        telephone: utilisateur.telephone || "",
        bio: utilisateur.bio || "",
        photo_profil: null, // La photo sera gérée séparément
      })
    }
  }, [utilisateur])

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Gérer l'upload de la photo de profil
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo_profil: e.target.files[0], // Garde le fichier pour l'envoyer
    }))
  }

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData() // Utilisation de FormData pour gérer les fichiers et les autres données
    for (const key in formData) {
      formDataToSend.append(key, formData[key])
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${utilisateur.id}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Nécessaire pour gérer le fichier
          },
        }
      )

      if (response.status === 200) {
        toast.success("Profil mis à jour avec succès")
        setUtilisateur(response.data) // Mettre à jour les informations utilisateur
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error)
      toast.error("Erreur lors de la mise à jour du profil")
    }
  }

  return (
    <div className="modificationProfil">
      <h2>Modifier le profil</h2>
      <form onSubmit={handleSubmit} className="formProfil">
        <div className="form-group">
          <label htmlFor="nom">Nom*</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prenom">Prénom*</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pseudo">Pseudo*</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_naissance">Date de naissance</label>
          <input
            type="date"
            id="date_naissance"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ville">Ville</label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telephone">Téléphone</label>
          <input
            type="text"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo_profil">Photo de profil</label>
          <input
            type="file"
            id="photo_profil"
            name="photo_profil"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn-update">
          Mettre à jour
        </button>
      </form>
    </div>
  )
}
