import axios from "axios" // Vous n'avez pas besoin de déstructurer axios
import Cookies from "js-cookie"
import "./ModalConfirmSupresPartie.scss"

export function ConfirmationModal({
  isOpen,
  onClose,
  selectedPartieIdToDelete,
}) {
  if (!isOpen) {
    return null
  }

  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  const handleConfirmDelete = () => {
    // Ne pas redéclarer selectedPartieIdToDelete ici
    console.info("partieId", selectedPartieIdToDelete)
    axios
      .delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/partie/participation/${selectedPartieIdToDelete}`,
        {
          headers,
        }
      )
      .then((results) => {
        console.info("Partie supprimée avec succès !")
        // Effectuez toute autre action nécessaire après la suppression de la partie ici
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la partie :", error)
        // Gérez l'erreur ici (peut-être afficher un message d'erreur à l'utilisateur)
      })

    onClose() // Fermez la fenêtre modale
  }

  const handleCancelDelete = () => {
    onClose() // Fermez la fenêtre modale
  }

  return (
    <div className="confirmationSupresmodal">
      <p>Êtes-vous sûr de vouloir supprimer cette partie ?</p>
      <button onClick={handleConfirmDelete}>Oui</button>
      <button onClick={handleCancelDelete}>Annuler</button>
    </div>
  )
}

export default ConfirmationModal
