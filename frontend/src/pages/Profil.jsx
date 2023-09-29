import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"

import "./Profil.scss"

import NavBar from "../components/NavBar"

export default function profil() {
  const idUser = Cookies.get("idUtilisateur")

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/profil/${idUser}`,
        { headers }
      )
      .then((res) => setUtilisateur(res.data))
      .catch((err) => {
        console.error("Problème lors du chargement de l'utlisateur", err)
      })
  }, [])

  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }
  const [utilisateur, setUtilisateur] = useState({})
  const [nom, setNom] = useState(utilisateur.Nom)
  const [prenom, setPrenom] = useState(utilisateur.Prenom)
  const [pseudo, setPseudo] = useState(utilisateur.Pseudo)
  const [mail, setMail] = useState(utilisateur.Mail)
  const [telephone, setTelephone] = useState(utilisateur.Telephone)
  const [pseudoDiscord, setPseudoDiscord] = useState(utilisateur.PseudoDiscord)
  const [description, setDescription] = useState(utilisateur.Description)
  const [photoProfil, setPhotoProfil] = useState(utilisateur.PhotoProfil)
  const [villeResidence, setVilleResidence] = useState(
    utilisateur.VilleResidence
  )
  const [hashedPassword, setHashedPassword] = useState(
    utilisateur.hashedPassword
  )
  console.info("data de utilisateur :", utilisateur)
  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post(
      "http://localhost:4242/utilisateurs",
      ({
        Nom: nom,
        Prenom: prenom,
        Pseudo: pseudo,
        Mail: mail,
        Telephone: telephone,
        PseudoDiscord: pseudoDiscord,
        Description: description,
        VilleResidence: villeResidence,
        hashedPassword,
      },
      { headers })
        .then((res) => res.data)
        .catch((error) => {
          console.error("Erreur lors de la mise a jour du profil :", error)
        })
    )
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <header className="App-header">
        <div className="boxFormProfil">
          <form className="boxFormProfil" onSubmit={handleSubmit}>
            <label>
              Nom:
              <input
                type="text"
                placeholder={utilisateur.Nom}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </label>
            <br />

            <label>
              Prénom:
              <input
                type="text"
                placeholder={utilisateur.Prenom}
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </label>
            <br />

            <label>
              Pseudo:
              <input
                type="text"
                placeholder={utilisateur.Pseudo}
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
              />
            </label>
            <br />

            <label>
              Mail:
              <input
                type="text"
                placeholder={utilisateur.Mail}
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </label>
            <br />

            <label>
              Téléphone:
              <input
                type="text"
                placeholder={utilisateur.Telephone}
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </label>
            <br />

            <label>
              Pseudo Discord:
              <input
                type="text"
                placeholder={utilisateur.PseudoDiscord}
                value={pseudoDiscord}
                onChange={(e) => setPseudoDiscord(e.target.value)}
              />
            </label>
            <br />

            <label>
              Description:
              <input
                type="text"
                placeholder={utilisateur.Description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <br />

            <label>
              Photo de Profil:
              <input
                type="text"
                placeholder="clic et insert ta photo"
                value={photoProfil}
                onChange={(e) => setPhotoProfil(e.target.value)}
              />
            </label>
            <br />

            <label>
              Ville de Résidence:
              <input
                type="text"
                placeholder={utilisateur.villeResidence}
                value={villeResidence}
                onChange={(e) => setVilleResidence(e.target.value)}
              />
            </label>
            <br />

            <label>
              Mot de Passe:
              <input
                type="password"
                value={hashedPassword}
                onChange={(e) => setHashedPassword(e.target.value)}
              />
            </label>
            <br />

            <button type="submit">Soumettre</button>
          </form>
        </div>
      </header>
    </>
  )
}
