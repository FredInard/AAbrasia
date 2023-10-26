import React, { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./ModificationPartieModal.scss"

function ModificationPartieModal({ isOpen, onClose, partie }) {
  const [titre, setTitre] = useState(partie.Titre)
  const [date, setDate] = useState(partie.Date)
  const [heure, setHeure] = useState(partie.Heure)
  const [lieu, setLieu] = useState(partie.Lieu)
  const idMaitreDuJeu = partie.MaitreDuJeu
  const [description, setDescription] = useState(partie.Description)
  const [nombreJoueur, setNombreJoueur] = useState(partie.NombreJoueur)
  const [typeDeJeux, setTypeDeJeux] = useState(partie.TypeDeJeux)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const handleSaveChanges = () => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/partie/${partie.id}`,
        {
          Titre: titre,
          Date: date,
          Heure: heure,
          Lieu: lieu,
          IdMaitreDuJeu: idMaitreDuJeu,
          Description: description,
          NombreJoueur: nombreJoueur,
          TypeDeJeux: typeDeJeux,
        },
        { headers }
      )
      .then((res) => {
        console.info("Modifications partie réussie :", res.data)
        onClose()
      })

      .catch((error) => {
        // Gérer les erreurs
        console.error("Erreur lors de la mise à jour de la partie :", error)
      })
  }

  return (
    <div className={`modalModificationPartie ${isOpen ? "open" : ""}`}>
      <div className="modalModificationPartie-content">
        <h2>Modifier la partie</h2>
        <form>
          <label>
            <h3>Titre :</h3>
            <input
              type="text"
              name="Titre"
              placeholder={partie.Titre}
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </label>
          <label>
            <h3>Date :</h3>
            <input
              type="date"
              name="Date"
              placeholder={partie.Date}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            <h3>Heure :</h3>
            <input
              type="Heure"
              name="Heure"
              placeholder={partie.Heure}
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
            />
          </label>
          <label>
            <h3>Lieu :</h3>
            <input
              type="text"
              name="Lieu"
              placeholder={partie.Lieu}
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
            />
          </label>

          <label>
            <h3>Description :</h3>
            <textarea
              name="Description"
              placeholder={partie.Description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            <h3>NombreJoueur :</h3>
            <textarea
              name="NombreJoueur"
              placeholder={partie.NombreJoueur}
              value={nombreJoueur}
              onChange={(e) => setNombreJoueur(e.target.value)}
            />
          </label>
          <label>
            <h3>TypeDeJeux :</h3>
            <textarea
              name="TypeDeJeux"
              placeholder={partie.TypeDeJeux}
              value={typeDeJeux}
              onChange={(e) => setTypeDeJeux(e.target.value)}
            />
          </label>
          <button
            className="buttonModifParfie"
            type="button"
            onClick={handleSaveChanges}
          >
            Enregistrer
          </button>
          <button className="buttonModifParfie" type="button" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  )
}

export default ModificationPartieModal
