// INICIANDO ==============================================
// Define as bibliotecas que iremos utilizar
var express = require('express');
var logger = require('morgan');
var mysql   = require('mysql');
var router  = express.Router();

var pool  = mysql.createPool({  
  connectionLimit : 100,
  host     : 'localhost',
  port : 3306, 
  database:'tabarato',
  user     : 'root',
  password : 'security'
});    

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

// NOVO PRODUTO =============================================
router.post('/api/produto', function(req, res) {
    // Cria um contato, as informações são enviadas por uma requisição AJAX pelo Angular    
    console.log("Dados recebidos: "+JSON.stringify(req.body));
    
    /*
    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO produto SET ? ',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.status(200).json(result);            
        });
        connection.release();       
    });
    */     
});

//  CATEGORIAS ============================================
router.get('/api/categorias', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM categoria',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);            
        });
        connection.release();
    });
});

router.post('/api/categoria', function(req, res) {
    // Cria um contato, as informações são enviadas por uma requisição AJAX pelo Angular    
    console.log("Dados recebidos: codigo: "+req.body.codigo+", descricao:"    
    +req.body.descricao+", icon: "
    +req.body.icon);
       
    return res.json(req.body);
});

//  UNIDADEMEDIDAS ============================================
router.get('/api/unidademedidas', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM unidademedida',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);         
        });
        connection.release();
    });    
});

//  LOJAS ============================================
router.get('/api/lojas', function(req, res) {	
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM loja',[],function(err,result){
            if(err) {
                return res.status(400).json(err);
            }
            return res.json(result);           
        });
        connection.release();
    });    
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