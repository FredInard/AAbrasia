import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar/NavBar"
import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch"
import { AuthContext } from "../AuthContext"
import Cookies from "js-cookie"
import jwtDecode from "jwt-decode"
import ModificationProfil from "../components/ModificationProfil/ModificationProfil"
import "./Profil.scss"

export default function Profil() {
  const [showListeParties, setShowListeParties] = useState(true)
  const [utilisateur, setUtilisateur] = useState(null)
  const navigate = useNavigate()
  const { isLoggedIn, setIsLoggedIn, userData } = useContext(AuthContext)

  console.info("Profil Component Rendered")
  console.info("isLoggedIn: ", isLoggedIn)
  console.info("setIsLoggedIn: ", setIsLoggedIn)
  console.info("userData: ", userData)

  useEffect(() => {
    console.info("Effect triggered: Checking if user is logged in")

    if (!isLoggedIn) {
      console.info("User is not logged in, redirecting to /login")
      navigate("/login")
    } else {
      console.info("User is logged in, checking userData...")

      if (userData) {
        console.info("User data found in context: ", userData)
        setUtilisateur(userData)
      } else {
        console.warn(
          "User data not found in context, checking localStorage for token..."
        )
        const token = localStorage.getItem("authToken")

        if (token) {
          try {
            const decodedToken = jwtDecode(token)
            console.info("Token decoded successfully: ", decodedToken)
            setIsLoggedIn(true)
            setUtilisateur(decodedToken)
          } catch (error) {
            console.error("Error decoding token: ", error)
            setIsLoggedIn(false)
            navigate("/login")
          }
        } else {
          console.warn("No token found in localStorage, redirecting to login.")
          setIsLoggedIn(false)
          navigate("/login")
        }
      }
    }
  }, [isLoggedIn, navigate, userData, setIsLoggedIn])

  const handleLogout = () => {
    console.info("User logging out...")

    Cookies.remove("authToken")
    Cookies.remove("Pseudo")
    Cookies.remove("loggedInUtilisateur")

    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="pageProfil">
        <h1 className="bienvenueName">
          Bienvenue {utilisateur ? utilisateur.pseudo : "Chargement..."}
        </h1>

        <div className="boutonSwitch">
          <p>Tableau de bord des parties</p>
          <ToggleSwitch
            isChecked={showListeParties}
            onChange={() => setShowListeParties(!showListeParties)}
          />
          <p>Modifier mon profil</p>
        </div>

        <button className="logoutButton" onClick={handleLogout}>
          Se déconnecter
        </button>

        <div className="globalBoxProfil">
          {showListeParties ? (
            <p>Les parties seront affichées ici.</p>
          ) : (
            utilisateur && (
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
