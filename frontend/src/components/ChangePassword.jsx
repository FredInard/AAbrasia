import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./ChangePassword.scss"

function ChangePassword({ isOpen, onClose }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const modalRef = useRef(null)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }
  const idUser = Cookies.get("idUtilisateur")

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

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      // Effectuez une requête vers le serveur pour mettre à jour le mot de passe
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/utilisateurs/changerMotDePasse/${idUser}`,
        { password },
        { headers }
      )

      if (response.status === 200 || response.status === 201) {
        alert("Mot de passe modifié avec succès.")
        onClose() // Fermez la modal après la modification du mot de passe
      } else {
        alert(
          "Une erreur s'est produite lors de la modification du mot de passe."
        )
      }
    } catch (error) {
      console.error("Erreur lors de la modification du mot de passe :", error)
      alert(
        "Une erreur s'est produite lors de la modification du mot de passe."
      )
    }
  }

  return (
    <div
      className="modalChangePW"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modalContent" ref={modalRef}>
        <h2 className="titleChangePW">Changer le mot de passe</h2>
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
  )
}

export default ChangePassword
