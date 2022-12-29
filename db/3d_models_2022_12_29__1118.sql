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
  `modelRenderEngine` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelPolyCategory` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelPolyCount` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelFormat` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelTags` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelUrl` varchar(2083) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelFileName` varchar(2048) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `modelImgs` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `modelSourceUrl` varchar(2083) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelIframeUrl` varchar(2083) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelExtraLinks` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `modelMaterialUrl` varchar(2083) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelState` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelVisibility` tinyint(1) DEFAULT '1',
  `modelRigged` tinyint(1) DEFAULT '0',
  `modelAnimated` tinyint(1) DEFAULT '0',
  `modelUv` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelLegality` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT 'Jogtiszta',
  `modelScript` text CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci,
  `modelViewerUid` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelViewCount` int DEFAULT '0',
  `modelDownloaderUid` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelDownloadCount` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (63,'2022-12-29 09:40:07','2022-12-29 09:40:07',NULL,'admin','ddddddd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(64,'2022-12-29 09:40:18','2022-12-29 09:40:18',NULL,'admin','asdf','asdfasd','3','Állat','asdfasd','Közepes',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(65,'2022-12-29 09:40:32','2022-12-29 09:40:32',NULL,'admin','ddddddddd',NULL,NULL,NULL,NULL,NULL,'4000','fbx','dsaf, asdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(66,'2022-12-29 09:41:05','2022-12-29 09:41:05',NULL,'admin','dddddaaaaaa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo.txt',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(67,'2022-12-29 09:41:16','2022-12-29 09:41:16',NULL,'admin','fdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo2.docx',NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(68,'2022-12-29 09:42:26','2022-12-29 09:42:26',NULL,'admin','hhhhhh',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo2.docx',NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(69,'2022-12-29 09:42:40','2022-12-29 09:42:40',NULL,'admin','t',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo2.docx',NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(70,'2022-12-29 09:53:35','2022-12-29 09:53:35',NULL,'admin','mod',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo.txt',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(71,'2022-12-29 09:55:19','2022-12-29 09:55:19',NULL,'admin','ddddddd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo.txt','Modell forrása','Iframe url','Extra linkek',NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(72,'2022-12-29 09:55:51','2022-12-29 09:55:51',NULL,'admin','qq',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Nem elérhető',1,1,1,'uvvvv','Nem ismert forrás','sccc',NULL,0,NULL,0),(73,'2022-12-29 10:07:05','2022-12-29 10:07:05',NULL,'admin','sa','Leírás','2','Állat','ender engin','Közepes','ygon szám','Formátum','Tag-ek,Tag-ek2','todo.txt','ájl névájl név','todo2.docx','odell forrása','Iframe u','Extra linke',NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(74,'2022-12-29 10:07:53','2022-12-29 10:08:08',NULL,'admin','uj',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Nem elérhető',0,1,0,'uvvvvv','Ingyenes modell','iiiii',NULL,0,NULL,0),(75,'2022-12-29 10:09:26','2022-12-29 10:09:26',NULL,'admin','dddddd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo.txt',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(76,'2022-12-29 10:14:01','2022-12-29 10:14:01',NULL,'admin','ddddddd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'todo.txt',NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(77,'2022-12-29 10:15:37','2022-12-29 10:15:37',NULL,'admin','lknkek',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Modellurl.txt',NULL,'Képek.txt',NULL,NULL,NULL,'Materialurls.txt',NULL,0,0,1,NULL,'Jogtiszta',NULL,NULL,0,NULL,0),(78,'2022-12-29 10:16:40','2022-12-29 10:16:40',NULL,'admin','dupla',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Modellurl másolata.txt,Modellurl.txt',NULL,'Képek másolata.txt,Képek.txt',NULL,NULL,NULL,'Materialurls másolata.txt,Materialurls.txt',NULL,1,0,0,NULL,'Jogtiszta',NULL,NULL,0,NULL,0);
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

-- Dump completed on 2022-12-29 11:18:34
