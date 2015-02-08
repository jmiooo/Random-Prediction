'use strict';
require('rootpath')();

var constants = require('config/constants');
var cache = constants.scoreCache;

function getBoard(req, res, next) {
  res.send({ scores: cache });
}

function submit(req, res, next) {
  var data = req.body.score;
  cache.unshift(data);
  if (cache.length > 10) {
    cache = cache.slice(0, 10);
  }
  res.send('200');
}

exports.getBoard = getBoard;
exports.submit = submit;