import React, { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../../AuthContext"
import "./NavBar.scss"
import logo from "../../assets/pics/logoArpenteurBlanc.svg"
import ToggleTheme from "../ToggleTheme/ToggleTheme"

const NavBar = () => {
  const { isLoggedIn, userRole, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/") // Rediriger vers la page d'accueil après la déconnexion
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src={logo} alt="Logo de l'association" />
        </NavLink>
      </div>
      <ToggleTheme />
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Accueil
          </NavLink>
        </li>
        {isLoggedIn && (
          <li>
            <NavLink
              to="/creer-partie"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Créer partie
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/association"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            L'association
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/equipe"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            L'équipe
          </NavLink>
        </li>
        {userRole === "admin" && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Administration
            </NavLink>
          </li>
        )}
      </ul>
      <div className="navbar-cta">
        {isLoggedIn ? (
          <>
            <NavLink to="/profil" className="btn-cta">
              Mon Profil
            </NavLink>
            <button onClick={handleLogout} className="btn-cta logout-button">
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn-cta">
            Se connecter
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default NavBar
