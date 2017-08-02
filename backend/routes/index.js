// INICIANDO ==============================================
// Define as bibliotecas que iremos utilizar
var express = require('express');
var logger  = require('morgan');
var mysql   = require('mysql');
var https   = require("https");
var router  = express.Router();

//https://developers.google.com/mobile/add?platform=android&cntapi=signin
var gcm = require('node-gcm');
var gcmApiKey = 'AIzaSyAFoZL_ofOX3kT5W_k77gyT99QCz5_XbqA';//'AIzaSyANN9rbE4VXHxIhS0_T5vnN2puc2tG0WLg'; // GCM API KEY OF YOUR GOOGLE CONSOLE PROJECT


var FCM = require('fcm-push');
var serverKey = 'AAAAaL9bLyE:APA91bFzJykIhJrU-t6VXtVqKgf-UnKGO7wka4HmG04aiKtQ-86rbJvban5MXZ7KgwkO_9CkZnuAMhhahrA6_ZD2VAz0o3ylrL6HMZOcwCLB1V2PAeAB_QUseeZRnK0Sg70YRxc030IB';
var fcm = new FCM(serverKey);

// TESTES LOCAIS
var pool  = mysql.createPool({  
    connectionLimit : 100,    
    host     : 'geladas.coqto56dhhuy.us-west-2.rds.amazonaws.com',
    port     : 3306, 
    user     : 'conceicaoroberto',
    password : 'security',
    database : 'geladas',
    multipleStatements: true
 });
 
const API_GOOGLE_PLACE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const API_KEY='key=AIzaSyDUAHiT2ptjlIRhAaVCY0J-qyNguPeCPfc';
const TYPES='types=grocery_or_supermarket'; //https://developers.google.com/places/supported_types?hl=pt-br
const RADIUS='radius=10000'; // 10km
const LIMIT_RESULTADO = 30;

const PROJECAO_PRODUTO = `
    SELECT p.* , m.descricao AS marca, 
        l.nome AS loja, l.vicinity as vicinity, l.lat as lat, l.lng as lng,
        t.descricao AS tipo, 
        md.descricao AS medida, md.ml as ml,
        u.nome as nomeusuario, u.avatar as avatar
        FROM produto p
        JOIN loja l ON l.cdloja = p.cdloja
        JOIN marca m ON m.cdmarca = p.cdmarca
        JOIN tipo t ON t.cdtipo = p.cdtipo
        JOIN medida md ON md.cdmedida = p.cdmedida
        LEFT JOIN usuario u on u.cdusuario = p.cdusuario
`;

router.get('/medidapormarca', getMedidapormarca);
router.get('/confignotificacao', confignotificacao);
router.get('/municipios', getMunicipios);
router.get('/municipio/:lat/:lng', getMunicipioByLatLng);
router.get('/municipio/:cdusuario', getMunicipioByUsuario);

router.post('/indiquemarca', indiqueMarca);
router.post('/localusuario', insereLocalusuario);



function insereLocalusuario(req, res) {
     pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            connection.query(`delete from localusuario where cdusuario = ? `,[req.body.cdusuario],function(err, result2){
                if(err) {
                    console.log("Erro ao tentar deletar localusuario");
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                connection.query('INSERT INTO localusuario(cdusuario, cdIbge ) values(?, ?) ', [req.body.cdusuario, req.body.cdIbge], function(err,result4){
                        if(err) {
                            console.log("Erro ao tentar inserir localusuario");                        
                            return connection.rollback(function() {
                                throw error;
                            });                        
                        }                        
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            console.log('success!');
                            return res.status(200).json();
                        });
                    });
                });
        });                 
        connection.release();
        return res.status(200).json();
    });
}

// Pega o municipio pela lat e lng
function getMunicipioByLatLng(req, res) {
    //busca as lojas da base ordenadas por loja mais próximas do usuario e envia a resposta pra ele
    pool.getConnection(function(err, connection) {        
        connection.query(`SELECT *, (6371 * 
                acos(
                    cos(radians( ? )) *
                    cos(radians(lat)) *
                    cos(radians( ? ) - radians(lng)) +
                    sin(radians( ? )) *
                    sin(radians(lat))
                )) AS distance
                FROM municipio HAVING distance < 20.0 
                ORDER BY distance ASC 
                `,[req.params.lat, req.params.lng, req.params.lat],function(err,result){

                if(result.length > 0) {
                    return res.json(result[0]);
                }
                return res.status(400).json(err);                  
        });
        connection.release();
    });
}

