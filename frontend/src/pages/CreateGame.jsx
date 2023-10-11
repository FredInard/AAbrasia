import axios from "axios"
import React, { useState } from "react"
import Cookies from "js-cookie"
import "./CreateGame.scss"

import NavBar from "../components/NavBar"

export default function CreateGame() {
  const [rpgName, setRpgName] = useState("")
  const [typeOfGame, setTypeOfGame] = useState("")
  const [date, setDate] = useState("")
  const [hour, setHour] = useState("")
  const [place, setPlace] = useState("")
  const [playersCapacity, setPlayersCapacity] = useState("")
  const [desc, setDesc] = useState("")

  const tokenFromCookie = Cookies.get("authToken")
  const idUser = Cookies.get("idUtilisateur")

  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const handleCreateGame = (e) => {
    e.preventDefault()
    axios
      .post(
        "http://localhost:4242/partie",
        {
          Titre: rpgName,
          Date: date,
          Heure: hour,
          Lieu: place,
          MaitreDuJeu: idUser,
          Description: desc,
          TypeDeJeux: typeOfGame,
          NombreJoueur: playersCapacity,
        },
        { headers }
      )
      .then((res) => {
        if (res.status === 200) {
          console.info("Partie créée avec succès !")
        }
        document.getElementById("createGameForm").reset()
        // document.getElementById("createGameSelecter").selectedIndex = 0
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la partie :", error)
      })
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="createGameGlobal">
        <div className="boxPictureOrc">
          {/* <img src={orc} alt="portrait d'un orc" className="orcPicture" /> */}
        </div>
        <form
          className="createGameForm"
          id="createGameForm"
          onSubmit={handleCreateGame}
        >
          <div className="createGameInputs">
            <input
              type="text"
              placeholder="Nom de ton aventure"
              onChange={(e) => setRpgName(e.target.value)}
            />

            <input
              type="datetime-local"
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time-local"
              onChange={(e) => setHour(e.target.value)}
            />
            <input
              type="text"
              placeholder="Lieu"
              onChange={(e) => setPlace(e.target.value)}
            />
            <input
              type="text"
              placeholder="Capacité max"
              onChange={(e) => setPlayersCapacity(e.target.value)}
            />
            <input
              type="text"
              placeholder="type de jeux"
              onChange={(e) => setTypeOfGame(e.target.value)}
            />
            <input
              type="textDescriptionOrc"
              placeholder="description"
              onChange={(e) => setDesc(e.target.value)}
            />
            <button type="submit">Créer ma partie</button>
          </div>
        </form>
      </div>
    </>
  )
}
