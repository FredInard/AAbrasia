-- Table utilisateur
DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE `utilisateur` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `pseudo` VARCHAR(100) NOT NULL UNIQUE,
  `hashedPassword` VARCHAR(255) NOT NULL,
  `role` ENUM('membre', 'admin', 'tresorier', 'secretaire', 'inactif') DEFAULT 'membre',
  `date_naissance` DATE DEFAULT NULL,
  `adresse` VARCHAR(255) DEFAULT NULL,
  `ville` VARCHAR(100) DEFAULT NULL,
  `telephone` VARCHAR(15) DEFAULT NULL,
  `bio` TEXT,
  `photo_profil` VARCHAR(255) DEFAULT NULL,
  `date_inscription` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `dernier_login` DATETIME DEFAULT NULL,
  `cgu_accepted` TINYINT(1) NOT NULL DEFAULT 0,    
  `cookies_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table partie
CREATE TABLE `partie` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(255) NOT NULL,
  `type` ENUM('jeux', 'evenement') DEFAULT 'jeux',
  `description` TEXT,
  `date` DATETIME NOT NULL,
  `nb_max_joueurs` INT NOT NULL,
  `id_maitre_du_jeu` INT DEFAULT NULL,
  `duree_estimee` INT DEFAULT NULL,
  `lieu` VARCHAR(255) DEFAULT NULL,
  `photo_scenario` VARCHAR(255) DEFAULT NULL,
  `strict_nb_joueurs` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0 = flexible, 1 = strict',
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_maitre_du_jeu`) REFERENCES `utilisateur`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table cotisation
DROP TABLE IF EXISTS `cotisation`;
CREATE TABLE `cotisation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `annee` YEAR NOT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `date_paiement` DATETIME DEFAULT NULL,
  `etat` ENUM('payee', 'non_payee') DEFAULT 'non_payee',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table transaction comptable
DROP TABLE IF EXISTS `transaction_comptable`;
CREATE TABLE `transaction_comptable` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `type` ENUM('recette', 'depense') NOT NULL,
  `categorie` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `utilisateur_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table document
DROP TABLE IF EXISTS `document`;
CREATE TABLE `document` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(255) NOT NULL,
  `type` ENUM('facture', 'justificatif', 'rapport', 'autre') DEFAULT 'autre',
  `chemin_fichier` VARCHAR(255) NOT NULL,
  `date_upload` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `utilisateur_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Modification de la table participation
DROP TABLE IF EXISTS `participation`;
CREATE TABLE `participation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `partie_id` INT NOT NULL,
  `date_participation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_partie` (`utilisateur_id`, `partie_id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`partie_id`) REFERENCES `partie`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table pour suivre les logs
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table repas
DROP TABLE IF EXISTS `repas`;
CREATE TABLE `repas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `partie_id` INT NOT NULL,
  `contenu` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`partie_id`) REFERENCES `partie`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table covoiturage
DROP TABLE IF EXISTS `covoiturage`;
CREATE TABLE `covoiturage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `partie_id` INT NOT NULL,
  `ville_depart` VARCHAR(255) NOT NULL,
  `ville_arrivee` VARCHAR(255) NOT NULL,
  `heure_depart` DATETIME NOT NULL,
  `propose_retour` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`partie_id`) REFERENCES `partie`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table password_reset_tokens
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiration DATETIME NOT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Table partie
DROP TABLE IF EXISTS `partie`;
CREATE TABLE `partie` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(255) NOT NULL,
  `type` ENUM('jeux', 'evenement') DEFAULT 'jeux',
  `description` TEXT,
  `date` DATETIME NOT NULL,
  `nb_max_joueurs` INT NOT NULL,
  `id_maitre_du_jeu` INT DEFAULT NULL,
  `duree_estimee` INT DEFAULT NULL,
  `lieu` VARCHAR(255) DEFAULT NULL,
  `photo_scenario` VARCHAR(255) DEFAULT NULL,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_maitre_du_jeu`) REFERENCES `utilisateur`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table cotisation
DROP TABLE IF EXISTS `cotisation`;
CREATE TABLE `cotisation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `annee` YEAR NOT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `date_paiement` DATETIME DEFAULT NULL,
  `etat` ENUM('payee', 'non_payee') DEFAULT 'non_payee',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table transaction comptable
DROP TABLE IF EXISTS `transaction_comptable`;
CREATE TABLE `transaction_comptable` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `type` ENUM('recette', 'depense') NOT NULL,
  `categorie` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `utilisateur_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table document
DROP TABLE IF EXISTS `document`;
CREATE TABLE `document` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(255) NOT NULL,
  `type` ENUM('facture', 'justificatif', 'rapport', 'autre') DEFAULT 'autre',
  `chemin_fichier` VARCHAR(255) NOT NULL,
  `date_upload` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `utilisateur_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Modification de la table participation
DROP TABLE IF EXISTS `participation`;
CREATE TABLE `participation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `partie_id` INT NOT NULL,
  `date_participation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_partie` (`utilisateur_id`, `partie_id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`partie_id`) REFERENCES `partie`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table pour suivre les logs
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table repas
DROP TABLE IF EXISTS `repas`;
CREATE TABLE `repas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `partie_id` INT NOT NULL,
  `contenu` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`partie_id`) REFERENCES `partie`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table covoiturage
DROP TABLE IF EXISTS `covoiturage`;
CREATE TABLE `covoiturage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT NOT NULL,
  `partie_id` INT NOT NULL,
  `ville_depart` VARCHAR(255) NOT NULL,
  `ville_arrivee` VARCHAR(255) NOT NULL,
  `heure_depart` DATETIME NOT NULL,
  `propose_retour` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`partie_id`) REFERENCES `partie`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table password_reset_tokens
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiration DATETIME NOT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

