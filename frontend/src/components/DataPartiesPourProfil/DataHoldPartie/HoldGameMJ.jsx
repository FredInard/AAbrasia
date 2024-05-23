import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"

import "react-toastify/dist/ReactToastify.css"

import "./HoldGameMJ.scss"

export default function HoldGameMJ() {
  const [meneurParties, setMeneurParties] = useState([])

  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)
  const [allParticipants, setAllParticipants] = useState({})
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  // Fonction pour filtrer les parties selon les critères donnés
  const filterParties = (parties) => {
    return parties.filter((partie) => new Date(partie.Date) < new Date())
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/meneur/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        const parties = filterParties(res.data)
        setMeneurParties(parties)

        // Récupérer les participants pour chaque partie
        const participantsPromises = parties.map((partie) => {
          return axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/displayPlayers/${
              partie.id
            }`,
            { headers }
          )
        })

        Promise.all(participantsPromises)
          .then((responses) => {
            const participantsData = responses.map((response, index) => ({
              partieId: parties[index].id,
              participants: response.data,
            }))
            const participantsMap = {}
            participantsData.forEach(({ partieId, participants }) => {
              participantsMap[partieId] = participants
            })
            setAllParticipants(participantsMap)
          })
          .catch((error) => {
            console.error(
              "Une erreur s'est produite lors de la récupération des participants.",
              error
            )
          })
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties meneurs", err)
      })
  }, [])

  return (
    <>
      {meneurParties.length > 0 && (
        <div className="boxCardsResumPartieMeneur">
          <h2>Mes parties en tant que meneur :</h2>
          {meneurParties.map((meneurPartie) => (
            <div key={meneurPartie.id}>
              <div className="cardResumMeneurParties">
                <h2>{meneurPartie.Titre}</h2>
                <p>Type : {meneurPartie.TypeDeJeux}</p>
                <p>Date : {meneurPartie.Date}</p>
                <p>Lieu : {meneurPartie.Lieu}</p>
                <p>Nombre de Joueur : {meneurPartie.NombreJoueur}</p>
                <p>Description : {meneurPartie.Description}</p>
                <p>Liste des participants:</p>
                <div className="mapParticipants">
                  {allParticipants[meneurPartie.id] &&
                  allParticipants[meneurPartie.id].length > 0 ? (
                    allParticipants[meneurPartie.id].map((participant) => (
                      <div
                        className="mapPhotoProfileParticipant"
                        key={participant.id}
                      >
                        <img
                          className="photoProfileParticipant"
                          src={`${import.meta.env.VITE_BACKEND_URL}/${
                            participant.PhotoProfil
                          }`}
                          alt="photo de profil de l'utilisateur"
                        />
                        <div className="mapPseudoParticipant">
                          <div className="pseudoParticipant">
                            {participant.Pseudo}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Chargement en cours...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
