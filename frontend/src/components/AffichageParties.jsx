import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import ModificationPartieModal from "../components/ModificationPartieModal.jsx"
import ModalExitPartie from "../components/ModalExitPartie.jsx"
import ModalConfirmSupresPartie from "../components/ModalConfirmSupresPartie.jsx"

import "./AffichageParties.scss"

export default function AffichageParties() {
  const [showModalModifPartie, setShowModalModifPartie] = useState(false)
  const [showModalExitPartie, setShowModalExitPartie] = useState(false)

  const [parties, setParties] = useState([])
  const [meneurParties, setMeneurParties] = useState([])
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

  const handleEditClick = (partie) => {
    setSelectedPartie(partie)
    setShowModalModifPartie(true)
  }

  const handleExitPartieClick = (partie) => {
    setSelectedPartie(partie)
    setShowModalExitPartie(true)
  }

  const handleSupresPartieClick = (partieId) => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/partie/participation/${partieId}`,
        {
          headers,
        }
      )
      .then((results) => {
        console.info("Partie supprimée avec succès !")
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la partie :", error)
      })
  }

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [selectedPartieIdToDelete, setSelectedPartieIdToDelete] = useState(null)

  const handleDeleteClick = (partieId) => {
    setSelectedPartieIdToDelete(partieId)
    setIsConfirmationModalOpen(true)
  }

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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/meneur/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        setMeneurParties(filterParties(res.data))
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties meneurs", err)
      })
  }, [showModalModifPartie, handleSupresPartieClick])

  return (
    <>
      <div className="globalBoxProfil">
        <div className="boxListeParties ">
          <div className="boxPictureLeft fade-in-left"></div>
          <div className="boxListeGame">
            <h1>Tableau de bord de tes parties :</h1>
            <div className="boxResumeParties fade-in-right">
              <div className="buttonContainer">
                <button
                  onClick={() => setParties(filterParties)}
                  className="filterButton"
                >
                  Affichage partie joueur
                </button>
                <button
                  onClick={() => setMeneurParties(filterParties)}
                  className="filterButton"
                >
                  Affichage partie MJ
                </button>
                <button
                  onClick={() => {
                    axios
                      .get(
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/partie/passes/${idUserNumb}`,
                        {
                          headers,
                        }
                      )
                      .then((res) => {
                        setParties(res.data)
                        setMeneurParties([])
                      })
                      .catch((err) => {
                        console.error(
                          "Problème lors du chargement des parties passées",
                          err
                        )
                      })
                  }}
                  className="filterButton"
                >
                  Affichage partie passées
                </button>
              </div>
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

              {meneurParties.length > 0 && (
                <div className="boxCardsResumPartieMeneur">
                  <h2>Mes parties en tant que meneur :</h2>
                  {meneurParties.map((meneurPartie) => (
                    <div key={meneurPartie.id}>
                      <div className="cardResumMeneurParties">
                        <h2>{meneurPartie.Titre}</h2>
                        <p>Type : {meneurPartie.TypeDeJeux}</p>
                        <p>Date : {meneurPartie.Date}</p>
                        <p>Lieu : {meneurPartie.Lieu}</p>
                        <p>Nombre de Joueur : {meneurPartie.NombreJoueur}</p>
                        <p>Description : {meneurPartie.Description}</p>
                        <button
                          className="allButtonProfil"
                          onClick={() => handleEditClick(meneurPartie)}
                        >
                          Modifier
                        </button>
                        <button
                          className="allButtonProfil"
                          onClick={() => handleDeleteClick(meneurPartie.id)}
                        >
                          Supprimer la partie
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
          selectedPartieIdToDelete={selectedPartieIdToDelete}
        />
      </div>
      <ToastContainer />
    </>
  )
}
