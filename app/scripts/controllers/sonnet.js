'use strict';

/**
 * @ngdoc function
 * @name poetryPalApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the poetryPalApp
 */
angular.module('poetryPalApp')

  .controller('SonnetCtrl', function ($scope, Syllables, Rhyme) {
    $scope.sonnetLine1 = 'i like to eat a breakfast that has toast';
    $scope.sonnetLine2 = 'all kinds are good but i like french the most';
    $scope.sonnetFeedback1 = "";
    $scope.sonnetFeedback2 = "";

    $scope.checkSyllables = function () {
      Syllables.checkLine($scope.sonnetLine1, 10)
      .then(function (data) {
        $scope.sonnetFeedback1 = data.message;
      });
      Syllables.checkLine($scope.sonnetLine2, 10)
      .then(function (data) {
        $scope.sonnetFeedback2 = data.message;
      });
    };

    $scope.checkRhymes = function () {
      Rhyme.checkLines($scope.sonnetLine1, $scope.sonnetLine2)
      .then(function (data) {
        if (data.match) {
          $scope.sonnetFeedback1 = ' ... Rhymes: OK';
          $scope.sonnetFeedback2 = ' ... Rhymes: OK';
        } else if (data.notFound.length > 0) {
          $scope.sonnetFeedback1 = (' ... Cannot check rhyme, unknown word(s): "' + data.notFound.join(", ") + '"');
          $scope.sonnetFeedback2 = (' ... Cannot check rhyme, unknown word(s): "' + data.notFound.join(", ") + '"');
        }
      });
    };
  });