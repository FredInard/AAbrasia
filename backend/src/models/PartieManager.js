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

  findpartieByUtilisateurId(id) {
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
    WHERE participation.Utilisateurs_Id = ?;
    `,
      [id]
    )
  }

  findpartieMeneurByUtilisateurId(id) {
    return this.database.query(
      `
      SELECT 
        id, 
        Titre,
        DATE_FORMAT(Date, '%Y-%m-%d') AS Date,
        TIME_FORMAT(Heure, '%H:%i') AS Heure,
        Lieu,
        MaitreDuJeu,
        Description,
        NombreJoueur,
        TypeDeJeux
      FROM ${this.table}
      WHERE MaitreDuJeu = ?;`,
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
}

module.exports = PartieManager
