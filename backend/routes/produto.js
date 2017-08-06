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

 router.get('/:codigo', function(req, res) {	    
    pool.getConnection(function(err, connection) {
        connection.query(
            PROJECAO_PRODUTO +
            `     
             WHERE p.codigo = ?        
        `,[req.params.codigo],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            var produto = result[0];
            return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>`+ produto.marca + ' ' + produto.medida + ' ' + produto.ml+' ml' + `</title>
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
            </head>
            <body>
                <div class="container">
                    <div class="card" style="width: 600px;">
                        <img class="card-img-top" src="`+'http://geladasoficial.com/images/'+produto.cdmarca+'/'+produto.cdtipo+'/'+produto.cdmedida+'.png'+ `">
                        <div class="card-block">
                            <h4 class="card-title">`+produto.marca + ' ' + produto.medida + ' ' + produto.ml +' ml'+`</h4>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Preco ...</li>
                            <li class="list-group-item">
                                <h2>`+produto.loja+`</h2>
                                <p>`+produto.vicinity+`</p>
                            </li>
                            <li class="list-group-item">
                                <img src="`+produto.avatar+`">
                                <h2>`+produto.nomeusuario+`</h2>
                                <p>publicado em: `+produto.dtpublicacao+`</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </body>
            </html>
            `);           
        });
        connection.release();
    }); 
});

module.exports = router;