import React, { useEffect, useState } from "react"
import axios from "axios"
import "./UserProfileModal.scss"

export default function UserProfileModal({ user, onClose }) {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur depuis l'API
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${user}`
        )
        setUserData(response.data) // Mettre à jour avec les données récupérées
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        )
      }
    }

    fetchUserData()
  }, [user])

  // Si les données utilisateur ne sont pas encore chargées, afficher un message de chargement
  if (!userData) return <div>Chargement...</div>

  return (
    <div className="userProfileModal">
      <div className="modalContent">
        <button onClick={onClose} className="closeButton">
          X
        </button>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${userData.photo_profil}`}
          alt={userData.pseudo}
          className="profilePhoto"
        />
        <h2>{userData.prenom}</h2>
        <p>Pseudo: {userData.pseudo}</p>
        <p>Bio: {userData.bio}</p>
      </div>
    </div>
  )
}
