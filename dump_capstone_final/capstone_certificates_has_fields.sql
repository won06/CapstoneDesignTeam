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
-- Table structure for table `certificates_has_fields`
--

DROP TABLE IF EXISTS `certificates_has_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates_has_fields` (
  `certificates_cert_id` int NOT NULL,
  `fields_field_id` varchar(10) NOT NULL,
  PRIMARY KEY (`certificates_cert_id`,`fields_field_id`),
  KEY `fk_certificates_has_fields_fields1_idx` (`fields_field_id`),
  KEY `fk_certificates_has_fields_certificates1_idx` (`certificates_cert_id`),
  CONSTRAINT `fk_certificates_has_fields_certificates1` FOREIGN KEY (`certificates_cert_id`) REFERENCES `certificates` (`cert_id`),
  CONSTRAINT `fk_certificates_has_fields_fields1` FOREIGN KEY (`fields_field_id`) REFERENCES `fields` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates_has_fields`
--

LOCK TABLES `certificates_has_fields` WRITE;
/*!40000 ALTER TABLE `certificates_has_fields` DISABLE KEYS */;
INSERT INTO `certificates_has_fields` VALUES (63,'22239'),(63,'22290'),(63,'58221'),(157,'2353'),(158,'2353'),(158,'5821'),(159,'2353'),(160,'5821'),(164,'23422'),(174,'223'),(174,'2232'),(177,'223'),(177,'22312'),(178,'223'),(178,'22312'),(244,'58221'),(251,'75109'),(251,'85429'),(252,'75109'),(252,'85429'),(258,'2341'),(261,'2212'),(261,'22501'),(261,'2341'),(262,'2341'),(265,'22239'),(265,'22290'),(265,'224'),(265,'2342'),(265,'58221'),(265,'63991'),(266,'22239'),(266,'22290'),(266,'224'),(266,'2342'),(266,'58221'),(266,'63991'),(267,'22239'),(267,'22290'),(267,'224'),(267,'2342'),(267,'58221'),(267,'63991'),(268,'2212'),(268,'22501'),(268,'2342'),(269,'2342'),(270,'2342'),(274,'22239'),(274,'22242'),(274,'22290'),(274,'223'),(274,'224'),(274,'5821'),(274,'58221'),(274,'63991'),(275,'22239'),(275,'22242'),(275,'22290'),(275,'223'),(275,'224'),(275,'5821'),(275,'58221'),(275,'63991'),(400,'23422'),(440,'22242'),(440,'28551'),(444,'76199'),(444,'77231'),(445,'75109'),(445,'85429'),(453,'75109'),(453,'85429'),(457,'76199'),(457,'77231'),(461,'22239'),(461,'22290'),(461,'224'),(461,'63991'),(462,'76199'),(462,'77231'),(463,'2342'),(467,'2232'),(467,'77231'),(468,'22239'),(468,'22242'),(468,'22290'),(468,'223'),(468,'224'),(468,'5821'),(468,'58221'),(468,'63991'),(495,'22242'),(495,'28551');
/*!40000 ALTER TABLE `certificates_has_fields` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-08 20:32:53
