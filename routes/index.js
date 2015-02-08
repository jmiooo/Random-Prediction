//file used to load other routes
'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();

var game = require('routes/game');
console.log(game);
app.get('/', game.load);
app.get('/getInfo', game.getInfo)

var board = require('routes/board');
app.get('/getBoard', board.getBoard);
app.post('/submit', board.submit);