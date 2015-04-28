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

    $scope.feedbackEmpty = true;

    $scope.sonnetFeedback1 = "";
    $scope.sonnetFeedback2 = "";

    $scope.sonnetData = [];
    $scope.lineModels = {};
    $scope.syllableLabels = {};
    $scope.rhymeLabels = {};

    $scope.initSonnet = function () {
      for (var i = 1; i <= 14; i++) {
        var curLine = {};
        curLine.lineNumber = i;
        if (i === 13) {
          curLine.rhymeMatch = 14;
        } else if (i === 14) {
          curLine.rhymeMatch = 13;
        } else if (i % 4 === 0 || i % 4 === 3) {
          curLine.rhymeMatch = i-2;
        } else if (i % 4 === 1 || i % 4 === 2) {
          curLine.rhymeMatch = i+2;
        }
        curLine.feedback = '';
        curLine.syllables = '?';
        $scope.rhymeLabels[i] = 'label-default';
        $scope.syllableLabels[i] = 'label-default';
        $scope.sonnetData.push(curLine);
      }
      $scope.lineModels[1] = 'i like to eat a breakfast that has toast';
      $scope.lineModels[2] = 'French is best but really all are yummy';
      $scope.lineModels[3] = 'i would not share it even with a ghost';
      $scope.lineModels[4] = 'would not even give it to a mummy';
    };

    $scope.clearFeedback = function () {
      if (!$scope.feedbackEmpty) {
        for (var i = 1; i <= $scope.sonnetData.length; i++) {
          $scope.sonnetData[i-1].feedback = '';
          $scope.sonnetData[i-1].syllables = '?';
          $scope.syllableLabels[i] = 'label-default';
          $scope.rhymeLabels[i] = 'label-default';
        }
      }
    };

    $scope.checkSyllables = function () {
      $scope.clearFeedback();

      for (var i = 1; i <= $scope.sonnetData.length; i++) {
        // don't check empty lines
        (function(line){
          var text = $scope.lineModels[line];
          if (text) {
            Syllables.checkLine(text, 10)
            .then(function (data) {
              $scope.sonnetData[line-1].feedback += (" ..." + data.message);
              $scope.sonnetData[line-1].syllables = data.count;
              if (data.count === 10) {
                $scope.syllableLabels[line] = 'label-success';
              } else {
                $scope.syllableLabels[line] = 'label-warning';
              }
            });
          }
        })(i);
      }

      $scope.feedbackEmpty = false;
    };

    $scope.checkRhymes = function () {
      $scope.clearFeedback();

      var doubles = [3,4,7,8,11,12,14];

      for (var i = 1; i <= $scope.sonnetData.length; i++) {
        
        (function(line){
          // get text of line
          var text1 = $scope.lineModels[line];
          var lineToMatch = $scope.sonnetData[line-1].rhymeMatch;
          var text2 = $scope.lineModels[lineToMatch];
          console.log(text1, text2);
          // don't check empty lines or lines whose pair has already been checked
          if (text1 && text2 && doubles.indexOf(line) === -1) {
            Rhyme.checkLines(text1, text2)
            .then(function (data) {
              if (data.match) {
                $scope.rhymeLabels[line] = 'label-success';
                $scope.rhymeLabels[lineToMatch] = 'label-success';
              } else if (data.notFound.length > 0) {
                $scope.rhymeLabels[line] = 'label-warning';
                $scope.rhymeLabels[lineToMatch] = 'label-warning';
                $scope.sonnetData[line-1].feedback += (' ... Cannot check rhyme, unknown word(s): "' + data.notFound.join(", ") + '"');
                $scope.sonnetData[lineToMatch-1].feedback += (' ... Cannot check rhyme, unknown word(s): "' + data.notFound.join(", ") + '"');
              } else {
                $scope.rhymeLabels[line] = 'label-danger';
                $scope.rhymeLabels[lineToMatch] = 'label-danger';
              }
            });

          }
        })(i);

        $scope.feedbackEmpty = false;
      }
    };

    $scope.checkAll = function () {
      $scope.clearFeedback();

      $scope.checkSyllables();
      $scope.checkRhymes();

      $scope.feedbackEmpty = false;
    };

    $scope.initSonnet();
  })

  .directive('sonnetLine', function () {
    return {
      restrict: 'E',
      templateUrl: '../views/sonnetLine.html'
    };
  });