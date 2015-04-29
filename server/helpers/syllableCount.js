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
      var option3 = curWord;
      var option4 = curWord;
      var capSwitch = (curWord[0].toLowerCase() === curWord[0]) ? curWord[0].toUpperCase()+curWord.slice(1) : curWord[0].toLowerCase()+curWord.slice(1);
      var capOption1 = capSwitch;
      var capOption2 = capSwitch;
      var capOption3 = capSwitch;
      var capOption4 = capSwitch;
      if (curWord.slice(-1) === 's') {
        option1 = curWord.slice(0,-1);
      }
      if (curWord.slice(-2) === 'es') {
        option2 = curWord.slice(0,-2);
      }
      if (curWord.slice(-2) === 'ed') {
        option3 = curWord.slice(0,-2);
      }
      if (curWord.slice(-1) === 'd') {
        option4 = curWord.slice(0,-1);
      }
      if (capSwitch.slice(-1) === 's') {
        capOption1 = capSwitch.slice(0,-1);
      }
      if (capSwitch.slice(-2) === 'es') {
        capOption2 = capSwitch.slice(0,-2);
      }
      if (capSwitch.slice(-2) === 'ed') {
        capOption3 = capSwitch.slice(0,-2);
      }
      if (capSwitch.slice(-1) === 'd') {
        capOption4 = capSwitch.slice(0,-1);
      }
      Word.findOne({ $or: [ { word: curWord }, { word: option1 }, { word: option2 }, { word: option3 }, { word: option4 }, {word: capSwitch},
        {word: capOption1}, {word: capOption2}, {word: capOption3}, {word: capOption4}] }, function (err, word) {
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
          if (word === option2) {
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