'use strict';

/**
 * @ngdoc function
 * @name poetryPalApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poetryPalApp
 */
angular.module('poetryPalApp')

  .controller('HaikuCtrl', function ($scope, HaikuSyllables) {
    $scope.syllablesCorrect = false;
    $scope.haikuLine1 = 'i like maple syrup';
    $scope.haikuLine2 = 'on pancakes and on toast';
    $scope.haikuLine3 = 'but not on my eggs';
    $scope.checkSyllables = function () {
      HaikuSyllables.checkLine($scope.haikuLine1, 5)
      .then(function (data) {
        $scope.haikuFeedback1 = data.message;
      });
      HaikuSyllables.checkLine($scope.haikuLine2, 7)
      .then(function (data) {
        console.log(data.message);
        $scope.haikuFeedback2 = data.message;

      });
      HaikuSyllables.checkLine($scope.haikuLine3, 5)
      .then(function (data) {
        if (data.message === 'OK!') {
        }
        $scope.haikuFeedback3 = data.message;
      });
    };
  })

  .factory('HaikuSyllables', function ($http) {
    var checkLine = function (line, expectedCount) {
      return $http({
        url: '/api/count',
        method: 'GET',
        params: {line: line, expectedCount: expectedCount}
      })
      .then(function (res) {
        console.log(line);
        console.log(res);
        if (res.data.count === expectedCount && res.data.notFound.length === 0) {
          return { message: 'OK!' };
        }
        else if (res.data.count > expectedCount) {
          return { message: "Too many syllables. (" + res.data.count + "/" + expectedCount +")", count: res.data.count };
        } else {
          if (res.data.notFound.length > 0) {
            var notFoundString = res.data.notFound.join(", ");
            return { message: "Count indeterminate - could not find words: " + notFoundString, count: res.data.count }
          } else {
            return { message: "Too few syllables. (" + res.data.count + "/" + expectedCount +")", count: res.data.count };
          }
        }
      });
    };

    return {
      checkLine: checkLine
    };
  });
