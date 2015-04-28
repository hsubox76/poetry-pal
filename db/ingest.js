var fs = require('fs');
var Word = require('./db').Word;
var _ = require("underscore");
var byline = require("byline");
var phon = require("./phonemeDict");

var isSortOfConsonant = function (str) {
  return ((str in phon.CONSONANTS || !(str in phon.VOWELS)) && !(str in phon.MARKS))
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
      if (phonemesPrelim[j].length > 1 && !(phonemesPrelim[j] in phon.CONSONANTS) && !(phonemesPrelim[j] in phon.VOWELS)){
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
      if (phonemes[i-1] in phon.VOWELS && isSortOfConsonant(phonemes[i]) && isSortOfConsonant(phonemes[i+1]) && phonemes[i+2] in phon.VOWELS) {
        syllables.push(currentSyl.join('|'));
        currentSyl = [];
      }
      // vowel consonant vowel
      if (phonemes[i] in phon.VOWELS && isSortOfConsonant(phonemes[i+1]) && phonemes[i+2] in phon.VOWELS) {
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
  return results;

};

// add word to db
var addWord = function (word, pron, count) {
  var newWord = new Word({
    word: word,
    syllables: breakBySyllables(pron)
  });
  newWord.save(function (err, newWord) {
    if (err) {
      console.log(err);
    } else {
      if (count % 500 === 0) {
        console.log('Saved ' + word);
      }
    }
  });
};

// go through lines in file and store words
var storeWords = function (data) {
  var count = 0;
  var lines = data.split('\r');
  lines.forEach(function (line) {
    var wordToAdd = line.split(" ")[0].split("/")[0];
    var wordToAddPron = line.split(" ")[1];
    // Don't bother adding words with spaces in them
    if (wordToAdd.indexOf('_') === -1) {
      breakBySyllables(wordToAddPron);
      // addWord(wordToAdd, wordToAddPron);
      // count++;
      // if (count % 500 === 0) {
      //   console.log(wordToAdd);
      // }

      Word.findOne({word: wordToAdd}, function (err, word) {
        if (err) {
          console.log(err);
        }
        if (!word) {
          count++;
          if (count % 500 === 0) {
            console.log(wordToAdd);
          }
          addWord(wordToAdd, wordToAddPron, count);
        }
      });

    }
  });
};

var count = 0;
var stream = byline(fs.createReadStream('db/data/mobypron.unc', { encoding: 'utf8' }));
stream.on('data', function(line) {  var wordToAdd = line.split(" ")[0].split("/")[0];
  var wordToAddPron = line.split(" ")[1];
  // Don't bother adding words with spaces in them
  if (wordToAdd.indexOf('_') === -1) {
    breakBySyllables(wordToAddPron);
    count++;
    if (count % 500 === 0) {
      console.log('calling addWord on: ' + wordToAdd);
    }
    addWord(wordToAdd, wordToAddPron);
  }
});
// fs.readFile('db/data/mobypron.unc', 'utf8', function (err, data) {
//   if (err) throw err;
//   storeWords(data);
// });

