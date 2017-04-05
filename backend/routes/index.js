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

/*
// TESTES LOCAIS
var pool  = mysql.createPool({  
   connectionLimit : 100,
   host     : 'localhost',
   port : 3306, 
   database:'tabarato',
   user     : 'tabarato',
   password : 'security',
   multipleStatements: true
 });    
*/
//NA NUVEM

var config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

if (process.env.INSTANCE_CONNECTION_NAME) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

var pool  = mysql.createPool(config);    

const API_GOOGLE_PLACE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const API_KEY='key=AIzaSyDUAHiT2ptjlIRhAaVCY0J-qyNguPeCPfc';
const TYPES='types=grocery_or_supermarket'; //https://developers.google.com/places/supported_types?hl=pt-br
const RADIUS='radius=5000'; // 1km
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

router.get('/api/confignotificacao', function(req, res){
    var cdusuario = req.query.cdusuario;
    pool.getConnection(function(err, connection){
        var cdconfignotificacao = 0;
        var raio = 10;
        var flnotificar = 1;
        var marcas = [];

        connection.query('select cdconfignotificacao, raio, flnotificar from confignotificacao where cdusuario = ? ', [cdusuario], function(err, result){
            //let tipos = [];
            //let medidas = [];

            if(result.length > 0){
                cdconfignotificacao = result[0].cdconfignotificacao;
                raio = result[0].raio;

                connection.query('select cdmarca from configmarca where cdconfignotificacao = ? ', [cdconfignotificacao], function(err, result){
                    marcas = result;
                    let obj = [{
                        'cdconfignotificacao': cdconfignotificacao,
                        'cdusuario': cdusuario,
                        'raio': raio,
                        'flnotificar': flnotificar,
                        'marcas': marcas
                    }];

                    return res.status(200).json(obj);
                });
            } else {
                connection.query('INSERT INTO confignotificacao(cdusuario, raio, flnotificar) values(?, 10, 1) ', [cdusuario], function(err,result){                        
                    if(err) {
                        console.log("Erro ao tentar inserir confignotificacao");                        
                        return connection.rollback(function() {
                            throw error;
                        });                        
                    }
                    
                    cdconfignotificacao = result.insertId;

                    connection.query(`INSERT INTO configmarca(cdmarca, cdconfignotificacao ) 
                                        SELECT cdmarca, `+cdconfignotificacao+`
                                        FROM marca `, [], function(err,result){
                            if(err) {
                                console.log("Erro ao tentar inserir configmarca");
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                   
                        connection.query('select cdmarca from configmarca where cdconfignotificacao = ? ', [cdconfignotificacao], function(err, result){
                            marcas = result;
                            
                            var obj = [{
                                'cdconfignotificacao': cdconfignotificacao,
                                'cdusuario': cdusuario,
                                'raio': raio,
                                'flnotificar': flnotificar,
                                'marcas': marcas
                            }];

                            return res.status(200).json(obj);
                        });
                    });

                });
            }
        });
        connection.release();
    });
});

// Configuracao Notificacao =============================
router.post('/api/confignotificacao', function(req, res) {	    
    //let medidas = req.body.medidas;
    //let tipos = req.body.tipos;
    let marcas = req.body.marcas;
    let raio = req.body.raio;
    let cdusuario = req.body.cdusuario;
    let flnotificar = req.body.flnotificar;

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
                        cdconfignotificacao = result[0].cdconfignotificacao;

                        console.log("Existe configuracao para esse usuario, detele td e insere tudo novamente");
                        connection.query(`delete from configmarca where cdconfignotificacao = ?`,[cdconfignotificacao],function(err, result2){
                            if(err) {
                                console.log("Erro ao tentar deletar configmarca");
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            connection.query(`delete from confignotificacao where cdconfignotificacao = ?`,[cdconfignotificacao],function(err, result3){
                                console.log("Erro ao tentar deletar confignotificacao");
                                if(err) {
                                    return connection.rollback(function() {
                                        throw error;
                                    });
                                }

                                connection.query('INSERT INTO confignotificacao(cdusuario, raio, flnotificar) values(?, ?, ?) ', [cdusuario, raio, flnotificar], function(err,result4){
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
                                            return;
                                        });
                                    }, this);                         
                                                                
                                    connection.commit(function(err) {
                                        if (err) {
                                            return connection.rollback(function() {
                                                throw err;
                                            });
                                        }
                                        console.log('success!');
                                        return res.status(200);
                                    });
                                });
                            });
                        });                 
                    } else {
                        connection.query('INSERT INTO confignotificacao(cdusuario, raio, flnotificar) values(?, ?) ', [cdusuario, raio, flnotificar], function(err,result){
                            if(err) {
                                console.log("Erro ao tentar inserir confignotificacao");                        
                                return connection.rollback(function() {
                                    throw error;
                                });                        
                            }
                            cdconfignotificacao = result.insertId;

                            marcas.forEach(function(element){
                                connection.query('INSERT INTO configmarca(cdmarca, cdconfignotificacao) values(?, ?) ', [element, cdconfignotificacao], function(err,result1){
                                    if(err) {
                                        console.log("Erro ao tentar inserir configmarca");
                                        return connection.rollback(function() {
                                            throw error;
                                        });                        
                                    }
                                    return;
                                });
                            }, this);                         
                                                   
                            connection.commit(function(err) {
                                if (err) {
                                    return connection.rollback(function() {
                                        throw err;
                                    });
                                }
                                console.log('success!');
                                return res.status(200);
                            });
                        });
                    }
                });
            });
        connection.release();
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
router.get('/api/produto/:codigo', function(req, res) {	    
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

router.put('/api/produto/:codigo', function(req, res) {
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

router.get('/api/produtos', function(req, res) {
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
        WHERE 1 = 1` + filtros + `
        order by p.preco asc
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

router.get('/api/filter', function(req, res) {
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
        WHERE 1 = 1` + filtros + `
        order by p.preco asc
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

router.get('/api/before_produtos', function(req, res) {
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
        WHERE 1 = 1` + filtros + `
        order by p.preco asc
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

router.get('/api/after_produtos', function(req, res) {
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
        WHERE 1 = 1` + filtros + `
        order by p.preco asc
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
    codigo: number;    
    descricao: string;
    quantidade: number;
    preco: number;
    cdloja: cdloja;
    cdcategoria: number;    
    dtpromocao: Date;
    dtpublicacao: Date;
    cdusuario: string
*/
router.post('/api/produto', function(req, res) {
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
                    `   SELECT u.devicetoken 
                        FROM usuario u
                        where exists (SELECT 1 from confignotificacao cn                      
                                        JOIN configmarca ma ON ma.cdconfignotificacao = cn.cdconfignotificacao              
                                        join produto p on p.cdmarca = ma.cdmarca
                                        join loja l on  p.cdloja = l.cdloja
                                        where p.codigo = ?                                        
                                        and cn.flnotificar = 1
                                        and cn.cdusuario = u.cdusuario                                              
                                        and  (6371 * acos(
                                                    cos(radians(u.lat)) *
                                                    cos(radians(l.lat)) *
                                                    cos(radians(u.lng) - radians(l.lng)) +
                                                    sin(radians(u.lat)) *
                                                    sin(radians(l.lat))
                                                )) <= cn.raio
                                )
                    `,[cdproduto], function(err, result){
                        //Notifica todos os usuarios que estao próximos, e que estejam configurados
                        pushNotification(cdproduto, result);               
                    });
                return res.status(200).json(result);            
            });
        connection.release();       
    });    
});

//apenas para testes depois remover esse codigo
router.get('/api/push', function (req, res) {
    var device_tokens = []; //create array for storing device tokens
    var retry_times = 4; //the number of times to retry sending the message if it fails
    var sender = new gcm.Sender(gcmApiKey); //create a new sender
    var message = new gcm.Message(); //create a new message    
    message.addData('title', 'Titulo da cerveja...');
    message.addData('message', "Mensagem de teste de notificacao");
    message.addData('sound', 'default');
    message.addData('icon', 'assets/images/111.png');
    message.collapseKey = 'Testing Push'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //number of seconds to keep the message on 
    //server if the device is offline
    
    //Take the registration id(lengthy string) that you logged 
    //in your ionic v2 app and update device_tokens[0] with it for testing.
    //Later save device tokens to db and 
    //get back all tokens and push to multiple devices        
    device_bob = "cHuB9agvyCY:APA91bFwXmQuliTLKP7cp2Z0aQxzPwm-SXOrcF405vnBOJkc11CVDadPZCmKdfpbNLwjYZut-2NWdAYpF9DNCu-MH_Bj_a_cUndt9z2kBEMJ-DH580YcZkWOjWuS88rUvRpJfqQOveWA";
    device_tokens.push(device_bob);
    
    sender.send(message, device_tokens, retry_times, function (result) {
        console.log('push sent to: ' + device_tokens);
        res.status(200).send('Pushed notification ' + device_tokens);
    }, function (err) {
        res.status(500).send('failed to push notification ');
    });
});

//router.get('/api/push', function (req, res) {
function pushNotification(produto, device_tokens){
    //var device_tokens = []; //create array for storing device tokens
    
    var retry_times = 4; //the number of times to retry sending the message if it fails
    var sender = new gcm.Sender(gcmApiKey); //create a new sender
    var message = new gcm.Message(); //create a new message    
    message.addData('title', 'Cerveja '+produto.cdproduto);
    message.addData('message', "Push message");
    message.addData('sound', 'default');
    message.collapseKey = 'Testing Push'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //number of seconds to keep the message on 
    //server if the device is offline
    
    //Take the registration id(lengthy string) that you logged 
    //in your ionic v2 app and update device_tokens[0] with it for testing.
    //Later save device tokens to db and 
    //get back all tokens and push to multiple devices    
    /*
    device_bob = "dunNZ5K9JLk:APA91bHlXnRfxzfTWmx55NwCHIcmPym7ZOvmIUm1bK74JMUuYSTdVhdl1SwoA0NyEETKDMh2bDYxkUUVdVlhx6ivW9zEMQ8zHKzmLYQslr2Sf9u6gemp5lJ8QmMfaKmILOJ8zK88-Jym";
    device_osama = "cKIJWzUdN9U:APA91bGFqKpEY4jc8ad6YB07gwgRvwyVFf-6bqvvv48qq17K9Yg2Qxjmcgs1mQV-GhpeLKp547HJk-jsMCgIgOm3B7uNXJ6oBr7lKHm5WTldYfs5pMBeFcsiedslm-YBanKd747I3AEV";
    device_jean = "d6bUJBLzx6c:APA91bHCiM-8kFN7xn3bCQAhImLZya1WkfYZP4zm-0GvQT7rfesOTerUj2e3f0vj2cs_RwpE33_Ofa71K-KJFuF7g43V5tlxaI6rNqIli0SqE7P_cetRaU5DUd6IJLfiy0Bn7is4Jwjt";
        
    device_tokens.push(device_osama);
    device_tokens.push(device_bob);
    device_tokens.push(device_jean);
    */
    if(device_tokens.length <= 0 ){
        console.log("Nao encontrou ninguem para notificar");
        return;
    }

    //guarda em cada possicao uma lista de devices de no máximo 1000(valor maximo da API de push notification) elementos
    var arrayDevices = new Array(); 
    
    if(device_tokens.length > 1000){
        while(device_tokens.length > 1000){
            //remove da posicao 0, 1000 elementos e add esses 1000 na lista de push
            arrayDevices.push(device_tokens.splice(0, 1000));
        }
        arrayDevices.push(device_tokens.splice(0, device_tokens.length - 1));
    } else {
        arrayDevices.push(device_tokens);
    }



    for(var tokens of arrayDevices){
        sender.send(message, tokens, retry_times, function (result) {
            console.log('push sent to: ' + device_tokens);
            res.status(200).send('Pushed notification ' + device_tokens);
        }, function (err) {
            res.status(500).send('failed to push notification ');
        });    
    }
}

/* NOVO USUARIO =============================================
    cdusuario: string 
    nome: string;
    avatar: string;
*/
router.post('/api/usuario', function(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM usuario where cdusuario = ? ', [req.body.cdusuario], function(err, result){
             if(result.length > 0) {
                 console.log("Usuario ja existe na base, ;-)");

                 connection.query('update usuario set lat = ?, lng = ?, devicetoken = ? where cdusuario = ? ',
                    [req.body.lat, req.body.lng, req.body.devicetoken,req.body.cdusuario], function(err, result){
                        connection.release();
                        return res.status(200); 
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
                        return res.status(200);
                    });
             }
        });
    });    
});

//validapreco
router.post('/api/validapreco', function(req, res) {
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
router.get('/api/validapreco', function(req, res) {
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
router.get('/api/validapreco/qtde', function(req, res) {
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
router.get('/api/marcas', function(req, res) {	
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
router.get('/api/medidas', function(req, res) {	
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
router.get('/api/tipos', function(req, res) {	
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


/* BUSCA ICONE DO PRODUTO ============================
router.get('/api/icone/:cdmarca/:cdtipo/:cdmedida', function(req, res, callback) {
    console.log("Buscar icone: cdmarca: "+req.params.cdmarca+", cdtipo: "+req.params.cdtipo+", cdmedida: "+req.params.cdmedida);
    //Primeiro Passo é buscar na base local
    pool.getConnection(function(err, connection) {        
        connection.query(`SELECT icon
                FROM iconproduto 
                WHERE cdmarca = ? and cdtipo = ? and cdmedida = ? `,[req.params.cdmarca, req.params.cdtipo, req.params.cdmedida],function(err,result){

                if(result.length > 0) {
                    return res.json(result);
                }     
        });
        connection.release();
    });
});
*/

// LOJAS ============================================
// http://pt.stackoverflow.com/questions/55669/identificar-se-conjunto-de-coordenadas-est%C3%A1-dentro-de-um-raio-em-android
// Fórmula de Haversine
// HAVING distance <= 5 (em kilometros)
// Esse metodo busca a loja onde o usuário esta pela sua localizacao, estou mapeando um raio em 100 metros (0.1) 
//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-27.6210716,-48.6739947&radius=500&types=grocery_or_supermarket&key=AIzaSyDUAHiT2ptjlIRhAaVCY0J-qyNguPeCPfc
router.get('/api/lojas/:lat/:lng', function(req, res, callback) {
    console.log("Dados recebidos: lat: "+req.params.lat+", lng: "+req.params.lng);
    
    //Primeiro Passo é buscar na base local
    pool.getConnection(function(err, connection) {
        console.log("Primeiro Passo é buscar na base local");
        connection.query(`SELECT *, (6371 * 
                acos(
                    cos(radians( ? )) *
                    cos(radians(lat)) *
                    cos(radians( ? ) - radians(lng)) +
                    sin(radians( ? )) *
                    sin(radians(lat))
                )) AS distance
                FROM loja HAVING distance <= 5.0 
                ORDER BY distance ASC 
                `,[req.params.lat, req.params.lng, req.params.lat],function(err,result){

                if(result.length > 0) {
                    return res.json(result);
                } 

                console.log("Segundo Passo se não encontrou na base local, busca na API place");
                //Segundo Passo se não encontrou na base local, busca na API place
                var location = "location="+req.params.lat + "," + req.params.lng;
                var url = API_GOOGLE_PLACE;
                url += '?'+location;
                url += '&'+RADIUS;
                url += '&'+TYPES;
                url += '&'+API_KEY;

                console.log("url: "+url);

                https.get(url, function(response) {
                    // Continuously update stream with data
                    var body = '';
                    response.on('data', function(d) {
                        body += d;
                    });
                    response.on('end', function() {            
                        // Data reception is done, do whatever with it!
                        /*
                        "geometry": {
                        "location": {
                        "lat": -27.6227852,
                        "lng": -48.6774436
                        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
                        "id": "3b6ea34712d3fef2c9d00d54342fa038604ab79d",
                        "name": "Hippo"
                        "vicinity" : "Rua da Universidade, 346 - Passeio Pedra Branca, Palhoça"
                        */
                        var parsed = JSON.parse(body);
                        var lojas = listaLojas(parsed);
                        // envia resposta para o usuário
                        res.send(lojas);
                        
                        persisteNovasLojas(lojas);
                    });
                });                      
        });
        connection.release();
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
});

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