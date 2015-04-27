var fs = require('fs');
var Word = require('./db').Word;

var VOWELS = {
  "/&/": "a",
  "/(@)/": "a",
  "/A/": "a",
  "/eI/": "a",
  "/-/": "ir",
  "/E/": "e",
  "/i/": "e",
  "/I/": "i",
  "/aI/": "i",
  "/Oi/": "oi",
  "/AU/": "ow",
  "/O/": "o",
  "/oU/": "o",
  "/u/": "oo",
  "/U/": "oo",
  "/@/": "u",
  "/@r/": "u",
  "\"A\"": "a",
  "/y/": "eu",
  "\"Y\"": "u"
};

var CONSONANTS = {
  "/b/": "b",
  "/tS/": "ch",
  "/d/": "d",
  "/f/": "f",
  "/g/": "g",
  "/h/": "h",
  "/hw/": "w",
  "/dZ/": "g",
  "/k/": "c",
  "/l/": "l",
  "/m/": "m",
  "/N/": "ng",
  "/n/": "n",
  "/p/": "p",
  "/r/": "r",
  "/S/": "sh",
  "/s/": "s",
  "/T/": "th",
  "/D/": "th",
  "/t/": "t",
  "/v/": "v",
  "/w/": "w",
  "/j/": "y",
  "/Z/": "s",
  "/z/": "z",
  "\"N\"": "n",
  "\"R\"": "r",
  "/x/": "ch"
};

// add word to db
var addWord = function (word) {
  console.log('storing word: ' + word);
  var newWord = new Word({
    word: word
  });
  newWord.save(function (err, newWord) {
    if (err) {
      console.log(err);
    }
  });
};

// go through lines in file and store words
var storeWords = function (data) {
  var lines = data.split('\r');
  lines.forEach(function (line) {
    var wordToAdd = line.split(" ")[0].split("/")[0];
    // Don't bother adding words with spaces in them
    if (wordToAdd.indexOf('_') === -1) {
      Word.findOne({word: wordToAdd}, function (err, word) {
        if (err) {
          console.log(err);
        }
        if (!word) {
          addWord(wordToAdd);
        }
      });
    }
  });
};

fs.readFile('db/data/testdict.unc', 'utf8', function (err, data) {
  if (err) throw err;
  storeWords(data);
});

