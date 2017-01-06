-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 06-Jan-2017 às 12:30
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
(1, 2, 5, 'https://storage.googleapis.com/iconescerveja/brahma-lata.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `loja`
--

CREATE TABLE IF NOT EXISTS `loja` (
  `codigo` varchar(80) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `icon` text,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `vicinity` text,
  `dtcadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `loja`
--

INSERT INTO `loja` (`codigo`, `nome`, `icon`, `lat`, `lng`, `vicinity`, `dtcadastro`) VALUES
('3b6ea34712d3fef2c9d00d54342fa038604ab79d', 'Hippo', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6227852, -48.6774436, 'Rua da Universidade, 346 - Passeio Pedra Branca, Palhoça', '0000-00-00 00:00:00'),
('c703fb5f1374405c6777e1b6b214bec390736353', 'Supermercados Xande', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5956175, -48.5510944, 'Rua Deodoro, 281 - Centro, Florianópolis', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `marca`
--

CREATE TABLE IF NOT EXISTS `marca` (
  `cdmarca` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  PRIMARY KEY (`cdmarca`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Extraindo dados da tabela `marca`
--

INSERT INTO `marca` (`cdmarca`, `descricao`) VALUES
(1, 'Skol'),
(2, 'Brahma'),
(3, 'Itaipava'),
(4, 'Bohemia'),
(5, 'Antartica'),
(6, 'Heineken'),
(7, 'Nova Schin'),
(8, 'Kaiser'),
(9, 'Stella Artois'),
(10, 'Budweiser'),
(11, 'Eisenbahn'),
(12, 'Saint Bier'),
(13, 'Amstel'),
(14, 'Corona'),
(15, 'Sol'),
(16, 'Bavaria'),
(17, 'Devasa'),
(18, 'Crystal');

-- --------------------------------------------------------

--
-- Estrutura da tabela `medida`
--

CREATE TABLE IF NOT EXISTS `medida` (
  `cdmedida` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(20) NOT NULL,
  `ml` int(11) NOT NULL,
  PRIMARY KEY (`cdmedida`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `medida`
--

INSERT INTO `medida` (`cdmedida`, `descricao`, `ml`) VALUES
(1, 'Litrão', 1000),
(2, 'Garrafa', 600),
(3, 'Latão', 550),
(4, 'Long Neck', 355),
(5, 'Lata', 350),
(6, 'Garrafinha', 300);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto`
--

CREATE TABLE IF NOT EXISTS `produto` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `preco` decimal(10,0) NOT NULL,
  `dtpublicacao` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `cdloja` varchar(80) NOT NULL,
  `cdmarca` int(11) NOT NULL,
  `cdtipo` int(11) NOT NULL,
  `cdmedida` int(11) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tipo`
--

CREATE TABLE IF NOT EXISTS `tipo` (
  `cdtipo` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(30) NOT NULL,
  PRIMARY KEY (`cdtipo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `tipo`
--

INSERT INTO `tipo` (`cdtipo`, `descricao`) VALUES
(1, 'Pilsen'),
(2, 'Weiss'),
(3, 'Pale Ale'),
(4, 'Bock'),
(5, 'Fruit Lambic'),
(6, 'Dry Stout');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
