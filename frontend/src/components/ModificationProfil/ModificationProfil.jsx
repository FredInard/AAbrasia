import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import jwtDecode from "jwt-decode"
import ChangePassword from "./ChangePassword.jsx"
import "./ModificationProfil.scss"

export default function ModificationProfil() {
  const [utilisateur, setUtilisateur] = useState({})
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    pseudo: "",
    date_naissance: "",
    adresse: "",
    ville: "",
    telephone: "",
    bio: "",
    photo_profil: null,
  })
  const [imageUrl, setImageUrl] = useState(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  console.info("formData", formData)

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("authToken")
  console.info("Token récupéré :", token)

  let idUser = null

  if (token && token.trim() !== "") {
    try {
      const decodedToken = jwtDecode(token)
      idUser = decodedToken.id // Assurez-vous que l'ID est bien sous la clé 'id'
      console.info("idUser", idUser)
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error)
      // Gérer le cas où le token est invalide
      // Par exemple, rediriger vers la page de connexion
    }
  } else {
    console.error(
      "Aucun token valide trouvé. L'utilisateur n'est pas authentifié."
    )
    // Rediriger vers la page de connexion ou afficher un message d'erreur
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  // Charger les données utilisateur depuis le backend
  useEffect(() => {
    if (idUser) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUser}`, {
          headers,
        })
        .then((res) => {
          setUtilisateur(res.data)
          setFormData({
            nom: res.data.nom || "",
            prenom: res.data.prenom || "",
            email: res.data.email || "",
            pseudo: res.data.pseudo || "",
            date_naissance: res.data.date_naissance || "",
            adresse: res.data.adresse || "",
            ville: res.data.ville || "",
            telephone: res.data.telephone || "",
            bio: res.data.bio || "",
            photo_profil: null,
          })
          if (res.data.photo_profil) {
            setImageUrl(
              `${import.meta.env.VITE_BACKEND_URL}/${res.data.photo_profil}`
            )
          }
        })
        .catch((err) => {
          console.error("Problème lors du chargement de l'utilisateur", err)
        })
    } else {
      console.error(
        "ID utilisateur non disponible. Impossible de charger les données utilisateur."
      )
      // Gérer le cas où l'ID utilisateur n'est pas disponible
    }
  }, [idUser])

  // Mettre à jour l'image quand l'utilisateur change
  useEffect(() => {
    if (utilisateur.photo_profil) {
      setImageUrl(
        `${import.meta.env.VITE_BACKEND_URL}/${utilisateur.photo_profil}`
      )
    }
  }, [utilisateur.photo_profil])

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Gérer l'upload de la photo de profil
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prevData) => ({
      ...prevData,
      photo_profil: file,
    }))
    setImageUrl(URL.createObjectURL(file))
  }

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Vérifier le contenu de formData
    console.info("Contenu de formData avant la soumission :", formData)

    const formDataToSend = new FormData()

    // Ajouter les champs texte
    for (const key in formData) {
      if (key !== "photo_profil") {
        formDataToSend.append(key, formData[key])
      }
    }

    // Ajouter le fichier s'il existe
    if (formData.photo_profil) {
      formDataToSend.append("photo_profil", formData.photo_profil)
    }

    // Afficher les données envoyées
    console.info("Contenu de formDataToSend :")
    for (const pair of formDataToSend.entries()) {
      console.info(`${pair[0]}: ${pair[1]}`)
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUser}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        toast.success("Profil mis à jour avec succès")
        setUtilisateur(response.data) // Mettre à jour les informations utilisateur
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error)
      toast.error("Erreur lors de la mise à jour du profil")
    }
  }

  // Ouvrir le modal de changement de mot de passe
  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true)
  }

  // Fermer le modal de changement de mot de passe
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false)
  }

  return (
    <div className="modificationProfil">
      <h2>Modifier le profil</h2>
      <form onSubmit={handleSubmit} className="formProfil">
        {/* Champ Nom */}
        <div className="form-group">
          <label htmlFor="nom">Nom*</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Prénom */}
        <div className="form-group">
          <label htmlFor="prenom">Prénom*</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Email */}
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Pseudo */}
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo*</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Date de Naissance */}
        <div className="form-group">
          <label htmlFor="date_naissance">Date de naissance</label>
          <input
            type="date"
            id="date_naissance"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
          />
        </div>

        {/* Champ Adresse */}
        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
        </div>

        {/* Champ Ville */}
        <div className="form-group">
          <label htmlFor="ville">Ville</label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
          />
        </div>

        {/* Champ Téléphone */}
        <div className="form-group">
          <label htmlFor="telephone">Téléphone</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </div>
        {/* Champ Bio */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {/* Champ Photo de Profil */}
        <div className="form-group">
          <label htmlFor="photo_profil">Photo de profil</label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Photo de profil"
              className="profilPictureChange"
            />
          )}
          <input
            type="file"
            id="photo_profil"
            name="photo_profil"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn-update">
          Mettre à jour
        </button>
      </form>

      <button
        className="openChangePasswordButton"
        onClick={openChangePasswordModal}
      >
        Changer le mot de passe
      </button>

      {showChangePasswordModal && (
        <ChangePassword
          isOpen={showChangePasswordModal}
          onClose={closeChangePasswordModal}
          onPasswordChangeSuccess={closeChangePasswordModal}
        />
      )}

      <ToastContainer />
    </div>
  )
}
