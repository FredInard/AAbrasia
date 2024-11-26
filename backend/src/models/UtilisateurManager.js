const AbstractManager = require("./AbstractManager")

class UtilisateurManager extends AbstractManager {
  constructor() {
    super({ table: "utilisateur" })
  }

  findByEmailOrPseudo(email, pseudo) {
    return this.database.query(
      `SELECT * FROM ${this.table} WHERE email = ? OR pseudo = ?`,
      [email, pseudo]
    )
  }

  // Insérer un nouvel utilisateur
  insert(utilisateur) {
    return this.database.query(
      `INSERT INTO ${this.table} (nom, prenom, email, pseudo, hashedPassword, role, date_naissance, adresse, ville, telephone, bio, photo_profil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.pseudo,
        utilisateur.hashedPassword, // Le mot de passe doit déjà être haché
        utilisateur.role || "membre",
        utilisateur.date_naissance,
        utilisateur.adresse,
        utilisateur.ville,
        utilisateur.telephone,
        utilisateur.bio,
        utilisateur.photo_profil,
      ]
    )
  }

  // Mettre à jour un utilisateur existant
  update(utilisateur) {
    console.info("utilisateur manager", utilisateur) // Placer le console.info en dehors de return
    return this.database.query(
      `UPDATE ${this.table} SET nom = ?, prenom = ?, email = ?, pseudo = ?, role = ?, date_naissance = ?, adresse = ?, ville = ?, telephone = ?, bio = ?, photo_profil = ? WHERE id = ?`,
      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.pseudo,
        utilisateur.role,
        utilisateur.date_naissance,
        utilisateur.adresse,
        utilisateur.ville,
        utilisateur.telephone,
        utilisateur.bio,
        utilisateur.photo_profil || null,
        utilisateur.id,
      ]
    )
  }

  // Trouver tous les utilisateurs
  findAll() {
    return this.database.query(
      `SELECT id, nom, prenom, email, pseudo, role, date_naissance, adresse, ville, telephone, bio, photo_profil, date_inscription, dernier_login FROM ${this.table}`
    )
  }

  // Trouver un utilisateur par ID
  find(id) {
    return this.database.query(
      `SELECT id, nom, prenom, email, pseudo, role, date_naissance, adresse, ville, telephone, bio, photo_profil, date_inscription, dernier_login FROM ${this.table} WHERE id = ?`,
      [id]
    )
  }

  // Supprimer un utilisateur par ID
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id])
  }

  // Trouver un utilisateur par pseudo
  findByPseudo(pseudo) {
    return this.database.query(
      `SELECT id, pseudo FROM ${this.table} WHERE pseudo = ?`,
      [pseudo]
    )
  }

  // Trouver un utilisateur par email avec le mot de passe
  findByEmailWithPassword(email) {
    return this.database.query(
      `SELECT id, email, hashedPassword, role, pseudo, photo_profil FROM ${this.table} WHERE email = ?`,
      [email]
    )
  }

  // Mettre à jour le mot de passe
  updatePassword(id, hashedPassword) {
    return this.database.query(
      `UPDATE ${this.table} SET hashedPassword = ? WHERE id = ?`,
      [hashedPassword, id]
    )
  }

  // Mettre à jour la photo de profil
  updatePhotoProfil(id, photoProfil) {
    return this.database.query(
      `UPDATE ${this.table} SET photo_profil = ? WHERE id = ?`,
      [photoProfil, id]
    )
  }

  // Récupérer le profil d'un utilisateur par ID (sans le mot de passe)
  findProfileById(id) {
    return this.database.query(
      `SELECT id, nom, prenom, email, pseudo, role, date_naissance, adresse, ville, telephone, bio, photo_profil, date_inscription, dernier_login FROM ${this.table} WHERE id = ?`,
      [id]
    )
  }
}

module.exports = UtilisateurManager
