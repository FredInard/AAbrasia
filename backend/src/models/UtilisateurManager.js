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

  // Anonymise toutes les infos (sauf id, date_inscription)
  anonymize(id) {
    return this.database.query(
      `UPDATE ${this.table}
     SET
       nom = '...',
       prenom = '...',
       email = '...',
       pseudo = '...',
       role = 'inactif',
       date_naissance = NULL,
       adresse = '...',
       ville = '...',
       telephone = '...',
       bio = '...',
       photo_profil = NULL,
       hashedPassword = 'AnonymizedPassword123!',
       date_inscription = date_inscription,
       dernier_login = NULL
     WHERE id = ?`,
      [id]
    )
  }

  // Insérer un nouvel utilisateur
  insert(utilisateur) {
    return this.database.query(
      `INSERT INTO ${this.table} (
        nom,
        prenom,
        email,
        pseudo,
        hashedPassword,
        role,
        date_naissance,
        adresse,
        ville,
        telephone,
        bio,
        photo_profil,
        cgu_accepted,
        cookies_accepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.pseudo,
        utilisateur.hashedPassword, // déjà haché par hashPassword
        utilisateur.role || "membre",
        utilisateur.date_naissance,
        utilisateur.adresse,
        utilisateur.ville,
        utilisateur.telephone,
        utilisateur.bio,
        utilisateur.photo_profil,
        utilisateur.cgu_accepted ? 1 : 0,
        utilisateur.cookies_accepted ? 1 : 0,
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

  // Recherche d'un utilisateur par email
  findByEmail(email) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE email = ?`, [
      email,
    ])
  }
}

module.exports = UtilisateurManager
