import React, { useState } from "react"
import "./AuthForm.scss"
import axios from "axios"

function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [nomInscription, setNomInscription] = useState([])
  const [prenomInscription, setPrenomInscription] = useState([])
  const [pseudoInscription, setPseudoInscription] = useState([])
  const [mailInscription, setMailInscription] = useState([])
  const [motDePasseInscription, setMotDePasseInscription] = useState([])

  const handleSubmit = () => {
    axios
      .post("http://localhost:4242/utilisateur", {
        Nom: nomInscription,
        Prenom: prenomInscription,
        Pseudo: pseudoInscription,
        Mail: mailInscription,
        MotDePasse: motDePasseInscription,
      })
      .then((res) => res.data)
  }

  const handleSignInClick = () => {
    setIsSignIn(true)
  }

  const handleSignUpClick = () => {
    setIsSignIn(false)
  }
  return (
    <div className={`container ${isSignIn ? "sign-in-mode" : "sign-up-mode"}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form
            action="#"
            className={`sign-in-form ${isSignIn ? "active" : ""}`}
          >
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Login" className="btn solid" />
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
            <h2 className="title">Sign up</h2>
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
              value="Sign up"
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
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign up
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
              Tu est déjà un membre de l'association, connecte toi opur de
              nouvelles aventures.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img src="img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  )
}

export default AuthForm
