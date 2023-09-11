-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema aabrasia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema aabrasia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `aabrasia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `aabrasia` ;

-- -----------------------------------------------------
-- Table `aabrasia`.`utilisateur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aabrasia`.`utilisateur` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Nom` VARCHAR(50) NOT NULL,
  `Prenom` VARCHAR(50) NOT NULL,
  `Pseudo` VARCHAR(50) NULL DEFAULT NULL,
  `Mail` VARCHAR(100) NOT NULL,
  `Telephone` VARCHAR(20) NULL DEFAULT NULL,
  `PseudoDiscord` VARCHAR(50) NULL DEFAULT NULL,
  `Description` TEXT NULL DEFAULT NULL,
  `PhotoProfil` VARCHAR(100) NULL DEFAULT NULL,
  `VilleResidence` VARCHAR(50) NULL DEFAULT NULL,
  `MotDePasse` VARCHAR(100) NOT NULL,
  `Admin` TINYINT(1) NULL DEFAULT NULL,
  `MembreEquipe` TINYINT(1) NULL DEFAULT NULL,
  `MembreAssociation` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Mail` (`Mail` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `aabrasia`.`partie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aabrasia`.`partie` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Titre` VARCHAR(100) NOT NULL,
  `Date` DATE NOT NULL,
  `Heure` TIME NOT NULL,
  `Lieu` VARCHAR(100) NOT NULL,
  `MaitreDuJeu` INT NOT NULL,
  `Description` TEXT NOT NULL,
  `NombreJoueur` INT NOT NULL,
  `TypeDeJeux` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `MaitreDuJeu` (`MaitreDuJeu` ASC) VISIBLE,
  CONSTRAINT `partie_ibfk_1`
    FOREIGN KEY (`MaitreDuJeu`)
    REFERENCES `aabrasia`.`utilisateur` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `aabrasia`.`participation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `aabrasia`.`participation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Utilisateur_Id` INT NULL DEFAULT NULL,
  `Partie_Id` INT NULL DEFAULT NULL,
  `Partie_IdMaitreDuJeu` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `Utilisateur_Id` (`Utilisateur_Id` ASC) VISIBLE,
  INDEX `Partie_Id` (`Partie_Id` ASC) VISIBLE,
  CONSTRAINT `participation_ibfk_1`
    FOREIGN KEY (`Utilisateur_Id`)
    REFERENCES `aabrasia`.`utilisateur` (`id`),
  CONSTRAINT `participation_ibfk_2`
    FOREIGN KEY (`Partie_Id`)
    REFERENCES `aabrasia`.`partie` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
