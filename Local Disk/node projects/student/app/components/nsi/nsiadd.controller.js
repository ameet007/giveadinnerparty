'use strict';

angular.module('sms.nsi')
  .controller('NsiAddCtrl', function ($scope, NSI, data, $modalInstance, $timeout, $util) {

    var _overrideCode = null;

    function init() {
      $scope.loading = true;

      NSI.addNSN(data).then(function (d) {
        $scope.loading = false;
        if(d.error && d.error.MessageList && d.error.MessageList.length){
          if(d.error.DefiniteMatchNSN){
              $modalInstance.close({nsn:d.error.DefiniteMatchNSN, created: new Date()});
          }else{
            _overrideCode = d.error.OverrideCode;
            $scope.needsOverride = true;  
          }
          
        }else if (d.OverrideCode) {
          _overrideCode = d.OverrideCode;
          $scope.needsOverride = true;
        } else {
          $modalInstance.close({nsn:d.NSN, created: new Date()});
        }

      });
    }

    $timeout(init);

    $scope.select = function(row) {
      $modalInstance.close({nsn: Number(row.NSN), created: row.created_date});
    };

    $scope.override = function() {
      $scope.loading = true;
      NSI.addNSN(_.extend({override: _overrideCode}, data)).then(function (d) {
        $scope.loading = false;
        if(d.error && d.error.DefiniteMatchNSN){
          $modalInstance.close({nsn: d.error.DefiniteMatchNSN, created: new Date()});
        }else if(d.error && d.error.OverrideCode){
          $modalInstance.close({nsn: d.error.OverrideCode, created: new Date()});
        }
        
        $modalInstance.close({nsn: d.NSN, created: new Date()});
      });
    }

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };
  });
