import React, { useState } from "react"
import axios from "axios" // Si tu utilises axios pour les requêtes API
import "./CreateGame.scss" // N'oublie pas d'ajouter un fichier de style si besoin
import NavBar from "../components/NavBar/NavBar"

const CreateGame = () => {
  // État pour gérer les champs du formulaire
  const [titre, setTitre] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [nbMaxJoueurs, setNbMaxJoueurs] = useState(4) // Par défaut 4 joueurs
  const [niveauDifficulte, setNiveauDifficulte] = useState("moyen")
  const [lieu, setLieu] = useState("")
  const [dureeEstimee, setDureeEstimee] = useState("")
  const [photoScenario, setPhotoScenario] = useState(null) // Nouvelle variable pour l'image

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      // Utilisation de FormData pour envoyer des fichiers avec d'autres données
      const formData = new FormData()
      formData.append("titre", titre)
      formData.append("description", description)
      formData.append("date", date)
      formData.append("nb_max_joueurs", nbMaxJoueurs)
      formData.append("niveau_difficulte", niveauDifficulte)
      formData.append("lieu", lieu)
      formData.append("duree_estimee", dureeEstimee)
      if (photoScenario) {
        formData.append("photo_scenario", photoScenario) // Ajout de l'image dans formData
      }

      // Requête POST à l'API pour créer une partie
      const response = await axios.post("/api/partie", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Indique que le contenu inclut un fichier
        },
      })

      if (response.status === 201) {
        alert("La partie a été créée avec succès !")
        // Réinitialisation du formulaire après succès
        setTitre("")
        setDescription("")
        setDate("")
        setNbMaxJoueurs(4)
        setNiveauDifficulte("moyen")
        setLieu("")
        setDureeEstimee("")
        setPhotoScenario(null) // Réinitialise l'image
      }
    } catch (error) {
      console.error("Erreur lors de la création de la partie :", error)
      alert("Une erreur est survenue lors de la création de la partie.")
    }
  }

  return (
    <>
      <NavBar />

      <div className="creer-partie-container">
        <h1>Créer une nouvelle partie</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Titre */}
          <div className="form-group">
            <label htmlFor="titre">Titre de la partie</label>
            <input
              type="text"
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date de la partie</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Nombre maximum de joueurs */}
          <div className="form-group">
            <label htmlFor="nbMaxJoueurs">Nombre maximum de joueurs</label>
            <input
              type="number"
              id="nbMaxJoueurs"
              value={nbMaxJoueurs}
              min="1"
              onChange={(e) => setNbMaxJoueurs(e.target.value)}
              required
            />
          </div>

          {/* Niveau de difficulté */}
          <div className="form-group">
            <label htmlFor="niveauDifficulte">Niveau de difficulté</label>
            <select
              id="niveauDifficulte"
              value={niveauDifficulte}
              onChange={(e) => setNiveauDifficulte(e.target.value)}
              required
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          {/* Lieu */}
          <div className="form-group">
            <label htmlFor="lieu">Lieu</label>
            <input
              type="text"
              id="lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              required
            />
          </div>

          {/* Durée estimée */}
          <div className="form-group">
            <label htmlFor="dureeEstimee">Durée estimée (en heures)</label>
            <input
              type="number"
              id="dureeEstimee"
              value={dureeEstimee}
              min="1"
              onChange={(e) => setDureeEstimee(e.target.value)}
              required
            />
          </div>

          {/* Photo du scénario */}
          <div className="form-group">
            <label htmlFor="photoScenario">Photo du scénario</label>
            <input
              type="file"
              id="photoScenario"
              accept="image/*"
              onChange={(e) => setPhotoScenario(e.target.files[0])} // Capture du fichier
            />
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="btn-submit">
            Créer la partie
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateGame
