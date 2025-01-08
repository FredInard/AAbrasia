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

  // Récupérer tous les covoiturages avec pseudo utilisateur et titre de partie
  findAll() {
    return this.database.query(`
   SELECT 
    covoiturage.id AS covoiturage_id,
    covoiturage.utilisateur_id,
    utilisateur.pseudo AS utilisateur_pseudo,
    covoiturage.partie_id,
    partie.titre AS partie_titre,
    covoiturage.ville_depart,
    covoiturage.ville_arrivee,
    covoiturage.heure_depart,
    covoiturage.propose_retour
FROM 
    covoiturage
JOIN 
    utilisateur ON covoiturage.utilisateur_id = utilisateur.id
JOIN 
    partie ON covoiturage.partie_id = partie.id;

  `)
  }

  // Récupérer un covoiturage par ID
  find(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
  }

  // Récupérer les covoiturages pour une partie spécifique par son ID avec le pseudo de l'utilisateur
  findCovoiturageByPartyId(partyId) {
    return this.database.query(
      `SELECT covoiturage.*, utilisateur.pseudo 
     FROM ${this.table} AS covoiturage 
     JOIN utilisateur ON covoiturage.utilisateur_id = utilisateur.id 
     WHERE covoiturage.partie_id = ?`, // Correction ici
      [partyId]
    )
  }

  // Supprimer les covoiturages par utilisateur_id
  deleteByUtilisateurId(utilisateurId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE utilisateur_id = ?`,
      [utilisateurId]
    )
  }

  deleteByPartyAndUserId(partyId, userId) {
    return this.database.query(
      `DELETE FROM covoiturage WHERE partie_id = ? AND utilisateur_id = ?`,
      [partyId, userId]
    )
  }

  // Supprimer un covoiturage par ID
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

module.exports = CovoiturageManager
