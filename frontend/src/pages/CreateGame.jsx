import React, { useState } from "react"
import axios from "axios"
import "./CreateGame.scss"
import NavBar from "../components/NavBar/NavBar"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import jwtDecode from "jwt-decode"

const CreateGame = () => {
  const navigate = useNavigate()

  const [titre, setTitre] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [nbMaxJoueurs, setNbMaxJoueurs] = useState(4)
  // const [niveauDifficulte, setNiveauDifficulte] = useState("moyen")
  const [lieu, setLieu] = useState("ECE Malijai")
  const [dureeEstimee, setDureeEstimee] = useState("")
  const [photoScenario, setPhotoScenario] = useState(null)
  const [type, setType] = useState("jeux")

  const token = localStorage.getItem("authToken")
  let idMaitreDuJeu = null

  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      idMaitreDuJeu = decodedToken.id
    } catch (error) {
      toast.error("Erreur d'authentification. Veuillez vous reconnecter.")
      navigate("/login")
      return null
    }
  } else {
    toast.error("Vous devez être connecté pour créer une partie.")
    navigate("/login")
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!titre || !description || !date || !lieu || !dureeEstimee) {
      toast.error("Veuillez remplir tous les champs requis.")
      return
    }

    const formData = new FormData()
    formData.append("titre", titre)
    formData.append("description", description)

    const formattedDate = new Date(date)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19)
    formData.append("date", formattedDate)
    formData.append("nb_max_joueurs", parseInt(nbMaxJoueurs, 10))
    // formData.append("niveau_difficulte", niveauDifficulte)
    formData.append("lieu", lieu)
    formData.append("duree_estimee", parseInt(dureeEstimee, 10))
    formData.append("type", type)
    formData.append("id_maitre_du_jeu", idMaitreDuJeu)

    if (photoScenario) {
      formData.append("photo_scenario", photoScenario)
    }

    const loadingToast = toast.loading("Création de la partie en cours...")

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parties`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 201) {
        toast.update(loadingToast, {
          render: "La partie a été créée avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })

        // Réinitialisation des champs
        setTitre("")
        setDescription("")
        setDate("")
        setNbMaxJoueurs(4)
        // setNiveauDifficulte("moyen")
        setLieu("")
        setDureeEstimee("")
        setPhotoScenario(null)
        setType("jeux")

        setTimeout(() => {
          navigate("/parties")
        }, 3000)
      } else {
        toast.update(loadingToast, {
          render: "Erreur lors de la création de la partie.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: "Une erreur est survenue lors de la création de la partie.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
      console.error("Erreur lors de la création de la partie :", error)
    }
  }

  const handleFileChange = (e) => {
    setPhotoScenario(e.target.files[0])
  }

  return (
    <>
      <NavBar />
      <div className="creer-partie-container">
        <h1>Créer une nouvelle partie</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
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
          {/* <div className="form-group">
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
          </div> */}
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
          <div className="form-group">
            <label htmlFor="photoScenario">Photo du scénario</label>
            <input
              type="file"
              id="photoScenario"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn-submit">
            Créer la partie
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateGame
