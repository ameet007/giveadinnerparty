'use strict';

angular.module('fngApp')
  .controller('AddNewRecordCtrl', function ($scope, type) {
    $scope.showNav = false;
    $scope.record = {};
    $scope.type = type;
  });
