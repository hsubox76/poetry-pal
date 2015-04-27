var fs = require('fs');
var Word = require('./db').Word;


var storeWords = function (data) {
  var lines = data.split('\r');
  lines.forEach(function (line) {
    var wordToAdd = line.split(" ")[0].split("/")[0];
    Word.findOne({word: wordToAdd}, function (err, word) {
      if (err) {
        console.log(err);
      }
      if (!word) {
        console.log('storing word: ' + wordToAdd);
        var newWord = new Word({
          word: wordToAdd
        });
        newWord.save(function (err, newWord) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
};

fs.readFile('db/data/testdict.unc', 'utf8', function (err, data) {
  if (err) throw err;
  storeWords(data);
});

