import { Link } from "react-router-dom"

import logo from "../assets/pics/logo.png"

import "./NavBar.scss"

function NavBar() {
  return (
    <>
      <div className="navBarDesktopContainer">
        <div className="boxlogoNavBar">
          <img
            className="logoNavBar"
            src={logo}
            alt="logo of website in the navbar"
          />
        </div>
        <div className="mainButtonsNavBar">
          <Link className="buttonNavBar" to="/">
            <p>HOME</p>
          </Link>
          <Link className="buttonNavBar" to="/Inscription">
            <p>Inscription</p>
          </Link>
          <Link className="buttonNavBar" to="/profil">
            <p>Profil</p>
          </Link>
          <Link className="buttonNavBar" to="/create-game">
            <p>Créer ta partie</p>
          </Link>
          <Link className="buttonNavBar" to="/Association">
            <p>L'Assocation</p>
          </Link>
          <Link className="buttonNavBar" to="/Creation">
            <p>Création</p>
          </Link>
          {/* <p>Agenda des parties</p>
                <Link to="/Creation">
                    <p>LOG OUT</p>
                </Link>     */}
        </div>
      </div>
    </>
  )
}

export default NavBar
