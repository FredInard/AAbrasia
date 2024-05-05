import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import ChangePassword from "./ChangePassword.jsx"

import "./ModificationProfil.scss"

export default function ModificationProfil() {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  const [utilisateur, setUtilisateur] = useState({})
  const [nom, setNom] = useState(utilisateur.Nom)
  const [prenom, setPrenom] = useState(utilisateur.Prenom)
  const [pseudo, setPseudo] = useState(utilisateur.Pseudo)
  const [mail, setMail] = useState(utilisateur.Mail || null)
  const [telephone, setTelephone] = useState(utilisateur.Telephone || null)
  const [pseudoDiscord, setPseudoDiscord] = useState(
    utilisateur.PseudoDiscord || null
  )
  const [description, setDescription] = useState(
    utilisateur.Description || null
  )
  const photoProfil = utilisateur.PhotoProfil
  const [villeResidence, setVilleResidence] = useState(
    utilisateur.VilleResidence || null
  )
  const hashedPassword = utilisateur.hashedPassword
  const admin = utilisateur.Admin || null
  const membreEquipe = utilisateur.MembreEquipe || null
  const membreAssociation = utilisateur.MembreAssociation || null
  const [imageUrl, setImageUrl] = useState(null)
  const idUser = Cookies.get("idUtilisateur")
  const idUserNumb = parseInt(idUser)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const handlePictureChange = (e) => {
    const picture = e.target.files[0]

    const formData = new FormData()
    formData.append("myFile", picture)

    setImageUrl(URL.createObjectURL(picture))

    updateProfilPictureOnServer(utilisateur.id, formData)
      .then(() => {
        window.location.reload()
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour de la photo de profil :",
          error
        )
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.info("Fonction handleSubmit appelée")

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUserNumb}`,
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
          id: idUserNumb,
        },
        { headers }
      )
      .then((res) => {
        toast.success("Profil modifié avec succès !")
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du profil :", error)
        toast.error(
          "Une erreur s'est produite lors de la mise à jour du profil."
        )
      })
  }

  const updateProfilPictureOnServer = async (idUserNumb, formData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUserNumb}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true)
  }

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false)
  }

  useEffect(() => {
    setNom(utilisateur.Nom)
    setPrenom(utilisateur.Prenom)
    setPseudo(utilisateur.Pseudo)
    setMail(utilisateur.Mail)
    setTelephone(utilisateur.Telephone)
    setPseudoDiscord(utilisateur.PseudoDiscord)
    setDescription(utilisateur.Description)
    setVilleResidence(utilisateur.VilleResidence)
    setImageUrl(
      `${import.meta.env.VITE_BACKEND_URL}/${utilisateur.PhotoProfil}`
    )
  }, [utilisateur])

  useEffect(() => {
    setImageUrl(
      `${import.meta.env.VITE_BACKEND_URL}/${utilisateur.PhotoProfil}`
    )
  }, [utilisateur.PhotoProfil])

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/profil/${idUserNumb}`,
        { headers }
      )
      .then((res) => setUtilisateur(res.data))
      .catch((err) => {
        console.error("Problème lors du chargement de l'utilisateur", err)
      })
  }, [])

  return (
    <div className="boxModifProfil">
      <div className="bigBoxFormProfil ">
        <h1>Modifie ton profil :</h1>
        <p>
          Attention, les informations ci-dessous seront visibles des autres
          utilisateurs.
        </p>
        <form onSubmit={handleSubmit} className="boxFormProfil fade-in-left">
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

          {/* Autres champs du formulaire */}

          <button type="submit" className="submitChangeProfil">
            Soumettre
          </button>
        </form>
        <button
          className="openChangePasswordButton"
          onClick={openChangePasswordModal}
        >
          Changer le mot de passe
        </button>
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
        {/* Contenu à droite */}
      </div>
      {showChangePasswordModal && (
        <ChangePassword
          isOpen={showChangePasswordModal}
          onClose={closeChangePasswordModal}
          onPasswordChangeSuccess={closeChangePasswordModal}
        />
      )}
      <ToastContainer />
    </div>
  )
}
