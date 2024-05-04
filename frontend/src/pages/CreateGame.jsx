import axios from "axios"
import React, { useState } from "react"
import Cookies from "js-cookie"
import { toast, ToastContainer } from "react-toastify"
import he from "he"

import "react-toastify/dist/ReactToastify.css"
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
    // Encodage de la description avec he.encode
    const encodedDesc = he.encode(desc)
    const encodedRpgName = he.encode(rpgName)
    const encodedTypeOfGame = he.encode(typeOfGame)
    const encodedPlace = he.encode(place)
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/partie`,
        {
          Titre: encodedRpgName,
          Date: date,
          Heure: hour,
          Lieu: encodedPlace,
          MaitreDuJeu: idUser,
          Description: encodedDesc,
          TypeDeJeux: encodedTypeOfGame,
          NombreJoueur: playersCapacity,
        },
        { headers }
      )
      .then((res) => {
        console.info("Partie en cours !")
        if (res.status === 200 || res.status === 201) {
          toast.success("Partie créée avec succès !")
        }
        document.getElementById("createGameForm").reset()
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la partie :", error)
        console.info("Erreur lors de la création de la partie")
      })
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="createGameGlobal">
        <div className="boxPictureOrc">
          {/* <img src={orc} alt="portrait d'un orc" className="orcPicture" /> */}
          <h1> Créer ton aventure : </h1>
          <p>
            Oyé Oyé talentueux maitre du jeux, cette espace t'es dédier afin que
            tu puisse créer tes parties. Elles serons visible de tous alors
            soigne ton écriture et recrute des joueurs pour une aventure épique.
          </p>
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

            <input type="date" onChange={(e) => setDate(e.target.value)} />
            <input type="time" onChange={(e) => setHour(e.target.value)} />
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
        <ToastContainer />
      </div>
    </>
  )
}
