// import React, { useState } from "react"
import "./CartePartie.scss"
import playerIcon from "../assets/pics/playerIcon.svg"

function CartePartie({ parties }) {
  // Convertir la date au format souhaité
  const formattedDate = new Date(parties.Date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  // Extraire l'heure et les minutes de la chaîne de caractères parties.Heure
  const heureMinutes = parties.Heure.split(":")
  const formattedTime = `${heureMinutes[0]}:${heureMinutes[1]}`

  return (
    <div className="globalContainerCard">
      <div className="boxInfoGlobalCard">
        <div className="titleContainerCard">{parties.Titre}</div>
        <div className="miniBoxInfo">
          <div className="infoItem"> Date : {formattedDate}</div>
          <div className="infoItem">Heure : {formattedTime}</div>
          <div className="infoItem">Lieu : {parties.Lieu}</div>
          <div className="infoItem">
            Maitre du jeu : {parties.PseudoMaitreDuJeu}
          </div>
          <div className="infoItem">Type : {parties.TypeDeJeuxPartie}</div>
          <div className="infoItem">
            Description : {parties.DescriptionPartie}
          </div>
          <div className="infoItem">Joueurs :</div>
        </div>
      </div>
      <div className="boxPlayerAndInfoCard">
        <div className="boxMaxPlayerCard">
          <img
            src={playerIcon}
            className="playerIcon"
            alt="icone d'un joueur"
          />
          <div className="NombreJoueur">X{parties.NombreJoueur}</div>
        </div>
        <div className="boxInfoCard"></div>
      </div>
    </div>
  )
}

export default CartePartie