function getMunicipioByUsuario(req, res) {
    //busca as lojas da base ordenadas por loja mais próximas do usuario e envia a resposta pra ele
    pool.getConnection(function(err, connection) {        
        connection.query(`SELECT m.* FROM municipio m
                        join localusuario lu on lu.cdibge = m.cdibge
                        where
                        lu.cdusuario = ? 
                `,[req.params.cdusuario],function(err,result){

                if(result.length > 0) {
                    return res.json(result[0]);
                }
                return res.status(400).json(err);                  
        });
        connection.release();
    });
}

// Municipios ============================================
function getMunicipios(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM municipio order by municipio',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);            
        });
        connection.release();
    });
}

function indiqueMarca(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO indiquemarca SET ? ', req.body,
            function(err,result){
                if(err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(result);            
            });
        connection.release();       
    });    
}

function getMedidapormarca(req, res){    
    pool.getConnection(function(err, connection) {
        connection.query(`
            select mpm.cdmedida as cdmedida, mpm.cdmarca as cdmarca 
            from medidapormarca mpm
            join medida m on m.cdmedida = mpm.cdmedida
            order by mpm.cdmarca asc, m.ml asc`, [], function(err, result){            
            var cdmarca = -1;
            var medidas = new Array();
            var objJson = new Array();
            
            for(let i = 0; i < result.length; i++) {
                if(cdmarca == -1){
                    cdmarca = result[i].cdmarca;
                }

                if(cdmarca == result[i].cdmarca){                
                    medidas.push(result[i].cdmedida);
                } else {
                    objJson.push({
                            cdmarca: cdmarca,
                            medidas: medidas
                        });

                    cdmarca = result[i].cdmarca;
                    medidas = new Array();
                    medidas.push(result[i].cdmedida);
                }
            }
            objJson.push({
                        cdmarca: cdmarca,
                        medidas: medidas
                    });

            return res.status(200).json(objJson);
        });
        connection.release();
    });
}

function confignotificacao(req, res){
    var cdusuario = req.query.cdusuario;
    
    pool.getConnection(function(err, connection){
        connection.query('select cdconfignotificacao, raio, flnotificar, flemail from confignotificacao where cdusuario = ? ', [cdusuario], function(err, result){
           if(result.length > 0){
                var cdconfignotificacao = result[0].cdconfignotificacao;
                var raio = result[0].raio;
                var flnotificar = result[0].flnotificar;
                var flemail = result[0].flemail;
                retornaConfigMarcas(cdconfignotificacao, cdusuario, raio, flnotificar, flemail, res);                
            } else {
                insereConfignotificacao(cdusuario, res);                
            }
        });
        connection.release();
    });
}

function insereConfignotificacao(cdusuario, res){
    var cdconfignotificacao = 0;
    var raio = 10;
    var flnotificar = 1;
    var flemail = 1;

    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO confignotificacao(cdusuario, raio, flnotificar, flemail) values(?, ?, ?, ?) ', [cdusuario, raio, flnotificar, flemail], function(err,result){
            if(err) {
                console.log("Erro ao tentar inserir confignotificacao");                        
                return connection.rollback(function() {
                    throw error;
                });                        
            }
            
            cdconfignotificacao = result.insertId;
            
            connection.query(`INSERT INTO configmarca(cdmarca, cdconfignotificacao ) 
                                        SELECT cdmarca, `+cdconfignotificacao+`
                                        FROM marca `, [], function(err2,result2){
                if(err2) {
                    console.log("Erro ao tentar inserir configmarca");
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                                
                retornaConfigMarcas(cdconfignotificacao, cdusuario, raio, flnotificar, flemail, res);
            });
        });
       connection.release();
    });
}

/*
    Retorna as configurações de marcas do usuario da tela de notificações
*/
function retornaConfigMarcas(cdconfignotificacao, cdusuario, raio, flnotificar, flemail, res){    
    pool.getConnection(function(err, connection) {
        connection.query('select cdmarca from configmarca where cdconfignotificacao = ? ', [cdconfignotificacao], function(err, marcas){
            var obj = [{
                'cdconfignotificacao': cdconfignotificacao,
                'cdusuario': cdusuario,
                'raio': raio,
                'flnotificar': flnotificar,
                'flemail': flemail,
                'marcas': marcas
            }];

            return res.status(200).json(obj);
        });
       connection.release();
    });
}

