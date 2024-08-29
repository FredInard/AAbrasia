const AbstractManager = require("./AbstractManager")

class PartieManager extends AbstractManager {
  constructor() {
    super({ table: "partie" })
  }

  insert(partie) {
    return this.database.query(
      `insert into partie (Titre, Date, Heure, Lieu, MaitreDuJeu, Description, NombreJoueur, TypeDeJeux) VALUES (?, DATE_FORMAT(?, '%Y-%m-%d %H:%i'), ?, ?, ?, ?, ?, ?)`,
      [
        partie.Titre,
        partie.Date,
        partie.Heure,
        partie.Lieu,
        partie.MaitreDuJeu,
        partie.Description,
        partie.NombreJoueur,
        partie.TypeDeJeux,
      ]
    )
  }

  update(partie) {
    return this.database.query(
      `update ${this.table} set Titre = ?, Date = ?, Heure = ?, Lieu = ?, MaitreDuJeu = ?, Description = ?, NombreJoueur = ?, TypeDeJeux = ? where id = ?`, // Utilisation de "id" au lieu de "partie_id"
      [
        partie.Titre,
        partie.Date,
        partie.Heure,
        partie.Lieu,
        partie.MaitreDuJeu,
        partie.Description,
        partie.NombreJoueur,
        partie.TypeDeJeux,
        partie.id, // Assurez-vous que l'identifiant (ID) est bien présent ici.
      ]
    )
  }

  getAffichageInfoPartie() {
    return this.database.query(`
    SELECT
    p.id AS PartieId,
    p.Titre,
    DATE_FORMAT(p.Date, '%Y-%m-%d') AS Date,
    TIME_FORMAT(p.Heure, '%H:%i') AS Heure,
    p.Lieu,
    p.MaitreDuJeu,
    u.Pseudo AS PseudoMaitreDuJeu,
    u.PhotoProfil AS PhotoProfilMaitreDuJeu,
    p.Description,
    p.NombreJoueur,
    p.TypeDeJeux
FROM partie p
JOIN utilisateurs u ON p.MaitreDuJeu = u.id;
    `)
  }

  getAffichageInfoPartieDate(date) {
    // console.info("date de PartieManager", date)
    return this.database.query(
      `
      SELECT
      p.id AS PartieId,
      p.Titre,
      DATE_FORMAT(p.Date, '%Y-%m-%d') AS Date,
      TIME_FORMAT(p.Heure, '%H:%i') AS Heure,
      p.Lieu,
      p.MaitreDuJeu,
      u.Pseudo AS PseudoMaitreDuJeu,
      u.PhotoProfil AS PhotoProfilMaitreDuJeu,
      p.Description,
      p.NombreJoueur,
      p.TypeDeJeux
    FROM partie p
    JOIN utilisateurs u ON p.MaitreDuJeu = u.id
    WHERE p.Date = ?;
      `,
      [date]
    )
  }

  findpartieByUtilisateurId(id) {
    console.info("id dans PartieManager", id)
    return this.database.query(
      `
      SELECT
      partie.id AS PartieId,
      partie.Titre,
      DATE_FORMAT(partie.Date, '%Y-%m-%d') AS Date,
      TIME_FORMAT(partie.Heure, '%H:%i') AS Heure,
      partie.Lieu,
      partie.Description,
      partie.NombreJoueur,
      partie.TypeDeJeux,
      utilisateurs.Pseudo AS MJPseudo,
      utilisateurs.PhotoProfil AS MJPhotoProfil,
      GROUP_CONCAT(participation.Utilisateurs_Id) AS Joueurs
    FROM partie
    JOIN participation ON partie.id = participation.Partie_Id
    JOIN utilisateurs ON partie.MaitreDuJeu = utilisateurs.id
    WHERE participation.Utilisateurs_Id = ?
    GROUP BY partie.id;
    
  
    `,
      [id]
    )
  }

  findpartieMeneurByUtilisateurId(id) {
    return this.database.query(
      `
      SELECT 
      p.id, 
      p.Titre,
      DATE_FORMAT(p.Date, '%Y-%m-%d') AS Date,
      TIME_FORMAT(p.Heure, '%H:%i') AS Heure,
      p.Lieu,
      p.MaitreDuJeu,
      p.Description,
      p.NombreJoueur,
      p.TypeDeJeux,
      GROUP_CONCAT(u.Pseudo) AS PseudosParticipants,
      GROUP_CONCAT(u.PhotoProfil) AS PhotosProfilsParticipants
  FROM partie AS p
  INNER JOIN participation AS par ON p.id = par.Partie_Id
  INNER JOIN Utilisateurs AS u ON par.Utilisateurs_Id = u.id
  WHERE p.MaitreDuJeu = ?
  GROUP BY p.id, p.Titre, p.Date, p.Heure, p.Lieu, p.MaitreDuJeu, p.Description, p.NombreJoueur, p.TypeDeJeux;
  
`,
      [id]
    )
  }

  getCountPartieById(id) {
    return this.database.query(
      `
      SELECT Partie_Id, COUNT(*) AS nbParticipants
      FROM participation
      WHERE Partie_Id = ?;`,
      [id]
    )
  }

  getDestroyeurDePartie(id) {
    return this.database.transaction((t) => {
      return this.database
        .query("DELETE FROM participation WHERE Partie_Id = ?", [id], {
          transaction: t,
        })
        .then(() => {
          return this.database.query("DELETE FROM partie WHERE id = ?", [id], {
            transaction: t,
          })
        })
    })
  }

  findJoueursByPartieId(id) {
    return this.database.query(
      `
      SELECT
    u.id,
    u.Pseudo,
    u.PhotoProfil
FROM utilisateurs u
JOIN participation pa ON u.id = pa.Utilisateurs_Id
WHERE pa.Partie_Id = ?;
  
`,
      [id]
    )
  }
}

module.exports = PartieManager
