
'use strict';

angular.module('sms.directives').directive('renderCenters', [function() {
      return {
        restrict: 'E',
        scope: {
          item: '=',
          header: '='
        },
        templateUrl: 'components/directives/renderCenters.html'
      };
    }]
);
