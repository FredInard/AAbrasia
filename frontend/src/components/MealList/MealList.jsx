import React, { useState, useEffect } from "react"
import axios from "axios"

const MealList = ({ partyId }) => {
  const [meals, setMeals] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/repas/${partyId}`)
      .then((res) => {
        setMeals(Array.isArray(res.data) ? res.data : []) // Assurez-vous que meals est un tableau
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des repas :", err)
        setError("Repas non trouvés ou problème avec l'API.")
      })
  }, [partyId])

  if (error) return <p>{error}</p>

  return (
    <div>
      <h3>Repas</h3>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <div key={meal.id}>
            <p>{meal.pseudo}</p>
            <p>
              {meal.repas_description} - Quantité : {meal.repas_quantite}
            </p>
          </div>
        ))
      ) : (
        <p>Aucun repas pour cette partie.</p>
      )}
    </div>
  )
}

export default MealList
