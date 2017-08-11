'use strict';

angular.module('sms.forms')
  .factory('formlyAdapter', function api($location, $rootScope, $http, $q, $timeout, $resource, $util, formlyUtils, formlyapi) {

    //$rootScope.$on("loginSuccess", init);
    $rootScope.$on("logoutSuccess", init);

    var _cache, _version, _url, _cachedModels;


    function init() {
      _cache = {};
      _version = 1;
      _url = '/api/v' + _version;
      _cachedModels = null;
    }

    init();

    var modelCacheLookup = function(name) {
      return _cache[name];
    }

    var _getModels = function (force) {
      var deferred = $q.defer();

      if (!force && _cachedModels) {
        deferred.resolve(_cachedModels);
        return deferred.promise;
      }

      _cache = {};

      formlyapi.getModels().then(function (data) {
        var modelList = [];
        var modelMap = {};
        _.each(data, function (d) {
          modelMap[d.name] = d
        });

        _.each(data, function (obj) {
          var model = makeModel(obj, modelMap);
          _cache[obj.name] = model;
          modelList.push(model);
        });
        modelList = _.sortBy(modelList, 'name');
        _cachedModels = modelList;


        deferred.resolve(modelList);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    function makeModel(s, modelMap) {
      var obj = {
        name: s.name,
        schema: s.schema,
        formly: makeFormly(s, modelMap),
        hasAccess: s.hasAccess,
        form: s.form
      };
      obj.tabs = buildTabs(obj.formly);
      return obj;
    }

    function buildTabs(formly) {
      var tabArray = [];

      var tabs = {};
      _.each(formly, function (f) {
        tabs[f.templateOptions.tab] = tabs[f.templateOptions.tab] || [];
        tabs[f.templateOptions.tab].push(f);
      });

      if (_.isEmpty(tabs)) return null;

      return tabs;
    }

    function makeFormly(schema, modelMap) {
      return formlyUtils.convertFromMongoose(schema, modelMap);
    }

    function flatten(obj, type) {
      return formlyUtils.flattenForMongoose(obj, _cache[type].schema.tree, _cache[type].schema.nested)
    }

    function _saveObject(type, obj, id) {
     
      return _getModels(false).then(function() {
        return formlyapi.saveObject(type, flatten(obj, type), id)
      });
    } 

    function _getListFromPost(type, params, useCache) {
      return _getModels(false).then(function() {
        return formlyapi.getObjectsFromPost(type, params, useCache).then(function (d) {
          return _.map(d, function (obj) {
           
            return formlyUtils.inflateFromMongoose(obj, _cache[type].schema, _cache[type].schema.nested);
          });
        });
      });
    }

    function _getList(type, params, useCache) {
      return _getModels(false).then(function() {
        return formlyapi.query(type, params, useCache).then(function (d) {
          return _.map(d, function (obj) {
            return formlyUtils.inflateFromMongoose(obj, _cache[type].schema, _cache[type].schema.nested);
          });
        });
      });
    }

    function _getObject(type, id, isEdit) {
      return _getModels(false).then(function() {
        return formlyapi.getObject(type, id).then(function (d) {
          return formlyUtils.inflateFromMongoose(d, _cache[type].schema, _cache[type].schema.nested, null, isEdit);
        });
      });
    }

    function _getObjects(type, ids) {
      return _query(type, {query:JSON.stringify({_id:{$in:ids}})});
    }

    function _query(type, query) {
      return _getModels(false).then(function() {
        return formlyapi.query(type, query).then(function (d) {
          return _.map(d, function (obj) {
            return formlyUtils.inflateFromMongoose(obj, _cache[type].schema, _cache[type].schema.nested);
          });
        })
      });
    }

     function _deleteObject(type, id,date,description) {
       if(date){
        var rowDate=new Date(date);
       }else{
        var rowDate=new Date();
       }
       if(!description) description='Deleted '+type;
       if(type!='usereventlogs'){
          _saveObject('usereventlogs',{EventDate:rowDate,EventType:'Delete '+type,EventDescription:description}).then(function(u){});
        }
      return _getModels(false).then(function() {
        return formlyapi.deleteObject(type, id);
      });
    };

    function _getCount(type, params, extra) {
      return _getModels(false).then(function() {
        return formlyapi.query(type + "/count", params).then(function (d) {
          return d.count;
        });
      });
    }

    function _buildRecord(record) {
      return {
        surname: $util.convertToPlain(record.OfficialFamilyName),
        forename1: $util.convertToPlain($util.getOfficialGiven1Name(record)),
        forename2: $util.convertToPlain(record.OfficialGiven2Name),
        forename3: $util.convertToPlain(record.OfficialGiven3Name),
        dob: $util.format(record.ChildBirthDate),
        name_dob_verification: $util.getVerification(formlyapi.cacheLookup('identificationsighted', record.ProofOfIdentitySighted).Value),
        gender: $util.formatGender(record.GenderCode),
        id: record._id,
        bdm: record.BDMFlag,
        nsn: record.NationalStudentNumber
      };
    }

    return {
      buildRecord: _buildRecord,
      getModels: _getModels,
      getList: _getList,
      getCount: _getCount,
      saveObject: _saveObject,
      deleteObject: _deleteObject,
      cacheLookup: formlyapi.cacheLookup,
      modelCacheLookup: modelCacheLookup,
      getObject: _getObject,
      getObjects: _getObjects,
      query: _query,
      getListFromPost:_getListFromPost,
      prettyName: function (n, isList) {
        if ( !n ) return '';
        if (isList && n.form && n.form.listName) return n.form.listName;
        if (n.form && n.form.prettyName) return n.form.prettyName;
        else return _.map(n.name.split(" "), function (s) {
          return s.substr(0, 1).toUpperCase() + s.substr(1);
        }).join(" ");
      }
    }

  });
