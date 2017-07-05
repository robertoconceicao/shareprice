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


router.get('/usernoraio/:lat/:lng/:raio', getUsernoraio);
router.get('/qtdeusernoraio/:lat/:lng/:raio', getQtdeUserNoRaio);
router.get('/lojas/:lat/:lng/:raio', getLojas);
router.get('/lojas/:name/:lat/:lng/:raio', getLojasByName);
router.get('/produtos/:lat/:lng/:raio', getProdutos);
function getUsernoraio(req, res){    
    let lat = req.params.lat;
    let lng = req.params.lng;
    let raio = Number.parseInt(req.params.raio) / 1000;
    console.log("GET USERNORAIO recebidos ", lat, lng, raio);
    pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT u.lat, u.lng, u.nome as label 
                FROM usuario u
                where (6371 * acos(
                            cos(radians(u.lat)) *
                            cos(radians(?)) *
                            cos(radians(u.lng) - radians(?)) +
                            sin(radians(u.lat)) *
                            sin(radians(?))
                        )) <= ?
        
        `, [lat, lng, lat, raio], function(err, result){
            return res.status(200).json(result);
        });
        connection.release();
    });
}

function getQtdeUserNoRaio(req, res){    
    let lat = req.params.lat;
    let lng = req.params.lng;
    let raio = Number.parseInt(req.params.raio) / 1000;    
    pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT count(1) as qtde
                FROM usuario u
                where (6371 * acos(
                            cos(radians(u.lat)) *
                            cos(radians(?)) *
                            cos(radians(u.lng) - radians(?)) +
                            sin(radians(u.lat)) *
                            sin(radians(?))
                        )) <= ?
        
        `, [lat, lng, lat, raio], function(err, result){
            return res.status(200).json(result);
        });
        connection.release();
    });
}

function getLojas(req, res) {
    let lat = req.params.lat;
    let lng = req.params.lng;
    let raio = Number.parseInt(req.params.raio) / 1000;

    var location = "location="+lat + "," + lng;
    var url = API_GOOGLE_PLACE;
    url += '?'+location;
    url += '&radius='+req.params.raio; //nao posso dividir para o google maps
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
        });
    });
    
    console.log("GET LOJAS dados recebidos ", lat, lng, raio);
    pool.getConnection(function(err, connection) {
        connection.query(`
                SELECT l.lat, l.lng, l.nome as label, l.icon, l.cdloja 
                FROM loja l
                where (6371 * acos(
                            cos(radians(l.lat)) *
                            cos(radians(?)) *
                            cos(radians(l.lng) - radians(?)) +
                            sin(radians(l.lat)) *
                            sin(radians(?))
                        )) <= ?

                `,[lat, lng, lat, raio], function(err, result){
                    return res.json(result);
        });
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

function getProdutos(req, res) {
    let lat = req.params.lat;
    let lng = req.params.lng;
    let raio = Number.parseInt(req.params.raio) / 1000;

    pool.getConnection(function(err, connection) {
        connection.query(`
            SELECT p.preco, p.dtpublicacao, m.descricao AS marca, 
            l.nome AS loja, l.lat as lat, l.lng as lng,
            md.descricao AS medida, 
            md.ml as ml,
            u.nome as nomeusuario
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
            JOIN medida md ON md.cdmedida = p.cdmedida
            LEFT JOIN usuario u on u.cdusuario = p.cdusuario
        WHERE p.preco > 0 
        order by DATE(p.dtpublicacao) desc, p.preco asc
        `,[lat, lng, lat, raio],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    }); 
}

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

function getLojasByName(req, res) {
    let name = req.params.name;
    let lat = req.params.lat;
    let lng = req.params.lng;
    let raio = Number.parseInt(req.params.raio) / 1000;
    console.log("GET LOJAS BY NAME dados recebidos ", name, lat, lng, raio);
    pool.getConnection(function(err, connection) {
        connection.query(`
                SELECT l.lat, l.lng, l.nome as label, l.icon, l.cdloja 
                FROM loja l
                where 
                upper(l.nome) like upper('%`+name+`%')
                and (6371 * acos(
                            cos(radians(l.lat)) *
                            cos(radians(?)) *
                            cos(radians(l.lng) - radians(?)) +
                            sin(radians(l.lat)) *
                            sin(radians(?))
                        )) <= ?

                `,[lat, lng, lat, raio], function(err, result){
                    return res.json(result);
        });
        connection.release();
    });
}

module.exports = router;