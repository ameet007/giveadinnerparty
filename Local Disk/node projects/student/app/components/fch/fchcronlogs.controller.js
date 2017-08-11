'use strict';

angular.module("sms.fch")
  .controller('FchCronLogsCtrl', function ($timeout,$stateParams,dialog,$cookies,$q, Auth,facilityService,formlyAdapter,
                                          $state,$scope, moment,$util,fchUtils) {


 var that=this;
 that.tableRecords=[];
 that.selectedFacility=Auth.getCurrentUser().facility._id;
 that.fchcronrecordlogsMap={};
 that.format='dd-MM-yyyy';
   function initTable() {
      if(that.fchsyncuserlogs && that.fchsyncuserlogs.length){
       
        that.fchsyncuserlogs.forEach(function(d){
            var record={};
            record['CentreName']=d['UserLogsEventId'].CentreName;
            record['Username']=d['UserLogsEventId'].Username;
            record['EventDateTime']=d['UserLogsEventId'].EventDate;
            record['SavedDateTime']=d['UserLogsEventId'].Date;
            record['CronStartTime']=(that.fchcronrecordlogsMap[d['FCHSyncEventId']._id]) ? that.fchcronrecordlogsMap[d['FCHSyncEventId']._id]['FCHCronLogsID'].StartTime:null;
            record['CronEndTime']=(that.fchcronrecordlogsMap[d['FCHSyncEventId']._id]) ? that.fchcronrecordlogsMap[d['FCHSyncEventId']._id]['FCHCronLogsID'].EndTime:null;
            record['Status']=(that.fchcronrecordlogsMap[d['FCHSyncEventId']._id]) ? that.fchcronrecordlogsMap[d['FCHSyncEventId']._id]['FCHCronLogsID'].Status:null;
            record['Description']=d['UserLogsEventId'].EventDescription;
            that.tableRecords.push(record);
        })
       
      }
      
    }
    var closeAllOpenedDatepickers=function(){
      var keyMap=_.map(that,function(val,key){
        if(_.includes(key, 'Opened')){
          return key;
        }else{
          return null;
        }
      }).filter(function(val){
        if(val){
          return true;
        }
        return false;
      });
      _.each(keyMap,function(type){
        that[type]=false;
      })
    }
   that.open = function ($event, type) {
      $event.preventDefault();
      $event.stopPropagation();
      closeAllOpenedDatepickers();
      that[type + 'Opened'] = true;
    };
    var f1 = $scope.$watch(function (scope) {
      return ( that.EventDate );
    }, function() {
    that['EventDateOpened']=false;
     
    });
    var f2 = $scope.$watch(function (scope) {
      return ( that.savedDate );
    }, function() {
    that['savedDateOpened']=false;
     
    });
   

    $scope.$on('destroy', function () {
      f1();
      f2();
     
    })
that.formClicked=function(type){
       that[type + 'Opened'] = false;
    }
that.dateFilter=function(eventType){
     that.tableRecords=[];
     that.fchsyncuserlogs={};
     that.fchcronrecordlogs={};
     that.fchcronrecordlogsMap=[];
   if(!that.selectedFacility){
      var params={
                      populate: 'FCHCronLogsID'
                  }
     }else{
      var params={
                      query:JSON.stringify({facility:that.selectedFacility}),
                      populate: 'FCHCronLogsID'
                  }
     }
    formlyAdapter.getList('fchcronrecordlogs',params).then(function(fchcronrecordlogs) {
          that.fchcronrecordlogs = fchcronrecordlogs;
          that.fchcronrecordlogs.forEach(function(d){
             that.fchcronrecordlogsMap[d.FCHSyncEventId]=d;
          })
          var refsParams={
                           query:JSON.stringify({EventType:"FCH"}),
                           populate: 'FCHSyncEventId,UserLogsEventId,FCHSyncEventId.facility'
                        }
           formlyAdapter.getList('fchsyncuserlogsrefs',refsParams).then(function (dataLogs) { 
              
              that.fchsyncuserlogs=dataLogs.filter(function(d){
                var facilityFlag=!that.selectedFacility || d.FCHSyncEventId.facility===that.selectedFacility;
                if(eventType=="EventDate"){
                  var EventDate=moment(d['UserLogsEventId'].EventDate);
                  var dateFlag=moment(that.EventDate).isSame(EventDate,'day');
                 }else{
                  var savedDate=moment(d['UserLogsEventId'].Date);
                  var dateFlag=moment(that.savedDate).isSame(savedDate,'day');
                 }
                return facilityFlag && dateFlag;
              });
              initTable();
             }); 
         });
     

     
  }
  that.changeFacility=function(){
     that.tableRecords=[];
     that.fchsyncuserlogs={};
     that.fchcronrecordlogs={};
     that.fchcronrecordlogsMap=[];
    if(!that.selectedFacility){
      var params={
                      populate: 'FCHCronLogsID'
                  }
     }else{
      var params={
                      query:JSON.stringify({facility:that.selectedFacility}),
                      populate: 'FCHCronLogsID'
                  }
     }
     
    formlyAdapter.getList('fchcronrecordlogs',params).then(function(fchcronrecordlogs) {
          that.fchcronrecordlogs = fchcronrecordlogs;
          that.fchcronrecordlogs.forEach(function(d){
             that.fchcronrecordlogsMap[d.FCHSyncEventId]=d;
          })
          var refsParams={
                           query:JSON.stringify({EventType:"FCH"}),
                           populate: 'FCHSyncEventId,UserLogsEventId,FCHSyncEventId.facility'
                        }
           formlyAdapter.getList('fchsyncuserlogsrefs',refsParams).then(function (dataLogs) { 
              
              that.fchsyncuserlogs=dataLogs.filter(function(d){
                return !that.selectedFacility || d.FCHSyncEventId.facility===that.selectedFacility;
              });
              initTable();
             }); 
         });
  }

   $timeout(function() {
          formlyAdapter.getList('facility').then(function(facilities){
              that.facilities=facilities;
          })
          var params={
                      query:JSON.stringify({facility:that.selectedFacility}),
                      populate: 'FCHCronLogsID'
                  }
         formlyAdapter.getList('fchcronrecordlogs',params).then(function(fchcronrecordlogs) {
          that.fchcronrecordlogs = fchcronrecordlogs;
          that.fchcronrecordlogs.forEach(function(d){
             that.fchcronrecordlogsMap[d.FCHSyncEventId]=d;
          })
          var refsParams={
                          query:JSON.stringify({EventType:"FCH"}),
                          populate: 'FCHSyncEventId,UserLogsEventId,FCHSyncEventId.facility'
                        }

           formlyAdapter.getList('fchsyncuserlogsrefs',refsParams).then(function (dataLogs) { 
               that.fchsyncuserlogs=dataLogs.filter(function(d){
                     return !that.selectedFacility || d.FCHSyncEventId.facility===that.selectedFacility;
              });
           
              initTable();
             }); 
          
      });
        
        
       
        
    });
});