const AbstractManager = require("./AbstractManager")

class PartieManager extends AbstractManager {
  constructor() {
    super({ table: "partie" })
  }

  // Insert a new partie
  insert(partie) {
    return this.database.query(
      `INSERT INTO partie (
        titre,
        type,
        description,
        date,
        nb_max_joueurs,
        id_maitre_du_jeu,
        duree_estimee,
        lieu,
        photo_scenario,
       strict_nb_joueurs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        partie.titre,
        partie.type,
        partie.description,
        partie.date,
        partie.nb_max_joueurs,
        partie.id_maitre_du_jeu,
        partie.duree_estimee,
        partie.lieu,
        partie.photo_scenario,
        partie.strict_nb_joueurs === "1" || partie.strict_nb_joueurs === true
          ? 1
          : 0,
      ]
    )
  }

  // Update an existing partie
  update(partie) {
    return this.database.query(
      `UPDATE ${this.table} 
       SET 
         titre = ?, 
         type = ?, 
         description = ?, 
         date = ?, 
         nb_max_joueurs = ?, 
         id_maitre_du_jeu = ?, 
         duree_estimee = ?, 
         lieu = ?, 
         photo_scenario = ?, 
         strict_nb_joueurs = ?
       WHERE id = ?`,
      [
        partie.titre,
        partie.type,
        partie.description,
        partie.date,
        partie.nb_max_joueurs,
        partie.id_maitre_du_jeu,
        partie.duree_estimee,
        partie.lieu,
        partie.photo_scenario,
        partie.strict_nb_joueurs === "1" ? 1 : 0,
        partie.id,
      ]
    )
  }

  // Supprimer les parties par id_maitre_du_jeu
  deleteByMaitreDuJeuId(maitreDuJeuId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE id_maitre_du_jeu = ?`,
      [maitreDuJeuId]
    )
  }

  // Find all parties
  findAll() {
    return this.database.query(`SELECT * FROM ${this.table}`)
  }

  // Find a partie by ID, including the pseudo and photo_profil of the maître du jeu
  find(id) {
    return this.database.query(
      `
    SELECT p.*, u.pseudo AS maitre_du_jeu_pseudo, u.photo_profil AS maitre_du_jeu_photo
    FROM ${this.table} AS p
    LEFT JOIN utilisateur AS u ON p.id_maitre_du_jeu = u.id
    WHERE p.id = ?
    `,
      [id]
    )
  }

  // Get detailed info of all parties
  getAffichageInfoPartie() {
    return this.database.query(`
     
    SELECT
    partie.id, 
    partie.titre,
    partie.type,
    partie.description,
    partie.date,
    partie.nb_max_joueurs,
    partie.id_maitre_du_jeu,
    partie.duree_estimee,
    partie.lieu,
    partie.photo_scenario,
    utilisateur.pseudo AS maitre_du_jeu_pseudo,
    utilisateur.photo_profil AS maitre_du_jeu_photo
FROM 
    partie
JOIN 
    utilisateur ON partie.id_maitre_du_jeu = utilisateur.id;
    
      `)
  }

  // Get detailed info of parties on a specific date
  getAffichageInfoPartieDate(date) {
    return this.database.query(
      `
      SELECT
        p.id AS partieId,
        p.titre,
        p.type,
        p.description,
        p.date,
        p.nb_max_joueurs,
        p.id_maitre_du_jeu,
        u.pseudo AS pseudoMaitreDuJeu,
        u.photo_profil AS photoProfilMaitreDuJeu,
        p.duree_estimee,
        p.lieu,
        p.photo_scenario
      FROM partie p
      LEFT JOIN utilisateur u ON p.id_maitre_du_jeu = u.id
      WHERE DATE(p.date) = DATE(?);
      `,
      [date]
    )
  }

  // Find all parties by utilisateur ID
  findPartieByUtilisateurId(id) {
    return this.database.query(
      `
    SELECT DISTINCT
      partie.id,
      partie.titre,
      partie.type,
      partie.description,
      partie.date,
      partie.nb_max_joueurs,
      partie.duree_estimee,
      partie.lieu,
      partie.photo_scenario,
      partie.id_maitre_du_jeu, -- Ajout de l'id du maître du jeu
      utilisateur.pseudo AS maitre_du_jeu_pseudo,
      utilisateur.photo_profil AS maitre_du_jeu_photo,
      CASE 
        WHEN partie.id_maitre_du_jeu = ? THEN 'maitre_du_jeu'
        ELSE 'participant'
      END AS role
    FROM 
      partie
    LEFT JOIN 
      utilisateur ON partie.id_maitre_du_jeu = utilisateur.id
    LEFT JOIN 
      participation ON participation.partie_id = partie.id
    WHERE 
      partie.id_maitre_du_jeu = ? 
      OR participation.utilisateur_id = ?
    `,
      [id, id, id]
    )
  }

  // Find participants of a partie by partie ID
  findJoueursByPartieId(partieId) {
    return this.database.query(
      `
      SELECT
        u.id,
        u.pseudo,
        u.photo_profil
      FROM utilisateur u
      JOIN participation pa ON u.id = pa.utilisateur_id
      WHERE pa.partie_id = ?;
      `,
      [partieId]
    )
  }

  // Find parties where the utilisateur is the maitre du jeu
  findPartieMeneurByUtilisateurId(utilisateurId) {
    return this.database.query(
      `
      SELECT
        p.id AS partieId,
        p.titre,
        p.type,
        p.description,
        p.date,
        p.nb_max_joueurs,
        p.id_maitre_du_jeu,
        p.duree_estimee,
        p.lieu,
        p.photo_scenario,
        GROUP_CONCAT(u.pseudo) AS pseudosParticipants,
        GROUP_CONCAT(u.photo_profil) AS photosProfilsParticipants
      FROM partie p
      LEFT JOIN participation pa ON p.id = pa.partie_id
      LEFT JOIN utilisateur u ON pa.utilisateur_id = u.id
      WHERE p.id_maitre_du_jeu = ?
      GROUP BY p.id;
      `,
      [utilisateurId]
    )
  }

  // Get the count of participants in a partie
  getCountPartieById(partieId) {
    return this.database.query(
      `
      SELECT partie_id, COUNT(*) AS nbParticipants
      FROM participation
      WHERE partie_id = ?
      GROUP BY partie_id;
      `,
      [partieId]
    )
  }

  // Delete a partie and its related participations
  // getDestroyeurDePartie(partieId) {
  //   return this.database.query("DELETE FROM partie WHERE id = ?", [partieId])
  // }

  deleteByPartyId(partyId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE partie_id = ?`,
      [partyId]
    )
  }
}

module.exports = PartieManager
