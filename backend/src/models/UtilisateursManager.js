const AbstractManager = require("./AbstractManager")

class UtilisateursManager extends AbstractManager {
  constructor() {
    super({ table: "utilisateurs" })
  }

  insert(utilisateurs) {
    return this.database.query(
      `insert into ${this.table} (Nom,Prenom, Pseudo, Mail, hashedPassword) values (?,?,?,?,?)`,
      [
        utilisateurs.Nom,
        utilisateurs.Prenom,
        utilisateurs.Pseudo,
        utilisateurs.Mail,
        utilisateurs.hashedPassword,
        utilisateurs.PhotoProfil,
      ]
    )
  }

  update(utilisateurs) {
    return this.database.query(
      `UPDATE ${this.table} SET Nom = ?, Prenom = ?, Pseudo = ?, Mail = ?, Telephone = ?, PseudoDiscord = ?, Description = ?, PhotoProfil = ?, VilleResidence = ?, hashedPassword = ?, Admin = ?, MembreEquipe = ?, MembreAssociation = ? WHERE (id = ?)`,
      [
        utilisateurs.Nom,
        utilisateurs.Prenom,
        utilisateurs.Pseudo,
        utilisateurs.Mail,
        utilisateurs.Telephone,
        utilisateurs.PseudoDiscord,
        utilisateurs.Description,
        utilisateurs.PhotoProfil,
        utilisateurs.VilleResidence,
        utilisateurs.hashedPassword,
        utilisateurs.Admin,
        utilisateurs.MembreEquipe,
        utilisateurs.MembreAssociation,
      ]
    )
  }

  readlessPW(id) {
    return this.database.query(
      `
      SELECT
        Nom,
        Prenom,
        Pseudo,
        Mail,
        Telephone,
        PseudoDiscord,
        Description,
        PhotoProfil,
        VilleResidence
      FROM ${this.table}
      WHERE id = ?
    `,
      [id]
    )
  }

  getDisplayPlayer(id) {
    return this.database.query(
      `
    SELECT utilisateurs.PhotoProfil, utilisateurs.Nom, utilisateurs.Prenom, utilisateurs.Pseudo
    FROM ${this.table}
    JOIN participation ON utilisateurs.id = participation.Utilisateur_Id
    WHERE participation.Partie_Id = ?;`,
      [id]
    )
  }

  getUserByPseudoWithPassword(Pseudo) {
    return this.database.query(
      `select id, Pseudo, PhotoProfil, Admin, hashedPassword from ${this.table} where Pseudo = ?`,
      [Pseudo]
    )
  }

  updateProfilPicture(utilisateurs, profilpicturePath) {
    return this.database.query(
      `UPDATE ${this.table} SET PhotoProfil = ? WHERE id = ?`,
      [profilpicturePath, utilisateurs.id]
    )
  }

  getReadPartieByUtilisateurId(id) {
    return this.database.query(
      `
      SELECT *
      FROM partie
      INNER JOIN participation ON partie.id = participation.Partie_Id
      WHERE participation.Utilisateur_Id = ? ;
      `,
      [id]
    )
  }
}

module.exports = UtilisateursManager