// Configuracao Notificacao =============================
router.post('/confignotificacao', function(req, res) {
    let marcas = req.body.marcas;
    let raio = req.body.raio;
    let cdusuario = req.body.cdusuario;
    let flnotificar = req.body.flnotificar;
    let flemail;
    try {
        flemail = req.body.flemail;
    } catch (error) {
        flemail = 1;
        console.log("Erro nao veio no comando o flemail, default para 1");        
    }

    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }

            var cdconfignotificacao = 0;
            connection.query(`
            select cdconfignotificacao from confignotificacao    
            WHERE 
            cdusuario = ?
            `,[cdusuario],function(err,result){
                    if(err) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                
                    if(result.length > 0) {
                        console.log("Existe configuracao para esse usuario, detele td e insere tudo novamente");
                        connection.query(`delete from configmarca
                                            where cdconfignotificacao in 
                                            (select cdconfignotificacao from confignotificacao where cdusuario = ? )`,[cdusuario],function(err, result2){
                            if(err) {
                                console.log("Erro ao tentar deletar configmarca");
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            connection.query(`delete from confignotificacao where cdusuario = ?`,[cdusuario],function(err, result3){
                                if(err) {
                                    console.log("Erro ao tentar deletar confignotificacao");
                                    return connection.rollback(function() {
                                        throw error;
                                    });
                                }

                                connection.query('INSERT INTO confignotificacao(cdusuario, raio, flnotificar, flemail) values(?, ?, ?, ?) ', [cdusuario, raio, flnotificar, flemail], function(err,result4){
                                    if(err) {
                                        console.log("Erro ao tentar inserir confignotificacao");                        
                                        return connection.rollback(function() {
                                            throw error;
                                        });                        
                                    }
                                    cdconfignotificacao = result4.insertId;

                                    marcas.forEach(function(element){
                                        connection.query('INSERT INTO configmarca(cdmarca, cdconfignotificacao) values(?, ?) ', [element, cdconfignotificacao], function(err,result5){
                                            if(err) {
                                                console.log("Erro ao tentar inserir configmarca");
                                                return connection.rollback(function() {
                                                    throw error;
                                                });                        
                                            }
                                        });
                                    }, this);                         
                                                                
                                    connection.commit(function(err) {
                                        if (err) {
                                            return connection.rollback(function() {
                                                throw err;
                                            });
                                        }
                                        console.log('success!');
                                        return res.status(200).json();
                                    });
                                });
                            });
                        });                 
                    } else {
                        insereConfignotificacao(cdusuario, res);
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            console.log('success!');
                            return res.status(200).json();
                        });                       
                    }
                });
            });
        connection.release();
        return res.status(200).json();
    });
});


function buscaUsuariosParaPushNotificacion(cdusuario, cdproduto){
    pool.getConnection(function(err, connection){
        connection.query(
            `   SELECT u.devicetoken 
                FROM usuario u
                where exists (SELECT 1 from confignotificacao cn                      
                                JOIN configmarca ma ON ma.cdconfignotificacao = cn.cdconfignotificacao              
                                join produto p on p.cdmarca = ma.cdmarca
                                join loja l on  p.cdloja = l.cdloja
                                where p.codigo = ?
                                and u.cdusuario <> ?
                                and cn.cdusuario = u.cdusuario                                              
                                and  (6371 * acos(
                                            cos(radians(u.lat)) *
                                            cos(radians(l.lat)) *
                                            cos(radians(u.lng) - radians(l.lng)) +
                                            sin(radians(u.lat)) *
                                            sin(radians(l.lat))
                                        )) <= cn.raio
                        )
            `,[cdproduto, cdusuario], function(err, result){
                return result;
            });
        connection.release();
    });
}

