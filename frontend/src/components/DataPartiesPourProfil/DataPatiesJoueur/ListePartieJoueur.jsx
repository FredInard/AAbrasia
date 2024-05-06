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
  const [selectedPartie, setSelectedPartie] = useState(null)
  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)
  console.info("parties", parties)
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/profil/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        setParties(filterParties(res.data))
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
            <div key={partie.id}>
              <div className="cardResumPartie">
                <h2>{partie.Titre}</h2>
                <p>Type : {partie.TypeDeJeux}</p>
                <p>Date : {partie.Date}</p>
                <p>Lieu : {partie.Lieu}</p>
                <p>Nombre de Joueur : {partie.NombreJoueur}</p>
                <p>Description : {partie.Description}</p>
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
