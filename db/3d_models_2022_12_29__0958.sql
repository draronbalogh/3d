CREATE DATABASE  IF NOT EXISTS `3d` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `3d`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: 3d
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modelUuid` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelUploaderUid` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT 'admin',
  `modelTitle` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelDescription` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `modelChannel` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelCategory` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelFormat` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelTags` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelUrl` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelFileName` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelImgs` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `modelSourceUrl` text CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci,
  `modelExtraLinks` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `modelState` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelVisibility` tinyint(1) DEFAULT '1',
  `modelRigged` tinyint(1) DEFAULT '0',
  `modelAnimated` tinyint(1) DEFAULT '0',
  `modelPolyCategory` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelLegality` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT 'Jogtiszta',
  `modelIframeUrl` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelScript` text CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci,
  `modelUv` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelPolyCount` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelMaterialUrl` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelRenderEngine` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelViewerUid` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelViewCount` int DEFAULT '0',
  `modelDownloaderUid` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelDownloadCount` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (47,'2022-12-18 12:25:09','2022-12-18 12:25:09',NULL,'admin','dsfdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(48,'2022-12-18 12:26:09','2022-12-18 12:29:41',NULL,'admin','dsfsddsf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(49,'2022-12-18 12:30:41','2022-12-18 12:30:57',NULL,'admin','ggg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(50,'2022-12-18 12:32:05','2022-12-18 12:33:24',NULL,'admin','ds',NULL,'3','Állat',NULL,NULL,'73 Szja adóalap kedvezmények 20220203.pdf',NULL,'elado--1776-m2-teruletu-kivett-beepitetlen-terulet-megnevezesu-lakoovezeti-telek-279.pdf',NULL,NULL,NULL,1,1,1,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(51,'2022-12-18 12:33:34','2022-12-18 12:44:30',NULL,'admin','Cím','Leírás','3',NULL,NULL,NULL,'elado--1776-m2-teruletu-kivett-beepitetlen-terulet-megnevezesu-lakoovezeti-telek-279.pdf',NULL,NULL,NULL,NULL,NULL,1,0,1,'Magas','Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(52,'2022-12-26 15:13:50','2022-12-26 15:14:41',NULL,'admin','qqqqqqqqqqqqq','qqqqqqqqqqqqq','3','Gép',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,'Magas','Ingyenes modell',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(53,'2022-12-26 15:14:55','2022-12-26 15:15:18',NULL,'admin','zzzzzzzzzzzz',NULL,'2','Gép',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,1,'Közepes','Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(57,'2022-12-26 15:58:16','2022-12-26 15:58:16',NULL,'admin','jjjj',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(58,'2022-12-26 15:58:25','2022-12-26 15:59:05',NULL,'admin','kkkk',NULL,'3','Egyéb',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,'Magas','Nem ismert forrás',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(59,'2022-12-26 16:34:30','2022-12-26 16:34:30',NULL,'admin','fgsdg',NULL,'2','Gép',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,NULL,'Nem ismert forrás',NULL,NULL,NULL,NULL,NULL,'sfdg',NULL,0,NULL,0),(61,'2022-12-26 16:50:39','2022-12-26 16:50:39',NULL,'admin','sdasd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0),(62,'2022-12-26 17:05:05','2022-12-26 17:05:19',NULL,'admin','ppo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Nem elérhető',0,0,1,NULL,'Jogtiszta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0);
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-29  9:48:57
