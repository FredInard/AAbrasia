import React, { useState } from "react"
import "./Home.scss"

import Calendar from "../components/schedule/Calendar"
import NavBar from "../components/NavBar/NavBar"
import Image1 from "../assets/pics/headerPictureD.png"
import iNeedYou from "../assets/pics/iNeedYou.svg"
import reflective from "../assets/pics/characterReflectivePose.svg"
import team from "../assets/pics/teamB.svg"
import logoArpenteur from "../assets/pics/logoArpenteur.svg"
// import logo from "../assets/pics/logo.svg"
// import Carrousel from "../components/Carrousel/Carrousel"
import Footer from "../components/Footer/Footer"
import iconeDiscorde from "../assets/pics/discord.svg"
import iconeFacebook from "../assets/pics/facebook.svg"
import iconeMail from "../assets/pics/mail.svg"
import give from "../assets/pics/give.svg"
import GameList from "../components/Game/GameList"

// const images = [
//   "https://img.lamontagne.fr/dC7lKP3qe-GxvvOjOL58e7cZoN3fz7YAf9bjOeWLz9I/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDIvOTEvNjcvMjAwMDAwMjkxNjc1Nw.jpg",
//   "https://cdn-s-www.republicain-lorrain.fr/images/4C0D3920-CE05-41DC-91E6-93F0A40520CF/NW_raw/les-jeux-de-role-sur-table-sont-tout-aussi-animes-qu-en-grandeur-nature-photo-rl-1546706878.jpg",
//   "https://cdn.svc.asmodee.net/production-asmodeefrblog/uploads/2023/08/Dice_header.jpg",
// ]

