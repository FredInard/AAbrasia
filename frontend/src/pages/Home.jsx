import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/fr"
import "react-big-calendar/lib/css/react-big-calendar.css"

// import Citadel from "../assets/pics/CitadelOfSisteron.svg"
// import questioningFemale from "../assets/pics/femaleWarrior.svg"
// import wizard from "../assets/pics/wizard.svg"
// import BrushDown from "../assets/pics/BrushDown.svg"
// import scene from "../assets/pics/banner.svg"
// import BrushUp from "../assets/pics/BrushUp.svg"
// import AdventurFriends from "../assets/pics/goAdventure.png"
import King from "../assets/pics/medievalKing.svg"
import Queen from "../assets/pics/queen.svg"
import Merchan from "../assets/pics/portraitOfMerchant.png"
import Elf1 from "../assets/pics/elfLikeDnD.svg"
import Elf2 from "../assets/pics/elfLikeDnD2.jpg"
import wizard2 from "../assets/pics/wizard2.jpg"
import logoAiW from "../assets/pics/logoAiW.svg"
import LogoPlayers from "../assets/pics/playerIcon.svg"
import iconeDiscorde from "../assets/pics/iconeDiscorde.svg"
import iconeFacebook from "../assets/pics/iconeFacebook2.svg"
import iconeMail from "../assets/pics/iconeGmail.svg"

import "./Home.scss"
import NavBar from "../components/NavBar"
import DisplayPlayers from "../components/DisplayPlayers"
import Modal from "../components/Modal"

