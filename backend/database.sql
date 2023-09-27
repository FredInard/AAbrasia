-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aabrasia
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
-- Table structure for table `participation`
--

DROP TABLE IF EXISTS `participation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Utilisateur_Id` int DEFAULT NULL,
  `Partie_Id` int DEFAULT NULL,
  `Partie_IdMaitreDuJeu` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Utilisateur_Id` (`Utilisateur_Id`),
  KEY `Partie_Id` (`Partie_Id`),
  CONSTRAINT `participation_ibfk_1` FOREIGN KEY (`Utilisateur_Id`) REFERENCES `utilisateurs` (`id`),
  CONSTRAINT `participation_ibfk_2` FOREIGN KEY (`Partie_Id`) REFERENCES `partie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participation`
--

LOCK TABLES `participation` WRITE;
/*!40000 ALTER TABLE `participation` DISABLE KEYS */;
INSERT INTO `participation` VALUES (55,13,5,10),(56,14,5,10),(57,15,5,10),(58,10,6,13),(59,13,6,13),(60,15,6,13),(61,16,7,10),(62,17,7,10),(63,18,7,10),(64,11,7,10),(65,14,7,10),(66,18,8,10),(67,11,8,10),(68,14,8,10);
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
  `Titre` varchar(100) NOT NULL,
  `Date` date NOT NULL,
  `Heure` time NOT NULL,
  `Lieu` varchar(100) NOT NULL,
  `MaitreDuJeu` int NOT NULL,
  `Description` text NOT NULL,
  `NombreJoueur` int NOT NULL,
  `TypeDeJeux` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `MaitreDuJeu` (`MaitreDuJeu`),
  CONSTRAINT `partie_ibfk_1` FOREIGN KEY (`MaitreDuJeu`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partie`
--

LOCK TABLES `partie` WRITE;
/*!40000 ALTER TABLE `partie` DISABLE KEYS */;
INSERT INTO `partie` VALUES (5,'L\'Épopée des Héros Perdus','2023-09-15','19:00:00','Discord',10,'Une aventure épique dans les contrées lointaines d\'Abrasia.',5,'Fantasy'),(6,'Mystères à la Maison Hantée','2023-09-20','20:30:00','MJC',10,'Une partie pleine de mystères et de frissons.',4,'Horreur'),(7,'Le Secret des Mages Anciens','2023-09-25','18:15:00','Discord',10,'Une quête pour découvrir les secrets de la magie.',6,'Fantasy'),(8,'La Quête du Trésor Perdu','2023-09-30','21:00:00','MJC',10,'Une aventure périlleuse dans les profondeurs d\'un donjon.',3,'Fantasy');
/*!40000 ALTER TABLE `partie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(250) NOT NULL,
  `Prenom` varchar(250) NOT NULL,
  `Pseudo` varchar(50) NOT NULL,
  `Mail` varchar(100) NOT NULL,
  `Telephone` varchar(20) DEFAULT NULL,
  `PseudoDiscord` varchar(50) DEFAULT NULL,
  `Description` text,
  `PhotoProfil` varchar(100) DEFAULT NULL,
  `VilleResidence` varchar(50) DEFAULT NULL,
  `hashedPassword` varchar(255) NOT NULL,
  `Admin` tinyint(1) DEFAULT NULL,
  `MembreEquipe` tinyint(1) DEFAULT NULL,
  `MembreAssociation` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Mail` (`Mail`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (10,'inard','Fred','Fredo','test.1un@gmail.co','061234567890','Finky','webmaster',NULL,'VSS','$argon2id$v=19$m=65536,t=5,p=1$1cy6eNa1lqGuy6TimPNASw$EhUwJpP6dnQn6yKlEkv2hyVNhGq9SsIVZidjri8rnUM',1,NULL,1),(11,'inard','Mathis','LeP\'ti','Mathis.non@gmail.com',NULL,'Mathisou','Fils du WM',NULL,'VSS','azerty',NULL,NULL,NULL),(13,'McFly','Marty','Morty','marty.mcfly@gmail.com',NULL,'PseudoDeMCFLY',NULL,NULL,NULL,'azerty',NULL,NULL,NULL),(14,'Doe','John','johndoe','john.doe@example.com','123-456-7890','john.doe#1234','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','profile1.jpg','New York','azerty',0,0,0),(15,'Smith','Jane','janesmith','jane.smith@example.com','987-654-3210','jane.smith#5678','Sed euismod quam eu libero hendrerit.','profile2.jpg','Los Angeles','azerty',0,0,0),(16,'Johnson','Robert','robertjohnson','robert.johnson@example.com','555-123-4567','robert.johnson#9012','Aenean id diam in tellus facilisis tristique.','profile3.jpg','Chicago','azerty',0,0,0),(17,'Davis','Sarah','sarahdavis','sarah.davis@example.com','444-789-0123','sarah.davis#3456','Nullam volutpat interdum diam, vel luctus ante rhoncus sed.','profile4.jpg','San Francisco','azerty',0,0,0),(18,'Brown','Michael','michaelbrown','michael.brown@example.com','222-555-7890','michael.brown#7890','Quisque sit amet dui nec nisi imperdiet hendrerit.','profile5.jpg','Miami','azerty',0,0,0);
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-27 23:22:18
