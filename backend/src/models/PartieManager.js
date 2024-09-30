const AbstractManager = require("./AbstractManager")

class PartieManager extends AbstractManager {
  constructor() {
    super({ table: "partie" })
  }

  // Insert a new partie
  insert(partie) {
    return this.database.query(
      `INSERT INTO ${this.table} (titre, type, description, date, nb_max_joueurs, id_maitre_du_jeu, duree_estimee, lieu, photo_scenario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        partie.titre,
        partie.type,
        partie.description,
        partie.date,
        partie.nb_max_joueurs,
        partie.id_maitre_du_jeu,
        partie.duree_estimee,
        partie.lieu,
        partie.photo_scenario,
      ]
    )
  }

  // Update an existing partie
  update(partie) {
    return this.database.query(
      `UPDATE ${this.table} SET titre = ?, type = ?, description = ?, date = ?, nb_max_joueurs = ?, id_maitre_du_jeu = ?, duree_estimee = ?, lieu = ?, photo_scenario = ? WHERE id = ?`,
      [
        partie.titre,
        partie.type,
        partie.description,
        partie.date,
        partie.nb_max_joueurs,
        partie.id_maitre_du_jeu,
        partie.duree_estimee,
        partie.lieu,
        partie.photo_scenario,
        partie.id,
      ]
    )
  }

  // Find all parties
  findAll() {
    return this.database.query(`SELECT * FROM ${this.table}`)
  }

  // Find a partie by ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  // Get detailed info of all parties
  getAffichageInfoPartie() {
    return this.database.query(`
      SELECT
        p.id AS partieId,
        p.titre,
        p.type,
        p.description,
        p.date,
        p.nb_max_joueurs,
        p.id_maitre_du_jeu,
        u.pseudo AS pseudoMaitreDuJeu,
        u.photo_profil AS photoProfilMaitreDuJeu,
        p.duree_estimee,
        p.lieu,
        p.photo_scenario
      FROM partie p
      LEFT JOIN utilisateur u ON p.id_maitre_du_jeu = u.id;
    `)
  }

  // Get detailed info of parties on a specific date
  getAffichageInfoPartieDate(date) {
    return this.database.query(
      `
      SELECT
        p.id AS partieId,
        p.titre,
        p.type,
        p.description,
        p.date,
        p.nb_max_joueurs,
        p.id_maitre_du_jeu,
        u.pseudo AS pseudoMaitreDuJeu,
        u.photo_profil AS photoProfilMaitreDuJeu,
        p.duree_estimee,
        p.lieu,
        p.photo_scenario
      FROM partie p
      LEFT JOIN utilisateur u ON p.id_maitre_du_jeu = u.id
      WHERE DATE(p.date) = DATE(?);
      `,
      [date]
    )
  }

  // Find parties by utilisateur ID
  findPartieByUtilisateurId(utilisateurId) {
    return this.database.query(
      `
      SELECT
        p.id AS partieId,
        p.titre,
        p.type,
        p.description,
        p.date,
        p.nb_max_joueurs,
        p.id_maitre_du_jeu,
        u.pseudo AS pseudoMaitreDuJeu,
        u.photo_profil AS photoProfilMaitreDuJeu,
        p.duree_estimee,
        p.lieu,
        p.photo_scenario
      FROM partie p
      JOIN participation pa ON p.id = pa.partie_id
      LEFT JOIN utilisateur u ON p.id_maitre_du_jeu = u.id
      WHERE pa.utilisateur_id = ?
      GROUP BY p.id;
      `,
      [utilisateurId]
    )
  }

  // Find participants of a partie by partie ID
  findJoueursByPartieId(partieId) {
    return this.database.query(
      `
      SELECT
        u.id,
        u.pseudo,
        u.photo_profil
      FROM utilisateur u
      JOIN participation pa ON u.id = pa.utilisateur_id
      WHERE pa.partie_id = ?;
      `,
      [partieId]
    )
  }

  // Find parties where the utilisateur is the maitre du jeu
  findPartieMeneurByUtilisateurId(utilisateurId) {
    return this.database.query(
      `
      SELECT
        p.id AS partieId,
        p.titre,
        p.type,
        p.description,
        p.date,
        p.nb_max_joueurs,
        p.id_maitre_du_jeu,
        p.duree_estimee,
        p.lieu,
        p.photo_scenario,
        GROUP_CONCAT(u.pseudo) AS pseudosParticipants,
        GROUP_CONCAT(u.photo_profil) AS photosProfilsParticipants
      FROM partie p
      LEFT JOIN participation pa ON p.id = pa.partie_id
      LEFT JOIN utilisateur u ON pa.utilisateur_id = u.id
      WHERE p.id_maitre_du_jeu = ?
      GROUP BY p.id;
      `,
      [utilisateurId]
    )
  }

  // Get the count of participants in a partie
  getCountPartieById(partieId) {
    return this.database.query(
      `
      SELECT partie_id, COUNT(*) AS nbParticipants
      FROM participation
      WHERE partie_id = ?
      GROUP BY partie_id;
      `,
      [partieId]
    )
  }

  // Delete a partie and its related participations
  getDestroyeurDePartie(partieId) {
    return this.database.query("DELETE FROM partie WHERE id = ?", [partieId])
  }
}

module.exports = PartieManager

// const AbstractManager = require("./AbstractManager")

// class PartieManager extends AbstractManager {
//   constructor() {
//     super({ table: "partie" })
//   }

//   insert(partie) {
//     return this.database.query(
//       `insert into partie (Titre, Date, Heure, Lieu, MaitreDuJeu, Description, NombreJoueur, TypeDeJeux) VALUES (?, DATE_FORMAT(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?)`,
//       [
//         partie.Titre,
//         partie.Date,
//         partie.Heure,
//         partie.Lieu,
//         partie.MaitreDuJeu,
//         partie.Description,
//         partie.NombreJoueur,
//         partie.TypeDeJeux,
//       ]
//     )
//   }

//   update(partie) {
//     return this.database.query(
//       `update ${this.table} set Titre = ?, Date = ?, Heure = ?, Lieu = ?, MaitreDuJeu = ?, Description = ?, NombreJoueur = ?, TypeDeJeux = ? where id = ?`, // Utilisation de "id" au lieu de "partie_id"
//       [
//         partie.Titre,
//         partie.Date,
//         partie.Heure,
//         partie.Lieu,
//         partie.MaitreDuJeu,
//         partie.Description,
//         partie.NombreJoueur,
//         partie.TypeDeJeux,
//         partie.id, // Assurez-vous que l'identifiant (ID) est bien présent ici.
//       ]
//     )
//   }

//   getAffichageInfoPartie() {
//     return this.database.query(`
//     SELECT
//     p.id AS PartieId,
//     p.Titre,
//     DATE_FORMAT(p.Date, '%Y-%m-%d') AS Date,
//     TIME_FORMAT(p.Heure, '%H:%i') AS Heure,
//     p.Lieu,
//     p.MaitreDuJeu,
//     u.Pseudo AS PseudoMaitreDuJeu,
//     u.PhotoProfil AS PhotoProfilMaitreDuJeu,
//     p.Description,
//     p.NombreJoueur,
//     p.TypeDeJeux
// FROM partie p
// JOIN utilisateurs u ON p.MaitreDuJeu = u.id;
//     `)
//   }

//   getAffichageInfoPartieDate(date) {
//     // console.info("date de PartieManager", date)
//     return this.database.query(
//       `
//       SELECT
//       p.id AS PartieId,
//       p.Titre,
//       DATE_FORMAT(p.Date, '%Y-%m-%d') AS Date,
//       TIME_FORMAT(p.Heure, '%H:%i') AS Heure,
//       p.Lieu,
//       p.MaitreDuJeu,
//       u.Pseudo AS PseudoMaitreDuJeu,
//       u.PhotoProfil AS PhotoProfilMaitreDuJeu,
//       p.Description,
//       p.NombreJoueur,
//       p.TypeDeJeux
//     FROM partie p
//     JOIN utilisateurs u ON p.MaitreDuJeu = u.id
//     WHERE p.Date = ?;
//       `,
//       [date]
//     )
//   }

//   findpartieByUtilisateurId(id) {
//     console.info("id dans PartieManager", id)
//     return this.database.query(
//       `
//       SELECT
//       partie.id AS PartieId,
//       partie.Titre,
//       DATE_FORMAT(partie.Date, '%Y-%m-%d') AS Date,
//       TIME_FORMAT(partie.Heure, '%H:%i') AS Heure,
//       partie.Lieu,
//       partie.Description,
//       partie.NombreJoueur,
//       partie.TypeDeJeux,
//       utilisateurs.Pseudo AS MJPseudo,
//       utilisateurs.PhotoProfil AS MJPhotoProfil,
//       GROUP_CONCAT(participation.Utilisateurs_Id) AS Joueurs
//     FROM partie
//     JOIN participation ON partie.id = participation.Partie_Id
//     JOIN utilisateurs ON partie.MaitreDuJeu = utilisateurs.id
//     WHERE participation.Utilisateurs_Id = ?
//     GROUP BY partie.id;

//     `,
//       [id]
//     )
//   }

//   findpartieMeneurByUtilisateurId(id) {
//     return this.database.query(
//       `
//       SELECT
//         p.id,
//         p.Titre,
//         DATE_FORMAT(p.Date, '%Y-%m-%d') AS Date,
//         TIME_FORMAT(p.Heure, '%H:%i') AS Heure,
//         p.Lieu,
//         p.MaitreDuJeu,
//         p.Description,
//         p.NombreJoueur,
//         p.TypeDeJeux,
//         GROUP_CONCAT(u.Pseudo) AS PseudosParticipants,
//         GROUP_CONCAT(u.PhotoProfil) AS PhotosProfilsParticipants
//       FROM partie AS p
//       LEFT JOIN participation AS par ON p.id = par.Partie_Id
//       LEFT JOIN Utilisateurs AS u ON par.Utilisateurs_Id = u.id
//       WHERE p.MaitreDuJeu = ?
//       GROUP BY p.id, p.Titre, p.Date, p.Heure, p.Lieu, p.MaitreDuJeu, p.Description, p.NombreJoueur, p.TypeDeJeux;
//       `,
//       [id]
//     )
//   }

//   getCountPartieById(id) {
//     return this.database.query(
//       `
//       SELECT Partie_Id, COUNT(*) AS nbParticipants
//       FROM participation
//       WHERE Partie_Id = ?;`,
//       [id]
//     )
//   }

//   getDestroyeurDePartie(id) {
//     return this.database.transaction((t) => {
//       return this.database
//         .query("DELETE FROM participation WHERE Partie_Id = ?", [id], {
//           transaction: t,
//         })
//         .then(() => {
//           return this.database.query("DELETE FROM partie WHERE id = ?", [id], {
//             transaction: t,
//           })
//         })
//     })
//   }

//   findJoueursByPartieId(id) {
//     return this.database.query(
//       `
//       SELECT
//     u.id,
//     u.Pseudo,
//     u.PhotoProfil
// FROM utilisateurs u
// JOIN participation pa ON u.id = pa.Utilisateurs_Id
// WHERE pa.Partie_Id = ?;

// `,
//       [id]
//     )
//   }
// }

// module.exports = PartieManager
