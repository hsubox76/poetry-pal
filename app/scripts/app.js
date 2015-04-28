'use strict';

/**
 * @ngdoc overview
 * @name poetryPalApp
 * @description
 * # poetryPalApp
 *
 * Main module of the application.
 */
angular
  .module('poetryPalApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/haiku', {
        templateUrl: 'views/haiku.html',
        controller: 'HaikuCtrl'
      })
      .when('/sonnet', {
        templateUrl: 'views/sonnet.html',
        controller: 'SonnetCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
