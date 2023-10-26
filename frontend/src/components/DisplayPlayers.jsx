import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./DisplayPlayers.scss"
import PlayerInfoModal from "./PlayerInfoModal"
import { Link } from "react-router-dom"
import SubmitButton from "./SubmitButton"

export default function DisplayPlayers({ postData }) {
  const [modalPlayerIsOpen, setModalPlayerIsOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [allPosts, setAllPosts] = useState([])
  const [xJoueurs, setXJoueurs] = useState([])
  const idUser = Cookies.get("idUtilisateur")
  const idUserNumber = parseInt(idUser, 10)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const openPlayerInfoModal = (post) => {
    if (tokenFromCookie) {
      setSelectedPlayer(post)
      setModalPlayerIsOpen(true)
    }
    // Vous pouvez également afficher un message à l'utilisateur ou effectuer une autre action si l'utilisateur n'est pas connecté.
  }

  const closePlayerInfoModal = () => {
    setSelectedPlayer(null)
    setModalPlayerIsOpen(false)
  }

  useEffect(() => {
    console.info("l'axios pour allPosts en cours")
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/displayPlayers/${
          postData.PartieId
        }`,
        { headers }
      )
      .then(
        (res) => setAllPosts(res.data),
        console.info("l'axios pour allPosts a correctement fonctionné")
      )

      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des sujets.",
          error
        )
        console.info("l'axios pour allPosts n'a pas fonctionné")
        // Gérez l'erreur ici (peut-être un message à l'utilisateur)
      })
  }, [xJoueurs])

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/partie/count/${postData.PartieId}`,
        { headers }
      )
      .then((res) => setXJoueurs(res.data))
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des sujets.",
          error
        )
        // Gérez l'erreur ici (peut-être un message à l'utilisateur)
      })
  }, [xJoueurs])

  const handleSuscribeGame = (e) => {
    e.preventDefault()
    // Ajoutez une vérification côté serveur ici
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/participation/count/${idUserNumber}/${postData.PartieId}`,
        { headers }
      )
      .then((checkResponse) => {
        if (checkResponse.data.isSubscribed) {
          console.info("L'utilisateur est déjà inscrit à cette partie.")
          // Gérez le cas où l'utilisateur est déjà inscrit (peut-être afficher un message à l'utilisateur)
        } else {
          // Si l'utilisateur n'est pas déjà inscrit, inscrivez-le à la partie
          axios
            .post(
              `${import.meta.env.VITE_BACKEND_URL}/participation`,
              {
                Utilisateurs_Id: idUserNumber,
                Partie_Id: postData.PartieId,
                Partie_IdMaitreDuJeu: postData.MaitreDuJeu,
              },
              { headers }
            )
            .then((res) => {
              if (res.status === 200) {
                console.info("L'utilisateur à rejoin la partie avec succès !")
              }
              // document.getElementById("createGameForm").reset()
            })
            .catch((error) => {
              console.error(
                "Erreur l'utilisateur n'a pas put rejoindre la partie :",
                error
              )
            })
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la vérification de l'inscription :",
          error
        )
      })
  }
  console.info("postData:", postData)
  console.info("allPosts:", allPosts)
  // console.info("idUserNumber:", idUserNumber)
  // console.info("postData.PartieId:", postData.PartieId)
  // console.info("NombreJoueur:", postData.NombreJoueur)
  // console.info("nbParticipants:", xJoueurs.nbParticipants)
  // console.info("MaitreDuJeu:", postData.MaitreDuJeu)

  return (
    <div className="displayPlayers-container">
      <div className="titreDisplayPlayer">
        <h2>{postData.Titre}</h2>
        <p>{postData.Description}</p>
        <h3>Meneur de partie :</h3>
        <img
          className="photoMaitreDuJeux"
          src={`${import.meta.env.VITE_BACKEND_URL}/${
            postData.PhotoProfilMaitreDuJeu
          }`}
          alt="photo de profil du meneur de partie"
        />
        <div className="photoMaitreDuJeux">{postData.PseudoMaitreDuJeu}</div>
      </div>
      <div className="titreDisplayPlayer">
        <h2>Participants :</h2>
      </div>
      <div className="mapParticipants">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div className="postCardDisplayPlayer" key={post.id}>
              <img
                className="photoProfilDisplayPlayer"
                src={`${import.meta.env.VITE_BACKEND_URL}/${post.PhotoProfil}`}
                alt="photo de profil de l'utilisateur"
                onClick={() => openPlayerInfoModal(post)}
              />
              <div className="post-details">
                <div className="userNameDisplayPlayer">{post.Pseudo}</div>
              </div>
            </div>
          ))
        ) : (
          <p>Chargement en cours...</p>
        )}
      </div>
      <div className="mapPlacesDisponibles">
        <h2>Places disponibles :</h2>
        {postData.NombreJoueur - xJoueurs.nbParticipants > 0 ? (
          <>
            <p>
              Il reste {postData.NombreJoueur - xJoueurs.nbParticipants}{" "}
              place(s), inscris-toi !
            </p>
            {!idUserNumber && (
              <Link className=" " to="/Inscription">
                <button className="buttonJoinAdventure">Inscris-toi</button>
              </Link>
            )}
            {idUserNumber && idUserNumber !== postData.MaitreDuJeu && (
              <div className="buttonJoinAdventure" onClick={handleSuscribeGame}>
                <SubmitButton />
              </div>
            )}
            {idUserNumber === postData.MaitreDuJeu && (
              <p>Vous ne pouvez pas vous inscrire à votre propre partie.</p>
            )}
          </>
        ) : (
          <p>
            Désolé, l'aventure est victime de son succès. Il n'y a plus de place
            pour cette partie.
          </p>
        )}
      </div>
      <PlayerInfoModal
        player={selectedPlayer}
        isOpen={modalPlayerIsOpen}
        onClose={closePlayerInfoModal}
      />
    </div>
  )
}
