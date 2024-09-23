import React from "react"
import "./Home.scss"

import Calendar from "../components/schedule/Calendar"
import NavBar from "../components/NavBar/NavBar"
import Image1 from "../assets/newA1.1.webp"
import Carrousel from "../components/Carrousel/Carrousel"

const images = [
  "https://via.placeholder.com/800x400/FFBB52/FFFFFF?text=Slide+1",
  "https://via.placeholder.com/800x400/52BBFF/FFFFFF?text=Slide+2",
  "https://via.placeholder.com/800x400/FF52BB/FFFFFF?text=Slide+3",
]

export default function Home() {
  return (
    <div>
      <NavBar className="NavBarHome" />

      {/* Introduction Section */}

      <div className="home">
        <div className="intro">
          <div className="intro1">
            <h1>
              Plongez dans l'aventure avec l'Association de jeux de rôle des
              Arpenteurs d'Abrasia
            </h1>
            <p>
              Bienvenue, <br />
              Les Arpenteurs d’Abrasia sont une association qui organise des
              parties de jeu de rôle sur table. Nous jouons principalement (mais
              pas que) dans un univers fantastique nommé Abrasia, et tout le
              monde est bienvenu·e, néophytes ou vétérans, pour créer des
              moments conviviaux de rires et d’aventures !
            </p>
          </div>
          <div className="intro2">
            <img src={Image1} alt="Jeux de rôle" />
          </div>
        </div>

        {/* Button to Discover Association */}
        <div className="cta">
          <button>Découvrir l'asso</button>
        </div>
        <Carrousel images={images} interval={4000} />
        {/* Section: C'est quoi le jeu de rôle ? */}
        <div className="info1">
          <h2>C’est quoi le jeu de rôle ?</h2>
          <p>
            Le jeu de rôle est un loisir qui se pratique en petits groupes
            (entre 3 et 6 personnes) autour d'une table. Une personne prend le
            rôle de meneuse de jeu et raconte une histoire dans laquelle chacune
            des personnes attablées incarne un personnage. Le but est d’imaginer
            et mettre en place collectivement des solutions pour déjouer les
            pièges et mener à bien l’aventure... À condition que les dés le
            permettent !
          </p>
        </div>

        {/* Association Section */}
        <div className="info1">
          <h2>Notre association</h2>
          <p>
            L'association des Arpenteurs d'Abrasia (AA) a une double vocation
            ludique et culturelle. Elle a pour objet de réunir des joueurs et
            joueuses de façon régulière autour de tables de jeu de rôle (jdr)
            afin de partager des moments conviviaux et inclusifs. Elle se donne
            pour mission de créer du lien social, d'une part en créant des
            espaces de jeu mixtes et bienveillants pour toute personne
            souhaitant la rejoindre, d'autre part en allant vers des publics en
            recherche de sociabilité et/ou isolés.
          </p>
        </div>

        {/* Agenda Section */}
        <div className="info1">
          <h2>Notre Agenda</h2>
          <p>Rejoins une de nos parties ou viens découvrir l'association.</p>
          <Calendar />
        </div>

        {/* Team Section */}
        <div className="info1">
          <h2>Team</h2>
          <p>Voici la team de l'association</p>
          <button>Découvrir toute la team</button>
        </div>

        {/* Contact Section */}
        <div className="info1">
          <h2>Nous contacter</h2>
          <p>
            Pour nous contacter, rien de plus simple : clique sur le média de
            ton choix
          </p>
          <button>Nous contacter</button>
        </div>

        {/* Footer - À implémenter plus tard */}
        {/* <footer /> */}
      </div>
    </div>
  )
}
