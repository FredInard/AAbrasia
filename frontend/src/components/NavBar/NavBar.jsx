import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import jwtDecode from "jwt-decode"
import "./NavBar.scss"
import logo from "../../assets/pics/logoArpenteurBlanc.svg"
import ToggleTheme from "../ToggleTheme/ToggleTheme"

const NavBar = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false) // État pour le menu burger

  // Récupérer le token depuis localStorage
  const token = localStorage.getItem("authToken")
  let authData = {
    isAuthenticated: false,
    role: null,
  }

  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp > currentTime) {
        authData = {
          isAuthenticated: true,
          role: decodedToken.role,
        }
      } else {
        // Token expiré
        localStorage.removeItem("authToken")
        navigate("/login")
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err)
      localStorage.removeItem("authToken")
      navigate("/login")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/") // Rediriger vers la page d'accueil après la déconnexion
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logo} alt="Logo de l'association" />
        </NavLink>
      </div>
      <ToggleTheme />
      <button className="menu-toggle" onClick={toggleMenu}>
        {/* Bouton menu burger */}
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : undefined)}
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </NavLink>
        </li>
        {authData.isAuthenticated && (
          <li>
            <NavLink
              to="/creer-partie"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              onClick={() => setIsMenuOpen(false)}
            >
              Créer partie
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/association"
            className={({ isActive }) => (isActive ? "active" : undefined)}
            onClick={() => setIsMenuOpen(false)}
          >
            L'association
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/equipe"
            className={({ isActive }) => (isActive ? "active" : undefined)}
            onClick={() => setIsMenuOpen(false)}
          >
            L'équipe
          </NavLink>
        </li>
        {authData.role === "admin" && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              onClick={() => setIsMenuOpen(false)}
            >
              Administration
            </NavLink>
          </li>
        )}
      </ul>
      <div className="navbar-cta">
        {authData.isAuthenticated ? (
          <>
            <NavLink
              to="/profil"
              className="btn-cta"
              onClick={() => setIsMenuOpen(false)}
            >
              Mon Profil
            </NavLink>
            <button
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className="btn-cta logout-button"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="btn-cta"
            onClick={() => setIsMenuOpen(false)}
          >
            Se connecter
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default NavBar