//  PRODUTOS ============================================
router.get('/produto/:codigo', function(req, res) {	    
    pool.getConnection(function(err, connection) {
        connection.query(
            PROJECAO_PRODUTO +
            `     
             WHERE p.codigo = ?        
        `,[req.params.codigo],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    }); 
});

router.put('/produto/:codigo', function(req, res) {
    var produtoData = req.body;
    var codigo = req.params.codigo;

    pool.getConnection(function(err, connection) {        
        connection.query('UPDATE produto SET ? WHERE codigo = ? ', [produtoData, codigo],
            function(err,result){
                if(err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(result);            
            });
        connection.release();       
    });    
});

router.get('/produtos', function(req, res) {
    var filtros = getFiltrosUrl(req);
    pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT p.* , m.descricao AS marca, 
            l.nome AS loja, l.vicinity as vicinity, l.lat as lat, l.lng as lng,
            t.descricao AS tipo, md.descricao AS medida, 
            md.ml as ml,
            u.nome as nomeusuario, u.avatar as avatar
            FROM produto p
            JOIN 
				(SELECT *, (6371 * acos(
                                cos(radians(?)) *
                                cos(radians(lat)) *
                                cos(radians(?) - radians(lng)) +
                                sin(radians(?)) *
                                sin(radians(lat))
                            )) AS distance
                 FROM loja                  
                 HAVING distance <= ?                 
                 ) as l ON l.cdloja = p.cdloja
            JOIN marca m ON m.cdmarca = p.cdmarca
            JOIN tipo t ON t.cdtipo = p.cdtipo
            JOIN medida md ON md.cdmedida = p.cdmedida
            LEFT JOIN usuario u on u.cdusuario = p.cdusuario
        WHERE p.preco > 0 ` + filtros + `
        order by DATE(p.dtpublicacao) desc, p.preco asc
        LIMIT 0 , ?
        `,[req.query.lat, req.query.lng, req.query.lat, req.query.distancia, LIMIT_RESULTADO],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    }); 
});

router.get('/filter', function(req, res) {
    var filtros = getFiltrosUrl(req);
    pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT p.* , m.descricao AS marca, 
                l.nome AS loja, l.vicinity as vicinity, l.lat as lat, l.lng as lng,
                t.descricao AS tipo, md.descricao AS medida, 
                md.ml as ml,
                u.nome as nomeusuario, u.avatar as avatar
                FROM produto p
                JOIN 
                    (SELECT *, (6371 * acos(
                                    cos(radians(?)) *
                                    cos(radians(lat)) *
                                    cos(radians(?) - radians(lng)) +
                                    sin(radians(?)) *
                                    sin(radians(lat))
                                )) AS distance
                    FROM loja                  
                    HAVING distance <= ?                 
                    ) as l ON l.cdloja = p.cdloja
                JOIN marca m ON m.cdmarca = p.cdmarca
                JOIN tipo t ON t.cdtipo = p.cdtipo
                JOIN medida md ON md.cdmedida = p.cdmedida
                LEFT JOIN usuario u on u.cdusuario = p.cdusuario
        WHERE p.preco > 0 ` + filtros + `
        order by DATE(p.dtpublicacao) desc, p.preco asc
        LIMIT 0 , ?
        `,[req.query.lat, req.query.lng, req.query.lat, req.query.distancia, LIMIT_RESULTADO],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    }); 
});

router.get('/before_produtos', function(req, res) {
   var filtros = getFiltrosUrl(req);
   pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT p.* , m.descricao AS marca, 
                l.nome AS loja, l.vicinity as vicinity, l.lat as lat, l.lng as lng,
                t.descricao AS tipo, md.descricao AS medida, 
                md.ml as ml,
                u.nome as nomeusuario, u.avatar as avatar
                FROM produto p
                JOIN 
                    (SELECT *, (6371 * acos(
                                    cos(radians(?)) *
                                    cos(radians(lat)) *
                                    cos(radians(?) - radians(lng)) +
                                    sin(radians(?)) *
                                    sin(radians(lat))
                                )) AS distance
                    FROM loja                  
                    HAVING distance <= ?                 
                    ) as l ON l.cdloja = p.cdloja
                JOIN marca m ON m.cdmarca = p.cdmarca
                JOIN tipo t ON t.cdtipo = p.cdtipo
                JOIN medida md ON md.cdmedida = p.cdmedida
                LEFT JOIN usuario u on u.cdusuario = p.cdusuario
        WHERE p.preco > 0 ` + filtros + `
        order by DATE(p.dtpublicacao) desc, p.preco asc
        LIMIT 0 , ?
        `,[req.query.lat, req.query.lng, req.query.lat, req.query.distancia, LIMIT_RESULTADO], function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    }); 
});

router.get('/after_produtos', function(req, res) {
    var posicao = Number.parseInt(req.query.posicao);
    var filtros = getFiltrosUrl(req);
    pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT p.* , m.descricao AS marca, 
                l.nome AS loja, l.vicinity as vicinity, l.lat as lat, l.lng as lng, 
                t.descricao AS tipo, md.descricao AS medida, 
                md.ml as ml,
                u.nome as nomeusuario, u.avatar as avatar
                FROM produto p
                JOIN 
                    (SELECT *, (6371 * acos(
                                    cos(radians(?)) *
                                    cos(radians(lat)) *
                                    cos(radians(?) - radians(lng)) +
                                    sin(radians(?)) *
                                    sin(radians(lat))
                                )) AS distance
                    FROM loja                  
                    HAVING distance <= ?                 
                    ) as l ON l.cdloja = p.cdloja
                JOIN marca m ON m.cdmarca = p.cdmarca
                JOIN tipo t ON t.cdtipo = p.cdtipo
                JOIN medida md ON md.cdmedida = p.cdmedida
                LEFT JOIN usuario u on u.cdusuario = p.cdusuario
        WHERE p.preco > 0 ` + filtros + `
        order by DATE(p.dtpublicacao) desc, p.preco asc
        LIMIT ? , ?
        `,[req.query.lat, req.query.lng, req.query.lat, req.query.distancia, posicao, LIMIT_RESULTADO], function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);
        });
        connection.release();
    }); 
});
/**
 * pega os filtros enviados via GET na url e converte em filtros SQL
 */
