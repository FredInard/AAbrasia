const AbstractManager = require("./AbstractManager")

class UtilisateurManager extends AbstractManager {
  constructor() {
    super({ table: "utilisateur" })
  }

  // Insérer un nouvel utilisateur
  insert(utilisateur) {
    return this.database.query(
      `INSERT INTO ${this.table} (nom, prenom, email, pseudo, mot_de_passe, role, date_naissance, adresse, ville, telephone, bio, photo_profil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.pseudo,
        utilisateur.mot_de_passe, // Le mot de passe doit déjà être haché
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
        utilisateur.photo_profil,
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

  // Trouver un utilisateur par pseudo avec le mot de passe
  findByPseudoWithPassword(pseudo) {
    return this.database.query(
      `SELECT id, pseudo, mot_de_passe, role FROM ${this.table} WHERE pseudo = ?`,
      [pseudo]
    )
  }

  // Mettre à jour le mot de passe
  updatePassword(id, motDePasse) {
    return this.database.query(
      `UPDATE ${this.table} SET mot_de_passe = ? WHERE id = ?`,
      [motDePasse, id]
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

// const AbstractManager = require("./AbstractManager")

// class UtilisateursManager extends AbstractManager {
//   constructor() {
//     super({ table: "utilisateurs" })
//   }

//   findAllPseudo(pseudoInscription) {
//     return this.database.query(
//       `
//     SELECT Pseudo FROM ${this.table} WHERE Pseudo = ?`,
//       [pseudoInscription]
//     )
//   }

//   insert(utilisateurs) {
//     return this.database.query(
//       `insert into ${this.table} (Nom,Prenom, Pseudo, Mail, hashedPassword, PhotoProfil) values (?,?,?,?,?,?)`,
//       [
//         utilisateurs.Nom,
//         utilisateurs.Prenom,
//         utilisateurs.Pseudo,
//         utilisateurs.Mail,
//         utilisateurs.hashedPassword,
//         utilisateurs.PhotoProfil,
//       ]
//     )
//   }

//   update(utilisateurs) {
//     return this.database.query(
//       `UPDATE ${this.table} SET Nom = ?, Prenom = ?, Pseudo = ?, Mail = ?, Telephone = ?, PseudoDiscord = ?, Description = ?, PhotoProfil = ?, VilleResidence = ?, hashedPassword = ?, Admin = ?, MembreEquipe = ?, MembreAssociation = ? WHERE (id = ?)`,
//       [
//         utilisateurs.Nom,
//         utilisateurs.Prenom,
//         utilisateurs.Pseudo,
//         utilisateurs.Mail,
//         utilisateurs.Telephone,
//         utilisateurs.PseudoDiscord,
//         utilisateurs.Description,
//         utilisateurs.PhotoProfil,
//         utilisateurs.VilleResidence,
//         utilisateurs.hashedPassword,
//         utilisateurs.Admin,
//         utilisateurs.MembreEquipe,
//         utilisateurs.MembreAssociation,
//         utilisateurs.id,
//       ]
//     )
//   }

//   readlessPW(id) {
//     return this.database.query(
//       `
//       SELECT
//         *
//       FROM ${this.table}
//       WHERE id = ?
//     `,
//       [id]
//     )
//   }

//   getDisplayPlayer(id) {
//     return this.database.query(
//       `
//       SELECT utilisateurs.PhotoProfil, utilisateurs.Nom, utilisateurs.Prenom, utilisateurs.Pseudo, utilisateurs.id, utilisateurs.Mail, utilisateurs.PseudoDiscord, utilisateurs.Telephone, utilisateurs.Description, utilisateurs.VilleResidence
//       FROM ${this.table}
//       JOIN participation ON utilisateurs.id = participation.Utilisateurs_Id
//       WHERE participation.Partie_Id = ?;`,
//       [id]
//     )
//   }

//   getDisplayMJ(id) {
//     return this.database.query(
//       `
//       SELECT utilisateurs.PhotoProfil, utilisateurs.Nom, utilisateurs.Prenom, utilisateurs.Pseudo, utilisateurs.id, utilisateurs.Mail, utilisateurs.PseudoDiscord, utilisateurs.Telephone, utilisateurs.Description, utilisateurs.VilleResidence
//       FROM ${this.table}
//       JOIN partie ON utilisateurs.id = partie.MaitreDujeu
//       WHERE partie.id = ?;`,
//       [id]
//     )
//   }

//   getUserByPseudoWithPassword(Pseudo) {
//     return this.database.query(
//       `select id, Pseudo, PhotoProfil, Admin, hashedPassword from ${this.table} where Pseudo = ?`,
//       [Pseudo]
//     )
//   }

//   updateProfilPicture(utilisateurs, profilpicturePath) {
//     return this.database.query(
//       `UPDATE ${this.table} SET PhotoProfil = ? WHERE id = ?`,
//       [profilpicturePath, utilisateurs.id]
//     )
//   }

//   getReadPartieByUtilisateurId(id) {
//     return this.database.query(
//       `
//       SELECT *
//       FROM partie
//       INNER JOIN participation ON partie.id = participation.Partie_Id
//       WHERE participation.Utilisateurs_Id = ? ;
//       `,
//       [id]
//     )
//   }
// }

// module.exports = UtilisateursManager
