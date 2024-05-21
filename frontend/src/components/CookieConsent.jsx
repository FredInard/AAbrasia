import React, { useState, useEffect } from "react"
import "./CookieConsent.css"

const CookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState(null)

  useEffect(() => {
    // Vérifie si le consentement est déjà stocké dans le localStorage
    const consent = localStorage.getItem("cookieConsent")
    setCookieConsent(consent)
  }, [])

  const handleAcceptCookies = () => {
    setCookieConsent("true")
    localStorage.setItem("cookieConsent", "true") // Stocke le consentement dans le localStorage
  }

  const handleDeclineCookies = () => {
    setCookieConsent("false")
    localStorage.setItem("cookieConsent", "false") // Stocke le refus dans le localStorage
  }

  if (cookieConsent === null) {
    return (
      <div className="cookie-consent">
        <p>
          Nous utilisons des cookies pour améliorer votre expérience.
          Acceptez-vous ?
        </p>
        <button onClick={handleAcceptCookies}>Accepter</button>
        <button onClick={handleDeclineCookies}>Refuser</button>
      </div>
    )
  }

  return null // Si le consentement est déjà donné ou refusé, ne rien afficher
}

export default CookieConsent
