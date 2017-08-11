'use strict';

angular.module('fngApp')
  .controller('NavbarCtrl', function ($scope, $window, $location, Auth, formlyAdapter, $timeout) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/#/main'
    }];


    $scope.prettyName = formlyAdapter.prettyName;

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $window.location.href('/login');
      //$location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    formlyAdapter.getModels().then(function (data) {
      $timeout(function () {
        $scope.models = _.filter(data, function (s) {
          return s.hasAccess;
        });
      });
    });


  });
