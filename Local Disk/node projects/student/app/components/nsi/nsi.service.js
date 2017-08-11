'use strict';

angular.module('sms.nsi', [])
  .factory('NSI', function NSI($location, $rootScope, $http, $q) {

    function op(req, callback, url) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();
      var data = req || {};

      $http.post(url, data).
        success(function(data) {
          deferred.resolve(data);
        }).
        error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;

    }

    return {

      login: function(callback) {
        return op(null, callback, '/nsi/login');
      },

      logout: function(callback) {
        return op(null, callback, '/nsi/logout');
      },

      search: function(data, callback) {
        return op(data, callback, '/nsi/search');
      },

      selectNSI: function(data, callback) {
        return op(data, callback, '/nsi/select');
      },

      addNSN: function(data, callback) {
        return op(data, callback, '/nsi/add');
      },

      update: function(data, callback) {
        return op(data, callback, '/nsi/update');
      }

    };
  });
