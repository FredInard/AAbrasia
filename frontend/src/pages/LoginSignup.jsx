import React, { useState, useRef, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./LoginSignup.scss"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "../components/NavBar/NavBar"
import { AuthContext } from "../services/AuthContext"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 300000 // 5 minutes de verrouillage

const LoginSignup = () => {
  const { setIsLoggedIn } = useContext(AuthContext)
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
  // Fonction de vérification du refresh token lors du chargement de la page
  useEffect(() => {
    const checkAccessToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken")

      if (refreshToken) {
        try {
          // Si le refresh token est présent, demander un nouveau token d'accès
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/refresh-token`,
            {
              token: refreshToken,
            }
          )

          if (response.status === 200) {
            setIsLoggedIn(true) // Connexion réussie
          } else {
            setIsLoggedIn(false) // Échec, redirection vers login
            navigate("/login")
          }
        } catch (error) {
          setIsLoggedIn(false) // En cas d'erreur, redirection vers login
          navigate("/login")
        }
      } else {
        setIsLoggedIn(false) // Si pas de refresh token, redirection vers login
        navigate("/login")
      }
    }

    checkAccessToken()
  }, [navigate, setIsLoggedIn])

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email: loginForm.email,
          password: loginForm.password,
        },
        { withCredentials: true } // Cela permet d'envoyer et de recevoir le cookie HTTP-Only
      )

      if (response.status === 200) {
        // Stocker le refresh token dans le localStorage
        localStorage.setItem("refreshToken", response.data.refreshToken)

        // Mettre à jour l'état de connexion dans le contexte
        setIsLoggedIn(true)

        // Rediriger vers la page d'accueil ou une autre page
        navigate("/")
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

  // Intercepteur pour gérer l'expiration du token d'accès et utiliser le refresh token
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true // Marquer la requête pour éviter la boucle

        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          window.location.href = "/login" // Si pas de refresh token, rediriger
          return Promise.reject(error)
        }

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/refresh-token`,
            { token: refreshToken }
          )

          if (response.status === 200) {
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return axios(originalRequest) // Relancer la requête originale
          }
        } catch (err) {
          window.location.href = "/login" // Si le refresh token échoue, rediriger
          return Promise.reject(err)
        }
      }

      return Promise.reject(error)
    }
  )

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
