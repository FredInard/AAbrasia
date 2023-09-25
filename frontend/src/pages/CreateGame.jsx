import axios from "axios"
import React, { useEffect, useState } from "react"
// import Cookies from "js-cookie"

export default function CreateGame() {
  const [rpgName, setRpgName] = useState("")
  const [gm, setGm] = useState("")
  const [date, setDate] = useState("")
  const [hour, setHour] = useState("")
  const [place, setPlace] = useState("")
  const [playersCapacity, setPlayersCapacity] = useState("")
  const [desc, setDesc] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:4242/partie")
      .then((res) => setRpgName(res.data))
  }, [])

  const handleCreateUser = (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:4242/partie", {
        Name: rpgName,
        Date: date,
        heure: hour,
        lieu: place,
        MaitreDuJeux: gm,
        Description: desc,
        NombreJoueur: playersCapacity,
      })
      .then((res) => {
        if (res.status === 200) {
          console.info("Partie créée avec succès !")
        }
        document.getElementById("createGameForm").reset()
        document.getElementById("createGameSelecter").selectedIndex = 0
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la partie :", error)
      })
  }

  return (
    <main id="createGameGlobal">
      <form id="createGameForm" onSubmit={handleCreateUser}>
        <div id="createGameInputs">
          <input
            type="text"
            placeholder="id du GM"
            onChange={(e) => setGm(e.target.value)}
          />

          <input
            type="text"
            placeholder="Nom de ton aventure"
            onChange={(e) => rpgName(e.target.value)}
          />

          <input
            type="datetime-local"
            onChange={(e) => setDate(e.target.value)}
          />
          <input type="time-local" onChange={(e) => setHour(e.target.value)} />
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
            placeholder="description"
            onChange={(e) => setDesc(e.target.value)}
          />
          <button type="submit">Créer ma partie</button>
        </div>
      </form>
    </main>
  )
}
