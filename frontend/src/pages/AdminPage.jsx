import React, { useState } from "react"
import JoueursComponent from "../components/JoueursComponent" // Importez le composant Joueurs
import PartiesComponent from "../components/PartiesComponent" // Importez le composant Parties
import ParticipationsComponent from "../components/ParticipationsComponent" // Importez le composant Participations
import "./AdminPage.scss"
import NavBar from "../components/NavBar"

function AdminPage() {
  const [activeTab, setActiveTab] = useState("joueurs") // Utilisez l'état local pour suivre l'onglet actif

  const handleTabClick = (tabName) => {
    setActiveTab(tabName)
  }
  console.info("hello ")
  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="globalDivAdminPage">
        <h1 className="adminPageH1">Page d'administration</h1>
        <div className="admin-buttons">
          <button onClick={() => handleTabClick("joueurs")}>Joueurs</button>
          <button onClick={() => handleTabClick("parties")}>Parties</button>
          <button onClick={() => handleTabClick("participations")}>
            Participations
          </button>
        </div>
        <div className="admin-content">
          {activeTab === "joueurs" && <JoueursComponent />}
          {activeTab === "parties" && <PartiesComponent />}
          {activeTab === "participations" && <ParticipationsComponent />}
        </div>
      </div>
    </>
  )
}

export default AdminPage
