import React from "react"
import "./Modal.scss"

function Modal({ parties, utilisateurs, onClose }) {
  // ... le reste de votre code modal

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Ajoutez un bouton pour fermer la modal */}
        <button className="buttonClose" onClick={onClose}>
          Fermer
        </button>
        {/* Le contenu de votre modal */}
        {/* ... */}
      </div>
    </div>
  )
}

export default Modal