function getFiltrosUrl(req){
    var filtros = "";
    if(!!req.query.marca){
        filtros += " AND p.cdmarca="+req.query.marca;
    }
    if(!!req.query.medida){
        filtros += " AND p.cdmedida="+req.query.medida;
    }
    if(!!req.query.tipo){
        filtros += " AND p.cdtipo="+req.query.tipo;
    }
    if(!!req.query.maxvalor){
        filtros += " AND p.preco <= '"+req.query.maxvalor+"'";
    }
    if(!!req.query.searchTerm){        
        filtros += " AND CONCAT_WS( ' ', l.nome, m.descricao, md.descricao, md.ml) like '%"+req.query.searchTerm+"%'";        
    }    
    console.log("filtros SQL: "+filtros);
    return filtros;
}

/* NOVO PRODUTO =============================================
    cdusuario: this._cdusuario.value,
    cdtipo: produto.tipo.cdtipo,
    cdmarca: produto.marca.cdmarca,
    cdloja: produto.loja.cdloja,
    cdmedida: produto.medida.cdmedida,
    preco: produto.preco,
    dtpublicacao: produto.dtpublicacao
*/
router.post('/produto', function(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    var cdproduto = 0;
    var cdusuario = req.body.cdusuario;
    
    pool.getConnection(function(err, connection) {        
        connection.query('INSERT INTO produto SET ? ', req.body,
            function(err,result){
                if(err) {
                    return res.status(400).json(err);
                }

                cdproduto = result.insertId;
                
                connection.query(
                    `   SELECT u.devicetoken as devicetoken
                        FROM usuario u
                        where exists (SELECT 1 from confignotificacao cn                      
                                        JOIN configmarca ma ON ma.cdconfignotificacao = cn.cdconfignotificacao              
                                        join produto p on p.cdmarca = ma.cdmarca
                                        join loja l on  p.cdloja = l.cdloja
                                        where p.codigo = ?                                        
                                        and cn.flnotificar = 1
                                        and cn.cdusuario = u.cdusuario                                              
                                        and cn.cdusuario <> p.cdusuario
                                        and  (6371 * acos(
                                                    cos(radians(u.lat)) *
                                                    cos(radians(l.lat)) *
                                                    cos(radians(u.lng) - radians(l.lng)) +
                                                    sin(radians(u.lat)) *
                                                    sin(radians(l.lat))
                                                )) <= cn.raio
                                )
                    `,[cdproduto], function(err, resultUsuarios){

                        connection.query(`
                            SELECT p.codigo, p.preco, m.descricao AS marca, l.nome AS loja, md.descricao AS medida, md.ml as ml
                                FROM produto p
                                JOIN loja l ON l.cdloja = p.cdloja
                                JOIN marca m ON m.cdmarca = p.cdmarca                                
                                JOIN medida md ON md.cdmedida = p.cdmedida                                
                                where p.codigo = ?
                        `, [cdproduto], function(err, resultProduto){
                            var produto = {
                                codigo: resultProduto[0].codigo,
                                marca: resultProduto[0].marca,
                                loja: resultProduto[0].loja,
                                medida: resultProduto[0].medida,
                                preco: resultProduto[0].preco,
                                cdtipo: req.body.cdtipo,
                                cdmarca: req.body.cdmarca,
                                cdmedida: req.body.cdmedida
                            };
                            //Notifica todos os usuarios que estao próximos, e que estejam configurados
                            pushNotification(produto, resultUsuarios);
                        });
                    });
                return res.status(200).json(result);            
            });
        connection.release();       
    });    
});

