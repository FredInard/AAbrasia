import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar/NavBar"
import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch"
import { AuthContext } from "../services/AuthContext"
import Cookies from "js-cookie" // Assure-toi que js-cookie est installé pour gérer les cookies
import ModificationProfil from "../components/ModificationProfil/ModificationProfil" // Assure-toi que ce composant est bien importé
import "./Profil.scss"

export default function Profil() {
  const [showListeParties, setShowListeParties] = useState(true) // Gestion de l'affichage
  const [utilisateur, setUtilisateur] = useState(null) // Ajouter un état pour l'utilisateur
  const navigate = useNavigate()
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext) // Ajoute setIsLoggedIn pour gérer l'état de connexion

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas authentifié
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [isLoggedIn, navigate])

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer les cookies
    Cookies.remove("authToken") // Si ton JWT est stocké dans un cookie HTTP-Only, ça le supprimera automatiquement
    Cookies.remove("Pseudo")
    Cookies.remove("loggedInUtilisateur")

    // Mettre à jour l'état du contexte Auth pour indiquer que l'utilisateur est déconnecté
    setIsLoggedIn(false)

    // Rediriger vers la page principale (ou la page de login)
    navigate("/")
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="pageProfil">
        <h1 className="bienvenueName">
          Bienvenue {utilisateur ? utilisateur.pseudo : "Chargement..."}
        </h1>

        {/* Toggle pour basculer entre l'affichage des parties et la modification du profil */}
        <div className="boutonSwitch">
          <p>Tableau de bord des parties</p>
          <ToggleSwitch
            isChecked={showListeParties} // Simplifier la logique pour passer directement `showListeParties`
            onChange={() => setShowListeParties(!showListeParties)} // Inverser la valeur au changement
          />
          <p>Modifier mon profil</p>
        </div>

        {/* Bouton de déconnexion */}
        <button className="logoutButton" onClick={handleLogout}>
          Se déconnecter
        </button>

        <div className="globalBoxProfil">
          {showListeParties ? (
            <p>Les parties seront affichées ici.</p>
          ) : (
            utilisateur && ( // Vérifie que l'utilisateur est chargé avant de rendre `ModificationProfil`
              <ModificationProfil
                utilisateur={utilisateur}
                setUtilisateur={setUtilisateur}
              />
            )
          )}
        </div>
      </div>
    </>
  )
}
