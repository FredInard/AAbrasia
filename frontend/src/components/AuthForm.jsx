import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./AuthForm.scss"
import axios from "axios"
import Cookies from "js-cookie"

function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [nomInscription, setNomInscription] = useState([])
  const [prenomInscription, setPrenomInscription] = useState([])
  const [pseudoInscription, setPseudoInscription] = useState([])
  const [mailInscription, setMailInscription] = useState([])
  const [motDePasseInscription, setMotDePasseInscription] = useState([])
  const [signInPseudo, setSignInPseudo] = useState()
  const [signInPassword, setSignInPassword] = useState()

  const handleSubmit = () => {
    axios
      .post("http://localhost:4242/utilisateurs", {
        Nom: nomInscription,
        Prenom: prenomInscription,
        Pseudo: pseudoInscription,
        Mail: mailInscription,
        password: motDePasseInscription,
      })
      .then((res) => res.data)
  }
  console.info(
    "data insérées :",
    nomInscription,
    prenomInscription,
    mailInscription,
    motDePasseInscription
  )

  const handleSignInClick = () => {
    setIsSignIn(true)
  }

  const handleSignUpClick = () => {
    setIsSignIn(false)
  }

  const handleKeyDown = (e) => {
    // console.info("Key down event triggered")
    if (e.code === "Enter" || (e.key === "Enter" && signInPassword !== "")) {
      handleLogin(e)
    }
  }

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:4242/login", {
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
            JSON.stringify(res.data.utilisateur.photoProfil),
            {
              sameSite: "strict",
            }
          )
          Cookies.set(
            "adminUtilisateur",
            JSON.stringify(res.data.utilisateur.admin),
            {
              sameSite: "strict",
            }
          )
          setSignInPseudo()
          setSignInPassword()
          navigate("/")
          console.info(
            "res.data.utilisateur.utilisateur :",
            res.data.utilisateur
          )
          console.info(
            "res.data.utilisateur.Admin :",
            res.data.utilisateur.Admin
          )
          console.info("res.data.utilisateur.id :", res.data.utilisateur.id)
          console.info(
            "res.data.utilisateur.PhotoProfil :",
            res.data.utilisateur.PhotoProfil
          )
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error)
      })
  }

  return (
    <div className={`container ${isSignIn ? "sign-in-mode" : "sign-up-mode"}`}>
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
            {/* <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div> */}
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
            <input
              type="submit"
              className="btn"
              value="S'inscrire"
              onClick={handleSubmit}
            />
            {/* <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div> */}
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
  )
}

export default AuthForm
