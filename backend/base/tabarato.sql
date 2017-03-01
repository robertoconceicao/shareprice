-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 01-Mar-2017 às 12:24
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

-- --------------------------------------------------------

--
-- Estrutura da tabela `loja`
--

CREATE TABLE IF NOT EXISTS `loja` (
  `cdloja` varchar(80) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `icon` text,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `vicinity` text,
  `dtcadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cdloja`),
  UNIQUE KEY `codigo` (`cdloja`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `loja`
--

INSERT INTO `loja` (`cdloja`, `nome`, `icon`, `lat`, `lng`, `vicinity`, `dtcadastro`) VALUES
('14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 'Mini Mercado Silva', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6037, -48.682583, 'Rua José Ângelo Kirchner, 35 - Sertão do Maruim, São José', '2017-02-11 20:11:54'),
('16c80f0e15096f64302ffde79c106556d95db102', 'Royer Supermercado', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5565982, -48.63865490000001, 'Rua Zigomar Georgina de Souza Silva, 292 - Areias, São José', '2017-02-11 20:11:54'),
('2c0bcab0b032587d3d0eb098261ead32a4874615', 'Bistek', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6062261, -48.62492880000001, 'State of Santa Catarina', '2017-02-11 20:11:54'),
('2fa24b046dd0e729f7dfcc3b991757ac9f31354f', 'Supermercados Imperatriz', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5946863, -48.6141827, 'Rua Delamar José da Silva, s/n - Kobrasol, São José', '2017-02-11 20:11:54'),
('3b6ea34712d3fef2c9d00d54342fa038604ab79d', 'Hippo', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6227852, -48.6774436, 'Rua da Universidade, 346 - Passeio Pedra Branca, Palhoça', '0000-00-00 00:00:00'),
('3dbb833fee92e844a500aee000d51dce97b5ef37', 'Paulisul Comércio de Frutas Ltda', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5807058, -48.61218889999999, 'Rua Francisco Pedro Machado, 186 - Barreiros, São José', '2017-02-11 20:11:54'),
('426b3fa719142b1330fa4032134112f6824282d2', 'Copal Supermercados', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.566701, -48.612002, 'Rua Leoberto Leal, 12812:00AM0 - Barreiros, São José', '2017-02-11 20:11:54'),
('49a93f472814a19d2afc01fbe734799b97c2202c', 'Fort Atacadista Loja 160', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5910759, -48.616578, 'Rua Cassol, São José', '2017-02-11 20:11:54'),
('5c2bfddff5fe626b306417e4bb94268b55a73422', 'Supermercados Imperatriz', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5620656, -48.619131, 'Rua Arnoldo Pedro Meira, 547 - Ipiranga, São José', '2017-02-11 20:11:54'),
('5cfb436db95e6bc5894145ce807be392c6163f5d', 'Bistek Supermercado', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6067413, -48.6248132, 'Rua Dr. Constâncio Krummel, 2183 - Praia Comprida, São José', '2017-02-11 20:11:54'),
('788ede152f6a7e510e4e39993ccd9f8c9fc64670', 'Giassi Supermercados - Barreiros - São José', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5535, -48.62248400000001, 'Rua Álvaro Medeiros Santiago, 301 - Areias, São José', '2017-02-11 20:11:54'),
('8c979dbbc0d8bf68f687d0ffffbc12fd5334c417', 'Mercado Fernandes', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5625248, -48.6332302, 'Rua Joana D''arc - Real Parque, São José', '2017-02-11 20:11:54'),
('8e1e97c96354bfe39bf0e0742734a0b4758078a9', 'Speciale Supermercados', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5988083, -48.6425367, 'Rua Vereador Arthur Manoel Mariano, 1175, São José', '2017-02-11 20:11:54'),
('9763886f9305eb9738001a67a8a718018b6388ef', 'Amora Veg', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.562811, -48.615699, 'Célio Veiga - Jardim Cidade de Florianopolis, São José', '2017-02-11 20:11:54'),
('a05d9788cf2817ef5b1514deab86877ec1eba39a', 'Supermercados Imperatriz-Geral', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5848403, -48.61345170000001, 'Rod br, 101', '2017-02-11 20:11:54'),
('b8d214bcd9c8c205b5f17adf7ec66ba210e37d9f', 'Taf distribuidora Reiter.', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6186186, -48.6489419, '316, Rua Vidal Procópio Lohn, 194 - Distrito Industrial, São José', '2017-02-11 20:11:54'),
('bc8305be9d390747940b65755f4cdef30d4a0794', 'Supermercados Rosa', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5760585, -48.6227221, 'Rua José Antônio Tomás, s/n - Bela Vista, São José', '2017-02-11 20:11:54'),
('c703fb5f1374405c6777e1b6b214bec390736353', 'Supermercados Xande', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5956175, -48.5510944, 'Rua Deodoro, 281 - Centro, Florianópolis', '0000-00-00 00:00:00'),
('ef3cb4a8d7598f41f7485a873886ad8a8636e9f0', 'Bistek Supermercado', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5757004, -48.6244824, 'Avenida Osvaldo José do Amaral, s/n - Bela Vista, São José', '2017-02-11 20:11:54'),
('f2ea26853397da38861da816d7ccf95765351021', 'Ezacol Alimentos', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.6069559, -48.6414098, 'Rua Petrônio Portela, 70, São José', '2017-02-11 20:11:54'),
('fa655f82f9f6903ad674d137de16be6131c36133', 'Superrosa', 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png', -27.5754385, -48.62272859999999, 'Rua José Antônio Tomás, 317 - Bela Vista, São José', '2017-02-11 20:11:54'),
('fedaaaf2b71268d8da084a24d09c462bd3246bb1', 'Fort Atacadista 06', 'https://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png', -27.5821336, -48.6144516, 'Rua Sebastião Furtado Pereira, s/n - Barreiros, São José', '2017-02-11 20:11:54');

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
  `preco` double(4,2) NOT NULL,
  `dtpublicacao` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `cdloja` varchar(80) NOT NULL,
  `cdmarca` int(11) NOT NULL,
  `cdtipo` int(11) NOT NULL,
  `cdmedida` int(11) NOT NULL,
  `cdusuario` varchar(100) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Extraindo dados da tabela `produto`
--

INSERT INTO `produto` (`codigo`, `preco`, `dtpublicacao`, `cdloja`, `cdmarca`, `cdtipo`, `cdmedida`, `cdusuario`) VALUES
(3, 10.50, '2017-01-06 19:10:26', 'c703fb5f1374405c6777e1b6b214bec390736353', 2, 1, 5, 'google-oauth2|115862700861296845675'),
(4, 6.55, '2017-01-06 23:55:38', 'c703fb5f1374405c6777e1b6b214bec390736353', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(5, 0.00, '2017-02-11 21:52:35', '1147d763f90c4c0db6ff2ddf4807aa049e09789a', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(6, 0.00, '2017-02-11 21:52:35', '1147d763f90c4c0db6ff2ddf4807aa049e09789a', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(7, 0.00, '2017-02-11 21:52:35', '1147d763f90c4c0db6ff2ddf4807aa049e09789a', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(8, 1.00, '2017-02-12 00:12:32', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(9, 1.95, '2017-02-12 16:49:32', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(10, 2.75, '2017-02-12 16:50:54', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(11, 5.60, '2017-02-14 15:54:06', '16c80f0e15096f64302ffde79c106556d95db102', 2, 1, 1, 'google-oauth2|115862700861296845675'),
(12, 0.99, '2017-02-14 14:04:56', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 2, 1, 5, 'google-oauth2|115862700861296845675'),
(13, 0.99, '2017-02-14 14:10:58', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 3, 'google-oauth2|115862700861296845675'),
(14, 3.50, '2017-02-14 14:25:52', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 5, 'google-oauth2|115862700861296845675'),
(15, 6.60, '2017-02-15 22:21:44', 'fa655f82f9f6903ad674d137de16be6131c36133', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(16, 2.50, '2017-02-17 15:01:26', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(17, 2.55, '2017-02-17 15:01:59', '14cc282e5dca6f017eb3c327451eaf72a9bb8b95', 1, 1, 1, 'google-oauth2|115862700861296845675'),
(18, 2.55, '2017-02-22 19:30:44', '3b6ea34712d3fef2c9d00d54342fa038604ab79d', 1, 1, 5, 'google-oauth2|115862700861296845675');

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

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `cdusuario` varchar(100) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `avatar` varchar(200) NOT NULL,
  PRIMARY KEY (`cdusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`cdusuario`, `nome`, `avatar`) VALUES
('facebook|395753717458940', 'Feito Toda da Silva', 'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12552646_161030307597950_6999094692632515479_n.jpg?oh=6f2b9636d60670e31481b6020c52d8c5&oe=5932AA68'),
('google-oauth2|115862700861296845675', 'Roberto da conceicao', 'https://lh5.googleusercontent.com/-NkphZfbAqNI/AAAAAAAAAAI/AAAAAAAAC2Y/2RbWqlwadFI/photo.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `validapreco`
--

CREATE TABLE IF NOT EXISTS `validapreco` (
  `cdproduto` int(11) NOT NULL,
  `cdusuario` varchar(200) NOT NULL,
  `flcerto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
