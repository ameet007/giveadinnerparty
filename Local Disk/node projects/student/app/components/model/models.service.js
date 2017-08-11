'use strict';

angular.module('fngApp')
  .factory('Models', function Auth($http, $q) {
    var capitalize = function(str) {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    return {
      get: function() {
        var d = $q.defer();
        $http.get('/api/models').success(function (data) {
          angular.forEach(data, function(d) {
            d.prettyName = capitalize(d.resourceName);
          })
          d.resolve(data);
        }).error(function (err) {
          d.reject(err);
        });
        return d.promise;
      }
    };
  });
