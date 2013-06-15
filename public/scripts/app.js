'use strict';

// Angular setup
var tooglesApp = angular.module('tooglesApp', ['ngSanitize'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/browse', { templateUrl: 'partials/list', controller: 'ListCtrl' });
    $routeProvider.when('/queue', { templateUrl: 'partials/list', controller: 'QueueCtrl' });
    $routeProvider.when('/browse/:category', { templateUrl: 'partials/list', controller: 'ListCtrl' });
    $routeProvider.when('/search/:query', { templateUrl: 'partials/list', controller: 'ListCtrl' });
    $routeProvider.when('/view/:id', { templateUrl: 'partials/view', controller: 'ViewCtrl' });
    $routeProvider.when('/playlist/:id', { templateUrl: 'partials/view', controller: 'ViewCtrl' });
    $routeProvider.when('/playlist/:id/:start', { templateUrl: 'partials/view', controller: 'ViewCtrl' });
    $routeProvider.when('/user/:username', { templateUrl: 'partials/list', controller: 'ListCtrl' });
    $routeProvider.when('/user/:username/:feed', { templateUrl: 'partials/list', controller: 'ListCtrl' });
    $routeProvider.otherwise({ redirectTo: '/browse' });
    // $locationProvider.html5Mode(true);
  }]);
