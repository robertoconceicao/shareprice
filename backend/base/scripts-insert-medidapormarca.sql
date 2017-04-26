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
(11, 'Barril', 4000);


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

---
|9|Stella Artois
|10|Budweiser
|11|Eisenbahn
|12|Saint Bier
|13|Amstel
|14|Corona
|15|Sol
|16|Bavaria
|17|Devasa
|18|Crystal

select ma.descricao, m.descricao, m.ml
from medidapormarca mm
join medida m on m.cdmedida = mm.cdmedida
join marca ma on ma.cdmarca = mm.cdmarca
where mm.cdmarca = 1

|1|Litrão|1000
|2|Garrafa|600
|3|Latão|473
|4|Long Neck|355
|5|Lata|350
|6|Garrafinha|300
|7|Latinha|269
|8|Long Neck|250
|9|Barril|5000
|10|Latão|500
|11|Barril|4000



