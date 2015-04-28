'use strict';

angular.module('poetryPalApp')

  .factory('Syllables', function ($http) {
    var checkLine = function (line, expectedCount) {
      return $http({
        url: '/api/count',
        method: 'GET',
        params: {line: line, expectedCount: expectedCount}
      })
      .then(function (res) {
        if (res.data.count === expectedCount && res.data.notFound.length === 0) {
          return { message: 'Syllables OK!' };
        }
        else if (res.data.count > expectedCount) {
          return { message: "Too many syllables. (" + res.data.count + "/" + expectedCount +")", count: res.data.count };
        } else {
          if (res.data.notFound.length > 0) {
            var notFoundString = res.data.notFound.join(", ");
            return { message: "Syllable count unknown - could not find words: " + notFoundString, count: res.data.count }
          } else {
            return { message: "Too few syllables. (" + res.data.count + "/" + expectedCount +")", count: res.data.count };
          }
        }
      });
    };

    return {
      checkLine: checkLine
    };
  })

  .factory('Rhyme', function($http) {
    var checkLines = function (line1, line2) {
      var arr1 = line1.split(' ');
      var arr2 = line2.split(' ');
      var word1 = arr1[arr1.length-1];
      var word2 = arr2[arr2.length-1];
      return $http({
        url: '/api/rhyme',
        method: 'GET',
        params: {word1: word1, word2: word2}
      })
      .then(function (res) {
        console.log(word1, word2);
        console.log(res);
        return res.data;
      });
    };

    return {
      checkLines: checkLines
    };
  });