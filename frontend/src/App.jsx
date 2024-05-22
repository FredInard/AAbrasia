import "./App.css"
import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Home from "./pages/Home"
import Inscription from "./pages/Inscription"
import CreateGame from "./pages/CreateGame"
import Creations from "./pages/Creations"
import Association from "./pages/Association"
import Profil from "./pages/Profil"
import AdminPage from "./pages/AdminPage"
import Cookies from "js-cookie"
// import CookieConsent from "./components/CookieConsent"

function App() {
  const isAuthenticated = Cookies.get("authToken") !== undefined
  const isAdmin = Cookies.get("adminUtilisateur") === "1"

  const [showCookieBanner, setShowCookieBanner] = useState(false)

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent")
    if (!consentGiven && isAuthenticated) {
      setShowCookieBanner(true)
    }
  }, [isAuthenticated])

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowCookieBanner(false)
  }

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/Inscription" element={<Inscription />} />
        <Route path="/creations" element={<Creations />} />
        <Route path="/association" element={<Association />} />

        {/* Routes protégées */}
        {isAuthenticated && (
          <Route path="/create-game" element={<CreateGame />} />
        )}
        {isAuthenticated && <Route path="/profil" element={<Profil />} />}
        {isAdmin && <Route path="/admin" element={<AdminPage />} />}

        {/* Redirections basées sur l'authentification */}
        <Route
          path="/create-game"
          element={
            isAuthenticated ? <CreateGame /> : <Navigate to="/Inscription" />
          }
        />
        <Route
          path="/profil"
          element={
            isAuthenticated ? <Profil /> : <Navigate to="/Inscription" />
          }
        />
        {isAdmin && (
          <Route
            path="/admin"
            element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
          />
        )}
      </Routes>

      {/* Affichage conditionnel de la bannière de consentement aux cookies */}
      {showCookieBanner && (
        <>
          <div className="cookie-banner-overlay no-interaction"></div>
          <div className="cookie-banner">
            <p>
              Ce site utilise des cookies pour améliorer votre expérience. En
              continuant à naviguer sur le site, vous acceptez notre utilisation
              des cookies.
            </p>
            <button onClick={handleAcceptCookies}>Accepter</button>
          </div>
        </>
      )}
    </Router>
  )
}

export default App
