var express = require('express');
var logger  = require('morgan');
var https   = require("https");
var fs      = require('fs');

var router  = express.Router();


router.get('/home', home);

function home(req, res){
    fs.readFile('./backend/site/index.html', function (err, data) {
        if (err) {
            console.log("Error: ", err);
            throw err; 
        }       
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
}

module.exports = router;