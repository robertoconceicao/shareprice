// INICIANDO ==============================================
// Define as bibliotecas que iremos utilizar
var express = require('express');
var logger  = require('morgan');
var mysql   = require('mysql');
var https   = require("https");
var router  = express.Router();

var pool  = mysql.createPool({  
  connectionLimit : 100,
  host     : 'localhost',
  port : 3306, 
  database:'tabarato',
  user     : 'tabarato',
  password : 'security'
});    

const API_GOOGLE_PLACE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const API_KEY='key=AIzaSyDUAHiT2ptjlIRhAaVCY0J-qyNguPeCPfc';
const TYPES='types=grocery_or_supermarket'; //https://developers.google.com/places/supported_types?hl=pt-br
const RADIUS='radius=5000'; // 1km
const LIMIT_RESULTADO = 5;



//  PRODUTOS ============================================
router.get('/api/produto/:codigo', function(req, res) {	    
    pool.getConnection(function(err, connection) {
        connection.query(`
        SELECT p.* , 
            m.descricao AS marca, 
            l.nome AS loja, 
            l.icon as iconloja,
            l.vicinity as vicinity,
            l.lat as lat,
            l.lng as lng,
            t.descricao AS tipo, 
            md.descricao AS medida, 
            md.ml as ml,
            i.icon as icon
        FROM produto p
        JOIN loja l ON l.cdloja = p.cdloja
        JOIN marca m ON m.cdmarca = p.cdmarca
        JOIN tipo t ON t.cdtipo = p.cdtipo
        JOIN medida md ON md.cdmedida = p.cdmedida
        JOIN iconproduto i on i.cdmarca = p.cdmarca and i.cdtipo = p.cdtipo and i.cdmedida = p.cdmedida
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
        SELECT p . * , m.descricao AS marca, l.nome AS loja, t.descricao AS tipo, md.descricao AS medida, md.ml as ml, i.icon as icon
        FROM produto p
        JOIN loja l ON l.cdloja = p.cdloja
        JOIN marca m ON m.cdmarca = p.cdmarca
        JOIN tipo t ON t.cdtipo = p.cdtipo
        JOIN medida md ON md.cdmedida = p.cdmedida
        join iconproduto i on i.cdmarca = p.cdmarca and i.cdtipo = p.cdtipo and i.cdmedida = p.cdmedida
        WHERE 1 = 1
        ` + filtros + `
        order by p.preco asc
        LIMIT 0 , ?
        `,[LIMIT_RESULTADO],function(err,result){
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
        SELECT p . * , m.descricao AS marca, l.nome AS loja, t.descricao AS tipo, md.descricao AS medida, md.ml as ml, i.icon as icon
        FROM produto p
        JOIN loja l ON l.cdloja = p.cdloja
        JOIN marca m ON m.cdmarca = p.cdmarca
        JOIN tipo t ON t.cdtipo = p.cdtipo
        JOIN medida md ON md.cdmedida = p.cdmedida
        join iconproduto i on i.cdmarca = p.cdmarca and i.cdtipo = p.cdtipo and i.cdmedida = p.cdmedida
        WHERE 1 = 1
        ` + filtros + `
        order by p.preco asc
        LIMIT 0 , ?
        `,[LIMIT_RESULTADO],function(err,result){
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
        SELECT p . * , m.descricao AS marca, l.nome AS loja, t.descricao AS tipo, md.descricao AS medida, md.ml as ml, i.icon as icon
        FROM produto p
        JOIN loja l ON l.cdloja = p.cdloja
        JOIN marca m ON m.cdmarca = p.cdmarca
        JOIN tipo t ON t.cdtipo = p.cdtipo
        JOIN medida md ON md.cdmedida = p.cdmedida
        join iconproduto i on i.cdmarca = p.cdmarca and i.cdtipo = p.cdtipo and i.cdmedida = p.cdmedida
        WHERE 1 = 1
        ` + filtros + `
        order by p.preco asc
        LIMIT 0 , ?
        `,[LIMIT_RESULTADO],function(err,result){
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
    var limiteResultado = Number.parseInt(LIMIT_RESULTADO) + posicao;
    var filtros = getFiltrosUrl(req);
    pool.getConnection(function(err, connection) {
        connection.query(`
        SELECT p . * , m.descricao AS marca, l.nome AS loja, t.descricao AS tipo, md.descricao AS medida, md.ml as ml, i.icon as icon
        FROM produto p
        JOIN loja l ON l.cdloja = p.cdloja
        JOIN marca m ON m.cdmarca = p.cdmarca
        JOIN tipo t ON t.cdtipo = p.cdtipo
        JOIN medida md ON md.cdmedida = p.cdmedida
        join iconproduto i on i.cdmarca = p.cdmarca and i.cdtipo = p.cdtipo and i.cdmedida = p.cdmedida
        WHERE 1 = 1
        ` + filtros + `
        order by p.preco asc
        LIMIT ? , ?
        `,[posicao, limiteResultado],function(err,result){
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
*/
router.post('/api/produto', function(req, res) {
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    
    pool.getConnection(function(err, connection) {        
        connection.query('INSERT INTO produto SET ? ', req.body,
            function(err,result){
                if(err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json(result);            
            });
        connection.release();       
    });    
});

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
                 connection.release();
                 return res.status(200); 
             }
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
        });
    });    
});

// MARCAS ============================================
router.get('/api/marcas', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM marca',[],function(err,result){
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


// BUSCA ICONE DO PRODUTO ============================
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
                FROM loja HAVING distance <= 5.0`,[req.params.lat, req.params.lng, req.params.lat],function(err,result){

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

    /*
    cdloja: string;
    nome: string;    
    lat: number;
    lng: number;
    vicinity: string; // endereço
    icon?: string;
    dtcadastro?: Date;
    */
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