/*apenas para testes depois remover esse codigo
*/
router.get('/push', function (req, res) {
    var produto = {"codigo":125,"preco":2.08,"dtpublicacao":"2017-04-29T03:02:52.000Z","cdloja":"ef3cb4a8d7598f41f7485a873886ad8a8636e9f0","cdmarca":1,"cdtipo":1,"cdmedida":7,"cdusuario":"115862700861296845675","marca":"Skol","loja":"Bistek Supermercado","vicinity":"Avenida Osvaldo José do Amaral, s/n - Bela Vista, São José","lat":-27.5757004,"lng":-48.6244824,"tipo":"Pilsen","medida":"Latinha","ml":269,"nomeusuario":"Roberto da conceicao","avatar":"https://lh5.googleusercontent.com/-NkphZfbAqNI/AAAAAAAAAAI/AAAAAAAAC2Y/2RbWqlwadFI/s96-c/photo.jpg"};
    pushNotification(produto, null);
    res.status(200).send('Pushed notification ');
    /*
    var device_tokens = []; //create array for storing device tokens     
    device_tokens.push('e3dJhjDsKQ4:APA91bETVTm1HVDeqzsidcIeXlK-jPt8hirFTMA73elUqbLdti-uTsmBX7x_HiFV1Tj-02q7Cv2JlI83viQOksY6CEPLFRk9kU9STSZfOC2lfqUcMy1ml27hBYq28-v6g_sX_8uysf3q');
    
    var message = {  
        to : 'e3dJhjDsKQ4:APA91bETVTm1HVDeqzsidcIeXlK-jPt8hirFTMA73elUqbLdti-uTsmBX7x_HiFV1Tj-02q7Cv2JlI83viQOksY6CEPLFRk9kU9STSZfOC2lfqUcMy1ml27hBYq28-v6g_sX_8uysf3q',
        collapse_key : 'Teste de Push',
        data : {
         'title': 'Titulo da cerveja...',
         'message': 'Mensagem de teste de notificacao',
         'sound': 'default',
         'icon': 'assets/images/111.png'
        },
        notification : {
            title : 'Teste de notificação',
            body : 'Body of the notification'
        }
    };

    fcm.send(message, function(err,response){  
        if(err) {
            console.log("Something has gone wrong !", err);
        } else {
            console.log("Successfully sent with resposne :",response);
            res.status(200).send('Pushed notification ' + device_tokens);
        }
    });
    */
});
/*
var produto = {
    codigo: resultProduto[0].codigo,
    marca: resultProduto[0].marca,
    loja: resultProduto[0].loja,
    medida: resultProduto[0].medida,
    preco: resultProduto[0].ml
};
*/
function pushNotification(produto, device_tokens){
    //var imgSrc = "assets/images/"+produto.cdtipo+""+produto.cdmarca+""+produto.cdmedida+".png";
    var data   = {
        'title': 'Cerveja '+produto.marca+' '+produto.medida+' R$ '+produto.preco,
        'message': "Promoção de cerveja no estabelecimento "+produto.loja,
        'sound': 'default',
        'codigo': produto.codigo,
        'icon': produto.cdtipo+""+produto.cdmarca+""+produto.cdmedida+".png"
    };
    
    if(device_tokens.length <= 0 ){
        console.log("Nao encontrou ninguem para notificar");
        return;
    }

    //converter a lista de result que veio do banco para uma lista de string device-token
    var listaDeviceToken = new Array();    
    for(var i = 0; i < device_tokens.length; i++){
        listaDeviceToken.push(device_tokens[i].devicetoken);
    }

    //guarda em cada possicao uma lista de devices de no máximo 1000(valor maximo da API de push notification) elementos
    var arrayDevices = new Array(); 
    if(listaDeviceToken.length > 1000){        
        while(listaDeviceToken.length > 1000){
            //remove da posicao 0, 1000 elementos e add esses 1000 na lista de push
            arrayDevices.push(listaDeviceToken.splice(0, 1000));
        }
        arrayDevices.push(listaDeviceToken.splice(0, listaDeviceToken.length - 1));
    } else {
        arrayDevices.push(listaDeviceToken);
    }

    var message = {  
        registration_ids : [],
        data,
        notification : {
            data
        }
    };

    for(var i = 0; i < arrayDevices.length; i++){
        console.log("Enviando push: ", arrayDevices[i]);
        message.registration_ids = arrayDevices[i];
        fcm.send(message, function(err,response){
            if(err) {
                console.log("Something has gone wrong !", err);
            } else {
                console.log("Successfully sent with resposne :",response);
            }
        });
    }
}