export default function Home() {
  const [parties, setParties] = useState([])
  const [postData, setPostData] = useState(null)
  const [isPostCardsOpen, setIsPostCardsOpen] = useState(false)
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }
  const localizer = momentLocalizer(moment)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/affichage`, { headers })
      .then((res) => setParties(res.data))
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [])

  const handlePostClick = (allPostData) => {
    setIsPostCardsOpen(true)
    setPostData(allPostData)
  }

  const images = [King, Queen, Merchan, Elf1, Elf2, wizard2]

  const [indexVisible, setIndexVisible] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexVisible((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="ContaineurPrincipal">
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
        <div className="scene">
          <div className="containeurLogo">
            <img
              className="logoBaner"
              src={logoAiW}
              alt="logo de l association les arpenteur d abrasia"
            />
          </div>
        </div>

        <div className="containeurPresentation">
          <div className="containeurPresentationbis">
            <div className="titreh2">
              <h2>
                Oubliez Netflix pour plongez dans l'aventure avec l'Association
                de jeux de role des Arpenteurs d'Abrasia
              </h2>
            </div>
            <div className="boxMage">
              <div className="boxTextMage">
                <p>
                  Bienvenue, <br />
                  Les Arpenteurs d’Abrasia sont une association qui organise des
                  parties de jeu de rôle sur table. Nous jouons principalement
                  (mais pas que) dans un univers fantastique nommé Abrasia, et
                  tout le monde est bienvenu·e, néophytes ou vétérans, pour
                  créer des moments conviviaux de rires et d’aventures !
                </p>
              </div>
              <div className="boxImageMage"></div>
            </div>
          </div>
          <div className="boxPresentationJDR">
            <div className="boxTextPresentationJDR">
              <p>
                C’est quoi le jeux de rôle ? Le jeu de rôle est un loisir qui se
                pratique en petits groupes (entre 3 et 6 personnes) autour d'une
                table. Une personne prend le rôle de meneuse de jeu et raconte
                une histoire dans laquelle chacune des personnes attablées
                incarne un personnage. Le but est d’imaginer et mettre en place
                collectivement des solutions pour déjouer les pièges et mener à
                bien l’aventure... À condition que les dés le permettent !
              </p>
            </div>
            <div className="boxImagePresentationJDR"></div>
          </div>
          <div className="boxCitadel">
            <div className="boxTextCitadel">
              <p>
                Présentation de l’asso L'association des Arpenteurs d'Abrasia
                (AA) a une double vocation ludique et culturelle. Elle a pour
                objet de réunir des joueurs et joueuses de façon régulière
                autour de tables de jeu de rôle (jdr) afin de partager des
                moments conviviaux et inclusifs.
              </p>
            </div>
            <div className="boxTextCitadelBis">
              <p>
                Elle se donne pour mission de créer du lien social, d'une part
                en créant des espaces de jeu mixtes et bienveillants pour toute
                personne souhaitant la rejoindre, d'autre part en allant vers
                des publics en recherche de sociabilité et/ou isolés, tels que
                les personnes retraitées ou les adolescents. L'association
                entend développer un volet culturel en organisant des ateliers
                d'écriture comme un complément des activités de jeu de rôle, des
                groupes de lecture, voire d'autres activités liées à la
                production de l'imaginaire.
              </p>
            </div>
            <div className="boxImageCitadel"></div>
          </div>
        </div>
      </div>
      <div className="agendaDesParties" id="agenda">
        <div className="titreAPartie">
          <h2>Agenda des parties</h2>
        </div>

        <div className="agenda">
          <Calendar
            localizer={localizer}
            events={parties} // Utilisez la propriété "events" au lieu de "parties"
            views={["month"]}
            defaultView="month"
            culture={"fr"}
            startAccessor="start"
            endAccessor="end"
            formats={{
              dayFormat: "ddd DD/MM",
              dayHeaderFormat: "ddd",
              dayRangeHeaderFormat: ({ start, end }) => {
                const startDate = moment(start).format("MMM DD")
                const endDate = moment(end).format("MMM DD")
                return `${startDate} - ${endDate}`
              },
              weekdayFormat: "dddd", // Format du jour de la semaine
            }}
          />
        </div>

        {!isPostCardsOpen && (
          <div className="containeurCards">
            {parties.map((partie) => (
              <div
                key={partie.id}
                className="globalContainerCard"
                onClick={() => handlePostClick(partie)}
              >
                <div className="titleContainerCard">{partie.Titre}</div>
                <div className="miniBoxInfo">
                  <div className="allInfoItem">
                    <div className="infoItem">Date : {partie.Date}</div>
                    <div className="infoItem">Heure : {partie.Heure}</div>
                    <div className="infoItem">Lieu : {partie.Lieu}</div>
                    <div className="infoItem">
                      Maitre du jeu : {partie.PseudoMaitreDuJeu}
                    </div>
                    <div className="infoItem">Type : {partie.TypeDeJeux}</div>
                    {/* <button onClick={() => handlePostClick(partie)}>
                      Voir les détails
                    </button> */}
                  </div>
                  <div className="maxPlayerInfoItem">
                    <div className="logoPlayerAndMaxPlayer">
                      <img
                        className="logoPlayer"
                        src={LogoPlayers}
                        alt="logo d'un joueur"
                      />
                      X{partie.NombreJoueur}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="boxLienAsso">
        <h2>Nos amis</h2>
        <p>Liens vers d’autres assos du 04</p>
        L’espace de jeu
        <p></p>Lien vers la page de l’ECE de Malijai
        <h2>Partenaires</h2>
        <p>
          Lien vers les sites du Théâtre Durance, Librairie, Médiathèque, etc...
        </p>
        <h2>Abrasia</h2>
        <p>Lien vers le site worldanvil d’Abrasia</p>
        <h2>Payer sa cotisation sur HelloAsso</h2>
        <h2>Nous rejoindre sur :</h2>
        <img src={iconeDiscorde} alt="logo Discorde" />
        <img src={iconeFacebook} alt="logo Discorde" />
        <img src={iconeMail} alt="logo Discorde" />
      </div>

      <Modal isOpen={isPostCardsOpen} onClose={() => setIsPostCardsOpen(false)}>
        {postData && <DisplayPlayers postData={postData} />}
      </Modal>
    </>
  )
}
