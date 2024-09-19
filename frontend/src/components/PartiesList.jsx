import React from "react"
import LogoPlayers from "../assets/pics/playerIcon.svg"

// Fonction utilitaire pour comparer deux dates (jour, mois, année)
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Composant pour afficher la liste des parties pour une date donnée
function PartiesList({ parties, selectedDate, onPostClick }) {
  // Filtre les parties pour la date sélectionnée
  const filteredParties = parties.filter((event) => {
    const eventDate = new Date(event.start)
    const selected = new Date(selectedDate)
    return isSameDay(eventDate, selected)
  })

  // Si aucune partie n'est programmée pour cette date
  if (filteredParties.length === 0) {
    return (
      <div className="no-events-message">
        Désolé, il n'y a pas encore de partie programmée pour cette date.
      </div>
    )
  }

  // Affichage des cartes de parties
  return (
    <div className="containeurCards">
      {filteredParties.map((event) => (
        <div
          key={event.id}
          className="globalContainerCard"
          onClick={() => onPostClick(event.extendedProps.partieData)}
        >
          {/* Section de gauche : Maître du Jeu */}
          <div className="leftSection">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/${
                event.extendedProps.partieData.PhotoProfilMaitreDuJeu
              }`}
              alt="Photo du Maître du Jeu"
              className="maitre-du-jeu-photo"
            />
            <div className="infoItem">
              {event.extendedProps.partieData.PseudoMaitreDuJeu}
            </div>
          </div>

          {/* Section centrale : Titre de la partie */}
          <div className="centerSection">
            <div className="titleContainerCard">{event.title}</div>
          </div>

          {/* Section de droite : Nombre de joueurs */}
          <div className="rightSection">
            <div className="logoPlayerAndMaxPlayer">
              <img
                className="logoPlayer"
                src={LogoPlayers}
                alt="logo d'un joueur"
              />
              X{event.extendedProps.partieData.NombreJoueur}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PartiesList
