import React, { useState } from "react"
import axios from "axios"
import "./CreateGame.scss"
import NavBar from "../components/NavBar/NavBar"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" // Importation des styles pour react-toastify
import jwtDecode from "jwt-decode" // Importation de jwt-decode

const CreateGame = () => {
  const navigate = useNavigate()

  // État pour gérer les champs du formulaire
  const [titre, setTitre] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [nbMaxJoueurs, setNbMaxJoueurs] = useState(4) // Par défaut 4 joueurs
  const [niveauDifficulte, setNiveauDifficulte] = useState("moyen")
  const [lieu, setLieu] = useState("")
  const [dureeEstimee, setDureeEstimee] = useState("")
  const [photoScenario, setPhotoScenario] = useState(null) // Variable pour l'image
  const [type, setType] = useState("jeux") // Variable d'état pour "type"

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("authToken")

  // Extraire l'ID du maître du jeu depuis le token
  let idMaitreDuJeu = null

  if (token && token.trim() !== "") {
    try {
      const decodedToken = jwtDecode(token)
      idMaitreDuJeu = decodedToken.id // Assurez-vous que l'ID est bien sous la clé 'id'
      console.info("idMaitreDuJeu :", idMaitreDuJeu)
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error)
      toast.error(
        "Erreur lors de l'authentification. Veuillez vous reconnecter."
      )
      // Rediriger vers la page de connexion si nécessaire
      navigate("/login")
      return
    }
  } else {
    console.error(
      "Aucun token valide trouvé. L'utilisateur n'est pas authentifié."
    )
    toast.error("Vous devez être connecté pour créer une partie.")
    // Rediriger vers la page de connexion
    navigate("/login")
    return
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validation des données
    if (!titre || !description || !date || !lieu || !dureeEstimee) {
      toast.error("Veuillez remplir tous les champs requis")
      return
    }

    if (!idMaitreDuJeu) {
      toast.error("Utilisateur non authentifié")
      // Rediriger vers la page de connexion
      navigate("/login")
      return
    }

    try {
      // Utilisation de FormData pour envoyer des fichiers avec d'autres données
      const formData = new FormData()
      formData.append("titre", titre)
      formData.append("description", description)

      // Formatage de la date
      let formattedDate = date
      if (date) {
        const dateObj = new Date(date)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, "0")
        const day = String(dateObj.getDate()).padStart(2, "0")
        const hours = String(dateObj.getHours()).padStart(2, "0")
        const minutes = String(dateObj.getMinutes()).padStart(2, "0")
        const seconds = String(dateObj.getSeconds()).padStart(2, "0")
        formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
      formData.append("date", formattedDate)

      // Conversion du nombre de joueurs en entier
      const nbMaxJoueursInt = parseInt(nbMaxJoueurs, 10)
      formData.append("nb_max_joueurs", nbMaxJoueursInt)

      // Conversion de la durée estimée en entier
      const dureeEstimeeInt = parseInt(dureeEstimee, 10)
      formData.append("duree_estimee", dureeEstimeeInt)

      formData.append("niveau_difficulte", niveauDifficulte)
      formData.append("lieu", lieu)
      formData.append("type", type) // Ajout de "type" aux données envoyées

      // Ajout de l'ID du maître du jeu aux données envoyées
      formData.append("id_maitre_du_jeu", idMaitreDuJeu)

      if (photoScenario) {
        formData.append("photo_scenario", photoScenario) // Ajout de l'image dans formData
      }

      // Avant la requête, pour afficher le contenu de formData
      console.info("Contenu de formData :")
      for (const [key, value] of formData.entries()) {
        console.info(`${key}:`, value)
      }

      // Afficher un toast de chargement pendant la requête
      const loadingToast = toast.loading("Création de la partie en cours...")

      // Requête POST à l'API pour créer une partie
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parties`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Après la requête, pour afficher la réponse du serveur
      console.info("Réponse du serveur :", response)

      if (response.status === 201) {
        toast.update(loadingToast, {
          render: "La partie a été créée avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })
        // Réinitialisation du formulaire après succès
        setTitre("")
        setDescription("")
        setDate("")
        setNbMaxJoueurs(4)
        setNiveauDifficulte("moyen")
        setLieu("")
        setDureeEstimee("")
        setPhotoScenario(null) // Réinitialise l'image
        setType("jeux") // Réinitialise le type

        // Redirection vers la page des parties après un délai
        setTimeout(() => {
          navigate("/parties")
        }, 3000)
      } else {
        toast.update(loadingToast, {
          render: "Erreur lors de la création de la partie",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
        console.error(
          "Erreur lors de la création de la partie :",
          response.data
        )
      }
    } catch (error) {
      console.error("Erreur lors de la création de la partie :", error)
      toast.error("Une erreur est survenue lors de la création de la partie.")
    }
  }

  // Gestion du changement de fichier pour l'image
  const handleFileChange = (e) => {
    setPhotoScenario(e.target.files[0])
  }

  return (
    <>
      <NavBar />

      <div className="creer-partie-container">
        <h1>Créer une nouvelle partie</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Titre */}
          <div className="form-group">
            <label htmlFor="titre">Titre de la partie</label>
            <input
              type="text"
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="jeux">Jeux</option>
              <option value="événement">Événement</option>
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date de la partie</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Nombre maximum de joueurs */}
          <div className="form-group">
            <label htmlFor="nbMaxJoueurs">Nombre maximum de joueurs</label>
            <input
              type="number"
              id="nbMaxJoueurs"
              value={nbMaxJoueurs}
              min="1"
              onChange={(e) => setNbMaxJoueurs(e.target.value)}
              required
            />
          </div>

          {/* Niveau de difficulté */}
          <div className="form-group">
            <label htmlFor="niveauDifficulte">Niveau de difficulté</label>
            <select
              id="niveauDifficulte"
              value={niveauDifficulte}
              onChange={(e) => setNiveauDifficulte(e.target.value)}
              required
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          {/* Lieu */}
          <div className="form-group">
            <label htmlFor="lieu">Lieu</label>
            <input
              type="text"
              id="lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              required
            />
          </div>

          {/* Durée estimée */}
          <div className="form-group">
            <label htmlFor="dureeEstimee">Durée estimée (en heures)</label>
            <input
              type="number"
              id="dureeEstimee"
              value={dureeEstimee}
              min="1"
              onChange={(e) => setDureeEstimee(e.target.value)}
              required
            />
          </div>

          {/* Photo du scénario */}
          <div className="form-group">
            <label htmlFor="photoScenario">Photo du scénario</label>
            <input
              type="file"
              id="photoScenario"
              accept="image/*"
              onChange={handleFileChange} // Capture du fichier
            />
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="btn-submit">
            Créer la partie
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateGame
