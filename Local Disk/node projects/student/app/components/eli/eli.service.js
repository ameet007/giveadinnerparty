'use strict';

angular.module('sms.eli', ['angularMoment'])
  .factory('ELI', function NSI($location, $rootScope, $http, $q) {

    function op(req, type, url) {
      type = type || "add";
      var deferred = $q.defer();
      var data = req || {};

      $http.post(url + "/" + type, data).
        success(function(data) {
          if ( data.error ) deferred.reject(data.error);
          else deferred.resolve(data);
        }).
        error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;

    }

    return {


      event: function(type) {
        return op(null, type, '/eli/event');
      },

      identity: function(data, type) {
        return op(data, type, '/eli/identity');
      },

      demographics: function(data, type) {
        return op(data, type, '/eli/demographics');
      },

      enrolment: function(data, type) {
        return op(data, type, '/eli/enrolment');
      },

      twentyhours: function(data, type) {
        return op(data, type, '/eli/twentyhours');
      },

      closure: function(data, type) {
        return op(data, type, '/eli/closure');
      },

      schedule: function(data, type) {
        return op(data, type, '/eli/schedule');
      },

      confirmation: function(data, type) {
        return op(data, type, '/eli/confirmation');
      },

      attendance: function(data, type) {
        return op(data, type, '/eli/attendance');
      },

      rs7: function(data, type) {
        return op(data, type, '/eli/rs7');
      },
      ecereturn: function(data, type) {
        return op(data, type, '/eli/ecereturn');
      },
      rs7Error: function(data) {
        return op(data, 'error', '/eli/rs7');
      }

    };
  });
