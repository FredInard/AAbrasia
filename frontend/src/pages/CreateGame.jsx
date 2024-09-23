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

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      // Construction des données à envoyer à l'API
      const newPartie = {
        titre,
        description,
        date,
        nb_max_joueurs: nbMaxJoueurs,
        niveau_difficulte: niveauDifficulte,
        lieu,
        duree_estimee: dureeEstimee,
      }

      // Requête POST à l'API pour créer une partie
      const response = await axios.post("/api/partie", newPartie) // Mets ici l'URL de ton API
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
        <form onSubmit={handleSubmit}>
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
