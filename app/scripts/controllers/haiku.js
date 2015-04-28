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
    $scope.checkSyllables = function () {
      HaikuSyllables.checkLine($scope.haikuLine1, 5)
      .then(function () {
        console.log('checks out');
        $scope.syllablesCorrect = true;
        $scope.message = 'Everything checks out!';
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
        if (res.data.count === expectedCount) {
          return true;
        }
        return false;
      });
    };

    return {
      checkLine: checkLine
    };
  });
