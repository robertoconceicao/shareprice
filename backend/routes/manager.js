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

module.exports = router;