function pushNotificationOLD(produto, device_tokens){
    //var device_tokens = []; //create array for storing device tokens
    
    var retry_times = 4; //the number of times to retry sending the message if it fails
    var sender = new gcm.Sender(gcmApiKey); //create a new sender
    var message = new gcm.Message(); //create a new message    
    message.addData('title', 'Cerveja '+produto.marca+' '+produto.medida+' R$ '+produto.preco);
    message.addData('message', "Promoção de cerveja no estabelecimento "+produto.loja+" <ion-thumbnail><img [src]='assets/images/"+produto.cdtipo+""+produto.cdmarca+""+produto.cdmedida+".png'></ion-thumbnail>");
    message.addData('sound', 'default');
    message.addData('codigo', produto.codigo);
    message.addData('icon', produto.cdtipo+""+produto.cdmarca+""+produto.cdmedida+".png");
    message.collapseKey = 'Testing Push'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //number of seconds to keep the message on 
    
    if(device_tokens.length <= 0 ){
        console.log("Nao encontrou ninguem para notificar");
        return;
    }

    //converter a lista de result que veio do banco para uma lista de string device-token
    var listaDeviceToken = new Array();    
    for(var i = 0; i < device_tokens.length; i++){
        listaDeviceToken.push(device_tokens[i].devicetoken);
    }

    //guarda em cada possicao uma lista de devices de no máximo 1000(valor maximo da API de push notification) elementos
    var arrayDevices = new Array(); 
    if(listaDeviceToken.length > 1000){        
        while(listaDeviceToken.length > 1000){
            //remove da posicao 0, 1000 elementos e add esses 1000 na lista de push
            arrayDevices.push(listaDeviceToken.splice(0, 1000));
        }
        arrayDevices.push(listaDeviceToken.splice(0, listaDeviceToken.length - 1));
    } else {
        arrayDevices.push(listaDeviceToken);
    }


    for(var i = 0; i < arrayDevices.length; i++){
        sender.send(message, arrayDevices[i], retry_times, function (result) {
            console.log('push sent to ');
        }, function (err) {
            console.log('failed to push notification');
        });    
    }
}

/* NOVO USUARIO =============================================
    cdusuario: string 
    nome: string;
    avatar: string;
*/
router.post('/usuario', function(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM usuario where cdusuario = ? ', [req.body.cdusuario], function(err, result){
             if(result.length > 0) {
                 console.log("Usuario ja existe na base, ;-)");

                 connection.query('update usuario set lat = ?, lng = ?, devicetoken = ?, dtlogin = ? where cdusuario = ? ',
                    [req.body.lat, req.body.lng, req.body.devicetoken, new Date(), req.body.cdusuario], function(err, result){
                        connection.release();
                        return res.status(200).json(); 
                    })

             } else {
                console.log("Cadastrando novo usuario, ;-P");
                connection.query('INSERT INTO usuario SET ? ', req.body,
                    function(err,result){
                        if(err) {
                            connection.release();
                            return res.status(400).json(err);
                        }
                        connection.release();
                        insereConfignotificacao(req.body.cdusuario, res);
                        //return res.status(200).json();
                    });
             }
        });
    });    
});

router.put('/usuario', function(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    
    pool.getConnection(function(err, connection) {
        connection.query('update usuario set lat = ?, lng = ?, devicetoken = ?, dtlogin = ? where cdusuario = ? ',
                    [req.body.lat, req.body.lng, req.body.devicetoken, new Date(), req.body.cdusuario], function(err, result){
                        connection.release();
                        return res.status(200).json(); 
                    });
    });    
});

//validapreco
router.post('/validapreco', function(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM validapreco where cdproduto = ? and cdusuario = ? ', [req.body.cdproduto, req.body.cdusuario], function(err, result){
             if(result.length > 0) {
                 console.log("Usuario ja fez o voto para esse produto");
                 connection.release();
                 return res.status(200).json();
             }
             console.log("Votando ...");
             connection.query('INSERT INTO validapreco SET ? ', req.body,
                function(err,result){
                    if(err) {
                        connection.release();
                        return res.status(400).json(err);
                    }
                    connection.release();
                    return res.status(200).json();
                });
        });
    });    
});

