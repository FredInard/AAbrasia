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

  // Récupérer tous les repas avec les informations utilisateur et partie
  findAll() {
    return this.database.query(`
    SELECT 
      repas.id,
      repas.partie_id,
      repas.utilisateur_id,
      repas.contenu,
      utilisateur.pseudo AS utilisateur_pseudo,
      partie.titre AS partie_titre
    FROM repas
    JOIN utilisateur ON repas.utilisateur_id = utilisateur.id
    JOIN partie ON repas.partie_id = partie.id
  `)
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

  // Supprimer les repas par utilisateur_id
  deleteByUtilisateurId(utilisateurId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE utilisateur_id = ?`,
      [utilisateurId]
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

  deleteByPartyId(partyId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE partie_id = ?`,
      [partyId]
    )
  }
}

module.exports = RepasManager
