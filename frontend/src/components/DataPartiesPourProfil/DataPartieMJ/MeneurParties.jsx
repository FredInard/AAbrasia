import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ModificationPartieModal from "../DataPatiesJoueur/ModificationPartieModal.jsx"
import ModalExitPartie from "../../ModalExitPartie.jsx"
import ModalConfirmSupresPartie from "../../ModalConfirmSupresPartie.jsx"

import "./MeneurParties.scss"

export default function MeneurParties() {
  const [showModalModifPartie, setShowModalModifPartie] = useState(false)
  const [showModalExitPartie, setShowModalExitPartie] = useState(false)

  const [meneurParties, setMeneurParties] = useState([])
  const [selectedPartie, setSelectedPartie] = useState(null)
  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)
  const [allPosts, setAllPosts] = useState([])
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

  useEffect(() => {
    // Boucle sur les parties pour récupérer les participants pour chaque partie
    meneurParties.forEach((partie) => {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/displayPlayers/${
            partie.id
          }`,
          { headers }
        )
        .then((res) => {
          // Mettre à jour les participants pour la partie correspondante
          setAllPosts((prevState) => ({
            ...prevState,
            [partie.id]: res.data,
          }))
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des participants.",
            error
          )
        })
    })
  }, [meneurParties])

  return (
    <>
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
                <p>Liste des participants:</p>
                <div className="mapParticipants">
                  {allPosts[meneurPartie.id] &&
                  allPosts[meneurPartie.id].length > 0 ? (
                    Array.from(
                      allPosts[meneurPartie.id]
                        .reduce((uniqueParticipants, post) => {
                          if (!uniqueParticipants.has(post.id)) {
                            uniqueParticipants.set(post.id, post)
                          }
                          return uniqueParticipants
                        }, new Map())
                        .values()
                    ).map((uniquePost) => (
                      <div
                        className="mapPhotoProfileParticipant"
                        key={uniquePost.id}
                      >
                        <img
                          className="photoProfileParticipant"
                          src={`${import.meta.env.VITE_BACKEND_URL}/${
                            uniquePost.PhotoProfil
                          }`}
                          alt="photo de profil de l'utilisateur"
                        />
                        <div className="mapPseudoParticipant">
                          <div className="pseudoParticipant">
                            {uniquePost.Pseudo}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Chargement en cours...</p>
                  )}
                </div>
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

      {/* Modal components */}
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

      {/* Toast notifications */}
      <ToastContainer />
    </>
  )
}
