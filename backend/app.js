// INICIANDO ==========================================
var express  = require('express');
// cria nossa aplicação Express
var app      = express();
// Cria conexao com mysql
var mysql      = require('mysql');

// solicitações para log no console (express4)
var logger = require('morgan');
// puxar informações por POST HTML (express4)
var bodyParser = require('body-parser');

var https = require("https");

//Push notification
var gcm = require('node-gcm');
 
//deeplink
var deeplink = require('node-deeplink');

// DEFININDO A APLICAÇÃO ==============================
// definindo local de arquivos públicos
// app.use(express.static(__dirname + '/public'));
// logando todas as requisições no console
app.use(logger('dev'));

// parse application/x-www-form-urlencoded                                    
app.use(bodyParser.urlencoded({'extended':'true'}));

// parse application/json          
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/json' }));

//http://expressjs.com/pt-br/starter/static-files.html
app.use('/static', express.static('public'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');//'http://localhost:8100');

    // Request methods you wish to allow OPTIONS, PATCH, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Define url para deeplink
app.get('/deeplink', deeplink({ 
    fallback: 'https://google.com',
    android_package_name: 'br.com.rdc.vivacerveja', 
    ios_store_link: 'https://todo',
}));

// ROTAS ===============================================
// Incluindo nossas rotas definidas no arquivo routes/index.js
var index = require('./routes/index');
var manager = require('./routes/manager');

// definindo nossas rotas na aplicação
app.use('/', index);
app.use('/manager', manager);

// LISTEN (iniciando nossa aplicação em node) ==========
// Define a porta 8080 onde será executada nossa aplicação
// Imprime uma mensagem no console
// [START server]
// Start the server
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});
// [END server]

module.exports = app;