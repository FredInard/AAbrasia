// import { useState, useEffect } from "react"
// import axios from "axios"
import "./Inscription.scss"
// import wizardWomanImage from "../assets/pics/wizard_woman.png"
import AuthForm from "../components/AuthForm"

export default function Inscription() {
  // const [nomInscription, setNomInscription] = useState([])
  // const [prenomInscription, setPrenomInscription] = useState([])
  // const [pseudoInscription, setPseudoInscription] = useState([])
  // const [mailInscription, setMailInscription] = useState([])
  // const [telephoneInscription, setTelephoneInscription] = useState([])
  // const [pseudoDiscordInscription, setPseudoDiscordInscription] = useState([])
  // const [descriptionInscription, setDescriptionInscription] = useState([])
  // const [photoProfilInscription, setPhotoProfilInscription] = useState([])
  // const [villeResidenceInscription, setVilleResidenceInscription] = useState([])
  // const [motDePasseInscription, setMotDePasseInscription] = useState([])

  // const handleSubmit = () => {
  //   axios
  //     .post("http://localhost:4242/utilisateur", {
  //       Nom: nomInscription,
  //       Prenom: prenomInscription,
  // Pseudo: pseudoInscription,
  // Mail: mailInscription,
  // Telephone: telephoneInscription,
  // PseudoDiscord: pseudoDiscordInscription,
  // Description: descriptionInscription,
  // PhotoProfil: photoProfilInscription,
  // VilleResidence: villeResidenceInscription,
  //       MotDePasse: motDePasseInscription,
  //     })
  //     .then((res) => setutilisateurs(res.data))
  // }

  return (
    <>
      {/* <div className="boxTitreInscription">
        <h1 className="TitreInscription">Inscription</h1>
      </div> */}

      <div>
        <AuthForm />
      </div>
      {/* <div>
          <img
            className="imagewomanwizard"
            src={wizardWomanImage}
            alt="An image of a wizard woman with glasses"
          />
          </div> */}

      {/* <div className="globalContenairInscription">
        <div className="contenaireInscription">
          <p>Nom</p>
          <input
            className="textaréacss"
            type="text"
            value={nomInscription}
            onChange={(e) => setNomInscription(e.target.value)}
            placeholder="Nom"
          />

          <p>Prénom</p>
          <input
            className="textaréacss"
            type="text"
            value={prenomInscription}
            onChange={(e) => setPrenomInscription(e.target.value)}
            placeholder="Saisissez votre Prénom"
          /> */}

      {/* <p>Pseudo</p>
          <input
            className="textaréacss"
            type="text"
            value={pseudoInscription}
            onChange={(e) => setPseudoInscription(e.target.value)}
            placeholder="Saisissez un pseudo"
          /> */}

      {/* <p>Mail</p>
          <input
            className="textaréacss"
            type="text"
            value={mailInscription}
            onChange={(e) => setMailInscription(e.target.value)}
            placeholder="Saisissez votre mail"
          /> */}

      {/* <p>Téléphone</p>
          <input
            className="textaréacss"
            type="text"
            value={telephoneInscription}
            onChange={(e) => setTelephoneInscription(e.target.value)}
            placeholder="Saisissez votre numéro de téléphone"
          /> */}

      {/* <p>Pseudo Discord</p>
          <input
            className="textaréacss"
            type="text"
            value={pseudoDiscordInscription}
            onChange={(e) => setPseudoDiscordInscription(e.target.value)}
            placeholder="Saisissez votre psuedo Discord"
          /> */}

      {/* <p>Description</p>
          <input
            className="textaréacss"
            type="text"
            value={descriptionInscription}
            onChange={(e) => setDescriptionInscription(e.target.value)}
            placeholder="Saisissez votre description"
          /> */}

      {/* <p>Photo de profil</p>
          <input
            className="textaréacss"
            type="text"
            value={photoProfilInscription}
            onChange={(e) => setPhotoProfilInscription(e.target.value)}
            placeholder="Une photo de profil ca fait toujour plaisir"
          /> */}

      {/* <p>Ville</p>
          <input
            className="textaréacss"
            type="text"
            value={villeResidenceInscription}
            onChange={(e) => setVilleResidenceInscription(e.target.value)}
            placeholder="Tu habite où? C'est pour venir boire l'appéro."
          /> */}

      {/* <p>Mot de passe*</p>
          <input
            className="textaréacss"
            type="text"
            value={motDePasseInscription}
            onChange={(e) => setMotDePasseInscription(e.target.value)}
            placeholder="Mot de passe 👨‍💻"
          /> */}

      {/* <button onClick={handleSubmit}>Créer mon profil</button>
        </div> */}

      {/* </div> */}
    </>
  )
}
