'use strict';

var Word = require('../../db/db').Word;

var syllableCount = function (line, cb) {
  var words = line.split(' ');
  var result = {};
  var wordsChecked = 0;
  result.notFound = [];
  result.count = 0;
  for (var i = 0; i < words.length; i++) {
    (function (curWord) {
      var option1 = curWord;
      var option2 = curWord;
      if (curWord.slice(-1) === 's') {
        option1 = curWord.slice(0,-1);
      }
      if (curWord.slice(-2) === 'es') {
        option2 = curWord.slice(0,-2);
      }
      Word.findOne({ $or: [ { word: curWord }, { word: option1 }, { word: option2 } ] }, function (err, word) {
      //Word.findOne({word: new RegExp('^'+ curWord +'(s|es)?')}, function (err, word) {
        if (err) {
          console.log(err);
        }
        if (!word) {
          console.log('Word not found: ' + curWord);
          result.notFound.push(curWord);
        } else {
          console.log(word);
          result.count += word.syllables.length;
          if (word !== curWord && curWord.slice(-2) === 'es') {
            result.count++;
          }
        }
        // if this is the last word checked
        wordsChecked++;
        if (wordsChecked === words.length) {
          cb(result);
        }
      });
    }(words[i]));
  }
};

module.exports = syllableCount;