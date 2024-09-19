// Importation des dépendances
import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Cookies from "js-cookie"

// Importation des composants
import NavBar from "../components/NavBar"
import DisplayPlayers from "../components/DisplayPlayers"
import Modal from "../components/Modal"
import CalendarComponent from "../components/CalendarComponent" // Importation du composant Calendar
import ImageCrossfader from "../components/ImageCrossfader" // Nouveau composant pour l'animation d'images
import PartiesList from "../components/PartiesList" // Nouveau composant pour la liste des parties

// Importation des styles et des images
import "./Home.scss"
import King from "../assets/pics/medievalKing.svg"
import Queen from "../assets/pics/queen.svg"
import Merchan from "../assets/pics/portraitOfMerchant.png"
import Elf1 from "../assets/pics/elfLikeDnD.svg"
import Elf2 from "../assets/pics/elfLikeDnD2.jpg"
import wizard2 from "../assets/pics/wizard2.jpg"
import logoAiW from "../assets/pics/logoAiW.svg"
import iconeDiscorde from "../assets/pics/iconeDiscorde.svg"
import iconeFacebook from "../assets/pics/iconeFacebook2.svg"
import iconeMail from "../assets/pics/iconeGmail.svg"
import money from "../assets/pics/money.svg"

export default function Home() {
  // États pour gérer les données des parties
  const [parties, setParties] = useState([]) // Liste des parties (événements)
  const [selectedDate, setSelectedDate] = useState(null) // Date sélectionnée par l'utilisateur
  const [isPostCardsOpen, setIsPostCardsOpen] = useState(false) // État du modal pour afficher les détails d'une partie
  const [postData, setPostData] = useState(null) // Données de la partie sélectionnée

  // Images pour l'animation d'images
  const images = [King, Queen, Merchan, Elf1, Elf2, wizard2]

  // Récupération du token d'authentification depuis les cookies
  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  // Fonction pour gérer le clic sur une date dans le calendrier
  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  // Fonction pour charger les événements (parties) depuis l'API
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/partie/affichage`,
        { headers }
      )
      // Transformation des données pour le calendrier
      const events = res.data.map((partie) => ({
        id: partie.id,
        title: partie.Titre,
        start: partie.Date, // Assurez-vous que partie.Date est au format ISO 8601
        extendedProps: {
          // Propriétés supplémentaires
          partieData: partie, // On stocke toutes les données de la partie pour un accès facile
        },
      }))
      setParties(events)
    } catch (err) {
      console.error("Problème lors du chargement des parties", err)
    }
  }, [headers])

  // Chargement des événements à l'initialisation du composant
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Fonction pour gérer le clic sur une carte d'événement
  const handlePostClick = (partie) => {
    setIsPostCardsOpen(true)
    setPostData(partie)
  }

  return (
    <>
      {/* Barre de navigation */}
      <NavBar className="NavBarHome" />

      {/* Conteneur principal */}
      <div className="ContaineurPrincipal">
        {/* Animation d'images */}
        <ImageCrossfader images={images} />

        {/* Section du logo */}
        <div className="scene">
          <div className="containeurLogo">
            <img
              className="logoBaner"
              src={logoAiW}
              alt="logo de l'association les Arpenteurs d'Abrasia"
            />
          </div>
        </div>

        {/* Contenu de présentation */}
        <div className="containeurPresentation">
          <div className="containeurPresentationbis">
            <div className="titre1">
              <h2>
                Oubliez Netflix pour plonger dans l'aventure avec l'Association
                de jeux de rôle des Arpenteurs d'Abrasia
              </h2>
            </div>
            <div className="boxMage">
              <div className="boxTextMage">
                <p className="paragraphe1">
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
              <h2 className="titre2">C’est quoi le jeu de rôle ?</h2>

              <p className="paragraphe1">
                Le jeu de rôle est un loisir qui se pratique en petits groupes
                (entre 3 et 6 personnes) autour d'une table. Une personne prend
                le rôle de meneuse de jeu et raconte une histoire dans laquelle
                chacune des personnes attablées incarne un personnage. Le but
                est d’imaginer et mettre en place collectivement des solutions
                pour déjouer les pièges et mener à bien l’aventure... À
                condition que les dés le permettent !
              </p>
            </div>
            <div className="boxImagePresentationJDR"></div>
          </div>
          <div className="boxCitadel">
            <div className="boxTextCitadel">
              <h2 className="titre2">Présentation de l’asso :</h2>
              <p className="paragraphe1">
                L'association des Arpenteurs d'Abrasia (AA) a une double
                vocation ludique et culturelle. Elle a pour objet de réunir des
                joueurs et joueuses de façon régulière autour de tables de jeu
                de rôle (jdr) afin de partager des moments conviviaux et
                inclusifs.
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

      {/* Section Agenda */}
      <div className="agendaDesParties" id="agenda">
        <div className="titreAPartie">
          <h2>Agenda des parties</h2>
        </div>

        <div className="agenda">
          {/* Intégration du composant Calendar */}
          <CalendarComponent onDateClick={handleDateClick} events={parties} />
        </div>

        {/* Affichage des parties pour la date sélectionnée */}
        {!isPostCardsOpen && selectedDate && (
          <PartiesList
            parties={parties}
            selectedDate={selectedDate}
            onPostClick={handlePostClick}
          />
        )}
      </div>

      {/* Section des liens et partenaires */}
      <div className="boxLienAsso">
        <h2 className="asso-title">Nos amis</h2>
        <p className="asso-text">Liens vers d’autres assos du 04</p>
        <p className="asso-link">L’espace de jeu</p>
        <p className="asso-link">Lien vers la page de l’ECE de Malijai</p>

        <h2 className="asso-title">Partenaires</h2>
        <p className="asso-text">
          Lien vers les sites du Théâtre Durance, Librairie, Médiathèque, etc...
        </p>

        <h2 className="asso-title">Abrasia</h2>
        <p className="asso-text">Lien vers le site worldanvil d’Abrasia</p>

        <h2 className="asso-title">Payer sa cotisation sur HelloAsso</h2>
        <a
          href="https://www.helloasso.com/associations/les-arpenteurs-d-abrasia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="asso-icon" src={money} alt="logo billet vert " />
        </a>

        <h2 className="asso-title">Nous rejoindre sur :</h2>
        <div className="asso-icons">
          <a
            href="https://discord.gg/Vv3Fa4DwYK"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="asso-icon"
              src={iconeDiscorde}
              alt="logo Discorde"
            />
          </a>
          <a
            href="https://www.facebook.com/arpenteurs.abrasia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="asso-icon"
              src={iconeFacebook}
              alt="logo Facebook"
            />
          </a>
          <a href="mailto:arpenteurs.jdr@gmail.com">
            <img className="asso-icon" src={iconeMail} alt="logo Mail" />
          </a>
        </div>
      </div>

      {/* Modal pour afficher les détails d'une partie */}
      <Modal isOpen={isPostCardsOpen} onClose={() => setIsPostCardsOpen(false)}>
        {postData && <DisplayPlayers postData={postData} />}
      </Modal>
    </>
  )
}
