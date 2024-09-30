const AbstractManager = require("./AbstractManager")

class CovoiturageManager extends AbstractManager {
  constructor() {
    super({ table: "covoiturage" })
  }

  // Insérer un nouveau covoiturage
  insert(covoiturage) {
    return this.database.query(
      `INSERT INTO ${this.table} (utilisateur_id, partie_id, ville_depart, ville_arrivee, heure_depart, propose_retour) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        covoiturage.utilisateur_id,
        covoiturage.partie_id,
        covoiturage.ville_depart,
        covoiturage.ville_arrivee,
        covoiturage.heure_depart,
        covoiturage.propose_retour,
      ]
    )
  }

  // Mettre à jour un covoiturage existant
  update(covoiturage) {
    return this.database.query(
      `UPDATE ${this.table} SET utilisateur_id = ?, partie_id = ?, ville_depart = ?, ville_arrivee = ?, heure_depart = ?, propose_retour = ? WHERE id = ?`,
      [
        covoiturage.utilisateur_id,
        covoiturage.partie_id,
        covoiturage.ville_depart,
        covoiturage.ville_arrivee,
        covoiturage.heure_depart,
        covoiturage.propose_retour,
        covoiturage.id,
      ]
    )
  }

  // Récupérer tous les covoiturages
  findAll() {
    return this.database.query(`SELECT * FROM ${this.table}`)
  }

  // Récupérer un covoiturage par ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  // Supprimer un covoiturage par ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }
}

module.exports = CovoiturageManager
