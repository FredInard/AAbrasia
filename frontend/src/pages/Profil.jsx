import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar/NavBar"
import ToggleSwitch from "../components/Toggle/ToggleSwitch"
// import ModificationProfil from "../components/DataPourProfil/ModificationProfil"
// import AffichageParties from "../components/DataPartiesPourProfil/AffichageParties"
import { AuthContext } from "../services/AuthContext"
import "./Profil.scss"

export default function Profil() {
  const [utilisateur, setUtilisateur] = useState(null)
  const [showListeParties, setShowListeParties] = useState(true)
  const [theme, setTheme] = useState("light-mode")
  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas authentifié
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    // Fonction pour récupérer les données de l'utilisateur
    const fetchUtilisateur = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateur/profil`,
          {
            withCredentials: true, // Assure l'envoi des cookies
          }
        )
        setUtilisateur(response.data)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        )
      }
    }

    fetchUtilisateur()
  }, [])

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light-mode" ? "dark-mode" : "light-mode")
  }

  if (!utilisateur) {
    // Afficher un indicateur de chargement
    return <p>Chargement...</p>
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <h1 className="bienvenueName">Bienvenue {utilisateur.pseudo}</h1>

      {/* Toggle pour basculer entre l'affichage des parties et la modification du profil */}
      <div className="boutonSwitch">
        <p>Tableau de bord des parties</p>
        <ToggleSwitch
          isChecked={!showListeParties}
          onChange={() => setShowListeParties(!showListeParties)}
        />
        <p>Modifier mon profil</p>
      </div>

      {/* Toggle pour changer le thème */}
      <div className="themeToggle">
        <p>Mode Clair</p>
        <ToggleSwitch
          isChecked={theme === "dark-mode"}
          onChange={toggleTheme}
        />
        <p>Mode Sombre</p>
      </div>

      {/* <div className="globalBoxProfil">
        {showListeParties ? (
          <AffichageParties utilisateur={utilisateur} />
        ) : (
          <ModificationProfil
            utilisateur={utilisateur}
            setUtilisateur={setUtilisateur}
          />
        )}
      </div> */}
    </>
  )
}
