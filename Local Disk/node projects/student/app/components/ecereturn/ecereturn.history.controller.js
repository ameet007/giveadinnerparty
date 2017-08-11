'use strict';

angular.module('sms.ecereturn')

.controller('EcereturnHistoryCtrl', function EcereturnHistoryCtrl(
	$rootScope,$scope, $timeout, popup, dialog, $util, formlyAdapter, $state,
	fchUtils,$location, $q, Auth, moment, facilityService, ELI, growlService,cfpLoadingBar, 
	EcereturnService, formlyData, $modal, $log, $document, $stateParams
) {

  var that = this;
  that.loading = true;

  that.initPage = function (){

    var params = {
      query: JSON.stringify({
        EceReturnYear: '2017',
        facility: that.facility._id,
      }),
      sort: '-EventDateTime'
      // aggregate: JSON.stringify({ $group: { _id: '$EceReturnYear', id: { $max: '$_id' } } })
    }

    formlyAdapter.getList('eliEvent', params).then(function (list_of_returns){

      if(list_of_returns.length) that.history = list_of_returns;
      that.loading = false;
    });
  }

  that.facility =  Auth.getCurrentUser().facility;
  $timeout(function() {

    that.initPage();
  }, 500);

  that.formatDate = function (date){
    return moment(date).format('MMMM DD, YYYY hh:mm:ss a');
  }
});