import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import logoSeul from "../assets/pics/logoSeul.svg"
import "./NavBar.scss"
import Cookies from "js-cookie"
import axios from "axios"

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [navBackgroundColor, setNavBackgroundColor] = useState("transparent")
  const [utilisateur, setUtilisateur] = useState({})
  const idUser = Cookies.get("idUtilisateur")
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/profil/${idUser}`,
        { headers }
      )
      .then((res) => setUtilisateur(res.data))
      .catch((err) => {
        console.error("Problème lors du chargement de l'utlisateur", err)
      })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      // Récupérez la position de défilement verticale
      const scrollY = window.scrollY

      // Déterminez la limite à partir de laquelle vous souhaitez changer la couleur de fond
      const scrollThreshold = 100 // Vous pouvez ajuster cette valeur selon vos besoins

      // Si la position de défilement dépasse la limite, changez la couleur de fond
      if (scrollY > scrollThreshold) {
        setNavBackgroundColor("rgb(6, 1, 39)")
      } else {
        setNavBackgroundColor("transparent")
      }
    }

    // Ajoutez le gestionnaire d'événements à la fenêtre
    window.addEventListener("scroll", handleScroll)

    // Assurez-vous de retirer le gestionnaire d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className="navBarDesktopContainer header"
      style={{ backgroundColor: navBackgroundColor }}
    >
      <div className="boxlogoNavBar">
        <img
          className="logoNavBar logo"
          src={logoSeul}
          alt="logo of website in the navbar"
        />
      </div>
      {isMobile && (
        <button className="menuButton" onClick={toggleMenu}>
          {isMenuOpen ? "Fermer" : "Menu"}
        </button>
      )}
      {isMenuOpen && isMobile && (
        <div className="menuItems">
          <Link className="menuItem menuItem-2" to="/">
            Home
          </Link>
          <Link className="menuItem menuItem-2" to="/Inscription">
            Inscription
          </Link>
          <Link className="menuItem menuItem-2" to="/create-game">
            Créer ta partie
          </Link>
          <Link className="menuItem menuItem-2" to="/Association">
            L'Association
          </Link>
          {/* <Link className="menuItem menuItem-2" to="/Creation">
            Création
          </Link> */}
          <Link className="menuItem menuItem-2" to="/profil">
            <img
              className="photoProfilUserNavBar"
              src={`${import.meta.env.VITE_BACKEND_URL}/${
                utilisateur.PhotoProfil
              }`}
              alt="photo de profil de l'utilisateur"
            />
          </Link>
        </div>
      )}
      {!isMobile && (
        <div className="mainButtonsNavBar">
          <Link className="buttonNavBar nav-item" to="/">
            <p>HOME</p>
          </Link>
          <Link className="buttonNavBar nav-item" to="/Inscription">
            <p>Inscription</p>
          </Link>
          <Link className="buttonNavBar nav-item" to="/Association">
            <p>L'Association</p>
          </Link>
          {/* <Link className="buttonNavBar nav-item" to="/Creation">
            <p>Création</p>
          </Link> */}

          {idUser ? (
            <>
              <Link className="buttonNavBar nav-item" to="/create-game">
                <p>Créer ta partie</p>
              </Link>
              <Link
                className="buttonNavBar nav-item boxPhotoProfil"
                to="/profil"
              >
                <img
                  className="photoProfilNB"
                  src={`${import.meta.env.VITE_BACKEND_URL}/${
                    utilisateur.PhotoProfil
                  }`}
                  alt="photo de profil de l'utilisateur"
                />
              </Link>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default NavBar
