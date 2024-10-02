import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
// import Cookies from "js-cookie"
import "./NavBar.scss"
import { AuthContext } from "../../services/AuthContext"
import logo from "../../assets/pics/logoArpenteurBlanc.svg"
import ToggleTheme from "../ToggleTheme/ToggleTheme"

const NavBar = () => {
  const { isLoggedIn } = useContext(AuthContext)

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
        <li>
          <NavLink
            to="/creer-partie"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Créer partie
          </NavLink>
        </li>
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
      </ul>
      <div className="navbar-cta">
        {isLoggedIn ? (
          <NavLink to="/profil" className="btn-cta">
            Mon Profil
          </NavLink>
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
