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

  // Supprimer les participations par utilisateur_id
  deleteByUtilisateurId(utilisateurId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE utilisateur_id = ?`,
      [utilisateurId]
    )
  }

  // Find all participations with additional details
  findAll() {
    return this.database.query(`
    SELECT 
      participation.id, 
      participation.utilisateur_id, 
      participation.partie_id, 
      participation.date_participation,
      utilisateur.pseudo AS utilisateur_pseudo,
      partie.titre AS partie_titre
    FROM 
      participation
    JOIN 
      utilisateur ON participation.utilisateur_id = utilisateur.id
    JOIN 
      partie ON participation.partie_id = partie.id
  `)
  }

  // Find a participation by ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  findParticipationsByPartyId(partyId) {
    // console.info("Appel de findParticipationsByPartyId avec partyId:", partyId)
    return this.database.query(
      `
        SELECT utilisateur.id, utilisateur.pseudo, utilisateur.photo_profil 
        FROM participation
        JOIN utilisateur ON participation.utilisateur_id = utilisateur.id
        JOIN partie ON participation.partie_id = partie.id
        WHERE participation.partie_id = ? AND utilisateur.id != partie.id_maitre_du_jeu
        `,
      [partyId]
    )
  }

  findByPartyAndUserId(partyId, userId) {
    return this.database.query(
      `SELECT * FROM participation WHERE partie_id = ? AND utilisateur_id = ?`,
      [partyId, userId]
    )
  }

  // Delete a participation by ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }

  deleteByPartyAndUserId(partyId, userId) {
    return this.database.query(
      `DELETE FROM participation WHERE partie_id = ? AND utilisateur_id = ?`,
      [partyId, userId]
    )
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

  // Ajoute un utilisateur à la participation
  addParticipantToParty(partyId, userId) {
    return this.database.query(
      `INSERT INTO participation (partie_id, utilisateur_id) VALUES (?, ?)`,
      [partyId, userId]
    )
  }

  deleteByPartyId(partyId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE partie_id = ?`,
      [partyId]
    )
  }
}

module.exports = ParticipationManager