//verifica se o usuario ja votou nesse produto
router.get('/validapreco', function(req, res) {
    let cdproduto = req.query.cdproduto;
    let cdusuario = req.query.cdusuario;
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM validapreco where cdproduto = ? and cdusuario = ? ', [cdproduto, cdusuario], function(err, result){
           if(err) {
                return res.status(400).json(err);
            }
            return res.status(200).json(result);
        });
        connection.release();
    });    
});

//verifica se o usuario ja votou nesse produto
router.get('/validapreco/qtde', function(req, res) {
    let cdproduto = req.query.cdproduto;
    pool.getConnection(function(err, connection) {
        connection.query(`
                SELECT coalesce(SUM(CASE 
                    WHEN t.flcerto = 1 THEN 1
                    ELSE 0
                END), 0 ) AS qtdeok,
                        coalesce(SUM(CASE 
                                WHEN t.flcerto = 0 THEN 1
                                ELSE 0
                            END), 0) AS qtdenok
                FROM validapreco t
                where t.cdproduto = ?
            `, [cdproduto], function(err, result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.status(200).json(result);
        });
        connection.release();
    });    
});


// MARCAS ============================================
router.get('/marcas', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM marca order by descricao',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);            
        });
        connection.release();
    });
});

// MEDIDAS ============================================
router.get('/medidas', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM medida',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);         
        });
        connection.release();
    });    
});

// TIPOS ============================================
router.get('/tipos', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM tipo',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);         
        });
        connection.release();
    });    
});

// LOJAS ============================================
// http://pt.stackoverflow.com/questions/55669/identificar-se-conjunto-de-coordenadas-est%C3%A1-dentro-de-um-raio-em-android
// Fórmula de Haversine
// HAVING distance <= 5 (em kilometros)
// Esse metodo busca a loja onde o usuário esta pela sua localizacao, estou mapeando um raio em 100 metros (0.1) 
//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-27.6210716,-48.6739947&radius=500&types=grocery_or_supermarket&key=AIzaSyDUAHiT2ptjlIRhAaVCY0J-qyNguPeCPfc
router.get('/lojas/:lat/:lng', function(req, res, callback) {
    console.log("Dados recebidos: lat: "+req.params.lat+", lng: "+req.params.lng);  
    //Segundo Passo se não encontrou na base local, busca na API place
    var location = "location="+req.params.lat + "," + req.params.lng;
    var url = API_GOOGLE_PLACE;
    url += '?'+location;
    url += '&'+RADIUS;
    url += '&'+TYPES;
    url += '&'+API_KEY;

    console.log("url: "+url);

    //busca as lojas do google e insere na base
    https.get(url, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            var lojas = listaLojas(parsed);
            persisteNovasLojas(lojas);
            return res.json(lojas);
        });
    });

    
    /*busca as lojas da base ordenadas por loja mais próximas do usuario e envia a resposta pra ele
    pool.getConnection(function(err, connection) {        
        connection.query(`SELECT *, (6371 * 
                acos(
                    cos(radians( ? )) *
                    cos(radians(lat)) *
                    cos(radians( ? ) - radians(lng)) +
                    sin(radians( ? )) *
                    sin(radians(lat))
                )) AS distance
                FROM loja HAVING distance <= 10.0 
                ORDER BY distance ASC 
                `,[req.params.lat, req.params.lng, req.params.lat],function(err,result){

                if(result.length > 0) {
                    return res.json(result);
                }                    
        });
        connection.release();
    });
    */
});     

function persisteNovasLojas(lojas){
    console.log("Persistindo na base local novas lojas");
        pool.getConnection(function(err, connection) {
        for(var i=0; i < lojas.length; i++){
            connection.query('INSERT INTO loja SET ? ',
                lojas[i],
                function(err,result){
                    if(err) {
                        console.log("Erro ao inserir nova loja: "+err);
                    } else {
                        console.log("Nova loja inserida com sucesso: "+result);
                    }
                });
        }        
        connection.release();       
    });
}

function listaLojas(parsed){
    var results = parsed.results;
    var retorno = new Array();
    var idAnterior = "-1";
    for(var i = 0; i < results.length; i++){
        var obj = results[i];
        if(idAnterior != obj.id){
            idAnterior = obj.id;
            retorno.push({
                cdloja: obj.id,
                nome: obj.name,
                icon: obj.icon,
                vicinity: obj.vicinity,
                dtcadastro: new Date(),                    
                lat: obj.geometry.location.lat,
                lng: obj.geometry.location.lng

            });
        }
    }
    return retorno;
}

pool.on('connection', function (connection) {   
  console.log("Conected");
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

pool.on('release', function () {
  console.log('Release');
});

module.exports = router;