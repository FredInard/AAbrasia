// MealList.jsx
import React, { useState, useEffect } from "react"
import axios from "axios"

const MealList = ({ partyId }) => {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/repas/${partyId}`)
      .then((res) => setMeals(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement des repas :", err)
      )
  }, [partyId])

  if (meals.length === 0) return <p>Aucun repas pour cette partie.</p>

  return (
    <div>
      <h3>Repas</h3>
      {meals.map((meal) => (
        <div key={meal.pseudo}>
          <p>{meal.pseudo}</p>
          <p>
            {meal.repas_description} - Quantité : {meal.repas_quantite}
          </p>
        </div>
      ))}
    </div>
  )
}

export default MealList
