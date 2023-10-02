import React from "react"
import "./SubmitButton.scss"

function NomDuComposant() {
  return (
    <div className="contSubmitButton">
      <button className="submitButton" tabIndex="0">
        <span>Rejoins l'aventure</span>
        <img
          src="https://i.cloudup.com/2ZAX3hVsBE-3000x3000.png"
          height="50"
          width="50"
          alt="Submit Button"
        />
      </button>
    </div>
  )
}

export default NomDuComposant
