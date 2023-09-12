import "./CartePartie.scss"
import playerIcon from "../assets/pics/playerIcon.svg"

function CartePartie({ parties, utilisateurs }) {
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

  return (
    <div className="globalContainerCard">
      <div className="boxInfoGlobalCard">
        <div className="titleContainerCard">{parties.Titre}</div>
        <div className="miniBoxInfo">
          <div className="infoItem"> Date : {formattedDate}</div>
          <div className="infoItem">Heure : {formattedTime}</div>
          <div className="infoItem">Lieu : {parties.Lieu}</div>
          <div className="infoItem">
            Maitre du jeux : {maitreDuJeu ? maitreDuJeu.Pseudo : "xxx"}
          </div>
          {/* <div className="infoItem">{parties.Description}</div> */}

          <div className="infoItem">Type : {parties.TypeDeJeux}</div>
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
