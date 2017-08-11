'use strict';

angular.module('sms.ecereturn')
.factory('WaitTimeService', function EcereturnService($location, $rootScope, $http, $q, Auth) {

	var _version = 1;
	var _url = '/api/v' + _version;

	var _getWaitTimeData = function(facility_id) {
	
		Auth.updateSessionTimeout();
		var deferred = $q.defer();

		$http.get(_url+'/waitstatus?facility='+encodeURI(facility_id)).success(function(data) {
			
			deferred.resolve(data);
		}).error(function(error) {
			
			deferred.reject(error);
		});
		return deferred.promise;
	}

	return {
        GetWaitTimeData:_getWaitTimeData,
	}
});
