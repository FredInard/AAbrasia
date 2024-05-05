import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "react-toastify/dist/ReactToastify.css"

import "./HoldGamePlayer.scss"

export default function HoldGamePlayer() {
  const [parties, setParties] = useState([])
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
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/profil/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        setParties(filterParties(res.data))
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [])

  return (
    <>
      <div className="boxResumeParties fade-in-right"></div>
      {parties.length > 0 && (
        <div className="boxCardsResumPartie">
          <h2>Mes parties :</h2>
          {parties.map((partie) => (
            <div key={partie.id}>
              <div className="cardResumPartie">
                <h2>{partie.Titre}</h2>
                <p>Type : {partie.TypeDeJeux}</p>
                <p>Date : {partie.Date}</p>
                <p>Lieu : {partie.Lieu}</p>
                <p>Nombre de Joueur : {partie.NombreJoueur}</p>
                <p>Description : {partie.Description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
