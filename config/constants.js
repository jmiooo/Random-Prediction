var path = require('path');
var childProcess = require('child_process');

exports.tickerCache = [];
exports.otherCache = [];

exports.scoreCache = [];

/*
 * ====================================================================
 * HELPERS
 * ====================================================================
 */

exports.runBackgroundScript = function (fileName, args) {
  return function (callback) {
    var python = childProcess.spawn('python', [fileName].concat(args));
    var output = '';

    python.stdout.on('data', function (data){
      output += data;
    });

    python.stderr.setEncoding('utf8');
    python.stderr.on('data', function (data) {
      console.log(data);
    });

    python.on('close', function(code) {
      callback(null, output);
    });
  };
}