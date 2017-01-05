-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 05-Jan-2017 às 10:28
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
-- Estrutura da tabela `categoria`
--

CREATE TABLE IF NOT EXISTS `categoria` (
  `codigo` int(11) NOT NULL,
  `descricao` varchar(100) NOT NULL,
  `icon` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `categoria`
--

INSERT INTO `categoria` (`codigo`, `descricao`, `icon`) VALUES
(1, 'Bebida', 'http://www.redditstatic.com/icon.png'),
(2, 'Churrasco', 'http://www.redditstatic.com/icon.png'),
(3, 'Limpeza', 'http://www.redditstatic.com/icon.png'),
(4, 'Outros', 'http://www.redditstatic.com/icon.png');

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
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `loja`
--

INSERT INTO `loja` (`codigo`, `nome`, `icon`, `lat`, `lng`, `vicinity`) VALUES
('3b6ea34712d3fef2c9d00d54342fa038604ab79d', 'Hippo', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6227852, -48.6774436, 'Rua da Universidade, 346 - Passeio Pedra Branca, Palhoça'),
('c703fb5f1374405c6777e1b6b214bec390736353', 'Supermercados Xande', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5956175, -48.5510944, 'Rua Deodoro, 281 - Centro, Florianópolis');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto`
--

CREATE TABLE IF NOT EXISTS `produto` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `preco` decimal(10,0) NOT NULL,
  `dtpromocao` timestamp NULL DEFAULT NULL,
  `dtpublicacao` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `cdcategoria` int(11) NOT NULL,
  `cdunidademedida` int(11) NOT NULL,
  `cdloja` int(11) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `unidademedida`
--

CREATE TABLE IF NOT EXISTS `unidademedida` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(30) NOT NULL,
  `sigla` varchar(10) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Extraindo dados da tabela `unidademedida`
--

INSERT INTO `unidademedida` (`codigo`, `descricao`, `sigla`) VALUES
(1, 'Mililitro', 'ml'),
(2, 'Litro', 'l'),
(3, 'Quilograma', 'kg'),
(4, 'Metro', 'm');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
