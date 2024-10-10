import React, { useState, useRef, useContext, useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { useNavigate } from "react-router-dom"
import "./LoginSignup.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "../components/NavBar/NavBar"
import jwtDecode from "jwt-decode" // Importation corrigée

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 300000 // 5 minutes de verrouillage

const LoginSignup = () => {
  const { setIsLoggedIn, setUserRole, setUserData } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true) // Basculer entre login et signup
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    pseudo: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loginAttempts, setLoginAttempts] = useState([])
  const [isUserLocked, setIsUserLocked] = useState(false)
  const lockoutTimerRef = useRef(null)
  const navigate = useNavigate()

  console.info("isUserLocked :", isUserLocked)

  // Gestion des tentatives de connexion infructueuses
  const lockoutUser = () => {
    setIsUserLocked(true)
    lockoutTimerRef.current = setTimeout(() => {
      clearLockout()
    }, LOCKOUT_DURATION)

    toast.error(
      "Trop de tentatives infructueuses. Compte temporairement bloqué."
    )
  }

  const clearLockout = () => {
    setIsUserLocked(false)
    setLoginAttempts([])
    clearTimeout(lockoutTimerRef.current)
  }

  // Vérification du token stocké dans le localStorage lors du chargement de la page
  useEffect(() => {
    const token = localStorage.getItem("authToken")

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setIsLoggedIn(true)
        setUserRole(decodedToken.role)
        setUserData(decodedToken)
      } catch (error) {
        console.error("Token invalide :", error)
        setIsLoggedIn(false)
        setUserRole("visitor")
        setUserData(null)
        navigate("/login")
      }
    } else {
      setIsLoggedIn(false)
      setUserRole("visitor")
      setUserData(null)
      navigate("/login")
    }
  }, [navigate, setIsLoggedIn, setUserRole, setUserData])

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email: loginForm.email,
          password: loginForm.password,
        }
      )

      if (response.status === 200) {
        const token = response.data.token

        if (token) {
          // Stocker le token d'accès dans le localStorage
          localStorage.setItem("authToken", token)

          // Décoder le token pour récupérer les informations de l'utilisateur
          const decodedToken = jwtDecode(token)

          // Mettre à jour l'état de connexion dans le contexte
          setIsLoggedIn(true)
          setUserRole(decodedToken.role)
          setUserData(decodedToken)

          // Rediriger vers la page d'accueil
          navigate("/")
        } else {
          console.error("Token non fourni dans la réponse du serveur.")
          toast.error("Erreur lors de la connexion. Veuillez réessayer.")
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error)
      toast.error("Email ou mot de passe incorrect.")
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
        setIsLogin(true) // Retourner au formulaire de connexion
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

  // Gérer les changements dans le formulaire de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  // Gérer les changements dans le formulaire d'inscription
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupForm((prevForm) => ({ ...prevForm, [name]: value }))
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
                <label htmlFor="loginemail">Email</label>
                <input
                  type="email"
                  id="loginemail"
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
