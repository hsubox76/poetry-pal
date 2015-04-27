var fs = require('fs');
var Word = require('./db').Word;
var _ = require("underscore");

var VOWELS = {
  "&": "a",
  "(@)": "a",
  "A": "a",
  "eI": "a",
  "-": "ir",
  "E": "e",
  "i": "e",
  "I": "i",
  "aI": "i",
  "Oi": "oi",
  "AU": "ow",
  "O": "o",
  "oU": "o",
  "u": "oo",
  "U": "oo",
  "@": "u",
  "@r": "u",
  "y": "eu",
  "Y": "u"
};

var CONSONANTS = {
  "b": "b",
  "tS": "ch",
  "d": "d",
  "f": "f",
  "g": "g",
  "h": "h",
  "hw": "w",
  "dZ": "g",
  "k": "c",
  "l": "l",
  "m": "m",
  "N": "ng",
  "n": "n",
  "p": "p",
  "r": "r",
  "S": "sh",
  "s": "s",
  "T": "th",
  "D": "th",
  "t": "t",
  "v": "v",
  "w": "w",
  "j": "y",
  "Z": "s",
  "z": "z",
  "R": "r",
  "x": "ch"
};

var MARKS = {
  "\'": 'primary',
  ",": 'secondary'
};
/*
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
*/

var isSortOfConsonant = function (str) {
  return ((str in CONSONANTS || !(str in VOWELS)) && !(str in MARKS))
};

var breakBySyllables = function (word) {
  var results = [];
  var word = word.replace(/\/\//g, '/');
  var pieces = [word];
  var emphasisIndex;
  // split by primary stress mark
  pieces.forEach(function (piece, index) {
    emphasisIndex = piece.indexOf('\'');
    if (emphasisIndex > 0) {
      pieces[index] = [piece.slice(0, emphasisIndex), piece.slice(emphasisIndex)];
      pieces = _.flatten(pieces);
    }
  });
  // split by secondary stress mark
  pieces.forEach(function (piece, index) {
    emphasisIndex = piece.indexOf(',');
    if (emphasisIndex > 0) {
      pieces[index] = [piece.slice(0, emphasisIndex), piece.slice(emphasisIndex)];
      pieces = _.flatten(pieces);
    }
  });

  // split if two consonants together
  pieces.forEach(function (piece, index) {
    var phonemesPrelim = piece.split('/');
    if (phonemesPrelim[phonemesPrelim.length-1] === '') {
      phonemesPrelim = phonemesPrelim.slice(0, -1);
    }
    if (phonemesPrelim[0] === '') {
      phonemesPrelim = phonemesPrelim.slice(1);
    }
    var syllables = [];
    var currentSyl = [];
    var phonemes = [];
    // split up phonemes that are together without a divider
    for (var j = 0; j < phonemesPrelim.length; j++) {
      if (phonemesPrelim[j].length > 1 && !(phonemesPrelim[j] in CONSONANTS) && !(phonemesPrelim[j] in VOWELS)){
        phonemes.push(phonemesPrelim[j][0]);
        phonemes.push(phonemesPrelim[j].slice(1));
      } else {
        phonemes.push(phonemesPrelim[j]);
      }
    }
    // go through all phonemes
    for (var i = 0; i < phonemes.length; i++) {
      currentSyl.push(phonemes[i]);
      // 2 consonants together, second one followed by a vowel
      if (phonemes[i-1] in VOWELS && isSortOfConsonant(phonemes[i]) && isSortOfConsonant(phonemes[i+1]) && phonemes[i+2] in VOWELS) {
        syllables.push(currentSyl.join('|'));
        currentSyl = [];
      }
      // vowel consonant vowel
      if (phonemes[i] in VOWELS && isSortOfConsonant(phonemes[i+1]) && phonemes[i+2] in VOWELS) {
        syllables.push(currentSyl.join('|'));
        currentSyl = [];
      }
    }
    syllables.push(currentSyl.join('|'));
    pieces[index] = syllables;
  });

  pieces = _.flatten(pieces);

  var results = _.map(pieces, function (piece) {
    var obj = {};
    if (piece[0] == '\'') {
      obj.emphasis = 'primary';
      obj.content = piece.slice(1);
    } else if (piece[0] == ',') {
      obj.emphasis = 'secondary';
      obj.content = piece.slice(1);
    } else {
      obj.content = piece;
    }
    return obj;
  });
  console.log(results);
  return results;

};

// add word to db
var addWord = function (word, pron) {
  console.log('storing word: ' + word);
  var newWord = new Word({
    word: word,
    syllables: breakBySyllables(pron)
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
    var wordToAddPron = line.split(" ")[1];
    // Don't bother adding words with spaces in them
    if (wordToAdd.indexOf('_') === -1) {
      breakBySyllables(wordToAddPron);
      Word.findOne({word: wordToAdd}, function (err, word) {
        if (err) {
          console.log(err);
        }
        if (!word) {
          addWord(wordToAdd, wordToAddPron);
        }
      });
    }
  });
};

fs.readFile('db/data/testdict.unc', 'utf8', function (err, data) {
  if (err) throw err;
  storeWords(data);
});

