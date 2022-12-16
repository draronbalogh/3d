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
  `modelIframeUrl` varchar(1024) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelScript` text COLLATE utf8mb3_hungarian_ci,
  `modelUv` varchar(45) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelPolyCount` varchar(1024) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelMaterialUrl` varchar(45) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelRenderEngine` varchar(1024) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelDownloadedBy` varchar(1024) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelDownloadCount` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (19,'2022-12-15 11:42:09','2022-12-16 08:53:50','','','áron12','leír1','','Gép','nincs formátum','tagekkel','_osszes.png','','_ZIH0004.png,pastedImage.png','','ezek extra linkek','',1,0,1,'Magas','Ingyenes modell',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'2022-12-15 11:43:06','2022-12-15 11:43:06','','','dddd','','','','','','','','','','','',1,0,0,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'2022-12-15 11:43:56','2022-12-15 11:43:56','','','','','','','','','','','','','','',1,0,0,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,'2022-12-15 13:39:12','2022-12-15 13:39:12','','','fffffffffffffffffsgdf','gsfdgsdfgsdg','','Állat','','','','','','','','',1,0,1,'Közepes','Ingyenes modell',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'2022-12-16 08:53:59','2022-12-16 08:53:59','','','','','','','','','aaa.txt,avid.txt','','','','','',1,0,0,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
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

-- Dump completed on 2022-12-16 17:17:12
