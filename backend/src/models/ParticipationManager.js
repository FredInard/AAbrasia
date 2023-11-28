const AbstractManager = require("./AbstractManager")

class ParticipationManager extends AbstractManager {
  constructor() {
    super({ table: "participation" })
  }

  insert(participation) {
    return this.database.query(
      `insert into ${this.table} (Utilisateurs_Id, Partie_Id, Partie_IdMaitreDuJeu) VALUES (?, ?, ?)`,
      [
        participation.Utilisateurs_Id,
        participation.Partie_Id,
        participation.Partie_IdMaitreDuJeu,
      ]
    )
  }

  update(participation) {
    return this.database.query(
      `update ${this.table} set Utilisateurs_Id = ?, Partie_Id = ?, Partie_IdMaitreDuJeu = ?`, // Utilisation de "id" au lieu de "participation_id"
      [
        participation.Utilisateurs_Id,
        participation.Partie_Id,
        participation.Partie_IdMaitreDuJeu,
        participation.id,
      ]
    )
  }

  getCountUserParticipation(utilisateurId, partieId) {
    return this.database.query(
      `SELECT COUNT(*) AS count FROM participation WHERE Utilisateurs_Id = ? AND Partie_Id = ?`,
      [utilisateurId, partieId]
    )
  }

  getDeleteUserParticipation(utilisateurId, partieId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE Utilisateurs_Id = ? AND Partie_Id = ?`,
      [utilisateurId, partieId]
    )
  }
}

module.exports = ParticipationManager
