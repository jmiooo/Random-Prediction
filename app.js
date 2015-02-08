'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();
//var configs = require('config/index');
//configs.configure(app);
var constants = require('config/constants');

var path = require('path');
var hbs = require('hbs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.__express);
app.engine('html', hbs.__express);
app.use(express.static(path.join(__dirname, "public")));

var bodyParser = require('body-parser');

app.use(bodyParser());

//mount on on other modules
//keep this file clean
//require('libs/backgroundProcesses/updateCaches').start();
/*var customSetInterval = configs.constants.globals.customSetInterval;
var globals = configs.globals.contestA;
customSetInterval(function(callback) {
  console.log(globals);
  callback(null);
}, 2000);*/

// Retrieving tickers
var runBackgroundScript = constants.runBackgroundScript;
var pullScriptPath1 = path.join(__dirname, '/scripts/pullTicker.py');
var runPullScript1 = runBackgroundScript(pullScriptPath1, []);
runPullScript1(function (err, info) {
  if (err) {
    console.log(err);
  }
  var parsedInfo = JSON.parse(info).data[0].securityData[0].fieldData.INDX_MEMBERS;
  for (var i = 0; i < parsedInfo.length; i++) {
    constants.tickerCache.push(parsedInfo[i]['Member Ticker and Exchange Code'].slice(0, -2) + 'US Equity');
  }
});

app.use('/', require('routes/index'));

app.listen(3000);