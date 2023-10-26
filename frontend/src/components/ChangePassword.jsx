import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./ChangePassword.scss"

function ChangePassword({ isOpen, onClose, onPasswordChangeSuccess }) {
  const [oldPassword, setOldPassword] = useState("") // Ajout de l'état pour l'ancien mot de passe
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [utilisateur, setUtilisateur] = useState({})
  const nom = utilisateur.Nom
  const prenom = utilisateur.Prenom
  const pseudo = utilisateur.Pseudo
  const mail = utilisateur.Mail || null
  const telephone = utilisateur.Telephone || null
  const pseudoDiscord = utilisateur.PseudoDiscord || null
  const description = utilisateur.Description || null
  const photoProfil = utilisateur.PhotoProfil
  const villeResidence = utilisateur.VilleResidence || null
  const admin = utilisateur.Admin || null
  const membreEquipe = utilisateur.MembreEquipe || null
  const membreAssociation = utilisateur.MembreAssociation || null
  const modalRef = useRef(null)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }
  const idUser = Cookies.get("idUtilisateur")
  const pseudoUser = Cookies.get("Pseudo")

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

  useEffect(() => {
    // Ajoutez un écouteur d'événements pour gérer les clics en dehors de la modal
    function handleOutsideClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
    } else {
      document.removeEventListener("mousedown", handleOutsideClick)
    }

    // Nettoyez l'écouteur d'événements lors de la fermeture de la modal
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen, onClose])

  const handleChangePassword = (e) => {
    e.preventDefault()

    // Appel à axios.post pour vérifier le mot de passe
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/verifPW`,
        {
          Pseudo: pseudoUser,
          hashedPassword: oldPassword,
        },
        {
          headers,
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.info("Mot de passe correct !")
          // Appeler ici la fonction de modification du mot de passe (Code n°2)
          handleChangePassword2()
        } else {
          console.error("Mot de passe incorrect !")
          // Afficher un message d'erreur ou gérer la logique appropriée
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification du mot de passe :", error)
        // Gérer l'erreur
      })
  }

  const handleChangePassword2 = async () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/utilisateurs/changerMotDePasse/${idUser}`,
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
          password,
          Admin: admin,
          MembreEquipe: membreEquipe,
          MembreAssociation: membreAssociation,
          id: idUser,
        },
        { headers }
      )

      if (response.status === 200 || response.status === 201) {
        console.info("Mot de passe modifié avec succès !")
        onClose() // Fermez la modal
        onPasswordChangeSuccess() // Appel de la fonction de rappel
      } else {
        // console.error("Erreur lors de la modification du mot de passe :", error)
        onClose() // Fermez la modal
        onPasswordChangeSuccess() // Appel de la fonction de rappel
      }
    } catch (error) {
      console.error("Erreur lors de la modification du mot de passe :", error)
      alert(
        "Une erreur s'est produite lors de la modification du mot de passe."
      )
    }
  }

  return (
    <>
      <div
        className="modalChangePW"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div
          className="modalChangePW"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="modalContent" ref={modalRef}>
            <h2 className="titleChangePW">Changer le mot de passe</h2>
            <div className="divChangePWThird">
              <h2 className="titleChangePW">Ancien mot de passe:</h2>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="divChangePWFirst">
              <h2 className="titleChangePW">Nouveau mot de passe:</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="divChangePWSecond">
              <h2 className="titleChangePW">Confirmer le mot de passe:</h2>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="buttonChangePW" onClick={handleChangePassword}>
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
