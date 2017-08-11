'use strict';

angular.module('sms.forms')
    .factory('formlyapi', function($location, $rootScope, $http, $q, Auth) {

        var _version = 1;
        var _url = '/api/v' + _version;

        var _getModels = function (force) {
          Auth.updateSessionTimeout();
            var deferred = $q.defer();
            $http.get(_url + '/getModelList').then(function (resp) {
                deferred.resolve(resp.data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

      var _lookupCache = {};
      var _promiseLookupCache = {};

      var cacheHit = function(t) {
        return _lookupCache[t] || _promiseLookupCache[t];
      };

      var cacheLookup = function(t) {
          var d = $q.defer();
          if ( _lookupCache[t] ) {
            d.resolve(_lookupCache[t]);
            //console.log("Fetching from cache:"+t, _lookupCache[t]);
          } else {
            d.resolve($q.all(_promiseLookupCache[t]));
            //console.log("Fetching from promiseCache:"+t, _promiseLookupCache[t]);
          }

          return d.promise;
      };


      var addToCache = function(list, t) {
        if ( list.then ) {
          var oldPromiseCache = _promiseLookupCache[t] || [];
          _promiseLookupCache[t] = oldPromiseCache.concat(list);
          //console.log("Add to promisecache:"+t);
        } else {
          var oldCache = _lookupCache[t] || [];
          oldCache = oldCache.concat(list);
          _lookupCache[t] = [];
          var map = {};
          _.each(oldCache, function(c) {
            if (c._id && !map[c._id]) {
              map[c._id] = true;
              _lookupCache[t].push(c);
            }
          });
          //console.log("Add to real cache:"+t, list);
        }

      };

      var _getObjectsFromPost = function(type, id, useCache, skipCache) {
    
        Auth.updateSessionTimeout();
          if ( !id && useCache && !skipCache && cacheHit(type) ) {
            
            return cacheLookup(type)
          } else {
              var deferred = $q.defer();
              var fragment = type;
              var data={};
              if (id) data = id;
              $http.post('/list/' + fragment,data).then(function (d) {
                  if ( !skipCache )
                    addToCache((id && !Array.isArray(d.data) ? [d.data] : d.data), type);
                  deferred.resolve(d.data);
              }, function (err) {
                  deferred.reject(err);
              })
              if ( !skipCache ) addToCache(deferred.promise, type);
              return deferred.promise;
          }
        }

      var _getObjects = function(type, id, useCache, skipCache) {
        Auth.updateSessionTimeout();
          if ( !id && useCache && !skipCache && cacheHit(type) ) {
            
            return cacheLookup(type)
          } else {
              var deferred = $q.defer();
              var fragment = type;
              if (id) fragment = fragment + "/" + id;
              $http.get(_url + '/' + fragment).then(function (d) {
                  if ( !skipCache )
                    addToCache((id && !Array.isArray(d.data) ? [d.data] : d.data), type);
                  deferred.resolve(d.data);
              }, function (err) {
                  deferred.reject(err);
              })
              if ( !skipCache ) addToCache(deferred.promise, type);
              return deferred.promise;
          }
        }

      var _addObjectToCache = function(type, obj, idx) {
        Auth.updateSessionTimeout();
        if ( _lookupCache[type] ) {
          idx = idx || 0;
          var count = idx > 0 ? 1 : 0;
          _lookupCache[type].splice(idx,count,obj);
        }
      }

        var _saveObject = function(type, obj, id) {
            Auth.updateSessionTimeout();
            var deferred = $q.defer();
            var fragment = type;
            if ( id ) fragment = fragment + "/" + id;
            $http.post(_url + '/' + fragment, obj).then(function(resp) {
                deferred.resolve(resp);
            }, function(err) {
                deferred.reject(err.data);
            });
            return deferred.promise;

        }

        var _deleteObject = function(type, id) {
            Auth.updateSessionTimeout();
            var deferred = $q.defer();
            var fragment = type;
            if ( id ) fragment = fragment + "/" + id;
            $http.delete(_url + '/' + fragment).then(function(resp) {
                deferred.resolve(resp);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;

        }

        var _cacheLookup = function(type, id) {
          Auth.updateSessionTimeout();
          var o = null;
          var d = _lookupCache[type];
          if ( d && d.length ) {
            _.each(d, function(obj) { if ( id == obj._id ) o = obj; })
          }
          return o;
        }

        var _getObject = function(type, id, checkCache) {
          Auth.updateSessionTimeout();
          if ( checkCache ) {
            return _getObjects(type, null, true, true).then(function(d) {
              var o = d;
              if ( d && d.length ) {
                _.each(d, function(obj) { if ( id == obj._id ) o = obj; })
              }
              return o;
            });
          } else {
            return _getObjects(type, id, false, true).then(function(d) {
              if (d.length) return d[0];
              else return d;
            })
          }
        }

        function encodeParams(query) {
            var str = "";
            for (var k in query ) {
                str += k + "=" + encodeURI(query[k]) + "&";
            }
            return str;
        }

        var _query = function(type, query, useCache) {
            var qStr = "?" + encodeParams(query);
            return _getObjects(type, qStr, useCache);
        }

        var getDailyFch=function(date) {
          Auth.updateSessionTimeout();
            var deferred = $q.defer();

            $http.get(_url+'/dailyfch?date='+encodeURI(date)).success(function(data) {
              deferred.resolve(data);
            }).error(function(error) {
              deferred.reject(error);
            });
            return deferred.promise;
      }
      var syncDailyFch=function(date) {
          Auth.updateSessionTimeout();
            var deferred = $q.defer();

            $http.post(_url+'/generatedailyfch?date='+encodeURI(date)).success(function(data) {
              deferred.resolve(data);
            }).error(function(error) {
              deferred.reject(error);
            });
            return deferred.promise;
      }
      var getMonthlyFch=function(month) {
        Auth.updateSessionTimeout();
            var deferred = $q.defer();

            $http.get(_url+'/monthlyfch?month='+encodeURI(month)).success(function(data) {
              deferred.resolve(data);
            }).error(function(error) {
              deferred.reject(error);
            });
            return deferred.promise;
      }
      var getWeeklyFch=function(date) {
        Auth.updateSessionTimeout();
            var deferred = $q.defer();

            $http.get(_url+'/weeklyfch?date='+encodeURI(date)).success(function(data) {
              deferred.resolve(data);
            }).error(function(error) {
              deferred.reject(error);
            });
            return deferred.promise;
      }

      var uploadCSVFile=function(fileData,model){
           var deferred = $q.defer();
           _.each(fileData,function(obj){
                _saveObject(model,obj).then(function(d){
                   deferred.resolve(d);
                },function(err){
                   deferred.reject(err);
                   return deferred.promise;
                });
              });
            
            return deferred.promise;
                        
          
    }

        return {
            cacheLookup: _cacheLookup,
            getModels: _getModels,
            getList: _getObjects,
            saveObject: _saveObject,
            deleteObject: _deleteObject,
            getObject: _getObject,
            query: _query,
            addObjectToCache: _addObjectToCache,
            getDailyFch:getDailyFch,
            getMonthlyFch:getMonthlyFch,
            getWeeklyFch:getWeeklyFch,
            uploadCSVFile:uploadCSVFile,
            syncDailyFch:syncDailyFch,
            getObjectsFromPost:_getObjectsFromPost,

        }

    });
