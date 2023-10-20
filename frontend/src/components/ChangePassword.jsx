import React, { useState } from "react"
import axios from "axios"
import "./ModalChangePW.scss"

function ChangePassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  // const [showModal, setShowModal] = useState(false)

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      // Effectuez une requête vers le serveur pour mettre à jour le mot de passe
      const response = await axios.put("/api/user/change-password", {
        password,
      })

      if (response.status === 200) {
        alert("Mot de passe modifié avec succès.")
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

  // const openModal = () => {
  //   setShowModal(true) // Ouvre la modal en définissant l'état à true
  // }

  return (
    <div className="globalDivChangePW">
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
      {/* {showModal && <ModalChangePW closeModal={() => setShowModal(false)} />} */}
    </div>
  )
}

export default ChangePassword
