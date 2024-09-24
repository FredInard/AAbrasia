import React from "react"
import { NavLink } from "react-router-dom" // Utilisation de NavLink pour la navigation
import "./NavBar.scss"
import logo from "../../assets/pics/logoArpenteurBlanc.svg"
import ToggleTheme from "../ToggleTheme/ToggleTheme"

const NavBar = () => {
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
          <NavLink to="/creer-partie" activeClassName="active">
            Créer partie
          </NavLink>
        </li>
        <li>
          <NavLink to="/association" activeClassName="active">
            L'association
          </NavLink>
        </li>
        <li>
          <NavLink to="/equipe" activeClassName="active">
            L'équipe
          </NavLink>
        </li>
      </ul>
      <div className="navbar-cta">
        <NavLink to="/login" className="btn-cta">
          Se connecter
        </NavLink>
      </div>
    </nav>
  )
}

export default NavBar
