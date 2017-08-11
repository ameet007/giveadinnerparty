'use strict';


angular.module('sms.rs7', [])

  .controller('RS7Ctrl', function RS7Ctrl($rootScope, $timeout, popup, dialog, $util, formlyAdapter, fchUtils,                                           $location, $q, Auth, moment, facilityService, ELI, growlService) {

    var that = this;



    function init() {
      $timeout(function () {
        formlyAdapter.getModels().then(function () {
        });
      });
    }

    $timeout(init);

  });
