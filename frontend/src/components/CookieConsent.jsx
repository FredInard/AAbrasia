// src/components/CookieConsent.jsx
import React, { useState, useEffect } from "react"
import "./CookieConsent.scss"

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      setIsVisible(true)
      document.body.classList.add("no-interaction") // Désactive les interactions
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true")
    setIsVisible(false)
    document.body.classList.remove("no-interaction") // Réactive les interactions
  }

  return (
    isVisible && (
      <>
        <div className="cookie-banner-overlay" />
        <div className="cookie-banner">
          <p>
            Nous utilisons des cookies pour améliorer votre expérience. En
            continuant à naviguer sur ce site, vous acceptez notre utilisation
            des cookies.
          </p>
          <button onClick={handleAccept}>Accepter</button>
        </div>
      </>
    )
  )
}

export default CookieConsent
