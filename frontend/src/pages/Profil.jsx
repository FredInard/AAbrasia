import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"

import Toggle from "../components/Toggle.jsx"
import NavBar from "../components/NavBar"
import ModificationPartieModal from "../components/ModificationPartieModal.jsx" // Importez la modal
import ModalExitPartie from "../components/ModalExitPartie.jsx"
import exit from "../assets/pics/Exist.png"
// import king from "../assets/pics/medievalKing.svg"
// import queen from "../assets/pics/queen.svg"

import "./Profil.scss"

export default function Profil() {
  const [showModalModifPartie, setShowModalModifPartie] = useState(false)
  const [showModalExitPartie, setShowModalExitPartie] = useState(false)
  const [showBoxListeParties, setShowBoxListeParties] = useState(true)
  const [utilisateur, setUtilisateur] = useState({})
  const [parties, setParties] = useState()
  const [meneurParties, setMeneurParties] = useState()
  const [selectedPartie, setSelectedPartie] = useState(null) // État pour stocker les données de la partie sélectionnée
  const [nom, setNom] = useState(utilisateur.Nom)
  const [prenom, setPrenom] = useState(utilisateur.Prenom)
  const [pseudo, setPseudo] = useState(utilisateur.Pseudo)
  const [mail, setMail] = useState(utilisateur.Mail)
  const [telephone, setTelephone] = useState(utilisateur.Telephone)
  const [pseudoDiscord, setPseudoDiscord] = useState(utilisateur.PseudoDiscord)
  const [description, setDescription] = useState(utilisateur.Description)
  const photoProfil = utilisateur.PhotoProfil
  const [villeResidence, setVilleResidence] = useState(
    utilisateur.VilleResidence
  )
  const hashedPassword = utilisateur.hashedPassword
  const admin = utilisateur.Admin
  const membreEquipe = utilisateur.MembreEquipe
  const membreAssociation = utilisateur.MembreAssociation
  const [imageUrl, setImageUrl] = useState(null)
  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)
  const navigate = useNavigate()
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  useEffect(() => {
    setImageUrl(
      `${import.meta.env.VITE_BACKEND_URL}/${utilisateur.PhotoProfil}`
    )
  }, [utilisateur.PhotoProfil])

  const handleEditClick = (partie) => {
    setSelectedPartie(partie) // Stockez les données de la partie sélectionnée dans l'état
    setShowModalModifPartie(true) // Ouvrez la modal
  }

  const handleExitPartieClick = (partie) => {
    setSelectedPartie(partie) // Stockez les données de la partie sélectionnée dans l'état
    setShowModalExitPartie(true) // Ouvrez la modal
  }

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/profil/${idUserNumb}`,
        { headers }
      )
      .then((res) => setUtilisateur(res.data))
      .catch((err) => {
        console.error("Problème lors du chargement de l'utlisateur", err)
      })
  }, [])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/profil/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        console.info("Réponse Axios (succès) :", res)
        setParties(res.data)
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [showModalExitPartie])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/meneur/${idUserNumb}`, {
        headers,
      })
      .then((res) => {
        console.info("Réponse Axios (succès) :", res)
        setMeneurParties(res.data)
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [showModalModifPartie])

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs`,
        {
          Nom: nom,
          Prenom: prenom,
          Pseudo: pseudo,
          Mail: mail,
          Telephone: telephone,
          PseudoDiscord: pseudoDiscord,
          Description: description,
          PhotoProfil: photoProfil,
          VilleResidence: villeResidence,
          hashedPassword,
          Admin: admin,
          MembreEquipe: membreEquipe,
          MembreAssociation: membreAssociation,
        },
        { headers }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error("Erreur lors de la mise a jour du profil :", error)
      })
  }

  const handleLogout = () => {
    Cookies.remove("authToken")
    Cookies.remove("loggedInUtilisateur")
    Cookies.remove("idUtilisateur")
    Cookies.remove("photoProfilUtilisateur")
    Cookies.remove("Pseudo")
    Cookies.remove("adminUtilisateur")

    navigate("/")
  }

  const updateProfilPictureOnServer = async (idUserNumb, formData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUserNumb}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for sending files,
            Authorization: `Bearer ${tokenFromCookie}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la photo de profil :",
        error
      )
      throw error
    }
  }

  const handlePictureChange = (e) => {
    const picture = e.target.files[0]

    // Créez un objet FormData pour envoyer la photo
    const formData = new FormData()
    formData.append("myFile", picture)

    setImageUrl(URL.createObjectURL(picture))

    // Appel de la fonction pour mettre à jour la photo de profil sur le serveur
    updateProfilPictureOnServer(utilisateur.id, formData)
  }
  console.info(imageUrl)
  console.info("utilisateur", utilisateur)
  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="boxBouttonExit">
        <img
          className="buttonExit"
          src={exit}
          onClick={handleLogout}
          alt="logo exit"
        />
        <p>Déconexion</p>
      </div>
      <h1 className="bienvenurName"> Bienvenue {utilisateur.Pseudo}</h1>
      <div className="bouttonSwitch">
        <p> Tableau de bord des parties</p>
        <Toggle onClick={() => setShowBoxListeParties(!showBoxListeParties)} />
        <p> Modifier mon profil</p>
      </div>
      <div className="globalBoxProfil">
        {showBoxListeParties === true ? (
          <div className="boxListeParties ">
            <div className="boxPictureLeft fade-in-left">
              {/* <img className="kingPicture" src={king} alt="image d'un roi" /> */}
            </div>
            <div className="boxListeGame">
              <h1>Tableau de bord de tes parties :</h1>
              <div className="boxResumeParties fade-in-right">
                {parties && (
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
                          {/* Bouton "Modifier" pour ouvrir la modal */}
                          <button onClick={() => handleExitPartieClick(partie)}>
                            Se retirer de la partie
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {meneurParties && (
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
                          {/* Bouton "Modifier" pour ouvrir la modal */}
                          <button onClick={() => handleEditClick(meneurPartie)}>
                            Modifier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="boxModifProfil">
            <div className="bigBoxFormProfil ">
              <h1>Modifie ton profil :</h1>
              <form
                className="boxFormProfil fade-in-left"
                onSubmit={handleSubmit}
              >
                <label className="labelChangeProfil">
                  Nom:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.Nom}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Prénom:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.Prenom}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Pseudo:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.Pseudo}
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Mail:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.Mail}
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Téléphone:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.Telephone}
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Pseudo Discord:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.PseudoDiscord}
                    value={pseudoDiscord}
                    onChange={(e) => setPseudoDiscord(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Description:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.Description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>

                <label className="labelChangeProfil">
                  Ville de Résidence:
                  <input
                    className="imputChangeProfil"
                    type="text"
                    placeholder={utilisateur.VilleResidence}
                    value={villeResidence}
                    onChange={(e) => setVilleResidence(e.target.value)}
                  />
                </label>

                <button type="submit">Soumettre</button>
              </form>
              <label className="boxChangePhotoProfil">
                Photo de Profil:
                <img
                  src={imageUrl}
                  alt="image de profil de l'utilisateur"
                  className="profilPictureChange"
                />
                <input
                  type="file"
                  id="buttonPicture"
                  accept="image/*"
                  onChange={handlePictureChange}
                />
              </label>
              <br />
            </div>
            <div className="boxPictureRight fade-in-right">
              {/* <img
                className="queenPicture "
                src={queen}
                alt="image d'un reine"
              /> */}
            </div>
          </div>
        )}
      </div>

      {/* Affichez la modal s'il y a une partie sélectionnée */}
      {selectedPartie && (
        <ModificationPartieModal
          isOpen={showModalModifPartie}
          onClose={() => {
            setShowModalModifPartie(false)
            setSelectedPartie(null) // Réinitialisez les données de la partie sélectionnée
          }}
          partie={selectedPartie}
        />
      )}
      {selectedPartie && (
        <ModalExitPartie
          isOpen={showModalExitPartie}
          onClose={() => {
            setShowModalExitPartie(false)
            setSelectedPartie(null) // Réinitialisez les données de la partie sélectionnée
          }}
          partie={selectedPartie}
        />
      )}
    </>
  )
}
