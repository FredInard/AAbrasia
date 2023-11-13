// importations (à compléter selon vos besoins)

import React, { useEffect, useState } from "react"
import axios from "axios"
import "./JoueursComponent.scss"
import Cookies from "js-cookie"
import poubelleIcon from "../assets/pics/poubel.png"

function JoueursComponent() {
  const [joueurs, setJoueurs] = useState([])
  const [editingPlayer, setEditingPlayer] = useState(null)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const handleEditPlayer = (player) => {
    setEditingPlayer(player)
  }

  const handleUpdatePlayer = (player) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${player.id}`,
        player,
        { headers }
      )
      .then((response) => {
        setJoueurs((prevJoueurs) =>
          prevJoueurs.map((p) => (p.id === player.id ? player : p))
        )
        setEditingPlayer(null)
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du joueur :", error)
      })
  }

  const handleDeletePlayer = (playerId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${playerId}`, {
        headers,
      })
      .then((response) => {
        setJoueurs((prevJoueurs) =>
          prevJoueurs.filter((p) => p.id !== playerId)
        )
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du joueur :", error)
      })
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs`, { headers })
      .then((response) => {
        setJoueurs(response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des joueurs :", error)
      })
  }, [])

  return (
    <div className="globalDivTableau">
      <h1 className="joueursComponentH1">Liste des Joueurs</h1>
      <table className="globalDivTable">
        <thead className="ligneDesTitres">
          <tr className="classTh">
            <th className="classTh">ID</th>
            <th className="classTh">Nom</th>
            <th className="classTh">Prénom</th>
            <th className="classTh">Pseudo</th>
            <th className="classTh">Mail</th>
            <th className="classTh">Admin</th>
            <th className="classTh">M.Equipe</th>
            <th className="classTh">M.Asso</th>
            <th className="classTh">hashedPassword</th>
            <th className="classTh">Ville</th>
            <th className="classTh">PhotoProfil</th>
            <th className="classTh">Description</th>
            <th className="classTh">Discord</th>
            <th className="classTh">Telephone</th>
            <th className="classTh">Actions</th>
          </tr>
        </thead>
        <tbody className="classTbody">
          {joueurs.map((player) => (
            <tr className="classTh" key={player.id}>
              <td className="celluleTd">{player.id}</td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Nom}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Nom: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Nom
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Prenom}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Prenom: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Prenom
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Pseudo}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Pseudo: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Pseudo
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Mail}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Mail: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Mail
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Admin}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Admin: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Admin
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.MembreEquipe}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        MembreEquipe: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.MembreEquipe
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.MembreAssociation}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        MembreAssociation: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.MembreAssociation
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.hashedPassword}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        hashedPassword: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.hashedPassword
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.VilleResidence}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        VilleResidence: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.VilleResidence
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.PhotoProfil}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        PhotoProfil: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.PhotoProfil
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Description}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Description: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Description
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.PseudoDiscord}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        PseudoDiscord: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.PseudoDiscord
                )}
              </td>
              <td className="celluleTd">
                {editingPlayer?.id === player.id ? (
                  <input
                    type="text"
                    value={editingPlayer.Telephone}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        Telephone: e.target.value,
                      })
                    }
                  />
                ) : (
                  player.Telephone
                )}
              </td>
              <td className="celluleTd">
                <button onClick={() => handleEditPlayer(player)}>
                  Modifier
                </button>
                {editingPlayer?.id === player.id && (
                  <button onClick={() => handleUpdatePlayer(editingPlayer)}>
                    Valider
                  </button>
                )}
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="buttonJoueursComponent"
                >
                  <img
                    src={poubelleIcon}
                    alt="Supprimer"
                    className="poubelJoueursComponent"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JoueursComponent
