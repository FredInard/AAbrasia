const AbstractManager = require("./AbstractManager")

class PasswordResetManager extends AbstractManager {
  constructor() {
    super({ table: "password_reset_tokens" })
  }

  // Insérer un nouveau token
  insert(data) {
    return this.database.query(
      `INSERT INTO ${this.table} (utilisateur_id, token, expiration) VALUES (?, ?, ?)`,
      [data.utilisateur_id, data.token, data.expiration]
    )
  }

  // Rechercher un token par sa valeur
  findByToken(token) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE token = ?`, [
      token,
    ])
  }

  // Supprimer un token par ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }
}

module.exports = PasswordResetManager
