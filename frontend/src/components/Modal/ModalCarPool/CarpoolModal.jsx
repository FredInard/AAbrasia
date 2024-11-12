import React, { useState } from "react"
import "./CarpoolModal.scss"

const CarpoolModal = ({ partyId, user, onClose, onSubmit }) => {
  const [villeDepart, setVilleDepart] = useState("")
  const [villeArrivee, setVilleArrivee] = useState("")
  const [heureDepart, setHeureDepart] = useState("")
  const [proposeRetour, setProposeRetour] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      departure: villeDepart,
      arrival: villeArrivee,
      departureTime: heureDepart,
      returnOffer: proposeRetour,
    })
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Proposer un covoiturage</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Lieu de départ :
            <input
              type="text"
              value={villeDepart}
              onChange={(e) => setVilleDepart(e.target.value)}
              required
            />
          </label>
          <label>
            Lieu d'arrivée :
            <input
              type="text"
              value={villeArrivee}
              onChange={(e) => setVilleArrivee(e.target.value)}
              required
            />
          </label>
          <label>
            Heure de départ :
            <input
              type="datetime-local"
              value={heureDepart}
              onChange={(e) => setHeureDepart(e.target.value)}
              required
            />
          </label>
          <label>
            Propose un retour :
            <input
              type="checkbox"
              checked={proposeRetour}
              onChange={(e) => setProposeRetour(e.target.checked)}
            />
          </label>
          <button type="submit">Proposer</button>
        </form>
      </div>
    </div>
  )
}

export default CarpoolModal
