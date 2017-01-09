-- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
--
-- Host: localhost    Database: shareprice
-- ------------------------------------------------------
-- Server version	5.7.16-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `epadMedida`
--

DROP TABLE IF EXISTS `epadMedida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `epadMedida` (
  `cdMedida` int(11) NOT NULL AUTO_INCREMENT,
  `deMedida` varchar(50) DEFAULT NULL,
  `sgMedida` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`cdMedida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `epadMedida`
--

LOCK TABLES `epadMedida` WRITE;
/*!40000 ALTER TABLE `epadMedida` DISABLE KEYS */;
/*!40000 ALTER TABLE `epadMedida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprClasseproduto`
--

DROP TABLE IF EXISTS `esprClasseproduto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprClasseproduto` (
  `cdClasseproduto` int(11) NOT NULL AUTO_INCREMENT,
  `deClasseproduto` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cdClasseproduto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprClasseproduto`
--

LOCK TABLES `esprClasseproduto` WRITE;
/*!40000 ALTER TABLE `esprClasseproduto` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprClasseproduto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprEstabelecimento`
--

DROP TABLE IF EXISTS `esprEstabelecimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprEstabelecimento` (
  `cdEstabelecimento` int(11) NOT NULL,
  `nmEstabelecimento` varchar(100) DEFAULT NULL,
  `nuLatitude` decimal(10,8) DEFAULT NULL,
  `nuLongitude` decimal(10,8) DEFAULT NULL,
  `deLogo` text,
  `deVicinity` text,
  `dtCadastro` datetime DEFAULT NULL,
  PRIMARY KEY (`cdEstabelecimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprEstabelecimento`
--

LOCK TABLES `esprEstabelecimento` WRITE;
/*!40000 ALTER TABLE `esprEstabelecimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprEstabelecimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprIcone`
--

DROP TABLE IF EXISTS `esprIcone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprIcone` (
  `cdIcone` int(11) NOT NULL AUTO_INCREMENT,
  `cdTipoproduto` int(11) NOT NULL,
  `cdMarca` int(11) NOT NULL,
  `cdMedida` int(11) NOT NULL,
  `deIcone` text,
  PRIMARY KEY (`cdIcone`),
  KEY `fk_esprIcone_esprTipoproduto1_idx` (`cdTipoproduto`),
  KEY `fk_esprIcone_esprMarca1_idx` (`cdMarca`),
  KEY `fk_esprIcone_epadMedida1_idx` (`cdMedida`),
  CONSTRAINT `fk_esprIcone_epadMedida1` FOREIGN KEY (`cdMedida`) REFERENCES `epadMedida` (`cdMedida`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_esprIcone_esprMarca1` FOREIGN KEY (`cdMarca`) REFERENCES `esprMarca` (`cdMarca`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_esprIcone_esprTipoproduto1` FOREIGN KEY (`cdTipoproduto`) REFERENCES `esprTipoproduto` (`cdTipoproduto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprIcone`
--

LOCK TABLES `esprIcone` WRITE;
/*!40000 ALTER TABLE `esprIcone` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprIcone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprMarca`
--

DROP TABLE IF EXISTS `esprMarca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprMarca` (
  `cdMarca` int(11) NOT NULL AUTO_INCREMENT,
  `nmMarca` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`cdMarca`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprMarca`
--

LOCK TABLES `esprMarca` WRITE;
/*!40000 ALTER TABLE `esprMarca` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprMarca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprProdEstabelecimento`
--

DROP TABLE IF EXISTS `esprProdEstabelecimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprProdEstabelecimento` (
  `cdProdestabelecimento` int(11) NOT NULL,
  `cdEstabelecimento` int(11) NOT NULL,
  `cdProduto` int(11) NOT NULL,
  `dtPublicacao` datetime NOT NULL,
  `vlProduto` decimal(9,2) NOT NULL,
  PRIMARY KEY (`cdProdestabelecimento`),
  KEY `fk_esprProdEstabelecimento_esprEstabelecimento1_idx` (`cdEstabelecimento`),
  KEY `fk_esprProdEstabelecimento_esprProduto1_idx` (`cdProduto`),
  CONSTRAINT `fk_esprProdEstabelecimento_esprEstabelecimento1` FOREIGN KEY (`cdEstabelecimento`) REFERENCES `esprEstabelecimento` (`cdEstabelecimento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_esprProdEstabelecimento_esprProduto1` FOREIGN KEY (`cdProduto`) REFERENCES `esprProduto` (`cdProduto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprProdEstabelecimento`
--

LOCK TABLES `esprProdEstabelecimento` WRITE;
/*!40000 ALTER TABLE `esprProdEstabelecimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprProdEstabelecimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprProduto`
--

DROP TABLE IF EXISTS `esprProduto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprProduto` (
  `cdProduto` int(11) NOT NULL AUTO_INCREMENT,
  `cdTipoproduto` int(11) NOT NULL,
  `cdClasseproduto` int(11) NOT NULL,
  `cdMarca` int(11) NOT NULL,
  `cdMedida` int(11) NOT NULL,
  `vlMedida` decimal(9,2) DEFAULT NULL,
  PRIMARY KEY (`cdProduto`),
  KEY `fk_esprProduto_epadMedida1_idx` (`cdMedida`),
  KEY `fk_esprProduto_esprTipo1_idx` (`cdTipoproduto`),
  KEY `fk_esprProduto_esprMarca1_idx` (`cdMarca`),
  KEY `fk_esprProduto_esprClasseproduto1_idx` (`cdClasseproduto`),
  CONSTRAINT `fk_esprProduto_epadMedida1` FOREIGN KEY (`cdMedida`) REFERENCES `epadMedida` (`cdMedida`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_esprProduto_esprClasseproduto1` FOREIGN KEY (`cdClasseproduto`) REFERENCES `esprClasseproduto` (`cdClasseproduto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_esprProduto_esprMarca1` FOREIGN KEY (`cdMarca`) REFERENCES `esprMarca` (`cdMarca`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_esprProduto_esprTipo1` FOREIGN KEY (`cdTipoproduto`) REFERENCES `esprTipoproduto` (`cdTipoproduto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprProduto`
--

LOCK TABLES `esprProduto` WRITE;
/*!40000 ALTER TABLE `esprProduto` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprProduto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esprTipoproduto`
--

DROP TABLE IF EXISTS `esprTipoproduto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esprTipoproduto` (
  `cdTipoproduto` int(11) NOT NULL AUTO_INCREMENT,
  `deTipoproduto` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cdTipoproduto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esprTipoproduto`
--

LOCK TABLES `esprTipoproduto` WRITE;
/*!40000 ALTER TABLE `esprTipoproduto` DISABLE KEYS */;
/*!40000 ALTER TABLE `esprTipoproduto` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-09 15:50:09
