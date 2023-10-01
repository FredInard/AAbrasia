import "./Modal.scss"
import React, { useRef, useEffect } from "react"

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef()

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden" // Empêche le défilement du corps sous la modal
      document.addEventListener("mousedown", handleOutsideClick)
    } else {
      document.body.style.overflow = "" // Rétablit le défilement du corps
      document.removeEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.body.style.overflow = "" // Rétablit le défilement du corps en cas de démontage de la modal
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-content">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
