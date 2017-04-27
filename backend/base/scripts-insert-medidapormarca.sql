-- Insere as medidas
INSERT INTO `medida` (`cdmedida`, `descricao`, `ml`) VALUES
(1, 'Litrão', 1000),
(2, 'Garrafa', 600),
(3, 'Latão', 473),
(4, 'Long Neck', 355),
(5, 'Lata', 350),
(6, 'Garrafinha', 300),
(7, 'Latinha', 269),
(8, 'Long Neck', 250),
(9, 'Barril', 5000),
(10, 'Latão', 500),
(11, 'Barril', 4000),
(12, 'Litrão', 990),
(13, 'Lata', 310),
(14, 'Long Neck', 343),
(15, 'Garrafa', 550),
(16, 'Long Neck', 275),
(17, 'Lata', 355);

-- Insere medida por marca
-- SKOL (1)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 1);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 1);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 1);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 1);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 1);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 1);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 1);

-- BRHAMA (2)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 2);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 2);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 2);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 2);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 2);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 2);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 2);

-- ITAIPAVA (3)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 8, 3);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 9, 3);

-- BOHEMIA (4)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 4);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 4);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 4);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 4);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 12, 4);

-- ANTARTICA (5)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 5);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 5);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 5);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 5);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 5);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 5);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 5);

-- HEINEKEN (6)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 6);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 6);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 6);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 6);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 8, 6);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 9, 6);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 10, 6);

-- NOVA SCHIN (7)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 7);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 7);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 7);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 7);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 7);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 7);

-- KAISER (8)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 8);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 8);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 8);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 8);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 8);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 8, 8);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 11, 8);

-- Stella Artois (9)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 9);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 9, 9);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 12, 9);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 13, 9);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 15, 9);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 16, 9);

-- Budweiser (10)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 10);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 10);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 10);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 10, 10);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 12, 10);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 14, 10);

-- Eisenbahn (11)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 11);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 11);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 11);

-- Saint Bier (12)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 12);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 12);

-- Amstel (13)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 13);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 13);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 13);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 13);

-- Corona (14)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 14);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 14);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 17, 14);

-- Sol (15)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 15);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 15);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 15);

-- Bavaria (16)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 16);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 16);
--INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 16);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 16);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 8, 16);

-- Devassa (17)
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 17);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 17);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 17);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 17);
--INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 17);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 17);

-- Crystal (18)
--INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 1, 18);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 2, 18);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 3, 18);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 4, 18);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 5, 18);
--INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 6, 18);
INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 7, 18);
--INSERT INTO medidapormarca(cdmedida, cdmarca) VALUES ( 8, 18);


select ma.descricao, m.descricao, m.ml
from medidapormarca mm
join medida m on m.cdmedida = mm.cdmedida
join marca ma on ma.cdmarca = mm.cdmarca
where mm.cdmarca = 1