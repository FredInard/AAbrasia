import React, { useState, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "./LoginSignup.scss" // Styles associés
import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "../components/NavBar/NavBar"
import { AuthContext } from "../services/AuthContext"

const MAX_LOGIN_ATTEMPTS = 5 // Nombre maximum de tentatives autorisées
const LOCKOUT_DURATION = 300000 // Durée de verrouillage en millisecondes (par exemple, 5 minutes)

const LoginSignup = () => {
  toast.configure()
  const { setIsLoggedIn } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true) // Basculer entre login et signup
  const [loginForm, setLoginForm] = useState({ pseudo: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    pseudo: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [loginAttempts, setLoginAttempts] = useState([])
  const [isUserLocked, setIsUserLocked] = useState(false)
  const lockoutTimerRef = useRef(null)
  const navigate = useNavigate()

  console.info(errorMessage)
  console.info(isUserLocked)
  console.info(setErrorMessage)

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  // Fonction pour verrouiller temporairement un utilisateur
  const lockoutUser = () => {
    setIsUserLocked(true)
    lockoutTimerRef.current = setTimeout(() => {
      clearLockout()
    }, LOCKOUT_DURATION)

    toast.error(
      "Trop de tentatives infructueuses. Compte temporairement bloqué."
    )
  }

  // Réinitialiser le statut de verrouillage
  const clearLockout = () => {
    setIsUserLocked(false)
    setLoginAttempts([])
    clearTimeout(lockoutTimerRef.current)
  }

  /* Effacer le compteur de tentatives après une connexion réussie
  const clearLoginAttempts = () => {
    setLoginAttempts([])
  } */

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          pseudo: loginForm.pseudo,
          password: loginForm.password,
        },
        { withCredentials: true } // Important: Assure que les cookies sont envoyés avec la requête
      )

      if (response.status === 200) {
        // Tu peux encore sauvegarder d'autres informations utilisateur (hors token) si nécessaire
        console.info("connexion réussi", response.data.utilisateur.pseudo)
        toast.success("connexion réussie !")
        Cookies.set("Pseudo", response.data.utilisateur.pseudo, {
          sameSite: "strict",
        })
        Cookies.set(
          "loggedInUtilisateur",
          JSON.stringify(response.data.utilisateur),
          {
            sameSite: "strict",
          }
        )
        // Mettre à jour l'état `isLoggedIn` dans le contexte
        setIsLoggedIn(true)
        // Redirige vers la page d'accueil ou une autre page
        navigate("/")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error)
      toast.error("Pseudo ou mot de passe incorrect.")
      setLoginAttempts([...loginAttempts, Date.now()])

      if (loginAttempts.length >= MAX_LOGIN_ATTEMPTS) {
        lockoutUser()
      }
    }
  }

  // Soumission du formulaire d'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.")
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs`,
        {
          nom: signupForm.nom,
          prenom: signupForm.prenom,
          pseudo: signupForm.pseudo,
          email: signupForm.email,
          password: signupForm.password,
        }
      )

      if (response.status === 201) {
        toast.success("Inscription réussie !")
        setIsLogin(true) // Revenir au formulaire de connexion après l'inscription
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error)
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.")
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
                <label htmlFor="loginPseudo">Pseudo</label>
                <input
                  type="text"
                  id="loginPseudo"
                  name="pseudo"
                  value={loginForm.pseudo}
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
                <label htmlFor="signupPseudo">Pseudo</label>
                <input
                  type="text"
                  id="signupPseudo"
                  name="pseudo"
                  value={signupForm.pseudo}
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
