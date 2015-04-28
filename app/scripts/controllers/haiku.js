'use strict';

/**
 * @ngdoc function
 * @name poetryPalApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poetryPalApp
 */
angular.module('poetryPalApp')

  .controller('HaikuCtrl', function ($scope, Syllables) {
    $scope.syllablesCorrect = false;
    $scope.haikuLine1 = 'i like maple syrup';
    $scope.haikuLine2 = 'on pancakes and on toast';
    $scope.haikuLine3 = 'but not on my eggs';
    $scope.checkSyllables = function () {
      Syllables.checkLine($scope.haikuLine1, 5)
      .then(function (data) {
        $scope.haikuFeedback1 = data.message;
      });
      Syllables.checkLine($scope.haikuLine2, 7)
      .then(function (data) {
        $scope.haikuFeedback2 = data.message;
      });
      Syllables.checkLine($scope.haikuLine3, 5)
      .then(function (data) {
        $scope.haikuFeedback3 = data.message;
      });
    };
  });

