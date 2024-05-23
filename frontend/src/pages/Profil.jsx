import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import "react-toastify/dist/ReactToastify.css"
import Toggle from "../components/Toggle.jsx"
import NavBar from "../components/NavBar"
import ModificationProfil from "../components/DataPourProfil/ModificationProfil copy.jsx"
import AffichageParties from "../components/DataPartiesPourProfil/AffichageParties.jsx"
import "./Profil.scss"

export default function Profil() {
  const tokenFromCookie = Cookies.get("authToken")
  // const [utilisateur, setUtilisateur] = useState({})

  const [showBoxListeParties, setShowBoxListeParties] = useState(true)

  useEffect(() => {
    // Vous devez récupérer les données de l'utilisateur ici
    // par exemple, en faisant une requête axios
    // et ensuite, définir l'utilisateur avec setUtilisateur
  }, [])

  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <h1 className="bienvenurName"> Bienvenue {/* {utilisateur.Pseudo} */}</h1>
      <div className="bouttonSwitch">
        <p> Tableau de bord des parties</p>
        <Toggle onClick={() => setShowBoxListeParties(!showBoxListeParties)} />
        <p> Modifier mon profil</p>
      </div>
      <div className="globalBoxProfil">
        {showBoxListeParties ? (
          <AffichageParties headers={headers} />
        ) : (
          <ModificationProfil headers={headers} />
        )}
      </div>
    </>
  )
}
