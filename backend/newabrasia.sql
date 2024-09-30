-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: newabrasia
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `covoiturage`
--

DROP TABLE IF EXISTS `covoiturage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `covoiturage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `partie_id` int NOT NULL,
  `ville_depart` varchar(255) NOT NULL,
  `ville_arrivee` varchar(255) NOT NULL,
  `heure_depart` datetime NOT NULL,
  `propose_retour` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `partie_id` (`partie_id`),
  CONSTRAINT `covoiturage_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `covoiturage_ibfk_2` FOREIGN KEY (`partie_id`) REFERENCES `partie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `covoiturage`
--

LOCK TABLES `covoiturage` WRITE;
/*!40000 ALTER TABLE `covoiturage` DISABLE KEYS */;
INSERT INTO `covoiturage` VALUES (1,1,1,'Paris','Paris','2024-10-01 13:00:00',1),(2,3,1,'Marseille','Paris','2024-10-01 12:30:00',0),(3,2,2,'Lyon','Lyon','2024-10-05 14:00:00',1),(4,5,2,'Bordeaux','Lyon','2024-10-05 13:30:00',1),(5,4,3,'Lille','Marseille','2024-10-10 16:00:00',1),(6,1,3,'Paris','Marseille','2024-10-10 16:30:00',1),(7,5,4,'Bordeaux','Lille','2024-10-15 18:00:00',1),(8,6,4,'Nantes','Lille','2024-10-15 17:30:00',1),(9,6,5,'Nantes','Bordeaux','2024-10-20 15:00:00',1),(10,4,5,'Lille','Bordeaux','2024-10-20 16:00:00',0),(11,1,6,'Paris','Nantes','2024-10-28 17:00:00',1),(12,2,6,'Lyon','Nantes','2024-10-28 16:00:00',1);
/*!40000 ALTER TABLE `covoiturage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `log_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participation`
--

DROP TABLE IF EXISTS `participation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `partie_id` int NOT NULL,
  `date_participation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_id` (`utilisateur_id`,`partie_id`),
  KEY `partie_id` (`partie_id`),
  CONSTRAINT `participation_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `participation_ibfk_2` FOREIGN KEY (`partie_id`) REFERENCES `partie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participation`
--

LOCK TABLES `participation` WRITE;
/*!40000 ALTER TABLE `participation` DISABLE KEYS */;
INSERT INTO `participation` VALUES (1,1,1,'2024-10-01 14:00:00'),(2,3,1,'2024-10-01 14:05:00'),(3,4,1,'2024-10-01 14:10:00'),(4,2,2,'2024-10-05 15:00:00'),(5,5,2,'2024-10-05 15:10:00'),(6,6,2,'2024-10-05 15:15:00'),(7,4,3,'2024-10-10 18:00:00'),(8,1,3,'2024-10-10 18:10:00'),(9,3,3,'2024-10-10 18:15:00'),(10,5,4,'2024-10-15 20:00:00'),(11,6,4,'2024-10-15 20:05:00'),(12,2,4,'2024-10-15 20:10:00'),(13,6,5,'2024-10-20 17:00:00'),(14,4,5,'2024-10-20 17:05:00'),(15,3,5,'2024-10-20 17:10:00'),(16,1,6,'2024-10-28 19:00:00'),(17,2,6,'2024-10-28 19:05:00'),(18,5,6,'2024-10-28 19:10:00');
/*!40000 ALTER TABLE `participation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partie`
--

DROP TABLE IF EXISTS `partie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `type` enum('jeux','événement') DEFAULT 'jeux',
  `description` text,
  `date` datetime NOT NULL,
  `nb_max_joueurs` int NOT NULL,
  `id_maitre_du_jeu` int DEFAULT NULL,
  `duree_estimee` int DEFAULT NULL,
  `lieu` varchar(255) DEFAULT NULL,
  `photo_scenario` varchar(255) DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_maitre_du_jeu` (`id_maitre_du_jeu`),
  CONSTRAINT `partie_ibfk_1` FOREIGN KEY (`id_maitre_du_jeu`) REFERENCES `utilisateur` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partie`
--

LOCK TABLES `partie` WRITE;
/*!40000 ALTER TABLE `partie` DISABLE KEYS */;
INSERT INTO `partie` VALUES (1,'Aventure en forêt enchantée','jeux','Une aventure mystérieuse au cœur d\'une forêt magique','2024-10-01 14:00:00',5,5,4,'Paris',NULL,'2024-09-30 23:19:41'),(2,'Le trésor perdu des pirates','jeux','Une chasse au trésor pleine de rebondissements','2024-10-05 15:00:00',4,2,3,'Lyon',NULL,'2024-09-30 23:19:41'),(3,'La cité des ombres','événement','Un grand jeu de rôle à travers une cité en ruines','2024-10-10 18:00:00',6,4,5,'Marseille',NULL,'2024-09-30 23:19:41'),(4,'Les dragons de l\'apocalypse','jeux','Une aventure épique avec des dragons dévastateurs','2024-10-15 20:00:00',5,3,4,'Lille',NULL,'2024-09-30 23:19:41'),(5,'L\'île aux monstres','jeux','Un jeu de survie sur une île peuplée de créatures dangereuses','2024-10-20 17:00:00',4,6,3,'Bordeaux',NULL,'2024-09-30 23:19:41'),(6,'Le tournoi des héros','événement','Un grand tournoi de héros avec des épreuves variées','2024-10-28 19:00:00',6,1,5,'Nantes',NULL,'2024-09-30 23:19:41');
/*!40000 ALTER TABLE `partie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repas`
--

DROP TABLE IF EXISTS `repas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `partie_id` int NOT NULL,
  `contenu` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `partie_id` (`partie_id`),
  CONSTRAINT `repas_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `repas_ibfk_2` FOREIGN KEY (`partie_id`) REFERENCES `partie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repas`
--

LOCK TABLES `repas` WRITE;
/*!40000 ALTER TABLE `repas` DISABLE KEYS */;
INSERT INTO `repas` VALUES (1,1,1,'Apporte des boissons'),(2,3,1,'Apporte des chips'),(3,2,2,'Apporte un gâteau'),(4,5,2,'Apporte des jus de fruits'),(5,4,3,'Apporte des sandwichs'),(6,1,3,'Apporte des salades'),(7,5,4,'Apporte des gâteaux'),(8,6,4,'Apporte des boissons'),(9,6,5,'Apporte des pizzas'),(10,4,5,'Apporte des fruits'),(11,1,6,'Apporte des boissons'),(12,2,6,'Apporte des gâteaux');
/*!40000 ALTER TABLE `repas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pseudo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('membre','admin') DEFAULT 'membre',
  `date_naissance` date DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `bio` text,
  `photo_profil` varchar(255) DEFAULT NULL,
  `date_inscription` datetime DEFAULT CURRENT_TIMESTAMP,
  `dernier_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'Dupont','Jean','jean.dupont@example.com','JeanD','azerty','admin','1990-05-15','12 rue de la Paix','Paris','0123456789','Passionné de jeux de rôle',NULL,'2024-09-30 23:19:41',NULL),(2,'Martin','Lucie','lucie.martin@example.com','LucieM',' azerty ','admin','1985-08-22','22 avenue de France','Lyon','0987654321','Organisatrice de sessions JDR',NULL,'2024-09-30 23:19:41',NULL),(3,'Leroy','Paul','paul.leroy@example.com','PaulL',' azerty ','membre','1992-02-10','34 boulevard des Champs','Marseille','0654321098','Joueur occasionnel',NULL,'2024-09-30 23:19:41',NULL),(4,'Dubois','Marie','marie.dubois@example.com','MarieD',' azerty ','membre','1988-09-30','78 impasse des Lilas','Lille','0678901234','Fan de science-fiction',NULL,'2024-09-30 23:19:41',NULL),(5,'Rousseau','Pierre','pierre.rousseau@example.com','PierreR',' azerty ','membre','1995-12-12','45 rue Victor Hugo','Bordeaux','0567890123','Master de jeux de rôle',NULL,'2024-09-30 23:19:41',NULL),(6,'Bernard','Clara','clara.bernard@example.com','ClaraB',' azerty ','membre','1989-11-18','29 rue des Fleurs','Nantes','0487654321','Créatrice d\'univers JDR',NULL,'2024-09-30 23:19:41',NULL);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-30 23:23:46
