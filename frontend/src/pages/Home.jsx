import React, { useState, useEffect } from "react"
import axios from "axios"
import "./Home.scss"
import NavBar from "../components/NavBar"
import Citadel from "../assets/pics/The_Citadel_of_Sisteron.png"
import questioningFemale from "../assets/pics/questioning_female.png"
import wizard from "../assets/pics/wizard.png"
import BrushDown from "../assets/pics/BrushDown.svg"
import scene from "../assets/pics/perudos_Craft_a_vectorial_minimalist_scene_set_in_a_fantasy_tav_5c581142-d45f-4653-b992-cd54a823bd7a.png"
import BrushUp from "../assets/pics/BrushUp.svg"
import logoAiW from "../assets/pics/logoAiW.svg"
import DisplayPlayers from "../components/displayPlayers"

export default function Home() {
  const [parties, setParties] = useState([])
  const [postData, setPostData] = useState(null)
  const [isPostCardsOpen, setIsPostCardsOpen] = useState(false)
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/partie/affichage`)
      .then((res) => setParties(res.data))
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [])

  const handlePostClick = (allPostData) => {
    // Ouvrez le composant PlayerCards en passant les informations du joueur sélectionné.
    setIsPostCardsOpen(true)
    setPostData(allPostData)
  }
  console.info("postcards1", postData)
  console.info("parties", parties)

  return (
    <>
      <NavBar />
      <div className="containeurLogo">
        <img
          className="logoBaner"
          src={logoAiW}
          alt="logo de l association les arpenteur d abrasia"
        />
        {/* <h1 className="titleBaner">Les Arpenteurs d'Abrasia</h1> */}
      </div>

      <div className="ContaineurBanner">
        <img
          src={BrushUp}
          alt="brush haut pour fondue image de scene"
          className="superpose haut"
        />
        <img
          src={scene}
          alt="scene de jeux de rôle avec des personnages de type héroïc fantasy autour d'une table."
          className="scene"
        />
        <img
          src={BrushDown}
          alt="brush bas pour fondue image de scene"
          className="superpose bas"
        />
      </div>

      <div className="containeurPresentation">
        <div>
          <div className="titreh2">
            <h2>L’association de jeux de rôle du 04</h2>
          </div>
          <div className="boxMage">
            <div className="boxIamgeMage">
              <img src={wizard} alt="image d'un magicien type Dnd" />
            </div>
            <div className="boxTextMage fade-in-right">
              <p>
                {" "}
                Bienvenue, <br />
                Les Arpenteurs d’Abrasia sont une association qui organise des
                parties de jeu de rôle sur table. Nous jouons principalement
                (mais pas que) dans un univers fantastique nommé Abrasia, et
                tout le monde est bienvenu·e, néophytes ou vétérans, pour créer
                des moments conviviaux de rires et d’aventures !
              </p>
            </div>
          </div>
        </div>
        <div className="boxWarior">
          <div className="boxTextWarior">
            <p>
              C’est quoi le jeux de rôle ? Le jeu de rôle est un loisir qui se
              pratique en petits groupes (entre 3 et 6 personnes) autour d'une
              table. Une personne prend le rôle de meneuse de jeu et raconte une
              histoire dans laquelle chacune des personnes attablées incarne un
              personnage. Le but est d’imaginer et mettre en place
              collectivement des solutions pour déjouer les pièges et mener à
              bien l’aventure... A conditions que les dés le permettent !
            </p>
          </div>
          <div className="boximageWarior">
            <img src={questioningFemale} alt="image d'une guerrière type Dnd" />
          </div>
        </div>
        <div className="boxCitadel">
          <div className="boxImageCitadel">
            <img src={Citadel} alt="image de la citadel de Sisteton" />
          </div>
          <div className="boxTextCitadel">
            <p>
              Présentation de l’asso L'association des Arpenteurs d'Abrasia (AA)
              a une double vocation ludique et culturelle. Elle a pour objet de
              réunir des joueurs et joueuses de façon régulière autour de tables
              de jeu de rôle (jdr) afin de partager des moments conviviaux et
              inclusifs.
            </p>
          </div>
        </div>
        <div className="boxTextCitadelBis">
          <p>
            Elle se donne pour mission de créer du lien social, d'une part en
            créant des espaces de jeu mixtes et bienveillants pour toute
            personne souhaitant la rejoindre, d'autre part en allant vers des
            publics en recherche de sociabilités et/ou isolées, telles que les
            personnes retraitées ou les adolescents. L'association entend
            développer un volet culturel en organisant des ateliers d'écriture
            comme un complément des activités de jeu de rôle, des groupes de
            lecture, voire d'autres activités liées à la production de
            l'imaginaire.
          </p>
        </div>
      </div>
      <div className="agendaDesParties">
        <div className="titreAPartie">
          <h2>Agenda des parties</h2>
        </div>

        {!isPostCardsOpen && (
          <div className="containeurCards">
            {parties.map((partie) => (
              <div key={partie.id} className="globalContainerCard">
                <div className="titleContainerCard">{partie.TitrePartie}</div>
                <div className="miniBoxInfo">
                  <div className="infoItem">Date : {partie.DatePartie}</div>
                  <div className="infoItem">Heure : {partie.HeurePartie}</div>
                  <div className="infoItem">Lieu : {partie.LieuPartie}</div>
                  <div className="infoItem">
                    Maitre du jeu : {partie.PseudoMaitreDuJeu}
                  </div>
                  <div className="infoItem">
                    Type : {partie.TypeDeJeuxPartie}
                  </div>
                  <div className="infoItem">X{partie.NombreJoueursPartie}</div>
                  <div className="infoItem">
                    Description : {partie.DescriptionPartie}
                  </div>
                  <button onClick={() => handlePostClick(partie)}>
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {isPostCardsOpen && (
          <DisplayPlayers
            isOpen={isPostCardsOpen}
            onClose={() => setIsPostCardsOpen(false)}
            postData={postData}
            // headers={headers}
            // formattedSchedule={formattedSchedule}
          />
        )}
      </div>
    </>
  )
}

// import React, { useState, useEffect } from "react"
// import axios from "axios"
// import "./Home.scss"
// import NavBar from "../components/NavBar"
// import Citadel from "../assets/pics/The_Citadel_of_Sisteron.png"
// import questioningFemale from "../assets/pics/questioning_female.png"
// import wizard from "../assets/pics/wizard.png"
// import BrushDown from "../assets/pics/BrushDown.svg"
// import scene from "../assets/pics/perudos_Craft_a_vectorial_minimalist_scene_set_in_a_fantasy_tav_5c581142-d45f-4653-b992-cd54a823bd7a.png"
// import BrushUp from "../assets/pics/BrushUp.svg"
// import logo from "../assets/pics/logo.png"
// import DisplayPlayers from "../components/displayPlayers"

// export default function Home() {
//   const [parties, setParties] = useState([])
//   const [postData, setPostData] = useState(null)
//   const [isPostCardsOpen, setIsPostCardsOpen] = useState(false)
//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_BACKEND_URL}/partie/affichage`)
//       .then((res) => setParties(res.data))
//       .catch((err) => {
//         console.error("Problème lors du chargement des parties", err)
//       })
//   }, [])

