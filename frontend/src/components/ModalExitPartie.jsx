import axios from "axios"
import Cookies from "js-cookie"
import "./ModalExitPartie.scss"

function ModificationPartieModal({ isOpen, onClose, partie }) {
  const idUser = Cookies.get("idUtilisateur")
  const idDuUser = parseInt(idUser)
  const idMaitreDuJeu = partie.MaitreDuJeu
  const idExitPartie = partie.PartieId
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const handleSaveChanges = () => {
    axios
      .delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/participation/delete/${idDuUser}/${idExitPartie}`,

        { headers }
      )
      .then((res) => {
        console.info(
          "L'annulation de la  participation à la partie réussi :",
          res.data
        )
        onClose()
      })

      .catch((error) => {
        // Gérer les erreurs
        console.error(
          "L'annulation de la participation à la partie à echoué :",
          error
        )
      })
  }

  console.info(
    "partie :",
    partie.PartieId,
    "idUser : ",
    idDuUser,
    "idExitPartie :",
    idExitPartie,
    "idMaitreDuJeu : ",
    idMaitreDuJeu
  )

  return (
    <div className={`modalModificationPartie ${isOpen ? "open" : ""}`}>
      <div className="modalModificationPartie-content">
        <h2 className="">Souhaites-tu vraiment te retirer de l'aventure ? </h2>

        <button type="buttonExitPartie" onClick={handleSaveChanges}>
          <h3 className="modalModificationPartieH3">
            {" "}
            Oui, malheureusement...
          </h3>
        </button>
        <button type="buttonExitPartieNo" onClick={onClose}>
          <h3>Annuler</h3>
        </button>
      </div>
    </div>
  )
}

export default ModificationPartieModal
