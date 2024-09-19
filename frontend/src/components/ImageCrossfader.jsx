// Importation des dépendances
import React, { useState, useEffect } from "react"

// Composant pour l'animation d'images en fondu enchaîné
function ImageCrossfader({ images }) {
  const [indexVisible, setIndexVisible] = useState(0)

  // useEffect pour gérer le changement d'image à intervalle régulier
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexVisible((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change d'image toutes les 5 secondes
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="image-crossfader">
      {images.map((src, index) => (
        <img
          key={index}
          className={`image-crossfader__img ${
            index === indexVisible ? "image-crossfader__img--visible" : ""
          }`}
          src={src}
          alt={`crossfader image ${index + 1}`}
        />
      ))}
    </div>
  )
}

export default ImageCrossfader
