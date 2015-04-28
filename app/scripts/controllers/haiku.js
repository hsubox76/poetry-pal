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
      if (HaikuSyllables.checkLine($scope.haikuLine1, 5) &&
      HaikuSyllables.checkLine($scope.haikuLine2, 7) &&
      HaikuSyllables.checkLine($scope.haikuLine3, 5)) {
        console.log('checks out');
        $scope.syllablesCorrect = true;
        $scope.message = 'Everything checks out!';
      }
    };
  })

  .factory('HaikuSyllables', function () {
    var checkLine = function (line, expectedCount) {
      // count letters, easy check to see everything else is working
      if (line.length === expectedCount) {
        return true;
      }
      return false;
    };

    return {
      checkLine: checkLine
    };
  });
