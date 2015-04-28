'use strict';

var express = require('express');
var syllableCount = require('./helpers/syllableCount');
var rhymeCheck = require('./helpers/rhymeCheck');

var app = express();

//var router = express.Router();

app.use(express.static(__dirname + '/../app'));

app.use('/api/count', function (req, res, next) {
  var line = req.query.line;
  syllableCount(line, function (result) {
    res.send(result);
  });
});

app.use('/api/rhyme', function (req, res, next) {
  var word1 = req.query.word1;
  var word2 = req.query.word2;
  rhymeCheck(word1, word2, function (result) {
    res.send(result);
  });
});



module.exports = app;