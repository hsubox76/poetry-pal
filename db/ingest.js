var fs = require('fs');
var Word = require('./db').Word;


var storeWords = function (data) {
  var lines = data.split('\r');
  lines.forEach(function (line) {
    console.log('line: ' + line);
  });
};

fs.readFile('./data/testdict.unc', 'utf8', function (err, data) {
  if (err) throw err;
  storeWords(data);
});

