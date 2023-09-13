import React, { useState, useEffect } from "react"
import "./CartePartie.scss"
import playerIcon from "../assets/pics/playerIcon.svg"

function CartePartie({ parties, utilisateurs }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Fonction pour gérer l'ouverture/fermeture de la carte étendue
  const toggleCardExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  // Convertir la date au format souhaité
  const formattedDate = new Date(parties.Date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  // Extraire l'heure et les minutes de la chaîne de caractères parties.Heure
  const heureMinutes = parties.Heure.split(":")
  const formattedTime = `${heureMinutes[0]}:${heureMinutes[1]}`

  // Recherche du pseudo du maître du jeu en fonction de son ID
  const maitreDuJeu = utilisateurs.find(
    (utilisateur) => utilisateur.id === parties.MaitreDuJeu
  )

  // Requête SQL simulée pour obtenir les joueurs de la partie (utilisez votre propre logique ici)
  const fetchPlayers = async () => {
    // Simulez une requête SQL
    const response = await fetch(`/votre-endpoint-sql?idPartie=${parties.id}`)
    const data = await response.json()
    return data
  }

  const [players, setPlayers] = useState([])

  useEffect(() => {
    // Chargez les joueurs lorsque la carte est étendue
    if (isExpanded) {
      fetchPlayers().then((data) => {
        setPlayers(data)
      })
    }
  }, [isExpanded])

  return (
    <div
      className={`globalContainerCard ${isExpanded ? "expanded" : ""}`}
      onClick={toggleCardExpansion}
    >
      <div className="boxInfoGlobalCard">
        <div className="titleContainerCard">{parties.Titre}</div>
        <div className="miniBoxInfo">
          <div className="infoItem"> Date : {formattedDate}</div>
          <div className="infoItem">Heure : {formattedTime}</div>
          <div className="infoItem">Lieu : {parties.Lieu}</div>
          {maitreDuJeu && (
            <div className="infoItem">Maitre du jeu : {maitreDuJeu.Pseudo}</div>
          )}
          {isExpanded && (
            <>
              <div className="infoItem">Type : {parties.TypeDeJeux}</div>
              <div className="infoItem">
                Description : {parties.Description}
              </div>
              <div className="infoItem">Joueurs :</div>
              <ul>
                {players.map((player) => (
                  <li key={player.id}>{player.Nom}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="boxPlayerAndInfoCard">
        <div className="boxMaxPlayerCard">
          <img
            src={playerIcon}
            className="playerIcon"
            alt="brush bas pour fondue image de scene"
          />
          <div className="NombreJoueur">X{parties.NombreJoueur}</div>
        </div>
        <div className="boxInfoCard"></div>
      </div>
    </div>
  )
}

export default CartePartie
