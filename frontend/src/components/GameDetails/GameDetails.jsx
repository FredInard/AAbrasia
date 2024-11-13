import React, { useState, useEffect } from "react"
import axios from "axios"

import ParticipantsList from "../ParticipantsList/ParticipantsList"
import MealList from "../MealList/MealList"
import CarpoolList from "../CarpoolList/CarpoolList"
import CarpoolModal from "../Modal/ModalCarPool/CarpoolModal"
import MealModal from "../Modal/ModalMealList/MealModal"

import "./GameDetails.scss"
import iconTime from "../../assets/pics/iconTime.svg"
import iconPlace from "../../assets/pics/iconPlaceMarker.svg"
import iconTeam from "../../assets/pics/iconTeam.svg"
import IconCar from "../../assets/pics/iconCar.svg"
import iconPizza from "../../assets/pics/iconPizza.svg"

const GameDetails = ({ partyId, onClose }) => {
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [user, setUser] = useState(null)
  const [isUpdated, setIsUpdated] = useState(false)
  const [isCarpoolModalOpen, setIsCarpoolModalOpen] = useState(false)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)

  // Récupérer l'utilisateur connecté une fois au chargement
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]))
      setUser(decodedToken)
    }
  }, [])

  // Charger les détails de la partie et vérifier l'inscription de l'utilisateur
  useEffect(() => {
    if (!partyId) return

    const fetchGameDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`
        )
        setGameDetails(res.data)

        // Vérifier si l'utilisateur est déjà inscrit à la partie
        if (user) {
          const participationRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
              user.id
            }`
          )
          setIsJoined(participationRes.data.isJoined)
        }
      } catch (err) {
        setError("Erreur lors du chargement des détails de la partie.")
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [partyId, user?.id])

  const handleJoinParty = async () => {
    if (!user) {
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
          user.id
        }`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      setIsJoined(true)
      setIsUpdated(!isUpdated) // Basculer isUpdated pour rafraîchir ParticipantsList
    } catch (err) {
      setError("Impossible de rejoindre la partie. Veuillez réessayer.")
    }
  }

  const handleLeaveParty = async () => {
    if (!user) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
          user.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      setIsJoined(false) // Mettre à jour l'état pour refléter le départ de l'utilisateur
      setIsUpdated(!isUpdated) // Rafraîchit les listes liées aux repas et covoiturages
      console.info(
        "L'utilisateur a quitté la partie et toutes ses données ont été supprimées."
      )
    } catch (err) {
      console.error(
        "Erreur lors de la suppression des données de l'utilisateur :",
        err
      )
      setError("Impossible de quitter la partie. Veuillez réessayer.")
    }
  }

  const handleOpenCarpoolModal = () => {
    setIsCarpoolModalOpen(true)
  }

  const handleCloseCarpoolModal = () => {
    setIsCarpoolModalOpen(false)
  }

  const handleCarpoolSubmit = (carpoolData) => {
    const authToken = localStorage.getItem("authToken")

    if (!authToken) {
      console.error("Jeton d'authentification manquant !")
      setError("Vous devez être connecté pour ajouter un covoiturage.")
      return
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/covoiturages`,
        {
          utilisateur_id: user.id,
          partie_id: partyId,
          ville_depart: carpoolData.departure,
          ville_arrivee: carpoolData.arrival,
          heure_depart: carpoolData.departureTime,
          propose_retour: carpoolData.returnOffer,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Préfixe "Bearer"
          },
        }
      )
      .then(() => {
        console.info("Covoiturage ajouté avec succès !")
        setIsUpdated(!isUpdated)
        console.info("isUpdated", isUpdated) // Basculer isUpdated pour rafraîchir CarpoolList
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du covoiturage :", err)
        setError("Erreur lors de l'ajout du covoiturage.")
      })
  }

  // Fonction pour gérer l'ouverture de la modal
  const handleOpenMealModal = () => {
    setIsMealModalOpen(true)
  }

  // Fonction pour gérer la fermeture de la modal
  const handleCloseMealModal = () => {
    setIsMealModalOpen(false)
  }

  // Fonction pour soumettre les données du repas
  const handleMealSubmit = (mealData) => {
    console.info(
      "Tentative de soumission du repas avec les données :",
      mealData
    )

    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      console.error("Jeton d'authentification manquant !")
      setError("Vous devez être connecté pour proposer un repas.")
      return
    }

    console.info("Jeton d'authentification récupéré :", authToken)

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/repas`,
        {
          utilisateur_id: user.id,
          partie_id: partyId,
          contenu: mealData.contenu,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        console.info("Repas ajouté avec succès !")
        setIsUpdated(!isUpdated)
        console.info("État isUpdated basculé :", isUpdated)
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du repas :", err)
        setError("Erreur lors de l'ajout du repas.")
      })
  }

  if (loading) return <p>Chargement des détails de la partie...</p>
  if (error) return <p>{error}</p>

  const canJoin = user && user.id !== gameDetails.id_maitre_du_jeu && !isJoined
  const canLeave = user && user.id !== gameDetails.id_maitre_du_jeu && isJoined

  console.info("User ID envoyé à CarpoolList:", user?.id)

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-labelledby="game-title"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          ✕
        </button>

        <h1 id="game-title" className="game-title">
          {gameDetails.titre}
        </h1>
        <div className="GmEtDescription">
          <div className="game-master-info">
            {gameDetails.maitre_du_jeu_photo && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${
                  gameDetails.maitre_du_jeu_photo
                }`}
                alt={`Maître du jeu ${gameDetails.maitre_du_jeu_pseudo}`}
                className="game-master-photo"
              />
            )}
            <span className="game-master-pseudo">
              MJ: {gameDetails.maitre_du_jeu_pseudo}
            </span>
          </div>

          <div className="game-description">
            <h3>Description :</h3>
            <p>{gameDetails.description}</p>
          </div>
        </div>

        <div className="game-details">
          <div className="game-info-item">
            <img src={iconTime} alt="Icône de l'heure" className="icon" /> :{" "}
            {gameDetails.date
              ? new Date(gameDetails.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) +
                " à " +
                new Date(gameDetails.date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Non précisé"}
          </div>
          <div className="game-info-item">
            <img src={iconPlace} alt="Icône de l'heure" className="icon" /> :{" "}
            {gameDetails.lieu || "Lieu non précisé"}
          </div>
          <div className="game-info-item">
            <img src={iconTeam} alt="Icône de l'heure" className="icon" /> : x{" "}
            {gameDetails.nb_max_joueurs || "Non précisé"}
          </div>
        </div>

        <h3>Participants :</h3>
        <ParticipantsList partyId={partyId} isUpdated={isUpdated} />

        {user && (
          <>
            <h3>Autres infos :</h3>
            <CarpoolList
              partyId={partyId}
              isUpdated={isUpdated}
              userId={user?.id}
            />
            <MealList
              partyId={partyId}
              isUpdated={isUpdated}
              userId={user?.id}
            />

            {isJoined && (
              <>
                <p>
                  Tu souhaites proposer un covoiturage ou informer que tu nous
                  ramènes de quoi manger ou boire ? Parfait ! Clique sur l’icône
                  de ton choix :
                </p>
                <div className="buttonAutresInfos">
                  <img
                    className="icon"
                    src={IconCar}
                    alt="icone d'une petite voiture rouge"
                    onClick={handleOpenCarpoolModal}
                  />
                  {isCarpoolModalOpen && (
                    <CarpoolModal
                      partyId={partyId}
                      user={user}
                      onClose={handleCloseCarpoolModal}
                      onSubmit={handleCarpoolSubmit}
                    />
                  )}
                  <img
                    className="icon"
                    src={iconPizza}
                    alt="icone d'une part de pizza"
                    onClick={handleOpenMealModal}
                  />
                  {isMealModalOpen && (
                    <MealModal
                      partyId={partyId}
                      user={user}
                      onClose={handleCloseMealModal}
                      onSubmit={handleMealSubmit}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}

        {canJoin && (
          <button onClick={handleJoinParty} className="join-btn">
            Rejoindre l'aventure
          </button>
        )}

        {canLeave && (
          <button onClick={handleLeaveParty} className="leave-btn">
            Quitter l'aventure
          </button>
        )}
      </div>
    </div>
  )
}

export default GameDetails
