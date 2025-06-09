-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: capstone
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `certification_career`
--

DROP TABLE IF EXISTS `certification_career`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certification_career` (
  `certificates_cert_id` int NOT NULL,
  `careers_career_id` int NOT NULL,
  PRIMARY KEY (`certificates_cert_id`,`careers_career_id`),
  KEY `fk_certificates_has_careers_careers1_idx` (`careers_career_id`),
  KEY `fk_certificates_has_careers_certificates1_idx` (`certificates_cert_id`),
  CONSTRAINT `fk_certificates_has_careers_careers1` FOREIGN KEY (`careers_career_id`) REFERENCES `careers` (`career_id`),
  CONSTRAINT `fk_certificates_has_careers_certificates1` FOREIGN KEY (`certificates_cert_id`) REFERENCES `certificates` (`cert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certification_career`
--

LOCK TABLES `certification_career` WRITE;
/*!40000 ALTER TABLE `certification_career` DISABLE KEYS */;
INSERT INTO `certification_career` VALUES (444,26),(457,26),(462,26),(157,44),(158,44),(159,44),(164,64),(400,64),(251,72),(252,72),(445,72),(453,72),(251,73),(252,73),(445,73),(453,73),(258,76),(261,76),(262,76),(265,77),(266,77),(267,77),(268,77),(269,77),(270,77),(463,77),(261,89),(268,89),(444,90),(457,90),(462,90),(467,90),(261,91),(268,91),(164,103),(400,103),(174,294),(467,294),(265,295),(266,295),(267,295),(274,295),(275,295),(461,295),(468,295),(440,299),(495,299),(265,300),(266,300),(267,300),(274,300),(275,300),(461,300),(468,300),(63,321),(244,321),(265,321),(266,321),(267,321),(274,321),(275,321),(468,321),(158,329),(160,329),(274,329),(275,329),(468,329),(274,375),(275,375),(440,375),(468,375),(495,375),(63,483),(265,483),(266,483),(267,483),(274,483),(275,483),(461,483),(468,483),(174,485),(177,485),(178,485),(274,485),(275,485),(468,485),(177,486),(178,486),(174,489),(467,489),(177,505),(178,505),(63,546),(265,546),(266,546),(267,546),(274,546),(275,546),(461,546),(468,546);
/*!40000 ALTER TABLE `certification_career` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08 20:32:52
