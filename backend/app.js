var express = require('express');
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Definir a route principal
app.get('/', function(req, res) {
	res.send('Welcome to API');
});


// Lista de Utilizadores
var produtos = [{ 
		codigo: 1, 
		categoria:{ 
			codigo: 1, 
			descricao: 'Bebidas'
		}, 
		descricao: 'cerveja brahma 300ml', 
		quantidade: 1, 
		preco: '1,50',
		loja: {
			codigo: 1,
			nome: 'Fort',
			latitude: '124332553',
			longitude: '124356677'
		},
		unidademedida: {
			codigo: 1,
			descricao: 'Mililitro',
			sigla: 'ml'
		},
		dtpromocao: '10/12/2016',
		dtpublicacao: '01/12/2016' 
	},
	{ codigo: 2, 
		categoria:{ 
			codigo: 2, 
			descricao: 'Churrasco'
		}, 
		descricao: 'Contra filé 1kg', 
		quantidade: 1, 
		preco: '20,50',
		loja: {
			codigo: 1,
			nome: 'Fort',
			latitude: '124332553',
			longitude: '124356677'
		},
		unidademedida: {
			codigo: 3,
			descricao: 'Quilograma',
			sigla: 'kg'
		},
		dtpromocao: '20/12/2016',
		dtpublicacao: '15/12/2016' 
	}
];

// Definir um endpoint da API
app.get('/api/get_produtos', function(req, res, next) {
	console.log("get produtos ");
	res.send(produtos);
	/*
	res.json({
			"data": produtos
	});
	*/
});

app.get('/api/post_produto', function(req, res, next) {
	 console.log("post produto: "+req.json());
	 
	 res.json({
				"Error": false,
				"Message": "Success"
	 });
});


// Aplicação disponível em http://127.0.0.1:9000/
app.listen(9000);