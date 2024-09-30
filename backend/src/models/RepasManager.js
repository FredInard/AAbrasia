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

  // Récupérer un repas par ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  // Supprimer un repas par ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }
}

module.exports = RepasManager
