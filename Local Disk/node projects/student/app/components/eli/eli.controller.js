'use strict';


angular.module('sms.eli')
  .config(function ($stateProvider) {
    $stateProvider
      .state('eli', {
        url: '/eli',
        templateUrl: 'components/eli/eli.html',
        controller: 'ELICtrl'
      })
  })
  .controller('ELICtrl', function($rootScope,$scope, ELI, popup, dialog, $util, formlyAdapter, $location, $q, Auth, moment,$http) {

    var that = this;

    var cUsr = $rootScope.$on("loginSuccess", checkAuth);

    var checkAuth = function() {
      that.usr = Auth.getCurrentUser();
      that.sAdmin = that.usr.role.index == 0;
      if(that.usr.role && that.usr.role.type){
          that.loggedInUserRole=that.usr.role.type;
           if(that.loggedInUserRole && that.loggedInUserRole=='SYSTEM_ADMIN_ROLE'){
            that.selectedFacility=null;
          }else{
            that.selectedFacility=(that.usr.facility && that.usr.facility._id) ? that.usr.facility._id : that.usr.facility; 
          }
      }
      cUsr();
    };

    checkAuth();
    
    that.sortType = 'SubmittedDate';
    that.sortOrder = '-';
    that.toggleSortType = function(type) {
      if ( type == that.sortType ) {
        that.sortOrder = (that.sortOrder == '-') ? '' : '-';
      } else {
        that.sortType = type;
      }
      getELIEvents();
    };

    that.showSortIcon = function(type) {
      var up = '▲';
      var down = '▼';
      if ( type != that.sortType ) return '';
      else if ( that.sortOrder == '-' ) return up;// '&#9660;';
      else return down;//'&#9650;';
    }

    that.filterList = [
      {name:"All", type:null},
      {name:"Attendance", type:"ChildAttendance"},
      {name:"Booking Schedule", type:"ChildBookingSchedule"},
      {name:"Confirmation", type:"ConfirmationData"},
      {name:"Demographics", type:"ChildDemographics"},
      {name:"Enrolment", type:"ChildEnrolment"},
      {name:"Identity", type:"ChildIdentity"},
      {name:"Service Closure", type:"EceServiceClosure"},
      {name:"Twenty Hours ECE", type:"TwentyHoursSchedule"},
      {name:"RS7 Return", type:"RS7Return"},
      {name:"ECE Return", type:"EceReturn"},
    ];
    that.selectedFilter = that.filterList[0];
    that.stopDate = new Date();
    that.startDate = new Date(that.stopDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    /*that.statusCodeList = [
      {name:"All", type:null},
      {name:"202", type:"202"},
      {name:"400", type:"400"},
      {name:"401", type:"401"}
    ];*/

    that.statusCodeList = [
      {name:"All", type:null},
      {name:"202", type:"202"},
      {name:"4XX", type:"4XX"},
      {name:"5XX", type:"5XX"}
    ];
    that.selectedStatusCode = that.statusCodeList[0];


    that.filterChange = function() {
      getELIEvents();
    }
    that.getEventStatus=function(row){
      if(row.StatusCode){
          if(row.StatusCode=='200' || row.StatusCode=='202'){
            return "Success";
          }else{
            return "Failure";
          }
      }else{  
        return "Pending";
      }
    }
    that.confirmationOptions = [
      //{name:"Yesterday", type:"day"},
      {name:"Past Week", type:"week"},
      //{name:"Past Month", type:"month"}
    ];
    that.selectedConfirmation=that.confirmationOptions[0];

    that.working = false;

    var toDateFormat = function(d) {
      d = new Date(d.getTime());
      return d.getFullYear()+"-"+ zeropad((d.getMonth()+1))+"-" +
        zeropad((d.getDate()))+"T"+ zeropad(d.getHours())+":"+ zeropad(d.getMinutes()) +":"+ zeropad(d.getSeconds());
    }


    function eliCall(method, type, data) {
      var d = $q.defer();
      that.working = true;
      method(data).then(function(result) {
        dialog.showOkDialog("ELI", type+" Sent Successfully: "+result);
        that.working = false;
        d.resolve(result);
      }, function(err) {
        dialog.showOkDialog("ELI Error: ", err);
        that.working = false;
        d.reject(err);
      })
      return d.promise;
    }

    that.events = [];
    that.totalEvents;

    function resetPages() {
      that.pendingPage = 1;
      that.submittedPage = 1;
    }

    resetPages();
    that.pageSize = 25;

    that.showPending = false;
    that.togglePending = getELIEvents;
    that.formClicked=function(type){
      that[type + 'Opened'] = false;
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
      return ( that.startDate );
    }, function() {
    that['startOpened']=false;
     
    });
   var f2 = $scope.$watch(function (scope) {
      return ( that.stopDate );
    }, function() {
    that['stopOpened']=false;
     
    });

    $scope.$on('destroy', function () {
      f1();
      f2();
     
    })
    function initAlerts() {

      Auth.getAlerts().then(function (d) {
        that.confirmations = d.confirmations;
        that.confirm = that.confirmations.length && that.confirmations.length > 0;
        if (that.confirm) {
          that.confirmationOptions = that.confirmations;
          that.selectedConfirmation = that.confirmationOptions[0];
        }
      });
    }
    initAlerts();

    function getChildQueryConstraint(kidId){
        var constraint = {};
        constraint['id']=kidId;
        
       if(that.loggedInUserRole && that.loggedInUserRole=='SYSTEM_ADMIN_ROLE'){
           constraint["facility"]={}; 
           
        }
        
      return JSON.stringify(constraint);
    }
    function getQueryConstraint() {
      var constraint = {};
      if ( that.showPending ) {
        constraint["SubmittedDate"] = "";
      }
      else  {
        constraint["SubmittedDate"] = "!=";
      }

      constraint["SaveDate"] = {"$gte": that.startDate, "$lte": that.stopDate};

      if ( that.selectedFilter.type ) {
        constraint["EventType"] = that.selectedFilter.type;
      }

       if ( that.selectedStatusCode.type ) {
        if(that.selectedStatusCode.type=='4XX'){
            constraint["StatusCode"] = {"$in":[400,401]};  
        }else if(that.selectedStatusCode.type=='5XX'){
            constraint["StatusCode"] = {"$in":[500,503]};  
        }else{
           constraint["StatusCode"] = that.selectedStatusCode.type;
        }
       
        
      }
      
      if(that.loggedInUserRole && that.loggedInUserRole=='SYSTEM_ADMIN_ROLE'){
           if(that.selectedFacility){
              /*if(that.facilitiesMap){
                constraint["facility"]={"$in":that.facilitiesMap};
              }else{
                constraint["facility"]={};  
              }*/
              constraint["facility"] = (that.selectedFacility && that.selectedFacility._id) ? that.selectedFacility._id: that.selectedFacility;            
           }
           
        }else{
          constraint["facility"] = (that.selectedFacility && that.selectedFacility._id) ? that.selectedFacility._id: that.selectedFacility;            
        }
        
      return JSON.stringify(constraint);
    }

    function getELIEvents() {
        
        
            return formlyAdapter.getModels().then(function () {

              formlyAdapter.getCount('eliEvent', {query:getQueryConstraint()}).then(function (data) {
                that.totalEvents = data;
              });

              formlyAdapter.getList('eliEvent', {query:getQueryConstraint(),sort:that.sortOrder+''+that.sortType,skip:(that.page()-1)*that.pageSize, limit:that.pageSize}).then(function (data) {

                that.events = data.filter(function(d){
                  var eventsaveDate=moment(d.SaveDate);
                  var currdate=moment();
                  var ifAbsent=(d.Values && d.Values.IsAbsent) ? d.Values.IsAbsent:0;
                  if(d.EventType=='ChildAttendance' && ifAbsent){
                     return (currdate.isAfter(eventsaveDate,'day') || currdate.isSame(eventsaveDate,'day') );  
                  }                
                 return true;
                });
                that.pageStart = that.getPageStart();
                that.pageEnd = that.getPageEnd();
              }, function (err) {
                console.log(err);
              })
            });
      
        
    }
    
    if(that.loggedInUserRole && that.loggedInUserRole=='SYSTEM_ADMIN_ROLE'){ 
            formlyAdapter.getList('facility').then(function(data){
             that.facilities=data;
             that.facilitiesMap=_.map(that.facilities,function(fac){ return fac._id });
              getELIEvents();
          });
      }else{
         getELIEvents();
      }

   

    that.page = function() {
      return ( that.showPending ) ? that.pendingPage : that.submittedPage;
    }

    that.totalPages = function() {
      return Math.ceil(that.totalEvents/that.pageSize);
    }

    that.incrementPage = function() {
      if ( that.page() < that.totalPages() ) {
        if (that.showPending)
          that.pendingPage++;
        else
          that.submittedPage++;
        getELIEvents();
      }
    };

    that.decrementPage = function() {
      if ( that.page() > 1 ) {
        if (that.showPending)
          that.pendingPage--
        else
          that.submittedPage--;
        getELIEvents();
      }
    };


    that.getPageStart = function(){
      return ((that.page()-1)*that.pageSize)+1;
    };


    that.getPageEnd = function(){
      var endOfPage = (((that.page()-1)*that.pageSize)+that.pageSize);
      if ( endOfPage > that.totalEvents ) return that.totalEvents;
      return endOfPage;
    };

    that.editEvent = function(evt) {
      //$location.path('main/formly/edit/eliEvent/'+evt._id);
      that.viewEvent(evt);
    };

    that.viewEvent = function(evt) {
      // get user first
      
      formlyAdapter.getObject('facility',evt.facility).then(function(fac){
        var centreName=(fac.name)?fac.name: fac.ShortName;
      formlyAdapter.getObject('administrator', evt.createdBy).then(function(usr) {
         //dialog.showOkDialog("ELI Data", formatData(evt, usr));
         
        if ( evt.Values && evt.Values['ChildEntityId']) {

          if(that.loggedInUserRole=='SYSTEM_ADMIN_ROLE'){
              $http.get('api/v1/child/'+evt.Values['ChildEntityId']+'?from=eliview').then(function(result){
                var kid=result.data;
                dialog.showOkDialog("ELI Data", formatData(evt, usr, kid,centreName));
              }, function(err){

                dialog.showOkDialog("ELI Data", formatData(evt, usr, null, centreName));
              })
          }else{
              formlyAdapter.getObject('child', evt.Values['ChildEntityId']).then(function(kid) {
               dialog.showOkDialog("ELI Data", formatData(evt, usr, kid,centreName));
              });
          }          
        } else {
          dialog.showOkDialog("ELI Data", formatData(evt, usr,null,centreName));
        }

      });
    });
    };

    /*that.viewEvent = function(evt) {
      // get user first
     
      formlyAdapter.getObject('administrator', evt.createdBy).then(function(usr) {
         //dialog.showOkDialog("ELI Data", formatData(evt, usr));
        if ( evt.Values && evt.Values['ChildEntityId']) {
          if(that.loggedInUserRole=='SYSTEM_ADMIN_ROLE'){
              $http.get('api/v1/child/'+evt.Values['ChildEntityId']+'?from=eliview').then(function(result){
                var kid=result.data;
                dialog.showOkDialog("ELI Data", formatData(evt, usr, kid));
              })
          }else{
              formlyAdapter.getObject('child', evt.Values['ChildEntityId']).then(function(kid) {
               dialog.showOkDialog("ELI Data", formatData(evt, usr, kid));
              });
          }
              
          
        } else {
          dialog.showOkDialog("ELI Data", formatData(evt, usr));
        }

      });
    };*/

    function formatText(text) {
      if (text && text.replace)  {
        return vkbeautify.xml(text);
      } else return text;
    }

    var formatData = function(evt, usr, kid,centreName) {

      var str = "ELI Event: "+evt.EventType+"<br/>";
      
      if ( usr ) {
        str += "Created By: "+usr.firstname + ' ' + usr.lastname +" / "+centreName+"<br/>";
      }
      str += "Created At: "+evt.EventDateTime + "<br/>";
      //str += "Saved: "+evt.EventDateTime + "<br/>";
      str += "Saved: "+evt.SaveDate + "<br/>";

      if ( kid ) {
        str += "Child: "+$util.formatName(kid) + " (NSN:" + kid.NationalStudentNumber + ")<br/>";
      } else{
        if(evt.EventType!='EceReturn')
        str += "Child: Does not exist in system anymore<br/>";
      }


      if ( evt.SubmitedDate) str += ("Submitted: "+evt.SubmittedDate + "<br/>");
      if ( evt.ActionType) str += ("Type: "+evt.ActionType + "<br/>");
      if ( evt.StatusCode) str += ("StatusCode: "+evt.StatusCode + "<br/>");
      if ( evt.StatusMessage) str += ("StatusMessage: "+evt.StatusMessage + "<br/>");
      str += "<br/><hr/><h3>Values</h3>";
      var previous='';
      for ( var k in evt.Values ) {
       
        if(k=="AttendanceTimeEnd"){
          previous="&nbsp;&nbsp;&nbsp;&nbsp;"+k + " = " +formatText(evt.Values[k])+"<br/>";
          continue;
        }
        if(k=="AttendanceTimeStart"){
          str += "&nbsp;&nbsp;&nbsp;&nbsp;"+k + " = " +formatText(evt.Values[k])+"<br/>";
          str+=previous;
          previous='';
        }else{
          str += "&nbsp;&nbsp;&nbsp;&nbsp;"+k + " = " +formatText(evt.Values[k])+"<br/>";
        }
        
      }


      if ( evt.RawRequest ) {
        var xml = vkbeautify.xml(evt.RawRequest);
        str += "<hr/><h3>Request</h3><textarea style='width:100%' rows='10' disabled>"+xml+"</textarea>";
      }

      if ( evt.RawResponse ) {
        str += "<hr/><h3>Response</h3><textarea  style='width:100%' rows='5' disabled>"+evt.RawResponse+"</textarea>";
      }


      return str;
    };
    
    /*var formatData = function(evt, usr, kid) {
      var str = "ELI Event: "+evt.EventType+"<br/>";

      if ( usr ) {
        str += "Created By: "+usr.firstname + ' ' + usr.lastname + "<br/>";
      }
      str += "Created At: "+evt.EventDateTime + "<br/>";
      str += "Saved: "+evt.SaveDate + "<br/>";

      if ( kid ) {
        str += "Child: "+$util.formatName(kid) + " (NSN:" + kid.NationalStudentNumber + ")<br/>";
      }


      if ( evt.SubmitedDate) str += ("Submitted: "+evt.SubmittedDate + "<br/>");
      if ( evt.ActionType) str += ("Type: "+evt.ActionType + "<br/>");
      if ( evt.StatusCode) str += ("StatusCode: "+evt.StatusCode + "<br/>");
      if ( evt.StatusMessage) str += ("StatusMessage: "+evt.StatusMessage + "<br/>");
      str += "<br/><hr/><h3>Values</h3>";
      for ( var k in evt.Values ) {
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"+k + " = " +formatText(evt.Values[k])+"<br/>";
      }



      if ( evt.RawRequest ) {
        var xml = vkbeautify.xml(evt.RawRequest);
        str += "<hr/><h3>Request</h3><textarea style='width:100%' rows='10' disabled>"+xml+"</textarea>";
      }

      if ( evt.RawResponse ) {
        str += "<hr/><h3>Response</h3><textarea  style='width:100%' rows='5' disabled>"+evt.RawResponse+"</textarea>";
      }


      return str;
    };*/


    that.sendEvent = function(evt, suppressGet) {
      
      var dtg = evt.SaveDate;
      if ( evt.SaveDate.getTime() > new Date().getTime() ) {
        dialog.showOkDialog("Warning", "ELI submission not possible for future events!");
        return;
      }
      if(evt.EventType=='EceReturn'){
          var obj = _.extend({_id: evt._id, EventDateTime:evt.EventDateTime, SaveDate:evt.SaveDate,EceReturnEntityId:evt.EceReturnEntityId}, evt.Values);
      }else{
          var obj = _.extend({_id: evt._id, EventDateTime:evt.EventDateTime, SaveDate:evt.SaveDate}, evt.Values);
       }
      
      
      var promise;
      switch (evt.EventType) {
        case 'ChildDemographics': promise = that.demographics(obj);break;
        case 'ChildIdentity': promise = that.identity(obj);break;
        case 'ChildEnrolment': promise = that.enrolment(obj);break;
        case 'TwentyHoursSchedule': promise = that.twentyhours(obj);break;
        case 'ChildBookingSchedule': promise = that.schedule(obj);break;
        case 'ChildAttendance': promise = that.attendance(obj);break;
        case 'EceServiceClosure': promise = that.closure(obj);break;
        case 'ConfirmationData': promise = that.confirmation(obj);break;
        case 'RS7Return': promise = that.rs7return(obj);break;
        case 'EceReturn': promise = that.EceReturn(obj);break;
      }

      if ( !suppressGet ) return promise.then(getELIEvents);
      else return promise;
    }

    that.deleteEvent = function(evt) {
      formlyAdapter.deleteObject('eliEvent', evt._id).then(function (d) {
        dialog.showOkDialog("Success", "Record Deleted!");
        getELIEvents();
      });
    }

    that.sendAllEvents = function(evt) {
      var p = [];
      _.each(that.events, function(evt) {
        p.push(that.sendEvent(evt, true));
      });
      $q.all(p).then(function() {
        getELIEvents();
        dialog.showOkDialog("Success", "All Records Deleted!").then(getELIEvents);
      })


    }

    that.deleteAllEvents = function() {
      var p = [];
      _.each(that.events, function(evt) {
        p.push(formlyAdapter.deleteObject('eliEvent', evt._id));
      });
      $q.all(p).then(function() {
        dialog.showOkDialog("Success", "All Records Deleted!").then(getELIEvents);
      })
    }

    var toFmt = function(str,fmt) {
      return moment(str).format(fmt);
    }

    that.format = 'dd-MM-yyyy';
    var getDateRange = function(conf, format) {
      var type = conf.type;
      var fmt = format || 'YYYY-MM-DD';
      var s = toFmt(conf.s, fmt) || moment().subtract(1, type + 's').startOf(type).format(fmt);
      var e = toFmt(conf.e, fmt) || moment().subtract(1, type + 's').endOf(type).format(fmt);
      return {start:s, end:e};
    }

    // confirmation is a special case - we create the eli event first, then send it
    that.confirmELIData = function() {
      var d = getDateRange(that.selectedConfirmation, 'DD-MM-YYYY');
      var eliConfirmMsg = "You can review your service's records before confirming by reviewing the attendance register or the reports"+
          " available on the ELI Reporting page.<hr/>By clicking confirm, I agree that to the best of my knowledge the records for the period" +
        " I am confirming are correct<hr/><h4>Period: "+ d.start + " thru " + d.end;

      dialog.showOkCancelDialog("ELI: Confirm Records", eliConfirmMsg, "Confirm", "Cancel").then(sendELI);
    }

    var dashRegexPattern = "-";
    var regEx = new RegExp(dashRegexPattern, "g");

    function sendELI() {
      var conf = that.selectedConfirmation;
      var d = getDateRange(conf);
      var confirmID = d.start.replace(regEx, "") + d.end.replace(regEx, "");
      console.log(d);
      var eliObj = {
        Values: {'StartDate': d.start, 'EndDate': d.end, 'ConfirmationDataEntityId': confirmID},
        EventType : "ConfirmationData",
        EventDateTime: new Date(),
        SaveDate: new Date(),
      };
      return formlyAdapter.saveObject('eliEvent', eliObj, null).then(function(d) {
        var evt = d.data;
        var obj = _.extend({_id: evt._id, EventDateTime: d.EventDateTime}, evt.Values);
        that.confirmation(obj).then(function() {
          initAlerts();
        })
      });
    };


    that.schedule = function(data) {
      return eliCall(ELI.schedule, "Booking Schedule", data);
    }

    that.attendance = function(data) {
      return eliCall(ELI.attendance, "Attendance", data);
    }

    that.closure = function(data) {
      return eliCall(ELI.closure, "Closure", data);
    }

    that.confirmation = function(data) {
      return eliCall(ELI.confirmation, "Confirmation", data);
    }

    that.rs7return = function(data) {
      return eliCall(ELI.rs7, "RS7 Return", data);
    }
    that.EceReturn=function(data){
      return eliCall(ELI.ecereturn, "Ece Return", data);
    }

    that.twentyhours = function(data) {
      return eliCall(ELI.twentyhours, "20 Hours ECE", data);
    }

    that.enrolment = function(data) {
      return eliCall(ELI.enrolment, "Enrolment", data);
    }

    that.demographics = function(data) {
      return eliCall(ELI.demographics, "Demographic", data);
    }

    that.identity = function(data) {
      return eliCall(ELI.identity, "Identity", data);
    }

    that.login = function() {
      return eliCall(ELI.login, "Login");
    }

    that.event = function() {
      return eliCall(ELI.event, "Sample Event");
    }

  });