//   const handlePostClick = (allPostData) => {
//     // Ouvrez le composant PlayerCards en passant les informations du joueur sélectionné.
//     setIsPostCardsOpen(true)
//     setPostData(allPostData)
//   }
//   console.info("postcards1", postData)
//   console.info("parties", parties)

//   return (
//     <>
//       <NavBar />
//       <div className="containeurLogo">
//         <img
//           className="logoBaner"
//           src={logo}
//           alt="logo qui représente un dé 12 de couleur bleu et rose"
//         />
//         <h1 className="titleBaner">Les Arpenteurs d'Abrasia</h1>
//       </div>

//       <div className="ContaineurBanner">
//         <img
//           src={BrushUp}
//           alt="brush haut pour fondue image de scene"
//           className="superpose haut"
//         />
//         <img
//           src={scene}
//           alt="scene de jeux de rôle avec des personnages de type héroïc fantasy autour d'une table."
//           className="scene"
//         />
//         <img
//           src={BrushDown}
//           alt="brush bas pour fondue image de scene"
//           className="superpose bas"
//         />
//       </div>

//       <div className="containeurPresentation">
//         <div>
//           <div className="titreh2">
//             <h2>L’association de jeux de rôle du 04</h2>
//           </div>
//           <div className="boxMage">
//             <div className="boxIamgeMage">
//               <img src={wizard} alt="image d'un magicien type Dnd" />
//             </div>
//             <div className="boxTextMage fade-in-right">
//               <p>
//                 {" "}
//                 Bienvenue, <br />
//                 Les Arpenteurs d’Abrasia sont une association qui organise des
//                 parties de jeu de rôle sur table. Nous jouons principalement
//                 (mais pas que) dans un univers fantastique nommé Abrasia, et
//                 tout le monde est bienvenu·e, néophytes ou vétérans, pour créer
//                 des moments conviviaux de rires et d’aventures !
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="boxWarior">
//           <div className="boxTextWarior">
//             <p>
//               C’est quoi le jeux de rôle ? Le jeu de rôle est un loisir qui se
//               pratique en petits groupes (entre 3 et 6 personnes) autour d'une
//               table. Une personne prend le rôle de meneuse de jeu et raconte une
//               histoire dans laquelle chacune des personnes attablées incarne un
//               personnage. Le but est d’imaginer et mettre en place
//               collectivement des solutions pour déjouer les pièges et mener à
//               bien l’aventure... A conditions que les dés le permettent !
//             </p>
//           </div>
//           <div className="boximageWarior">
//             <img src={questioningFemale} alt="image d'une guerrière type Dnd" />
//           </div>
//         </div>
//         <div className="boxCitadel">
//           <div className="boxImageCitadel">
//             <img src={Citadel} alt="image de la citadel de Sisteton" />
//           </div>
//           <div className="boxTextCitadel">
//             <p>
//               Présentation de l’asso L'association des Arpenteurs d'Abrasia (AA)
//               a une double vocation ludique et culturelle. Elle a pour objet de
//               réunir des joueurs et joueuses de façon régulière autour de tables
//               de jeu de rôle (jdr) afin de partager des moments conviviaux et
//               inclusifs.
//             </p>
//           </div>
//         </div>
//         <div className="boxTextCitadelBis">
//           <p>
//             Elle se donne pour mission de créer du lien social, d'une part en
//             créant des espaces de jeu mixtes et bienveillants pour toute
//             personne souhaitant la rejoindre, d'autre part en allant vers des
//             publics en recherche de sociabilités et/ou isolées, telles que les
//             personnes retraitées ou les adolescents. L'association entend
//             développer un volet culturel en organisant des ateliers d'écriture
//             comme un complément des activités de jeu de rôle, des groupes de
//             lecture, voire d'autres activités liées à la production de
//             l'imaginaire.
//           </p>
//         </div>
//       </div>
//       <div className="agendaDesParties">
//         <div className="titreAPartie">
//           <h2>Agenda des parties</h2>
//         </div>

//         <div className="containeurCards">
//           {parties.map((partie) => (
//             <div key={partie.id} className="globalContainerCard">
//               <div className="titleContainerCard">{partie.TitrePartie}</div>
//               <div className="miniBoxInfo">
//                 <div className="infoItem">Date : {partie.DatePartie}</div>
//                 <div className="infoItem">Heure : {partie.HeurePartie}</div>
//                 <div className="infoItem">Lieu : {partie.LieuPartie}</div>
//                 <div className="infoItem">
//                   Maitre du jeu : {partie.PseudoMaitreDuJeu}
//                 </div>
//                 <div className="infoItem">Type : {partie.TypeDeJeuxPartie}</div>
//                 <div className="infoItem">X{partie.NombreJoueursPartie}</div>
//                 <div className="infoItem">
//                   Description : {partie.DescriptionPartie}
//                 </div>

//                 <DisplayPlayers
//                   isOpen={isPostCardsOpen}
//                   onClose={() => setIsPostCardsOpen(false)}
//                   postData={postData}
//                   // headers={headers}
//                   // formattedSchedule={formattedSchedule}
//                 />

//                 <button onClick={() => handlePostClick(partie)}>
//                   Voir les détails
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   )
// }
