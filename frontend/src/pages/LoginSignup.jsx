import React, { useState } from "react"
// import axios from "axios" // Utilisé pour les requêtes API
import "./LoginSignup.scss" // Styles associés
import NavBar from "../components/NavBar/NavBar"

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true) // Permet de basculer entre login et signup
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nom: "",
    prenom: "",
  })

  // Gestion du changement des champs pour le formulaire de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  // Gestion du changement des champs pour le formulaire d'inscription
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      // const response = await axios.post("/api/login", loginForm) // Remplace l'URL par celle de ton backend
      alert("Connexion réussie !")
    } catch (error) {
      console.error("Erreur lors de la connexion :", error)
      alert("Erreur de connexion. Veuillez vérifier vos informations.")
    }
  }

  // Soumission du formulaire d'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      return alert("Les mots de passe ne correspondent pas !")
    }
    try {
      // const response = await axios.post("/api/signup", signupForm) // Remplace l'URL par celle de ton backend
      alert("Inscription réussie !")
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error)
      alert("Erreur d'inscription. Veuillez réessayer.")
    }
  }

  // Basculer entre Connexion et Inscription
  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <>
      <NavBar />
      <div className="login-signup-container">
        <div className="form-container">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <h2>Connexion</h2>
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input
                  type="email"
                  id="loginEmail"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Mot de passe</label>
                <input
                  type="password"
                  id="loginPassword"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                Connexion
              </button>
              <p className="toggle-text">
                Vous n'avez pas de compte ?{" "}
                <span onClick={toggleForm}>Inscrivez-vous ici</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <h2>Inscription</h2>
              <div className="form-group">
                <label htmlFor="signupNom">Nom</label>
                <input
                  type="text"
                  id="signupNom"
                  name="nom"
                  value={signupForm.nom}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupPrenom">Prénom</label>
                <input
                  type="text"
                  id="signupPrenom"
                  name="prenom"
                  value={signupForm.prenom}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email</label>
                <input
                  type="email"
                  id="signupEmail"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Mot de passe</label>
                <input
                  type="password"
                  id="signupPassword"
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirmez le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                Inscription
              </button>
              <p className="toggle-text">
                Vous avez déjà un compte ?{" "}
                <span onClick={toggleForm}>Connectez-vous ici</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default LoginSignup
