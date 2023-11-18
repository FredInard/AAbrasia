import React, { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./AuthForm.scss"
import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const MAX_LOGIN_ATTEMPTS = 5 // Nombre maximum de tentatives autorisées
const LOCKOUT_DURATION = 300000 // Durée de verrouillage en millisecondes (par exemple, 5 minutes)

function AuthForm() {
  toast.configure()
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("")
  const [isSignIn, setIsSignIn] = useState(true)
  const [nomInscription, setNomInscription] = useState("")
  const [prenomInscription, setPrenomInscription] = useState("")
  const [pseudoInscription, setPseudoInscription] = useState("")
  const [mailInscription, setMailInscription] = useState("")
  const [motDePasseInscription, setMotDePasseInscription] = useState("")
  const [signInPseudo, setSignInPseudo] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const imageParDefaut = "assets/images/profilPictures/portraitOfMerchant.png"
  console.info("imageParDefaut", imageParDefaut)
  const [loginAttempts, setLoginAttempts] = useState([])
  const [isUserLocked, setIsUserLocked] = useState(false)
  const lockoutTimerRef = useRef(null)
  const isValidPassword = (password) => {
    // Vérifier la longueur du mot de passe (8 caractères minimum)
    if (password.length < 8) {
      return false
    }

    // Vérifier s'il y a au moins 1 chiffre
    if (!/\d/.test(password)) {
      return false
    }

    // Vérifier s'il y a au moins 1 caractère spécial (par exemple, !@#$%^&*)
    if (!/[!@#$%^&*]/.test(password)) {
      return false
    }

    // Vérifier s'il y a au moins 1 majuscule
    if (!/[A-Z]/.test(password)) {
      return false
    }

    return true
  }

  // Fonction pour gérer la tentative de connexion
  const handleLoginAttempt = () => {
    // Vérifier si l'utilisateur est actuellement verrouillé
    if (isUserLocked) {
      const remainingLockoutTime =
        LOCKOUT_DURATION -
        (Date.now() - loginAttempts[loginAttempts.length - 1])
      toast.error(
        `Your account is temporarily locked. Please try again in ${Math.ceil(
          remainingLockoutTime / 1000
        )} seconds.`
      )
      return
    }

    // Authentification normale ici...
    // Si l'authentification échoue, incrémenter le compteur de tentatives
    setLoginAttempts([...loginAttempts, Date.now()])

    // Si le nombre de tentatives dépasse le seuil, verrouiller l'utilisateur
    if (loginAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      lockoutUser()
      return
    }

    // Authentification réussie...
    clearLoginAttempts()
    // Continuer avec le reste de la logique de connexion
  }

  // Fonction pour verrouiller temporairement un utilisateur
  const lockoutUser = () => {
    setIsUserLocked(true)

    // Mettre en place un timer pour réinitialiser le verrouillage après LOCKOUT_DURATION
    lockoutTimerRef.current = setTimeout(() => {
      clearLockout()
    }, LOCKOUT_DURATION)

    toast.error(
      "Too many unsuccessful attempts. Your account is temporarily locked."
    )
  }

  // Fonction pour réinitialiser le statut de verrouillage
  const clearLockout = () => {
    setIsUserLocked(false)
    setLoginAttempts([])
    clearTimeout(lockoutTimerRef.current)
  }

  // Fonction pour effacer le compteur de tentatives après une connexion réussie
  const clearLoginAttempts = () => {
    setLoginAttempts([])
  }

  const handleSubmit = () => {
    // Effectuer d'abord une requête GET pour vérifier si l'utilisateur existe déjà
    if (!isValidPassword(motDePasseInscription)) {
      toast.error("Le mot de passe ne remplit pas les conditions requises.")
      return
    }
    if (motDePasseInscription !== confirmationMotDePasse) {
      toast.error(
        "Le mot de passe et la confirmation du mot de passe ne correspondent pas."
      )
      console.info(
        "Le mot de passe et la confirmation du mot de passe ne correspondent pas."
      )
      return
    }
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/utilisateurs/pseudo/${pseudoInscription}`
      )
      .then((res) => {
        console.info("Réponse de la requête GET :", res.data)
        if (res.data.isPseudoExist === true) {
          console.info("res.data.isPseudoExist", res.data.isPseudoExist)
          // Un utilisateur avec le même pseudo ou la même adresse e-mail existe déjà
          setErrorMessage(
            "Le pseudo est déjà pris ou l'utilisateur existe déjà."
          )
          setIsModalOpen(true)
          console.error("L'utilisateur existe déjà.")
        } else {
          // Aucun utilisateur avec le même pseudo ou la même adresse e-mail n'existe
          // Vous pouvez maintenant effectuer la requête POST pour ajouter l'utilisateur
          axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs`, {
              Nom: nomInscription,
              Prenom: prenomInscription,
              Pseudo: pseudoInscription,
              Mail: mailInscription,
              password: motDePasseInscription,
              PhotoProfil: imageParDefaut,
            })
            .then((res) => {
              console.info("Insertion réussie :", res.data)
              // Gérer la réponse de la requête POST ici
            })
            .catch((error) => {
              console.error("Erreur lors de l'inscription :", error)
            })
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la vérification de l'utilisateur :",
          error.response.data
        )
      })
  }

  const handleSignInClick = () => {
    setIsSignIn(true)
  }

  const handleSignUpClick = () => {
    setIsSignIn(false)
  }

  const handleKeyDown = (e) => {
    if (e.code === "Enter" || (e.key === "Enter" && signInPassword !== "")) {
      handleLogin(e)
    }
  }

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        Pseudo: signInPseudo,
        hashedPassword: signInPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          console.info("Connexion établie !")
          document.getElementById("cardLogIn-Input").reset()
          const token = res.data.token
          Cookies.set("authToken", token, { expires: 0.5, sameSite: "strict" })
          Cookies.set("Pseudo", res.data.utilisateur.Pseudo, {
            sameSite: "strict",
          })
          Cookies.set(
            "loggedInUtilisateur",
            JSON.stringify(res.data.utilisateur),
            {
              sameSite: "strict",
            }
          )
          Cookies.set(
            "idUtilisateur",
            JSON.stringify(res.data.utilisateur.id),
            {
              sameSite: "strict",
            }
          )
          Cookies.set(
            "photoProfilUtilisateur",
            JSON.stringify(res.data.utilisateur.PhotoProfil),
            {
              sameSite: "strict",
            }
          )
          Cookies.set(
            "adminUtilisateur",
            JSON.stringify(res.data.utilisateur.Admin),
            {
              sameSite: "strict",
            }
          )
          clearLoginAttempts()
          setSignInPseudo("")
          setSignInPassword("")
          navigate("/")
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error)
        // Gérer la tentative de connexion infructueuse
        handleLoginAttempt()
      })
  }

  console.info("motDePasseInscription", motDePasseInscription)
  console.info("confirmationMotDePasse", confirmationMotDePasse)

  return (
    <>
      <div
        className={`container ${isSignIn ? "sign-in-mode" : "sign-up-mode"}`}
      >
        <div className="forms-container">
          <div className="signin-signup">
            <form
              action="#"
              className={`sign-in-form ${isSignIn ? "active" : ""}`}
            >
              <h2 className="title">Connexion</h2>
              <form id="cardLogIn-Input">
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Pseudo"
                    onChange={(e) => setSignInPseudo(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setSignInPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </form>
              <Link to="/">
                <input
                  type="submit"
                  value="C'est partie"
                  className="btn solid"
                  onClick={handleLogin}
                />
              </Link>
            </form>
            <form
              action="#"
              className={`sign-up-form ${isSignIn ? "" : "active"}`}
            >
              <h2 className="title">Inscription</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={prenomInscription}
                  onChange={(e) => setPrenomInscription(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  placeholder="Nom"
                  value={nomInscription}
                  onChange={(e) => setNomInscription(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email"
                  value={mailInscription}
                  onChange={(e) => setMailInscription(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  placeholder="Pseudo"
                  value={pseudoInscription}
                  onChange={(e) => setPseudoInscription(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="mot de passe"
                  value={motDePasseInscription}
                  onChange={(e) => setMotDePasseInscription(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Confirmez le mot de passe"
                  value={confirmationMotDePasse}
                  onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                />
              </div>

              <input
                type="submit"
                className="btn"
                value="S'inscrire"
                onClick={handleSubmit}
              />
              <p className="mdpExplication">
                mot de passe 8 caractère minimum avec une majuscule, un chifre
                et un caractère spécial
              </p>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div
            className={`panel left-panel ${
              isSignIn ? "sign-in-mode" : "sign-up-mode"
            }`}
          >
            <div className="content">
              <h3>Tu es nouveau ici ?</h3>
              <p>
                Inscrit toi et découvre notre association, rejoins les autres
                joueurs et une partie.
              </p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={handleSignUpClick}
              >
                Inscrit toi
              </button>
            </div>
            <img src="img/log.svg" className="image" alt="" />
          </div>
          <div
            className={`panel right-panel ${
              isSignIn ? "sign-in-mode" : "sign-up-mode"
            }`}
          >
            <div className="content">
              <h3>Déjà inscrit ?</h3>
              <p>
                Tu est déjà membre de l'association, connecte toi pour de
                nouvelles aventures.
              </p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={handleSignInClick}
              >
                S'identifier
              </button>
            </div>
            <img src="img/register.svg" className="image" alt="" />
          </div>
        </div>
      </div>
      <div className={`modalAuthForm ${isModalOpen ? "open" : "closed"}`}>
        <div
          id="error-modal"
          className={`error-modalAuthForm ${errorMessage ? "visible" : ""}`}
        >
          <p className="error-message">{errorMessage}</p>
          <button onClick={() => setIsModalOpen(false)}>Fermer</button>
        </div>
      </div>
    </>
  )
}

export default AuthForm
