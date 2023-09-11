const AbstractManager = require("./AbstractManager")

class UtilisateurManager extends AbstractManager {
  constructor() {
    super({ table: "utilisateur" })
  }

  insert(utilisateur) {
    return this.database.query(
      `insert into ${this.table} (Nom,Prenom, Pseudo, Mail, Telephone, PseudoDiscord, Description, PhotoProfil, VilleResidence, MotDePasse, Admin, MembreEquipe, MembreAssociation) values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        utilisateur.Nom,
        utilisateur.Prenom,
        utilisateur.Pseudo,
        utilisateur.Mail,
        utilisateur.Telephone,
        utilisateur.PseudoDiscord,
        utilisateur.Description,
        utilisateur.PhotoProfil,
        utilisateur.VilleResidence,
        utilisateur.MotDePasse,
        utilisateur.Admin,
        utilisateur.MembreEquipe,
        utilisateur.MembreAssociation,
      ]
    )
  }

  update(utilisateur) {
    return this.database.query(
      `UPDATE ${this.table} SET Nom = ?, Prenom = ?, Pseudo = ?, Mail = ?, Telephone = ?, PseudoDiscord = ?, Description = ?, PhotoProfil = ?, VilleResidence = ?, MotDePasse = ?, Admin = ?, MembreEquipe = ?, MembreAssociation = ? WHERE (id = ?)`,
      [
        utilisateur.Nom,
        utilisateur.Prenom,
        utilisateur.Pseudo,
        utilisateur.Mail,
        utilisateur.Telephone,
        utilisateur.PseudoDiscord,
        utilisateur.Description,
        utilisateur.PhotoProfil,
        utilisateur.VilleResidence,
        utilisateur.MotDePasse,
        utilisateur.Admin,
        utilisateur.MembreEquipe,
        utilisateur.MembreAssociation,
      ]
    )
  }
}

module.exports = UtilisateurManager
