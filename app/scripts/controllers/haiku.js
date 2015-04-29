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

    $scope.feedbackEmpty = true;

    $scope.haikuData = [];
    $scope.lineModels = {};
    $scope.syllableLabels = {};
    $scope.rhymeLabels = {};

    $scope.initHaiku = function () {
      for (var i = 1; i <= 3; i++) {
        var curLine = {};
        curLine.lineNumber = i;
        if (i === 1 || i === 3) {
          curLine.expectedCount = 5;
        }
        if (i === 2) {
          curLine.expectedCount = 7;
        }
        curLine.feedback = '';
        curLine.syllables = '?';
        $scope.syllableLabels[i] = 'label-default';
        $scope.haikuData.push(curLine);
      }

      $scope.lineModels[1] = 'i like maple syrup';
      $scope.lineModels[2] = 'both on pancakes and on toast';
      $scope.lineModels[3] = 'but not on my eggs';
    };

    $scope.clearFeedback = function () {
      if (!$scope.feedbackEmpty) {
        for (var i = 1; i <= $scope.haikuData.length; i++) {
          $scope.haikuData[i-1].feedback = '';
          $scope.haikuData[i-1].syllables = '?';
          $scope.syllableLabels[i] = 'label-default';
        }
      }
    };

    $scope.checkSyllables = function () {
      $scope.clearFeedback();

      for (var i = 1; i <= $scope.haikuData.length; i++) {
        // don't check empty lines
        (function(line){
          var text = $scope.lineModels[line];
          if (text) {
            Syllables.checkLine(text, $scope.haikuData[line-1].expectedCount)
            .then(function (data) {
              if (data.notFound.length > 0) {
                $scope.haikuData[line-1].feedback += ("Cannot check syllables, unknown word(s): " + data.notFound.join(', '));
                $scope.syllableLabels[line] = 'label-warning';
              } else {
                $scope.haikuData[line-1].syllables = data.count;
                if (data.count === $scope.haikuData[line-1].expectedCount) {
                  $scope.syllableLabels[line] = 'label-success';
                } else {
                  $scope.syllableLabels[line] = 'label-danger';
                }
              }
            });
          }
        })(i);
      }

      $scope.feedbackEmpty = false;
    };
    // $scope.checkSyllables = function () {
    //   Syllables.checkLine($scope.haikuLine1, 5)
    //   .then(function (data) {
    //     $scope.haikuFeedback1 = data.message;
    //   });
    //   Syllables.checkLine($scope.haikuLine2, 7)
    //   .then(function (data) {
    //     $scope.haikuFeedback2 = data.message;
    //   });
    //   Syllables.checkLine($scope.haikuLine3, 5)
    //   .then(function (data) {
    //     $scope.haikuFeedback3 = data.message;
    //   });
    // };
    $scope.initHaiku();
  })

  .directive('haikuLine', function () {
    return {
      restrict: 'E',
      templateUrl: '../views/haikuLine.html'
    };
  });