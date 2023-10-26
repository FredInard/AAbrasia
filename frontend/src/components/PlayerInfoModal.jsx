// import React, { useState } from "react"
// import axios from "axios"
// import Cookies from "js-cookie"
import "./PlayerInfoModal.scss"

export default function PlayerInfoModal({ player, isOpen, onClose }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modalPlayer">
      <div className="modalPlayer-content">
        <span className="closeModalPlayer" onClick={onClose}>
          &times;
        </span>
        <h2 className="h2infoModalProfil">Informations du joueur</h2>
        <img
          className="photoPofilModal"
          src={`${import.meta.env.VITE_BACKEND_URL}/${player.PhotoProfil}`}
          alt="photo de profil de l'utilisateur"
        />
        <div className="infoModalProfil">
          <p className="pModalProfil">
            <strong>Prenom</strong>: {player.Prenom}
          </p>
          <p className="pModalProfil">
            <strong>Pseudo</strong>: {player.Pseudo}
          </p>
          <p className="pModalProfil">
            <strong>PseudoDiscord</strong>: {player.PseudoDiscord}
          </p>
          <p className="pModalProfil">
            <strong>VilleResidence</strong>: {player.VilleResidence}
          </p>
          <p className="pModalProfil">
            <strong>Telephone</strong>: {player.Telephone}
          </p>
          <p className="pModalProfil">
            <strong>Description</strong>: {player.Description}
          </p>
        </div>
      </div>
    </div>
  )
}
