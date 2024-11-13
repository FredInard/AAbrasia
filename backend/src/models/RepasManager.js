const AbstractManager = require("./AbstractManager")

class RepasManager extends AbstractManager {
  constructor() {
    super({ table: "repas" })
  }

  // Insérer un nouveau repas
  insert(repas) {
    return this.database.query(
      `INSERT INTO ${this.table} (utilisateur_id, partie_id, contenu) VALUES (?, ?, ?)`,
      [repas.utilisateur_id, repas.partie_id, repas.contenu]
    )
  }

  // Mettre à jour un repas existant
  update(repas) {
    return this.database.query(
      `UPDATE ${this.table} SET utilisateur_id = ?, partie_id = ?, contenu = ? WHERE id = ?`,
      [repas.utilisateur_id, repas.partie_id, repas.contenu, repas.id]
    )
  }

  // Récupérer tous les repas
  findAll() {
    return this.database.query(`SELECT * FROM ${this.table}`)
  }

  // Récupérer tous les repas pour une partie spécifique par son ID avec le pseudo de l'utilisateur
  getRepasByPartyId(partyId) {
    return this.database.query(
      `SELECT repas.*, utilisateur.pseudo 
     FROM ${this.table} AS repas 
     JOIN utilisateur ON repas.utilisateur_id = utilisateur.id 
     WHERE repas.partie_id = ?`, // Utilisation de 'partie_id' conformément à la table
      [partyId]
    )
  }

  // Récupérer un repas par ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  deleteByPartyAndUserId(partyId, userId) {
    return this.database.query(
      `DELETE FROM repas WHERE partie_id = ? AND utilisateur_id = ?`,
      [partyId, userId]
    )
  }

  // Supprimer un repas par ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }
}

module.exports = RepasManager
