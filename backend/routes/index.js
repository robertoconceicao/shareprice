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
  user     : 'root',
  password : 'security'
});    

var API_GOOGLE_PLACE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
var API_KEY='key=AIzaSyDUAHiT2ptjlIRhAaVCY0J-qyNguPeCPfc';
var TYPES='types=grocery_or_supermarket'; //https://developers.google.com/places/supported_types?hl=pt-br
var RADIUS='radius=500';

//  PRODUTOS ============================================
router.get('/api/produtos', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM produto',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    }); 
});

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
    console.log("Dados recebidos: "+JSON.stringify(req.body.cdtipo));
    
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
                FROM loja HAVING distance <= 0.5`,[req.params.lat, req.params.lng, req.params.lat],function(err,result){

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
            var obj = results[0];
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

/*
router.get('/api/contatos', function(req, res) {
    // utilizaremos o mongoose para buscar todos os contatos no BD
    Contato.find(function(err, contatos) {
        // Em caso de erros, envia o erro na resposta
        if (err)
            res.send(err)
        // Retorna todos os contatos encontrados no BD
        res.json(contatos); 
    });
});
 
// ROTA CRIAR =============================================
router.post('/api/contatos', function(req, res) {
    // Cria um contato, as informações são enviadas por uma requisição AJAX pelo Angular
    Contato.create({
        nome : req.body.nome,
        email : req.body.email,
        telefone : req.body.telefone,
        done : false
    }, function(err, contato) {
        if (err)
            res.send(err);
        // Busca novamente todos os contatos após termos inserido um novo registro
        Contato.find(function(err, contatos) {
            if (err)
                res.send(err)
            res.json(contatos);
        });
    });
 
});
 
// ROTA DELETAR ============================================
router.delete('/api/contatos/:contato_id', function(req, res) {
    // Remove o contato no Model pelo parâmetro _id
    Contato.remove({
        _id : req.params.contato_id
    }, function(err, contato) {
        if (err)
            res.send(err);
        // Busca novamente todos os contatos após termos removido o registro
        Contato.find(function(err, contatos) {
            if (err)
                res.send(err)
            res.json(contatos);
        });
    });
});
 
// ROTA EDITAR =============================================
router.get('/api/contatos/:contato_id', function(req, res) {
    // Busca o contato no Model pelo parâmetro id
    Contato.findOne({
        _id : req.params.contato_id
    }, function(err, contato) {
        if (err)
            res.send(err);
        res.json(contato);
    });
});
 
// ROTA ATUALIZAR ==========================================
router.put('/api/contatos/:contato_id', function(req, res) {
    // Busca o contato no Model pelo parâmetro id
    var contatoData = req.body;
    var id = req.params.contato_id;
 
    Contato.update( 
        {_id: id }, 
        contatoData, 
        { upsert: true}, 
        function(err, contato) {
            if (err) res.send(err);
            res.json(contato);
    });
    
});
 
// DEFININDO NOSSA ROTA PARA O ANGULARJS/FRONT-END =========
router.get('*', function(req, res) {
    // Carrega nossa view index.html que será a única da nossa aplicação
    // O Angular irá lidar com as mudanças de páginas no front-end
    res.sendfile('./public/index.html');
});
 */