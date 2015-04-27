'use strict';

/**
 * @ngdoc function
 * @name poetryPalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the poetryPalApp
 */
angular.module('poetryPalApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
