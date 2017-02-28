-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 27-Fev-2017 às 20:48
-- Versão do servidor: 5.5.34
-- versão do PHP: 5.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de Dados: `tabarato`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `iconproduto`
--

CREATE TABLE IF NOT EXISTS `iconproduto` (
  `cdtipo` int(11) NOT NULL,
  `cdmarca` int(11) NOT NULL,
  `cdmedida` int(11) NOT NULL,
  `icon` varchar(250) NOT NULL,
  PRIMARY KEY (`cdtipo`,`cdmarca`,`cdmedida`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `iconproduto`
--

INSERT INTO `iconproduto` (`cdtipo`, `cdmarca`, `cdmedida`, `icon`) VALUES
(1, 1, 1, 'http://tabarato.ddns.net:9000/static/images/skol/skollitrao.png'),
(1, 1, 2, 'http://tabarato.ddns.net:9000/static/images/skol/skol-600.png'),
(1, 1, 3, 'http://tabarato.ddns.net:9000/static/images/skol/skol-latao.png'),
(1, 1, 4, 'http://tabarato.ddns.net:9000/static/images/skol/skol-long-neck.png'),
(1, 1, 5, 'http://tabarato.ddns.net:9000/static/images/skol/skol-lata.png'),
(1, 1, 6, 'http://tabarato.ddns.net:9000/static/images/skol/skol-garrafinha.png'),
(1, 2, 1, 'http://tabarato.ddns.net:9000/static/images/brahma/brahma-litrao.png'),
(1, 2, 2, 'http://tabarato.ddns.net:9000/static/images/brahma/brahma-600.jpg'),
(1, 2, 3, 'http://tabarato.ddns.net:9000/static/images/brahma/brahma-latao.png'),
(1, 2, 4, 'http://tabarato.ddns.net:9000/static/images/brahma/brahma-longneck.png'),
(1, 2, 5, 'http://tabarato.ddns.net:9000/static/images/brahma/brahma-lata.png'),
(1, 2, 6, 'http://tabarato.ddns.net:9000/static/images/brahma/brahma-garrafinha.png');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