export default function Home() {
  // Initialiser `selectedDate` avec la date d'aujourd'hui
  const today = new Date()
  const adjustedToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
  const formattedToday = adjustedToday.toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(formattedToday)

  // Définissez `handleDateSelect` pour mettre à jour `selectedDate`
  const handleDateSelect = (date) => {
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
    const formattedDate = adjustedDate.toISOString().split("T")[0]

    setSelectedDate(formattedDate) // Met à jour selectedDate sous un format homogène
  }

  return (
    <div>
      <NavBar className="NavBarHome" />

      <div className="home">
        {/* Section d'introduction */}
        <section className="section-intro">
          <div className="intro-text">
            <h1>
              <img src={logoArpenteur} alt="Jeux de rôle" />
              l'Association de jeux de rôle qui te fait oublier Netflix
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
          <div className="intro-image">
            <img src={team} alt="Jeux de rôle" />
          </div>
        </section>

        {/* Bouton pour découvrir l'association */}
        <div className="cta">
          <button>Découvrir l'asso</button>
        </div>

        {/* Carrousel */}
        {/* <Carrousel images={images} interval={4000} /> */}

        {/* Section : C'est quoi le jeu de rôle ? */}
        <section className="section-what-is-jdr">
          <div className="section-what-is-jdr1">
            <h2>C’est quoi le jeu de rôle ?</h2>
            <p>
              Le jeu de rôle est un loisir qui se pratique en petits groupes
              (entre 3 et 6 personnes) autour d'une table. Une personne prend le
              rôle de meneuse de jeu et raconte une histoire dans laquelle
              chacune des personnes attablées incarne un personnage. Le but est
              d’imaginer et mettre en place collectivement des solutions pour
              déjouer les pièges et mener à bien l’aventure... À condition que
              les dés le permettent !
            </p>
          </div>
          <div className="reflective-image">
            <img src={reflective} alt="Jeux de rôle" />
          </div>
        </section>

        {/* Section : Notre association */}
        <section className="section-our-association">
          <div className="divImageSectionAsso">
            <img
              src={Image1}
              alt="imageSectionAsso"
              className="imageSectionAssociation"
            />
          </div>

          <div className="section-what-is-jdr1">
            <h2>Notre association</h2>
            <p>
              L'association des Arpenteurs d'Abrasia (AA) a une double vocation
              ludique et culturelle. Elle a pour objet de réunir des joueurs et
              joueuses de façon régulière autour de tables de jeu de rôle (jdr)
              afin de partager des moments conviviaux et inclusifs. Elle se
              donne pour mission de créer du lien social, d'une part en créant
              des espaces de jeu mixtes et bienveillants pour toute personne
              souhaitant la rejoindre, d'autre part en allant vers des publics
              en recherche de sociabilité et/ou isolés.
            </p>
          </div>
        </section>

        {/* Section : Notre Agenda */}
        <section className="section-agenda">
          <h2>Notre Agenda</h2>
          <p>Rejoins une de nos parties ou viens découvrir l'association.</p>
          <Calendar onDateSelect={handleDateSelect} />
          <GameList selectedDate={selectedDate} />
        </section>

        {/* Section : Team */}
        <section className="section-team">
          <h2>Notre Équipe</h2>
          <p>Voici la team de l'association</p>
          <button>Découvrir toute la team</button>
        </section>
        <div className="section-HelloAsso">
          <h2>Nous soutenir sur HelloAsso</h2>
          <div className="boxHelloAsso">
            <div className="helloAsso1">
              <img
                src={iNeedYou}
                alt="imageSectionAsso"
                className="imageSectionAssociation"
              />
              <p>Parceque donner c'est bien, mais a nous c'est mieux.</p>
            </div>
            <div className="helloAsso2">
              <a
                href="https://www.helloasso.com/associations/les-arpenteurs-d-abrasia"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="contact-icon" src={give} alt="Logo HelloAsso" />
              </a>
            </div>
          </div>
        </div>
        {/* Section : Nous contacter */}
        <section className="section-contact">
          <h2>Nous contacter</h2>
          <p>
            Pour nous contacter, rien de plus simple : clique sur le média de
            ton choix
          </p>

          <div className="contact-links">
            {/* Nos amis */}
            <div className="contact-section">
              <h3>Nos amis</h3>
              <p>Liens vers d’autres associations du 04 :</p>
              <ul>
                <li>
                  <a
                    href="http://lien-vers-espace-de-jeu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    L’Espace de Jeu
                  </a>
                </li>
                <li>
                  <a
                    href="http://lien-vers-ece-malijai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ECE de Malijai
                  </a>
                </li>
              </ul>
            </div>

            {/* Partenaires */}
            <div className="contact-section">
              <h3>Partenaires</h3>
              <p>Liens vers les sites de nos partenaires :</p>
              <ul>
                <li>
                  <a
                    href="http://lien-vers-theatre-durance"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Théâtre Durance
                  </a>
                </li>
                <li>
                  <a
                    href="http://lien-vers-librairie"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Librairie [Nom]
                  </a>
                </li>
                <li>
                  <a
                    href="http://lien-vers-mediatheque"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Médiathèque [Nom]
                  </a>
                </li>
              </ul>
            </div>

            {/* Abrasia */}
            <div className="contact-section">
              <h3>Abrasia</h3>
              <p>Découvrez l'univers d'Abrasia sur World Anvil :</p>
              <a
                href="http://lien-vers-worldanvil-abrasia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lien vers Abrasia
              </a>
            </div>

            {/* Payer sa cotisation */}

            {/* Nous rejoindre sur */}
            <div className="contact-section">
              <h3>Nous rejoindre sur :</h3>
              <div className="social-icons">
                <a
                  href="https://discord.gg/Vv3Fa4DwYK"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="contact-icon"
                    src={iconeDiscorde}
                    alt="Logo Discord"
                  />
                </a>
                <a
                  href="https://www.facebook.com/arpenteurs.abrasia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="contact-icon"
                    src={iconeFacebook}
                    alt="Logo Facebook"
                  />
                </a>
                <a href="mailto:arpenteurs.jdr@gmail.com">
                  <img
                    className="contact-icon"
                    src={iconeMail}
                    alt="Logo Email"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
