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
        partie.IdMaitreDuJeu,
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
    p.id AS PartieID,
    p.Titre AS TitrePartie,
    DATE_FORMAT(p.Date, '%d-%m-%Y') AS DatePartie,
    DATE_FORMAT(p.Heure, '%H:%i') AS HeurePartie,
    p.Lieu AS LieuPartie,
    p.Description AS DescriptionPartie,
    p.NombreJoueur AS NombreJoueursPartie,
    p.TypeDeJeux AS TypeDeJeuxPartie,
    u.Pseudo AS PseudoMaitreDuJeu,
    p.MaitreDuJeu AS IDMaitreDuJeu,
    u.PhotoProfil AS PhotoProfilUtilisateur
FROM
${this.table} AS p
INNER JOIN
    utilisateurs AS u
ON
    p.MaitreDuJeu = u.id;


    `)
  }

  findpartieByUtilisateurId(id) {
    console.info("ID de l'utilisateur de findpartieByUtilisateurId:", id)
    return this.database.query(
      `
      SELECT
      partie.id AS PartieId,
      Titre,
      DATE_FORMAT(partie.Date, '%Y-%m-%d') AS Date,
      TIME_FORMAT(partie.Heure, '%H:%i'),
      Lieu,
      MaitreDuJeu,
      Description,
      NombreJoueur,
      TypeDeJeux
    FROM ${this.table}
    JOIN participation ON partie.id = participation.Partie_Id
    WHERE participation.Utilisateur_Id = ?;
    `,
      [id]
    )
  }

  findpartieMeneurByUtilisateurId(id) {
    console.info("ID de l'utilisateur de findpartieByUtilisateurId:", id)
    return this.database.query(
      `
      SELECT DISTINCT 
      partie.id AS meneurPartieId,
      Titre,
      DATE_FORMAT(partie.Date, '%Y-%m-%d') AS Date,
      TIME_FORMAT(partie.Heure, '%H:%i') AS Heure,
      Lieu,
      MaitreDuJeu,
      Description,
      NombreJoueur,
      TypeDeJeux
      FROM ${this.table}
      JOIN participation ON partie.id = participation.Partie_Id
      WHERE participation.Partie_IdMaitreDuJeu = ?
       ;`,
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
}

module.exports = PartieManager
