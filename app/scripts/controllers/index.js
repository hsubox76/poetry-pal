'use strict';

/**
 * @ngdoc function
 * @name poetryPalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the poetryPalApp
 */
angular.module('poetryPalApp')
  .controller('HeaderController', function ($scope, $location) {
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
  });