import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import logoSeul from "../assets/pics/logoSeul.svg"
import "./NavBar.scss"

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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

  return (
    <div className="navBarDesktopContainer header">
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
          <Link className="menuItem menuItem-2" to="/profil">
            Profil
          </Link>
          <Link className="menuItem menuItem-2" to="/create-game">
            Créer ta partie
          </Link>
          <Link className="menuItem menuItem-2" to="/Association">
            L'Association
          </Link>
          <Link className="menuItem menuItem-2" to="/Creation">
            Création
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
          <Link className="buttonNavBar nav-item" to="/profil">
            <p>Profil</p>
          </Link>
          <Link className="buttonNavBar nav-item" to="/create-game">
            <p>Créer ta partie</p>
          </Link>
          <Link className="buttonNavBar nav-item" to="/Association">
            <p>L'Association</p>
          </Link>
          <Link className="buttonNavBar nav-item" to="/Creation">
            <p>Création</p>
          </Link>
        </div>
      )}
    </div>
  )
}

export default NavBar
