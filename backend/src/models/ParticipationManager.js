const AbstractManager = require("./AbstractManager")

class ParticipationManager extends AbstractManager {
  constructor() {
    super({ table: "participation" })
  }

  insert(participation) {
    return this.database.query(
      `insert into participation (Utilisateur_Id, Partie_Id, Partie_IdMaitreDuJeu) VALUES (?, ?, ?)`,
      [
        participation.Utilisateur_Id,
        participation.Partie_Id,
        participation.Partie_IdMaitreDuJeu,
      ]
    )
  }

  update(participation) {
    return this.database.query(
      `update ${this.table} set Utilisateur_Id = ?, Partie_Id = ?, Partie_IdMaitreDuJeu = ?`, // Utilisation de "id" au lieu de "participation_id"
      [
        participation.Utilisateur_Id,
        participation.Partie_Id,
        participation.Partie_IdMaitreDuJeu,
        participation.id, // Assurez-vous que l'identifiant (ID) est bien présent ici.
      ]
    )
  }

  getCountUserParticipation(utilisateurId, partieId) {
    return this.database.query(
      `SELECT COUNT(*) AS count FROM participation WHERE Utilisateur_Id = ? AND Partie_Id = ?`,
      [utilisateurId, partieId]
    )
  }

  getDeleteUserParticipation(utilisateurId, partieId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE Utilisateur_Id = ? AND Partie_Id = ?`,
      [utilisateurId, partieId]
    )
  }
}

module.exports = ParticipationManager
