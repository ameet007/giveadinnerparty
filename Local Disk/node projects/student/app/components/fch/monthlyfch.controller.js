'use strict';

angular.module("sms.fch")
  .controller('MonthlyFchCtrl', function ($timeout,$stateParams,dialog,$cookies,$q, Auth,facilityService,formlyAdapter,
                                          $state,$scope, moment,$util,formlyapi,fchUtils) {



   var params = params && params.stateParams ? params.stateParams : $stateParams;
   
	 var that = this;
   that.format='MMMM-yyyy';
  
   if($cookies.get('fchmonth')){
    that.month=new Date($cookies.get('fchmonth'));
   }else{
    that.month=new Date();
    $cookies.put('fchmonth',new Date(),{}); 
   }
   that.dateFilter=function(){
     initTable();
  }
  that.formClicked=function(type){
      that[type + 'Opened'] = false;
    }

    var f1 = $scope.$watch(function (scope) {
      return ( that.month );
    }, function() {
    that['todayOpened']=false;
     
    });
   

    $scope.$on('destroy', function () {
      f1();
     
    })
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
   
    
    function zeropad(n) {
        return n > 9 ? n : "0" + n;
      }

    function getLabel(hr, min) {
      var nexthr=hr+1;
      return hr +" - "+(nexthr);
    }
    function calAdvanceDay(){
        formlyAdapter.getList('eceserviceschedule').then(function(data){
          var ServiceSchedule=data;
          
          var serviceSchedule=fchUtils.getEffectiveServiceSchedule(ServiceSchedule,that.month);
          
          var month=moment(that.month).format('MMM YYYY');
          if(serviceSchedule){
            
            _.each(that.monthDates,function(day){
                if(serviceSchedule[days[day.getDay()]].Scheduled){
                   
                   
                   var holidays=[];
                   var tempClosure=[];
                   
                   if(that.holidayList && that.holidayList.length){
                    holidays=that.holidayList.filter(function(holiDay){
                      var holidayDay=new Date(holiDay.Date).getDate();
                      var holidayMonth=new Date(holiDay.Date).getMonth()+1;
                      var holidayYear=new Date(holiDay.Date).getYear();
                      var todayDay=new Date(day).getDate();
                      var todayMonth=new Date(day).getMonth()+1;
                      var todayYear=new Date(day).getYear();
                      
                      if(holiDay.ReoccurYearly && holidayDay==todayDay && holidayMonth==todayMonth){
                            return true;
                        }else if(holidayDay==todayDay && holidayMonth==todayMonth && holidayYear==todayYear){ 
                           return true;
                        }
                    })
                   } 
                 

                   if(that.temporaryClosureList && that.temporaryClosureList.length){
                    var firstClosure=null;
                   
//                    tempClosure=that.temporaryClosureList.filter(function(data){
//                         firstClosure = data;
//                         var closureDay=new Date(firstClosure.ClosureStartDate).getDate();
//                          var closureMonth=new Date(firstClosure.ClosureStartDate).getMonth()+1;
//                          var closureYear=new Date(firstClosure.ClosureStartDate).getYear();
//                          var todayDay=new Date(day).getDate();
//                          var todayMonth=new Date(day).getMonth()+1;
//                          var todayYear=new Date(day).getYear();
//                         if(firstClosure && firstClosure.ClosureReasonCode && (closureDay==todayDay && closureMonth==todayMonth && closureYear==todayYear) ){
//                           
//                            return true;
//                        }
//                    })

                    tempClosure=fchUtils.matchesTempClosure(day, that.temporaryClosureList)
                    
                    
                   } 
                   var currDay = moment(day).format("ddd");
                   if(!(holidays && holidays.length)  && (currDay!='Sat' || currDay!='Sun')){
                       that.advanceDays++;
                   }
                   if(!(holidays && holidays.length) && !(tempClosure) && (currDay!='Sat' || currDay!='Sun')){
                       that.planopenDays++;
                       that.actualopenDays++;
                   } 
//                   if(!(tempClosure && tempClosure.length) && (currDay!='Sat' || currDay!='Sun')){
//                      that.actualopenDays++;
//                   }
//                    if(!(tempClosure) && (currDay!='Sat' || currDay!='Sun')){
//                        console.log(day);
//                       that.actualopenDays++;
//                   }
                }
            });
            
          }
        })
    }

   var setmonthDates=function(){
       var y = that.month.getFullYear(), m = that.month.getMonth();
       var firstDay = new Date(y, m, 1);
       var lastDay = new Date(y, m + 1, 0);
      
      while(firstDay <=lastDay){
        that.monthDates.push(firstDay);
        
        firstDay=new Date(firstDay.getTime()+24*60*60*1000);
      }
   }
   var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  

   that.getRowClass = function (day) {

       var holiday=null,Closure=null,holidayMatrix=0,tempClousureMatrix=0;
       if(that.holidayList && that.holidayList.length){
       
          _.each(that.holidayList,function(holiDay){
              if(holiDay){
                var holidayDay=new Date(holiDay.Date).getDate();
                var holidayMonth=new Date(holiDay.Date).getMonth()+1;
                var holidayYear=new Date(holiDay.Date).getYear();
                var todayDay=new Date(day).getDate();
                var todayMonth=new Date(day).getMonth()+1;
                var todayYear=new Date(day).getYear();
               
                if(holiDay.ReoccurYearly && holidayDay==todayDay && holidayMonth==todayMonth){
                    holiday=holiDay;
                     if(holiday.canMarkAttendance){
                       holidayMatrix=1;
                      }else{
                        holidayMatrix=0;
                      }
                    return false;
                }else if(holidayDay==todayDay && holidayMonth==todayMonth && holidayYear==todayYear){ 

                  holiday=holiDay;
                  if(holiday.canMarkAttendance){
                       holidayMatrix=1;
                      }else{
                        holidayMatrix=0;
                      }
                  return false;
                }
                
              }
          })
       }

       if(that.temporaryClosureList && that.temporaryClosureList.length){
         
          _.each(that.temporaryClosureList,function(data){
            
             
              var closureDay=new Date(data.ClosureStartDate).getDate();
              var closureMonth=new Date(data.ClosureStartDate).getMonth()+1;
              var closureYear=new Date(data.ClosureStartDate).getYear();
              var todayDay=new Date(day).getDate();
              var todayMonth=new Date(day).getMonth()+1;
              var todayYear=new Date(day).getYear();
              
            if(data && data.ClosureReasonCode && (closureDay==todayDay && closureMonth==todayMonth && closureYear==todayYear) ){
              Closure=data;
              var clousureData=(data.ClosureReasonCode._id) ? data.ClosureReasonCode._id:data.ClosureReasonCode;
               if(that.absenceReasonMap[clousureData].IsFunded){
                   tempClousureMatrix=1;
              }else{
                   tempClousureMatrix=0;
              }
              return false;
            }
          });
        }
        if(holiday){
              return 'info';
        }else if(Closure){
         
          return 'warning';
        }
       return "success";
    }
    
 
   function initTable(){
      that.advanceDays=0;
      that.planopenDays=0;
       that.actualopenDays=0;
      that.monthDates=[];
      $cookies.put('fchmonth', new Date(that.month), {});
      formlyAdapter.getList('eceserviceschedule').then(function(data){
        that.eceserviceschedule=data;
          fchUtils.getMonthlyFch(that.month,that.licenseDetails,that.centerstatusData,that.eceserviceschedule).then(function(matrix){
            setmonthDates();// for displaying dates in grid
            $timeout(function(){
             that.monthlyMatrix=matrix; 
            });

            calAdvanceDay();
          });
      });
      
   }

   $timeout(function() {
       var user = Auth.getCurrentUser();
       var fac= ( user.facility && user.facility._id )  ? user.facility._id : user.facility;
       formlyAdapter.getList('licenseconfiguration', {query:JSON.stringify({facility:fac})}).then(function (obj) {
          that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
          formlyAdapter.getList('centrestatus').then(function(data){
           that.centerstatusData=(data && data.length)? data[0]:null;
            formlyAdapter.getList('absencereason').then(function(data) {
                  that.absenceReasons = data;
                  that.filteredAbsenceReasons = _.filter(data, function(d) {
                      return !d.IsTempClosureCode && d.UseForChild;
                  });

                  that.absenceReasonMap = {};
                  _.each(data, function(d) {
                      that.absenceReasonMap[d._id] = d;
                  });
                  formlyAdapter.getList("holiday").then(function (holidays) {
                      that.holidayList = holidays
                    });
                  formlyAdapter.getList("temporaryClosure").then(function (tempclousure) {
                      that.temporaryClosureList = tempclousure;
                    });
                  initTable();
              });
           });

           
        });
    });
    /*$timeout(function() {
       facilityService.getLicensing().then(function(obj){
          that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
        });
       formlyAdapter.getList('centrestatus').then(function(data){
           that.centerstatusData=(data && data.length)? data[0]:null;
       });
        formlyAdapter.getList('absencereason').then(function(data) {
            that.absenceReasons = data;
            that.filteredAbsenceReasons = _.filter(data, function(d) {
                return !d.IsTempClosureCode && d.UseForChild;
            });

            that.absenceReasonMap = {};
            _.each(data, function(d) {
                that.absenceReasonMap[d._id] = d;
            });
            formlyAdapter.getList("holiday").then(function (holidays) {
                that.holidayList = holidays
              });
            formlyAdapter.getList("temporaryClosure").then(function (tempclousure) {
                that.temporaryClosureList = tempclousure;
              });
            initTable();
        });
    });*/
    
});