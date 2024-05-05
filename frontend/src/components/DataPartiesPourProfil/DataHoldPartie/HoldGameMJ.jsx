import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"

import "react-toastify/dist/ReactToastify.css"

import "./HoldGameMJ.scss"

export default function HoldGameMJ() {
  const [meneurParties, setMeneurParties] = useState([])

  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)

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
        setMeneurParties(filterParties(res.data))
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
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
