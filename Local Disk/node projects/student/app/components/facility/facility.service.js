'use strict';

angular.module("sms.facility")
  .factory('facilityService', function (formlyAdapter, $q, Auth) {

    var _facilities = null;
    var _alerts = null;
    var _licenseconfiguration=null;
    return {

      getFacilities: function(refresh) {
        var d = $q.defer();
        if ( refresh || !_facilities) {
          formlyAdapter.getList('facility', {populate: 'Company,Region'}).then(function (data) {
            _facilities = data;
            d.resolve(data);
          }, function(err) {
            d.reject(err);
          });
        } else {
          d.resolve(_facilities);
        }
        return d.promise;
      },

      getCurrentCenter: function() {
        var user = Auth.getCurrentUser();
        return this.getFacilities(false).then(function(_facilities) {

          if (!user.facility && !user.role || (user.role.index == 0 && !user.facility) ) return _facilities[0];

          return _.filter(_facilities, function (c) {
            return c._id == (user.facility._id ? user.facility._id : user.facility)
          })[0];
        });
      },
      getLicensing: function() {
        var user = Auth.getCurrentUser();
        var d = $q.defer();
        if (!_licenseconfiguration) {
          var fac= ( user.facility && user.facility._id )  ? user.facility._id : user.facility;
          formlyAdapter.getList('licenseconfiguration', {query:JSON.stringify({facility:fac})}).then(function (data) {
            _licenseconfiguration = data;
            d.resolve(data);
          }, function(err) {
            d.reject(err);
          });
        } else {
          d.resolve(_licenseconfiguration);
        }
        return d.promise;
      },

      getLicensingConfiguration:function(){
        return (_licenseconfiguration && _licenseconfiguration.length) ? _licenseconfiguration[0].LicensingConfiguration : null;
      }

    }
  });
