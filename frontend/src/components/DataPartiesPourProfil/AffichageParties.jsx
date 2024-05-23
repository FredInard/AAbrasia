import React, { useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ListePartieJoueur from "./DataPatiesJoueur/ListePartieJoueur.jsx"
import MeneurParties from "./DataPartieMJ/MeneurParties.jsx"
import HoldGameMJ from "../DataPartiesPourProfil/DataHoldPartie/HoldGameMJ.jsx"
import HoldGamePlayer from "../DataPartiesPourProfil/DataHoldPartie/HoldGamePlayer.jsx"

import "./AffichageParties.scss"

export default function AffichageParties() {
  // États pour gérer l'état des boutons
  const [showPlayerParties, setShowPlayerParties] = useState(true)
  const [showMjParties, setShowMjParties] = useState(false)
  const [showOldParties, setShowOldParties] = useState(false)

  return (
    <>
      <div className="globalBoxProfil">
        <div className="boxListeParties ">
          <div className="boxPictureLeft fade-in-left"></div>
          <div className="boxListeGame">
            <div className="boxResumeParties fade-in-right">
              <div className="buttonContainer">
                {/* Bouton 1 : Afficher les parties joueurs */}
                <button
                  className="filterButton"
                  onClick={() => {
                    setShowPlayerParties(true)
                    setShowMjParties(false)
                  }}
                >
                  Affiche tes parties joueurs
                </button>
                {/* Bouton 2 : Afficher les parties MJ */}
                <button
                  className="filterButton"
                  onClick={() => {
                    setShowPlayerParties(false)
                    setShowMjParties(true)
                  }}
                >
                  Affiche tes parties MJ
                </button>
                {/* Bouton 3 : Afficher les anciennes parties */}
                <label className="checkboxLabel">
                  <input
                    type="checkbox"
                    checked={showOldParties}
                    onChange={() => setShowOldParties(!showOldParties)}
                  />
                  Affiche tes anciennes parties uniquement
                </label>
              </div>

              {/* Condition de rendu pour les composants en fonction de l'état des boutons */}
              {showPlayerParties && !showMjParties && !showOldParties && (
                <ListePartieJoueur />
              )}
              {!showPlayerParties && showMjParties && !showOldParties && (
                <MeneurParties />
              )}
              {!showPlayerParties && !showMjParties && showOldParties && (
                <HoldGamePlayer />
              )}
              {!showPlayerParties && showMjParties && showOldParties && (
                <HoldGameMJ />
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
