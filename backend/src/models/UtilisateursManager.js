const AbstractManager = require("./AbstractManager")

class UtilisateursManager extends AbstractManager {
  constructor() {
    super({ table: "utilisateurs" })
  }

  insert(utilisateurs) {
    return this.database.query(
      `insert into ${this.table} (Nom,Prenom, Pseudo, Mail, Telephone, PseudoDiscord, Description, PhotoProfil, VilleResidence, MotDePasse, Admin, MembreEquipe, MembreAssociation) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
        utilisateurs.MotDePasse,
        utilisateurs.Admin,
        utilisateurs.MembreEquipe,
        utilisateurs.MembreAssociation,
      ]
    )
  }

  update(utilisateurs) {
    return this.database.query(
      `UPDATE ${this.table} SET Nom = ?, Prenom = ?, Pseudo = ?, Mail = ?, Telephone = ?, PseudoDiscord = ?, Description = ?, PhotoProfil = ?, VilleResidence = ?, MotDePasse = ?, Admin = ?, MembreEquipe = ?, MembreAssociation = ? WHERE (id = ?)`,
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
        utilisateurs.MotDePasse,
        utilisateurs.Admin,
        utilisateurs.MembreEquipe,
        utilisateurs.MembreAssociation,
      ]
    )
  }

  getDisplayPlayer(id) {
    return this.database.query(
      `
    SELECT utilisateurs.PhotoProfil, utilisateurs.Nom, utilisateurs.Prenom, utilisateurs.Pseudo
    FROM ${this.table}
    JOIN participation ON utilisateurs.id = participation.Utilisateurs_Id
    WHERE participation.Partie_Id = ?;`,
      [id]
    )
  }

  getUserByPseudoWithPassword(Pseudo) {
    return this.database.query(
      `select id, Pseudo, hashedPassword from ${this.table} where Pseudo = ?`,
      [Pseudo]
    )
  }
}

module.exports = UtilisateursManager
