const AbstractManager = require("./AbstractManager")

class LogManager extends AbstractManager {
  constructor() {
    super({ table: "log" })
  }

  // Insérer un nouveau log
  insert(log) {
    return this.database.query(
      `INSERT INTO ${this.table} (utilisateur_id, action, description, timestamp) VALUES (?, ?, ?, ?)`,
      [
        log.utilisateur_id,
        log.action,
        log.description,
        log.timestamp || new Date(),
      ]
    )
  }

  // Récupérer tous les logs
  findAll() {
    return this.database.query(`SELECT * FROM ${this.table}`)
  }

  // Récupérer un log par ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  // Supprimer un log par ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }
}

module.exports = LogManager
