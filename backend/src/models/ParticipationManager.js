const AbstractManager = require("./AbstractManager")

class ParticipationManager extends AbstractManager {
  constructor() {
    super({ table: "participation" })
  }

  // Insert a new participation
  insert(participation) {
    return this.database.query(
      `INSERT INTO ${this.table} (utilisateur_id, partie_id, date_participation) VALUES (?, ?, ?)`,
      [
        participation.utilisateur_id,
        participation.partie_id,
        participation.date_participation || new Date(),
      ]
    )
  }

  // Update an existing participation
  update(participation) {
    return this.database.query(
      `UPDATE ${this.table} SET utilisateur_id = ?, partie_id = ?, date_participation = ? WHERE id = ?`,
      [
        participation.utilisateur_id,
        participation.partie_id,
        participation.date_participation,
        participation.id,
      ]
    )
  }

  // Find all participations
  findAll() {
    return this.database.query(`SELECT * FROM ${this.table}`)
  }

  // Find a participation by ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  // Delete a participation by ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }

  // Get count of participations for a user in a specific partie
  getCountUserParticipation(utilisateurId, partieId) {
    return this.database.query(
      `SELECT COUNT(*) AS count FROM ${this.table} WHERE utilisateur_id = ? AND partie_id = ?`,
      [utilisateurId, partieId]
    )
  }

  // Delete a participation by user ID and partie ID
  deleteByUserAndPartie(utilisateurId, partieId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE utilisateur_id = ? AND partie_id = ?`,
      [utilisateurId, partieId]
    )
  }
}

module.exports = ParticipationManager

// const AbstractManager = require("./AbstractManager")

// class ParticipationManager extends AbstractManager {
//   constructor() {
//     super({ table: "participation" })
//   }

//   insert(participation) {
//     return this.database.query(
//       `insert into ${this.table} (Utilisateurs_Id, Partie_Id, Partie_IdMaitreDuJeu) VALUES (?, ?, ?)`,
//       [
//         participation.Utilisateurs_Id,
//         participation.Partie_Id,
//         participation.Partie_IdMaitreDuJeu,
//       ]
//     )
//   }

//   update(participation) {
//     return this.database.query(
//       `update ${this.table} set Utilisateurs_Id = ?, Partie_Id = ?, Partie_IdMaitreDuJeu = ?`, // Utilisation de "id" au lieu de "participation_id"
//       [
//         participation.Utilisateurs_Id,
//         participation.Partie_Id,
//         participation.Partie_IdMaitreDuJeu,
//         participation.id,
//       ]
//     )
//   }

//   getCountUserParticipation(utilisateurId, partieId) {
//     return this.database.query(
//       `SELECT COUNT(*) AS count FROM participation WHERE Utilisateurs_Id = ? AND Partie_Id = ?`,
//       [utilisateurId, partieId]
//     )
//   }

//   getDeleteUserParticipation(utilisateurId, partieId) {
//     return this.database.query(
//       `DELETE FROM ${this.table} WHERE Utilisateurs_Id = ? AND Partie_Id = ?`,
//       [utilisateurId, partieId]
//     )
//   }
// }

// module.exports = ParticipationManager
