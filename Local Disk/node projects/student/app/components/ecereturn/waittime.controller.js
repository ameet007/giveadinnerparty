'use strict';

angular.module('sms.ecereturn')

.controller('WaitTimeCtrl', function EcereturnHistoryCtrl(
	$rootScope,$scope, $timeout, popup, dialog, $util, formlyAdapter, $state,
	fchUtils,$location, $q, Auth, moment, facilityService, ELI, growlService,cfpLoadingBar, 
	EcereturnService, formlyData, $modal, $log, $document, $stateParams,WaitTimeService
) {

  var that = this;
  that.loading = false;
  that.waittimeData = [];
  that.facility = Auth.getCurrentUser().facility;

  that.initPage = function (){

    WaitTimeService.GetWaitTimeData(that.facility._id).then(function (data){

      var params = {
        query: JSON.stringify({
          Facility: that.facility._id,
        }),
        populate:'AgeCategory',
        // sort:'+AgeCategory.sortOrder'
      }
      return formlyAdapter.getList('childrenwaitingstatusreport', params);
    }).then(function (wait_time_data){
        
      that.waittimeData = _.sortBy(wait_time_data, 'AgeCategory.sortOrder');
    });
  }

  $timeout(function() {

    that.initPage();
  }, 500);
});