'use strict';

angular.module("sms.facility")
  .controller('FacilityCtrl', function ($timeout, $rootScope, messageService, Auth,growlService, formlyAdapter, $state) {

  var that = this;
  $timeout(function () {
    formlyAdapter.getModels().then(function () {
      formlyAdapter.getList("helpguide").then(function(helpguide) {
          that.helpguide = (helpguide && helpguide.length) ? helpguide[0]:{};
          
        });
      formlyAdapter.getList("faq").then(function(faq) {
          that.faq = (faq && faq.length) ? faq[0]:{};
          
        });
      formlyAdapter.getList("logticket").then(function(logticket) {
          that.logticket = (logticket && logticket.length) ? logticket[0]:{};
          
        });
      formlyAdapter.getList('facility', {populate: 'Company,Region'}).then(function (data) {
        var sortedCentreList=_.sortBy(data,function(d){
          return d.name;
        })
        that.rawCenterList = sortedCentreList;
        var regions= parseRegions(sortedCentreList);
        var sortedRegions=_.sortBy(regions,function(r){
          return r.name;
        })
        that.regionList =sortedRegions;

        //formlyAdapter.getList('company').then(function (data) {
          var orgs=parseOrgs(sortedCentreList);
         var sortedOrgsList=_.sortBy(orgs,function(o){
            return o.name;
          })
         
        that.orgList =sortedOrgsList; //, that.regionList);
        //});
      });
    });
   

  }, 300);
  that.cancelHelpGuide=function(){
     $state.go("main.home", {}, {reload:true});
  }
  that.saveHelpGuide=function(){
    
    formlyAdapter.saveObject('helpguide',that.helpguide,that.helpguide._id).then(function(obj){
       growlService.growl('Helpguide record was saved successfully!', 'success');
    })
  }
  that.cancelFaq=function(){
     $state.go("main.home", {}, {reload:true});
  }
  that.saveFaq=function(){
    
    formlyAdapter.saveObject('faq',that.faq,that.faq._id).then(function(obj){
       growlService.growl('Faq record was saved successfully!', 'success');
    })
  }
  that.cancelLogTicket=function(){
     $state.go("main.home", {}, {reload:true});
  }
  that.saveLogTicket=function(){
    
    formlyAdapter.saveObject('logticket',that.logticket,that.logticket._id).then(function(obj){
       growlService.growl('Log Ticket link was saved successfully!', 'success');
    })
  }
  that.selectOrg = function(row) {
      var obj = formlyAdapter.getObject('administrator', Auth.getCurrentUser()._id).then(function(o) {
        o.Company = row._id;
        formlyAdapter.saveObject('administrator', o, o._id).then(function(){
          $state.go("main.home", {}, {reload:true});
        })
      })
    };

  that.selectFacility = function(row) {
    var obj = formlyAdapter.getObject('administrator', Auth.getCurrentUser()._id).then(function(o) {
      o.facility = row._id;
      formlyAdapter.saveObject('administrator', o, o._id).then(function(){
        Auth.getCurrentUser().facility = row;
        document.location.href = "/#/main/home";
        $timeout(function() {
          location.reload(true);
        })
        //$state.go("main.home", {}, {reload:true});
      })
    })
  }

    var parseOrgs = function (data) {
      var arr = [];
      var found = {};
      
      _.each(data, function (obj) {
        var key = obj.Company ? obj.Company._id : '(No Organisation)';
        var name = obj.Company ? obj.Company.name : key;
        if (typeof(found[key])==='undefined') {
          found[key]=arr.length;
          arr.push({name:name, facilityList:[]});
        }

        arr[found[key]].facilityList.push(obj);
      });

      _.each(arr, function(val, idx) {
        var regions=parseRegions(val.facilityList);
        var sortedRegions=_.sortBy(regions,function(r){
          return r.name;
        });
        arr[idx].regionList = sortedRegions;
      });

      return arr;

    }

  var parseRegions = function (data) {
    var arr = [];
    var found = {};

    _.each(data, function (obj) {
      var key = obj.Region ? obj.Region._id : '(No Region)';
      var name = obj.Region ? obj.Region.name : key;
      //if ( !obj.Region ) {
      //  found[key] = arr.length;
      //  arr.push({name:key, facilityList:[]})
      //  } else
      if (typeof(found[key])==='undefined') {
        found[key]=arr.length;
        arr.push({name:name, facilityList:[]});
      }

      arr[found[key]].facilityList.push(obj);
    });

    return arr;

  }
});