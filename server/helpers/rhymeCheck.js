'use strict';

var Word = require('../../db/db').Word;
var phon = require("../../db/phonemeDict");


var rhymeCompare = function(word1, word2) {
  console.log(word1.word, word2.word);
  // just compare last syllables, simplest case, expand later
  var syl1 = word1.syllables[word1.syllables.length - 1].content;
  var syl2 = word2.syllables[word2.syllables.length - 1].content;
  var phonemes1 = syl1.split('|');
  var phonemes2 = syl2.split('|');
  var rhymePart1;
  var rhymePart2;
  for (var i = 0; i < phonemes1.length; i++) {
    if (phonemes1[i] in phon.VOWELS) {
      rhymePart1 = phonemes1.slice(i).join('|');
      break;
    }
  }
  for (i = 0; i < phonemes2.length; i++) {
    if (phonemes2[i] in phon.VOWELS) {
      rhymePart2 = phonemes2.slice(i).join('|');
      break;
    }
  }
  if (rhymePart1 === rhymePart2) {
    return true;
  }
  return false;
};

var rhymeCheck = function (word1, word2, cb) {
  Word.findOne({ word: word1 }, function (err, word1Found) {
    if (err) {
      throw err;
    }
    var returnObj = {};
    returnObj.notFound = [];
    if (!word1Found) {
      returnObj.notFound.push(word1);
      cb(returnObj);
    } else {
      Word.findOne({ word: word2 }, function (err, word2Found) {
        if (err) {
          throw err;
        }
        var returnObj = {};
        returnObj.notFound = [];
        if (!word2Found) {
          returnObj.notFound.push(word2);
          cb(returnObj);
        } else {
          cb(rhymeCompare(word1Found, word2Found));
        }
      });
    }
  });

};

module.exports = rhymeCheck;