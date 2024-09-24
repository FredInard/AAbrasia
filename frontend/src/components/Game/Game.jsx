import React, { useState } from "react"
import Game from "./Game"
import GameDetails from "./GameDetails"

const ParentComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  const handleGameClick = (game) => {
    setSelectedGame(game)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  // Exemple de données pour un jeu
  const gameData = {
    title: "Titre de la Partie",
    description: "Lorem ipsum dolor sit amet...",
    time: "19h30",
    location: "ECE Mallijai",
    maxPlayers: 5,
    gameMasterPhoto: "/path/to/photo.jpg",
    gameMasterPseudo: "Pseudo",
    participants: [
      { name: "Katia", photo: "/path/to/katia.jpg" },
      { name: "Maria", photo: "/path/to/maria.jpg" },
      { name: "Mathieu", photo: "/path/to/mathieu.jpg" },
    ],
    extraInfo: [
      "Katia propose un covoiturage de Sisteron à Manosque départ 18h.",
      "Maria ramène 1 Pizza et 1 bouteille de lait de coco.",
      "Mathieu ramène 1 Pizza et 1 bouteille de lait de coco.",
    ],
  }

  return (
    <div>
      {/* Game component */}
      <Game
        title={gameData.title}
        maxPlayers={gameData.maxPlayers}
        gameMasterPhoto={gameData.gameMasterPhoto}
        onClick={() => handleGameClick(gameData)}
      />

      {/* GameDetails modal */}
      <GameDetails
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
}

export default ParentComponent
