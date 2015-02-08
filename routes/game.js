'use strict';
require('rootpath')();

var path = require('path');
var childProcess = require('child_process');
var constants = require('config/constants');

var runBackgroundScript = constants.runBackgroundScript;
var pullScriptPath = path.join(__dirname, '../scripts/pullData.py');

/*
 * ====================================================================
 * PLAY
 * ====================================================================
 */

function load(req, res, next) {
  res.render('game.hbs');
}

function getInfo(req, res, next) {
  var random = Math.floor(Math.random() * constants.tickerCache.length);
  var runPullScript = runBackgroundScript(pullScriptPath, [constants.tickerCache[random]]);
  runPullScript(function (err, info) {
    if (err){
      console.log(err);
    }
    var parsedInfo = JSON.parse(info);
    res.send(parsedInfo);
  });
}


exports.load = load;
exports.getInfo = getInfo