import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import ModificationPartieModal from "./ModificationPartieModal.jsx"
import ModalExitPartie from "../../ModalExitPartie.jsx"
import ModalConfirmSupresPartie from "../../ModalConfirmSupresPartie.jsx"

import "./ListePartieJoueur.scss"

export default function ListePartieJoueur() {
  const [showModalModifPartie, setShowModalModifPartie] = useState(false)
  const [showModalExitPartie, setShowModalExitPartie] = useState(false)

  const [parties, setParties] = useState([])
  const [joueursParPartie, setJoueursParPartie] = useState({})
  const [selectedPartie, setSelectedPartie] = useState(null)
  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)

  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  // Fonction pour filtrer les parties selon les critères donnés
  const filterParties = (parties) => {
    return parties.filter((partie) => new Date(partie.Date) > new Date())
  }

  const handleExitPartieClick = (partie) => {
    setSelectedPartie(partie)
    setShowModalExitPartie(true)
  }

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  console.info("parties:", parties)
  console.info("selectedPartie:", selectedPartie)
  console.info("idUserNumb:", idUserNumb)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/profil/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        console.info("Réponse de l'API:", res.data)
        const filteredParties = filterParties(res.data)
        setParties(filteredParties)
        // Pour chaque partie, récupérer les joueurs associés
        filteredParties.forEach((partie) => {
          axios
            .get(
              `${import.meta.env.VITE_BACKEND_URL}/partie/joueurs/${
                partie.PartieId
              }`,
              {
                headers,
              }
            )
            .then((res) => {
              setJoueursParPartie((prev) => ({
                ...prev,
                [partie.PartieId]: res.data,
              }))
            })
            .catch((err) => {
              console.error("Problème lors du chargement des Joueurs", err)
            })
        })
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [showModalExitPartie])

  return (
    <>
      <div className="boxResumeParties fade-in-right"></div>
      {parties.length > 0 && (
        <div className="boxCardsResumPartie">
          <h2>Mes parties :</h2>
          {parties.map((partie) => (
            <div key={partie.PartieId}>
              <div className="cardResumPartie">
                <h2>{partie.Titre}</h2>
                <p>Type : {partie.TypeDeJeux}</p>
                <p>Date : {partie.Date}</p>
                <p>Lieu : {partie.Lieu}</p>
                <p>Nombre de Joueur : {partie.NombreJoueur}</p>
                <p>Description : {partie.Description}</p>
                <p>Maître du Jeu : {partie.MJPseudo}</p>
                <img
                  className="photoProfileMJ"
                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                    partie.MJPhotoProfil
                  }`}
                  alt={`Photo de profil de ${partie.MJPseudo}`}
                />
                <p>Liste des joueurs :</p>
                <div className="joueursPartieUser">
                  {joueursParPartie[partie.PartieId] &&
                    joueursParPartie[partie.PartieId].map((joueur) => (
                      <div className="joueursPartieUser" key={joueur.id}>
                        <img
                          className="photoProfileMJ"
                          src={`${import.meta.env.VITE_BACKEND_URL}/${
                            joueur.PhotoProfil
                          }`}
                          alt={`Photo de profil de ${joueur.Pseudo}`}
                        />
                        <p>{joueur.Pseudo}</p>
                      </div>
                    ))}
                </div>
                <button
                  className="allButtonProfil"
                  onClick={() => handleExitPartieClick(partie)}
                >
                  Se retirer de la partie
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPartie && (
        <ModificationPartieModal
          isOpen={showModalModifPartie}
          onClose={() => {
            setShowModalModifPartie(false)
            setSelectedPartie(null)
          }}
          partie={selectedPartie}
        />
      )}
      {selectedPartie && (
        <ModalExitPartie
          isOpen={showModalExitPartie}
          onClose={() => {
            setShowModalExitPartie(false)
            setSelectedPartie(null)
          }}
          partie={selectedPartie}
        />
      )}
      <ModalConfirmSupresPartie
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
      />

      <ToastContainer />
    </>
  )
}
