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

  findParticipationsByPartyId(partyId) {
    console.info("Appel de findParticipationsByPartyId avec partyId:", partyId)
    return this.database
      .query(
        `SELECT utilisateur.pseudo, utilisateur.photo_profil 
       FROM participation
       JOIN utilisateur ON participation.utilisateur_id = utilisateur.id 
       WHERE participation.partie_id = ?`,
        [partyId]
      )
      .then((results) => {
        console.info("Résultats de la requête:", results) // Vérifiez ici combien de résultats sont retournés
        return results
      })
      .catch((error) => {
        console.error("Erreur lors de l'exécution de la requête:", error)
        throw error
      })
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
