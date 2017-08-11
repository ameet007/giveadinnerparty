'use strict';

angular.module("sms.fch")
  .controller('DailyFchCtrl', function ($timeout,$stateParams,dialog,$cookies,$q, Auth,facilityService,formlyAdapter,
                                          $state,$scope, moment,$util,formlyapi,fchUtils) {



   var params = params && params.stateParams ? params.stateParams : $stateParams;
   
	 var that = this;
   that.lastThreeWeeksAttendanceList=[];
	 that.format='dd-MM-yyyy';
   $scope.timeHeaders=[];
    var date = $stateParams.date;
   if($cookies.get('fchdate') && !date){
    that.today=new Date($cookies.get('fchdate'));
   }else if (date) {
     that.today=moment(date, "DD-MM-YYYY").toDate();
   } else {
    that.today=new Date();
    $cookies.put('fchdate',new Date(),{}); 
   }
 
	 that.childList=[];
   that.holidayList=[];
   that.temporaryClosureList=[];
   that.bookingHoursCondition=0;
   that.licenseConfiguration=null;
   that.currentCentre=(Auth.getCurrentUser().facility && Auth.getCurrentUser().facility.length) ? Auth.getCurrentUser().facility : null ;
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
      return ( that.today );
    }, function() {
    that['todayOpened']=false;
     
    });
   

    $scope.$on('destroy', function () {
      f1();
     
    })
   that.weekDates=[];
  var setWeeklyDateRange=function(){
    var currDay = moment(that.today).format("ddd");
      if(currDay =='Sun'){
           var startOfWeek = moment(new Date(that.today)).startOf('week').add(-6,'days').toDate();
           var endOfWeek   = moment(new Date(that.today)).endOf('week').add(-6,'days').toDate();
      }else{
           var startOfWeek = moment(new Date(that.today)).startOf('week').add(1,'days').toDate();
           var endOfWeek   = moment(new Date(that.today)).endOf('week').add(1,'days').toDate();
      }
         
   // var startOfWeek = moment(new Date(that.today)).startOf('week').add(1,'days').toDate();
   // var endOfWeek   = moment(new Date(that.today)).endOf('week').add(1,'days').toDate();
    var arr=[];
    var i=0;
    
    while(moment(startOfWeek)<=moment(endOfWeek)){
       arr[i]=new Date(startOfWeek);
       startOfWeek=moment(startOfWeek).add(1,'days');
       i++;
    }
    
    that.weekDates=arr;
    
  }

    var getParams = function () {
       var kids = that.childList;
    	 return {
                "$in": _.map(kids, function (c) {
                  return c._id;
                })
              }
      
    }
    var timeFix = function (date, setToMidnight) {
      var d = new Date(date.getTime());
      if (setToMidnight) d.setHours(23, 59, 59, 0);
      else d.setHours(0, 0, 0, 0);
      return d;
    }
   

    function zeropad(n) {
        return n > 9 ? n : "0" + n;
      }

    function getLabel(hr, min) {
      var nexthr=hr+1;
      //return hr + ":" + zeropad(min) +" - "+(nexthr) + ":" + zeropad(min);
      return hr +" - "+(nexthr);
    }

       
    

 var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

   




  that.dateFilter=function(){
     initTable();
  }
  that.openAlert=function(child){ 
   var childName=that.getChildName(child);
   var msg='Funding criteria not met for '+ childName;
   dialog.showOkDialog("Alert", msg);
  }

  that.checkChildAgeCondition=function(child){

         var childBirthDay=moment(child.ChildBirthDate);
            var today=moment(that.today);
            var months=today.diff(childBirthDay,'months');
            if(months < 72){
              return true;
            }else{
              return false;
            }
  }

    that.clearAll=function(){
      that.today=new Date();
    }

    that.getChildName = function (theKid) {

        var id = theKid._id ? theKid._id : theKid;
        var child = _.filter(that.childList, function (k) {
          return k._id == id;
        })[0];
        if (!child) return '--';

        return (child.PreferredGiven1Name?child.PreferredGiven1Name:child.OfficialGiven1Name) + ' ' + child.OfficialFamilyName;
    };
    $scope.getTimeHeaders=function(today,eceServiceschedule,childList,attendanceList){
      
      var day=today || that.today;

       $scope.timeHeaders=fchUtils.getTimeHeaders(day,eceServiceschedule,childList,attendanceList,that.format);
       return $scope.timeHeaders;
    }
   
    

	 that.checkBookingHoursCondition=function(){
     if(that.attendanceList && that.attendanceList.length){

        return 1;
      }
      
      if(that.childList && that.childList.length && that.today){

        var bookingHours=0;
        var bookedChildcount=0;
        var totalBookedHours=0;
        _.each(that.childList,function(child){
            if($util.checkBookingAndEnrolment(child,true,that.today)){
                
                var bs=fchUtils.getBookingSchedule(child,that.today);
               // var bs=child.Enrolments[child.Enrolments.length-1].BookingSchedule[child.Enrolments[child.Enrolments.length-1].BookingSchedule.length-1];
             
               if(bs && bs.length){
                _.each(bs,function(times){
                    var Start=times['startTime']; //moment(Times[days[that.today.getDay()]+'Start'],'hh:mm');
                    var End=times['endTime'];//moment(Times[days[that.today.getDay()]+'End'],'hh:mm');
                    totalBookedHours+=End.diff(Start,'minutes')/60;
                });
                bookedChildcount++;
              }
          } 
        });
       
        var aggregateBookingHours=totalBookedHours/bookedChildcount;
       
        if(aggregateBookingHours >= 2.5){
          return 1;
        }else{
          return 0;
        }
        
      }else{
        return 0;
      }

   }

    that.getRowClass = function (child) {
        if(that.holiday && !that.holidayMatrix){
          if(!that.checkChildAgeCondition(child)){
           return 'danger testAlert';
          }else{
            return 'info';
          }
        }else if(that.firstClosure && !that.temporaryClosure){
          if(!that.checkChildAgeCondition(child)){
          return 'danger testAlert';
        }else{
          return 'warning';
        }
        }else if(!that.checkChildAgeCondition(child)){
          return 'danger testAlert';
        }
       return "success";
    }
   
    that.checkThreeWeekRule=function(child){
      return fchUtils.checkThreeWeekRule(child,that.today,that.attendanceList,that.lastThreeWeeksAttendanceList,that.holidayList,that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList);
       
    }
   


    that.getECETwentyHours=function(child){
       if(child){
            var childBirthDay=moment(child.ChildBirthDate);
            var today=moment(that.today);
            var months=today.diff(childBirthDay,'months');
             if(months >= 36 && months <= 60){
                var FCH=that.matrix[child._id]['claimable_fch'];
                var ECETwentyHours=fchUtils.getECETwentyHours(FCH,child,that.today,that.attendanceList);
                
                return ECETwentyHours ;
            }else{
              return 0;
            }
        }else{
          return 0;
        }
    }

    that.getECEPlusTenHours=function(child){
      if(child){
            var childBirthDay=moment(child.ChildBirthDate);
            var today=moment(that.today);
            var months=today.diff(childBirthDay,'months');
            if(months >= 36 && months <= 60){
                var FCH=that.matrix[child._id]['claimable_fch'];
                var ECETwentyHours=fchUtils.getECETwentyHours(FCH,child,that.today,that.attendanceList);
                var ECEPlusTenHours=0;
                if(ECETwentyHours >0 || fchUtils.checkWeekTwentyHoursAttestation(child,that.today)){
                
                    ECEPlusTenHours=FCH-ECETwentyHours;
                }
               
                if(ECEPlusTenHours<0) ECEPlusTenHours=0;
               return ECEPlusTenHours;
            }else{
              return 0;
            }
            
        }else{
          return 0;
        }
    }

   
    that.calculateTotalPerHour=function(){
        var timehourTotal=[];
        var underTwoTotalperhour=0;
        var childPlace=(that.licenseConfiguration && that.licenseConfiguration.ChildPlace) ? that.licenseConfiguration.ChildPlace : 0;
           _.each($scope.timeHeaders,function(timePeriod){
            var total=0;
            //if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
            if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
              _.each(that.childList,function(child){

                  if(total <  childPlace){
                      total+=(that.matrix[child._id] && that.matrix[child._id][timePeriod]) ? that.matrix[child._id][timePeriod]:0;
                  }else{
                    return false;
                  }
               });
              if(that.firstClosure && that.holiday){
                  total= total * that.holidayMatrix * that.tempClousureMatrix  ;
                 }else if(that.holiday && !that.firstClosure){
                   total= total * that.holidayMatrix ;
                 }else if(that.firstClosure && !that.holiday){
                   total= total * that.tempClousureMatrix ;
                 }
              total= total  * that.serviceCloseMatrix ;
              timehourTotal[timePeriod]=Math.ceil(total);
              that.matrix['totalperhour']=timehourTotal;
            }else{
              total= total  * that.serviceCloseMatrix ;
              timehourTotal[timePeriod]=Math.ceil(total);
              that.matrix['totalperhour']=timehourTotal;
            }
           });
        
    
    }
    that.calTotalClaimableHours=function(){
      var total=0;
      var childPlace=(that.licenseConfiguration && that.licenseConfiguration.ChildPlace) ? that.licenseConfiguration.ChildPlace : 0;
        var maxClaimableHour=childPlace * 6;
       
         //if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
           if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){     
            _.each(that.childList,function(child){
                if(total <= maxClaimableHour)
                total+=that.matrix[child._id]['claimable_fch'];
              else
                return false;
            });
            if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix  ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix ;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix ;
              
         }
      }
      total= total  * that.serviceCloseMatrix ;
      if(total > maxClaimableHour) total=maxClaimableHour;
      that.matrix['total_claimable_fch']=Math.ceil(total);
    }
    
    that.calTotalFAR=function(){
      var total=0;
        if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){     
            _.each(that.childList,function(child){
                
                total+=that.matrix[child._id]['far'];
             });
            if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix  ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix ;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix ;
              
         }
      }
      total = total  * that.serviceCloseMatrix ;
      that.matrix['total_far']=Math.ceil(total);
    }

    that.calTotalAttendedHours=function(){
      var total=0;
       //if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
         if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){   
        _.each(that.childList,function(child){
            total+=that.matrix[child._id]['total_hours_attended'];
            
        });
        if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix ;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix ;
              
         }
      }
      total= total  * that.serviceCloseMatrix ;
        that.matrix['total_attended_hours']=Math.ceil(total);
    }



    

    that.calTotalEceFundingUnderTwoFCH=function(){
       var total=0;
       var maxTotal = (that.licenseConfiguration && that.licenseConfiguration.UnderTwo) ? that.licenseConfiguration.UnderTwo * 6 : 0;
        //if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
            if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
        _.each(that.childList,function(child){
            //total+=fchUtils.getEceFundingUnderTwoFCH(child,that.today,that.matrix);
            total+=that.matrix[child._id]['ece_under_two_fch'];
        });
        if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix;
              
         }
      }
      total= total  * that.serviceCloseMatrix ;
      if(total>maxTotal) total=maxTotal;
       that.matrix['total_ecefuncding_under_two']=Math.ceil(total); 
    }
    that.calTotalEceFundingOverTwoAndLessThanSix=function(){
        var total=0;
        var maxTotal = (that.licenseConfiguration && that.licenseConfiguration.OverTwo) ? that.licenseConfiguration.OverTwo * 6 : 0;
         //if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
        if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
        _.each(that.childList,function(child){
            //total+=fchUtils.getEceFundingOverTwoAndLessThanSix(child,that.today,that.attendanceList,that.matrix);
            total+=that.matrix[child._id]['ece_over_two_and_less_than_six'];
        });
        if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix;
              
         }
      }
       total= total  * that.serviceCloseMatrix ;
       if(total>maxTotal) total=maxTotal;
        that.matrix['total_ecefuncding_over_two_and_less_six']=Math.ceil(total); 
    }

    that.calTotalECETwentyHours=function(){
          var total=0
         //  if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
            if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
        _.each(that.childList,function(child){
              /*total+=that.getECETwentyHours(child);*/
              total+=that.matrix[child._id]['twenty_hours_ece'];
        });
        if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix;
          }
      }
        total= total  * that.serviceCloseMatrix ;
        that.matrix['total_ecetwenty_hours']=Math.ceil(total); 
    }

    that.calTotalECEPlusTenHours=function(){
         var total=0
        //if(that.currentCentre.CenterStatus=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
          if(that.licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
          _.each(that.childList,function(child){
                //total+=that.getECEPlusTenHours(child);
                total+=that.matrix[child._id]['plus_ten_hours'];
          });

           if(that.firstClosure && that.holiday){
            total= total * that.holidayMatrix * that.tempClousureMatrix ;
           }else if(that.holiday && !that.firstClosure){
             total= total * that.holidayMatrix ;
           }else if(that.firstClosure && !that.holiday){
             total= total * that.tempClousureMatrix ;
              
         }

        }
        total= total  * that.serviceCloseMatrix ;
        that.matrix['total_plus_ten_hours']=Math.ceil(total); 
    }


    /**
      Functions For weekly Limit calculation
    **/

    
    

    function getDailyMatrix(day){
      var d=$q.defer();
      var dayMatrix=[];
      var licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,day);
      var serviceCloseMatrix=0;
      /* Service Closed Matrix */
    if(that.centerstatusData && licenseConfiguration){
      
          if(that.centerstatusData[licenseConfiguration.Status]=="Funded"){
            serviceCloseMatrix=1;
          }else{
            serviceCloseMatrix=0;
          }
      }
      var temporaryClosureList=[];
      var holidayList=[];
      var eceServiceschedule=[];
      var lastThreeWeeksAttendanceList=[];
      var twelveWeekAttendanceList=[];
      var childList=[];
      var attendanceList=[];
      var lastfivedaysAttendance=[];
      var twelveWeekAttendanceList=[];
      var childFARCounter={};
      var holiday=null,holidayMatrix=null,firstClosure=null,tempClousureMatrix=null;
      var promise=formlyapi.getDailyFch(new Date(day).toISOString()).then(function(data){
          that.currentCentre=data.currentCentre;
          childFARCounter=data.absenceFARCounter;
          
          childList=fchUtils.filterAttendedOrBookedChild(day,data.childList,data.attendanceList);
          temporaryClosureList=(data.temporaryClosureList) ? data.temporaryClosureList:null;
          holidayList=(data.holidayList) ? data.holidayList:null;
          attendanceList=(data.attendanceList) ? data.attendanceList : null;
          eceServiceschedule=fchUtils.getEffectiveServiceSchedule(data.eceServiceschedule,day); //(data.eceServiceschedule) ? data.eceServiceschedule:null;
          lastfivedaysAttendance=data.lastFiveDaysattendanceList;
          twelveWeekAttendanceList=data.LastTwelveWeekAttendance;
          lastThreeWeeksAttendanceList=[];
          var datesArray=fchUtils.getLastThreeWeekDates(day,holidayList,temporaryClosureList,that.absenceReasonMap);
        _.each(datesArray,function(date){
          if(date){
              var attendanceParam = {
                  query: JSON.stringify({
                    Child:getParams(childList),
                    Date: {"$gte": timeFix(date, false), "$lte": timeFix(date, true)},
                  })
                }
              formlyAdapter.getList('attendance',attendanceParam).then(function(obj){
                 lastThreeWeeksAttendanceList[date]=obj;
              });
          }
            
        });
          if(eceServiceschedule && eceServiceschedule.length){
              serviceCloseMatrix=fchUtils.checkServiceSchedule(eceServiceschedule,day);
          }
        if(holidayList && holidayList.length){

          _.each(holidayList,function(holiDay){
              if(holiDay){
                var holidayDay=new Date(holiDay.Date).getDate();
                var holidayMonth=new Date(holiDay.Date).getMonth()+1;
                var holidayYear=new Date(holiDay.Date).getYear();
                var todayDay=new Date(day).getDate();
                var todayMonth=new Date(day).getMonth()+1;
                var todayYear=new Date(day).getYear();
               
                if(holiDay.ReoccurYearly && holidayDay==todayDay && holidayMonth==todayMonth){
                    holiday=holiDay;
                    if(holiDay.canMarkAttendance){
                     holidayMatrix=1;
                    }else{
                      holidayMatrix=0;
                    }
                    return false;
                }else if(holidayDay==todayDay && holidayMonth==todayMonth && holidayYear==todayYear){ 

                  holiday=holiDay;

                  if(holiDay.canMarkAttendance){
                   holidayMatrix=1;
                  }else{
                    holidayMatrix=0;
                  } 
                  

                  return false;
                }else{
                  holiday=null;
                  holidayMatrix=null;
                }
                
              }
          })
          
        }

        if(temporaryClosureList && temporaryClosureList.length){
         
          _.each(temporaryClosureList,function(data){
            
              firstClosure = data;
             var closureDay=new Date(firstClosure.ClosureStartDate).getDate();
              var closureMonth=new Date(firstClosure.ClosureStartDate).getMonth()+1;
              var closureYear=new Date(firstClosure.ClosureStartDate).getYear();
              var todayDay=new Date(day).getDate();
              var todayMonth=new Date(day).getMonth()+1;
              var todayYear=new Date(day).getYear();
              
            if(firstClosure && firstClosure.ClosureReasonCode && (closureDay==todayDay && closureMonth==todayMonth && closureYear==todayYear) ){
              var clousureData=(data.ClosureReasonCode._id) ? data.ClosureReasonCode._id:data.ClosureReasonCode;
              
              if(that.absenceReasonMap[clousureData].IsFunded){

                tempClousureMatrix=1;
              }else{
                tempClousureMatrix=0;
              }
              return false;
            }else{
              firstClosure=null;
              tempClousureMatrix=null;
            }
          });
        }
        if(childList && childList.length){

          _.each(childList,function(child){
                dayMatrix[child._id]=[];
                  //if(licenseConfiguration.Status=='Open' && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
                    if(licenseConfiguration && that.currentCentre.ServiceId!='' && that.bookingHoursCondition){
                       if(firstClosure && holiday){
                           dayMatrix[child._id]['total_hours_attended']=serviceCloseMatrix*holidayMatrix * tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child,day,eceServiceschedule,attendanceList,childList,that.currentCentre.ChildPlace,lastThreeWeeksAttendanceList,holidayList,temporaryClosureList,licenseConfiguration,lastfivedaysAttendance,that.absenceReasonMap,twelveWeekAttendanceList,childFARCounter);  
                           dayMatrix[child._id]['claimable_fch']=dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * holidayMatrix * tempClousureMatrix * serviceCloseMatrix  : serviceCloseMatrix*holidayMatrix * tempClousureMatrix * 6;
                          }else if(holiday && !firstClosure){
                          dayMatrix[child._id]['total_hours_attended']=serviceCloseMatrix* holidayMatrix *  fchUtils.getChildAttededOrBookedHours(child,day,eceServiceschedule,attendanceList,childList,that.currentCentre.ChildPlace,lastThreeWeeksAttendanceList,holidayList,temporaryClosureList,licenseConfiguration,lastfivedaysAttendance,that.absenceReasonMap,twelveWeekAttendanceList,childFARCounter);  
                          dayMatrix[child._id]['claimable_fch']=dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * holidayMatrix* serviceCloseMatrix   : serviceCloseMatrix*holidayMatrix *  6;
                       }else if(firstClosure && !holiday){
                        dayMatrix[child._id]['total_hours_attended']= serviceCloseMatrix* tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child,day,eceServiceschedule,attendanceList,childList,that.currentCentre.ChildPlace,lastThreeWeeksAttendanceList,holidayList,temporaryClosureList,licenseConfiguration,lastfivedaysAttendance,that.absenceReasonMap,twelveWeekAttendanceList,childFARCounter);  
                          
                          dayMatrix[child._id]['claimable_fch']=dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * serviceCloseMatrix*tempClousureMatrix   : serviceCloseMatrix*tempClousureMatrix *  6;
                      }else{
                          dayMatrix[child._id]['total_hours_attended']=serviceCloseMatrix*fchUtils.getChildAttededOrBookedHours(child,day,eceServiceschedule,attendanceList,childList,that.currentCentre.ChildPlace,lastThreeWeeksAttendanceList,holidayList,temporaryClosureList,licenseConfiguration,lastfivedaysAttendance,that.absenceReasonMap,twelveWeekAttendanceList,childFARCounter);  
                          
                          dayMatrix[child._id]['claimable_fch']=dayMatrix[child._id]['total_hours_attended'] < 6 ? serviceCloseMatrix*dayMatrix[child._id]['total_hours_attended']   : serviceCloseMatrix* 6;
                      }

                        
                }else{
                    dayMatrix[child._id]['total_hours_attended']=serviceCloseMatrix*fchUtils.getChildAttededOrBookedHours(child,day,eceServiceschedule,attendanceList,childList,that.currentCentre.ChildPlace,lastThreeWeeksAttendanceList,holidayList,temporaryClosureList,licenseConfiguration,lastfivedaysAttendance,that.absenceReasonMap,twelveWeekAttendanceList,childFARCounter);  
                    dayMatrix[child._id]['claimable_fch']=dayMatrix[child._id]['total_hours_attended'] < 6 ? serviceCloseMatrix* dayMatrix[child._id]['total_hours_attended'] *0  : serviceCloseMatrix*6 *0;
                 }

           });                                                
             dayMatrix['day']=day;
          }
    
          
         d.resolve(dayMatrix);
       });
       
        return d.promise;
       
   }

   function calWeeklyLimit(){
    

    if(that.weekDates && that.weekDates.length){
        var promises=[];
        that.weeklyMatrix={};
        
        
        
          _.each(that.weekDates,function(day){

             if(new Date(day).setHours(0,0,0,0) < new Date(that.today).setHours(0,0,0,0)){ 
              var d=$q.defer();
                getDailyMatrix(day).then(function(matrix){
                     _.each(that.childList,function(child){
                          if(matrix[child._id]){
                             if(that.weeklyMatrix[child._id] >=30){
                              return; 
                             }
                             if(!that.weeklyMatrix[child._id]){
                              
                                 that.weeklyMatrix[child._id]=parseInt(matrix[child._id]['claimable_fch']);
                              }else{
                                
                                that.weeklyMatrix[child._id]=parseInt(that.weeklyMatrix[child._id] + matrix[child._id]['claimable_fch']);   
                              }
                             
                          }

                      });
                     
                       d.resolve(that.weeklyMatrix);
                          
                     });
                 promises.push(d.promise);
             }
             

            
          });  
          
         return $q.all(promises).then(function(data){
                
               return that.weeklyMatrix;
               
         })
          
      }

   }


    /*
      Weekly calculation function end
    */

    that.calculateClaimableFCH=function(total,weeklyLimit){
      var fch=0;
     
      if(total<=weeklyLimit){
            if(weeklyLimit<=6){
               if(total<=weeklyLimit){
                  fch=total;
               }else{
                fch=weeklyLimit;
               }
              
            }else if(total <=6){
              fch=total;
            }else{
              fch=6;
            }
          }else{
            if(weeklyLimit >= 6 && total >=6){
                fch=6;
            }else{
              fch=weeklyLimit;
            }
          }
     
      return fch;
    }
  function initTable() {
    that.matrix = null;
    that.licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,that.today);
    
    /* Service Closed Matrix */
    if(that.centerstatusData && that.licenseConfiguration){

          if(that.centerstatusData[that.licenseConfiguration.Status]=="Funded"){
            that.serviceCloseMatrix=1;
          }else{
            that.serviceCloseMatrix=0;
          }
      }else{
        that.serviceCloseMatrix=0;
      }
    
  $cookies.put('fchdate', new Date(that.today), {});
 
    formlyapi.getDailyFch(new Date(that.today).toISOString()).then(function(data) {
        that.currentCentre = data.currentCentre;
        that.childList = fchUtils.filterAttendedOrBookedChild(that.today, data.childList, data.attendanceList);
        that.temporaryClosureList = data.temporaryClosureList;
        that.holidayList = data.holidayList;
        that.attendanceList = data.attendanceList;
        that.eceServiceschedule = fchUtils.getEffectiveServiceSchedule(data.eceServiceschedule,that.today);
        that.bookingHoursCondition=that.checkBookingHoursCondition();
        if(that.eceServiceschedule){
            that.serviceCloseMatrix=fchUtils.checkServiceSchedule(that.eceServiceschedule,that.today);
        }
        /*holiday matrix*/
        if (that.holidayList && that.holidayList.length) {
          
            _.each(that.holidayList, function(holiday) {
                if (holiday) {
                    var holidayDay = new Date(holiday.Date).getDate();
                    var holidayMonth = new Date(holiday.Date).getMonth() + 1;
                    var holidayYear = new Date(holiday.Date).getYear();
                    var todayDay = new Date(that.today).getDate();
                    var todayMonth = new Date(that.today).getMonth() + 1;
                    var todayYear = new Date(that.today).getYear();
                    if (holiday.ReoccurYearly && holidayDay == todayDay && holidayMonth == todayMonth) {
                        that.holiday = holiday;
                        if (holiday.canMarkAttendance) {
                            that.holidayMatrix = 1;
                        } else {
                            that.holidayMatrix = 0;
                        }
                        return false;
                    } else if (holidayDay == todayDay && holidayMonth == todayMonth && holidayYear == todayYear) {
                        that.holiday = holiday;
                        
                        if (holiday.canMarkAttendance) {
                            that.holidayMatrix = 1;
                        } else {
                            that.holidayMatrix = 0;
                        }
                        return false;
                    } else {
                        that.holiday = null;
                        that.holidayMatrix = null;
                    }
                }
            })
        }
        /*holiday matrix ends*/


        /*temp closure matrix*/
        if (that.temporaryClosureList && that.temporaryClosureList.length) {
            _.each(that.temporaryClosureList, function(data) {
                that.firstClosure = data;
                var closureStartDay=moment(that.firstClosure.ClosureStartDate);
                var closureEndDay=moment(that.firstClosure.ClosureEndDate);
                var today=moment(that.today);
                
                if(today.isBetween(closureStartDay,closureEndDay) || today.isSame(closureStartDay,'day') || today.isSame(closureEndDay,'day')){
                   
                     var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;
                      if (that.absenceReasonMap[clousureData].IsFunded) {
                          that.tempClousureMatrix = 1;
                      } else {
                          that.tempClousureMatrix = 0;
                      }
                      return false;
                 
                }else{
                  var closureDay = new Date(that.firstClosure.ClosureStartDate).getDate();
                  var closureMonth = new Date(that.firstClosure.ClosureStartDate).getMonth() + 1;
                  var closureYear = new Date(that.firstClosure.ClosureStartDate).getYear();
                  var todayDay = new Date(that.today).getDate();
                  var todayMonth = new Date(that.today).getMonth() + 1;
                  var todayYear = new Date(that.today).getYear();
                  if (that.firstClosure && that.firstClosure.ClosureReasonCode && (closureDay == todayDay && closureMonth == todayMonth && closureYear == todayYear)) {
                      var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;
                      if (that.absenceReasonMap[clousureData].IsFunded) {
                          that.tempClousureMatrix = 1;
                      } else {
                          that.tempClousureMatrix = 0;
                      }
                      return false;
                  } else {
                      that.firstClosure = null;
                      that.tempClousureMatrix = null;
                  }
                }
                
            });
        }
        /*temp closure matrix ends*/
 
        $scope.getTimeHeaders(that.today,that.eceServiceschedule,that.childList,that.attendanceList);
        var dateParams={"$gte": fchUtils.timeFix(that.today, false), "$lte": fchUtils.timeFix(that.today, true)};
        formlyAdapter.getList('dailyfchmatrix', {query:JSON.stringify({Date:dateParams})}).then(function (obj) {
           if(obj && obj.length){
              
              that.matrix=[];
              _.each(obj[0].matrix,function(objMatrix){
                  
                  that.matrix[objMatrix.Child]=objMatrix;
                })

                that.matrix['total_attended_hours']=obj[0].total_attended_hours;
                that.matrix['total_claimable_fch']=obj[0].total_claimable_fch;
                that.matrix['total_ecefuncding_over_two_and_less_six']=obj[0].total_ecefuncding_over_two_and_less_six;
                that.matrix['total_ecefuncding_under_two']=obj[0].total_ecefuncding_under_two;
                that.matrix['total_ecetwenty_hours']=obj[0].total_ecetwenty_hours;
                that.matrix['total_far']=obj[0].total_far;
                that.matrix['total_plus_ten_hours']=obj[0].total_plus_ten_hours;
                that.calculateTotalPerHour();
               
            }
                
                $timeout(function() { 

                if (that.currentCentre && that.licenseConfiguration && ((that.licenseConfiguration.Status != 'Open' && that.licenseConfiguration.Status != 'Provisional') || that.currentCentre.ServiceId == '' || !that.bookingHoursCondition)) {
                    if (that.licenseConfiguration.Status != 'Open' && that.licenseConfiguration.Status != 'Provisional') {
                        dialog.showOkDialog("Error", "Current centre Status is not funded");
                    } else if (that.currentCentre.ServiceId == '') {
                        dialog.showOkDialog("Error", "Service ID missing");
                    } else if (!that.bookingHoursCondition) {
                        dialog.showOkDialog("Error", "Centre doesn't meet criteria of minimum booking per day");
                    }
                }else if(!that.licenseConfiguration){
                  dialog.showOkDialog("Error", "Current centre status is not defined");
                }else if(!that.serviceCloseMatrix){
                    dialog.showOkDialog("Error", "Centre is not Scheduled for today");
                }
                $scope.$broadcast('dataloaded');
            }, 100);
                
            });
    });
  }
/*function initTable() {
    that.matrix = [];
    that.licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,that.today);
    
    /* Service Closed Matrix *
    if(that.centerstatusData && that.licenseConfiguration){

          if(that.centerstatusData[that.licenseConfiguration.Status]=="Funded"){
            that.serviceCloseMatrix=1;
          }else{
            that.serviceCloseMatrix=0;
          }
      }else{
        that.serviceCloseMatrix=0;
      }
      
     

    $cookies.put('fchdate', new Date(that.today), {});
    formlyapi.getDailyFch(new Date(that.today).toISOString()).then(function(data) {
        that.currentCentre = data.currentCentre;
        that.childList = fchUtils.filterAttendedOrBookedChild(that.today, data.childList, data.attendanceList);
        that.childFARCounter=data.absenceFARCounter;
        that.temporaryClosureList = data.temporaryClosureList;
        that.holidayList = data.holidayList;
        that.attendanceList = data.attendanceList;
        that.eceServiceschedule = fchUtils.getEffectiveServiceSchedule(data.eceServiceschedule,that.today);
        that.lastThreeWeeksAttendanceList = [];
        that.lastfivedaysAttendance=data.lastFiveDaysattendanceList;
        that.TwelveWeekAttendanceList=data.LastTwelveWeekAttendance;
        that.bookingHoursCondition=that.checkBookingHoursCondition();
        if(that.eceServiceschedule){
            that.serviceCloseMatrix=fchUtils.checkServiceSchedule(that.eceServiceschedule,that.today);
        }

        /*holiday matrix*
        if (that.holidayList && that.holidayList.length) {
          
            _.each(that.holidayList, function(holiday) {
                if (holiday) {
                    var holidayDay = new Date(holiday.Date).getDate();
                    var holidayMonth = new Date(holiday.Date).getMonth() + 1;
                    var holidayYear = new Date(holiday.Date).getYear();
                    var todayDay = new Date(that.today).getDate();
                    var todayMonth = new Date(that.today).getMonth() + 1;
                    var todayYear = new Date(that.today).getYear();
                    if (holiday.ReoccurYearly && holidayDay == todayDay && holidayMonth == todayMonth) {
                        that.holiday = holiday;
                        if (holiday.canMarkAttendance) {
                            that.holidayMatrix = 1;
                        } else {
                            that.holidayMatrix = 0;
                        }
                        return false;
                    } else if (holidayDay == todayDay && holidayMonth == todayMonth && holidayYear == todayYear) {
                        that.holiday = holiday;
                        
                        if (holiday.canMarkAttendance) {
                            that.holidayMatrix = 1;
                        } else {
                            that.holidayMatrix = 0;
                        }
                        return false;
                    } else {
                        that.holiday = null;
                        that.holidayMatrix = null;
                    }
                }
            })
        }
        /*holiday matrix ends*

        /*temp closure matrix*
        if (that.temporaryClosureList && that.temporaryClosureList.length) {
            _.each(that.temporaryClosureList, function(data) {
                that.firstClosure = data;
                var closureStartDay=moment(that.firstClosure.ClosureStartDate);
                var closureEndDay=moment(that.firstClosure.ClosureEndDate);
                var today=moment(that.today);
                
                if(today.isBetween(closureStartDay,closureEndDay) || today.isSame(closureStartDay,'day') || today.isSame(closureEndDay,'day')){
                   
                   // if (that.firstClosure && that.firstClosure.ClosureReasonCode && (closureDay == todayDay && closureMonth == todayMonth && closureYear == todayYear)) {
                      var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;
                      if (that.absenceReasonMap[clousureData].IsFunded) {
                          that.tempClousureMatrix = 1;
                      } else {
                          that.tempClousureMatrix = 0;
                      }
                      return false;
                  /*} else {
                      that.firstClosure = null;
                      that.tempClousureMatrix = null;
                  }*
                }else{
                  var closureDay = new Date(that.firstClosure.ClosureStartDate).getDate();
                  var closureMonth = new Date(that.firstClosure.ClosureStartDate).getMonth() + 1;
                  var closureYear = new Date(that.firstClosure.ClosureStartDate).getYear();
                  var todayDay = new Date(that.today).getDate();
                  var todayMonth = new Date(that.today).getMonth() + 1;
                  var todayYear = new Date(that.today).getYear();
                  if (that.firstClosure && that.firstClosure.ClosureReasonCode && (closureDay == todayDay && closureMonth == todayMonth && closureYear == todayYear)) {
                      var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;
                      if (that.absenceReasonMap[clousureData].IsFunded) {
                          that.tempClousureMatrix = 1;
                      } else {
                          that.tempClousureMatrix = 0;
                      }
                      return false;
                  } else {
                      that.firstClosure = null;
                      that.tempClousureMatrix = null;
                  }
                }
                
            });
        }
        /*temp closure matrix ends*
        var datesArray = fchUtils.getLastThreeWeekDates(that.today, that.holidayList, that.temporaryClosureList,that.absenceReasonMap);
        $scope.getTimeHeaders(that.today,that.eceServiceschedule,that.childList,that.attendanceList);
       
        var promises  = [];
        _.each(datesArray, function(date) {
            if (date) {

              var deffered = $q.defer();
              // console.log(date)
                var attendanceParam = {
                    query: JSON.stringify({
                        Child: getParams(),
                        Date: {
                            "$gte": timeFix(date, false),
                            "$lte": timeFix(date, true)
                        },
                    })
                }
                formlyAdapter.getList('attendance', attendanceParam).then(function(obj) {
                  that.lastThreeWeeksAttendanceList[date] = obj;
                  deffered.resolve();
                });
                promises.push(deffered.promise);
            }
        })
        $q.all(promises).then(function(){
          
          if (that.childList && that.childList.length) {
              var currDay = moment(that.today).format("ddd");

              calWeeklyLimit().then(function(weeklydata) {
                var under2limitFlag=false;
                var totallimitFlag=false;
                  _.each(that.childList, function(child) {
                   
                      var weeklyLimit = (that.weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - that.weeklyMatrix[child._id] : 30;
                      
                     _.each($scope.timeHeaders, function(timePeriod) {
                         if(!that.matrix[timePeriod]){
                          that.matrix[timePeriod] = [];
                         }
                          var val = 0;
                          //if (that.licenseConfiguration && that.licenseConfiguration.Status == 'Open' && that.currentCentre.ServiceId != '' && that.bookingHoursCondition) {
                            if (that.licenseConfiguration && that.currentCentre.ServiceId != '' && that.bookingHoursCondition) {
                              if (that.firstClosure && that.holiday) {
                                  val = that.holidayMatrix * that.tempClousureMatrix * fchUtils.checkChildAttendanceOrBooking(timePeriod, child, that.today, that.attendanceList, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              } else if (that.holiday && !that.firstClosure) {
                                  val = that.holidayMatrix * fchUtils.checkChildAttendanceOrBooking(timePeriod, child, that.today, that.attendanceList, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              } else if (that.firstClosure && !that.holiday) {
                                  val = that.tempClousureMatrix * fchUtils.checkChildAttendanceOrBooking(timePeriod, child, that.today, that.attendanceList, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              } else {
                                  val = fchUtils.checkChildAttendanceOrBooking(timePeriod, child, that.today, that.attendanceList, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              }
                              var childBirthDay = moment(child.ChildBirthDate);
                              var day = moment(that.today);
                              var months = day.diff(childBirthDay, 'months');

                              if(months < 24){
                                  
                                 if(that.matrix[timePeriod] && that.matrix[timePeriod]['under2']){
                                     
                                  if(that.matrix[timePeriod]['under2']['value'] + val <= that.licenseConfiguration.UnderTwo){
                                    that.matrix[timePeriod]['under2']['value']=that.matrix[timePeriod]['under2']['value']+val; 
                                    that.matrix[timePeriod]['under2']['flag']=false;
                                  }else{
                                    under2limitFlag = true; 
                                    that.matrix[timePeriod]['under2']['flag']=true;
                                    that.matrix[timePeriod]['under2']['adjustedvalue']++;
                                    
                                  }
                                }else{
                                   that.matrix[timePeriod]['under2']=[];
                                   that.matrix[timePeriod]['under2']['value']= val;
                                   that.matrix[timePeriod]['under2']['flag']=false;
                                   that.matrix[timePeriod]['under2']['adjustedvalue']=0;
                                }
                                 
                                    
                              }
                              if(that.matrix[timePeriod]['total']){
                                if(that.matrix[timePeriod]['total']+val <=that.licenseConfiguration.ChildPlace){
                                    that.matrix[timePeriod]['total']=that.matrix[timePeriod]['total']+val;
                                }else{
                                  totallimitFlag = true; 
                                  that.matrix[timePeriod]['limitFlag']=true;
                                  that.matrix[timePeriod]['adjustedvalue']=that.matrix[timePeriod]['adjustedvalue']+val;
                                }
                             }else{
                                that.matrix[timePeriod]['total']=val;
                                that.matrix[timePeriod]['limitFlag']=false;
                                that.matrix[timePeriod]['adjustedvalue']=0
                              }
                              
                              if(that.matrix[timePeriod] && that.matrix[timePeriod]['under2'] && that.matrix[timePeriod]['under2']['adjustedvalue'] && that.matrix[timePeriod]['adjustedvalue']){
                                 //that.matrix[timePeriod]['adjustedvalue']=that.matrix[timePeriod]['adjustedvalue']-that.matrix[timePeriod]['under2']['adjustedvalue'];
                              }
                             
                              
                              if (that.matrix[child._id]) {
                                  that.matrix[child._id][timePeriod] = val * that.serviceCloseMatrix;
                                  
                              } else {
                                  that.matrix[child._id] = [];
                                  that.matrix[child._id][timePeriod] = val * that.serviceCloseMatrix;
                                  
                              }
                          } else {
                              if (that.matrix[child._id]) {
                                  that.matrix[child._id][timePeriod] = val * that.serviceCloseMatrix;
                                  
                              } else {
                                  that.matrix[child._id] = [];
                                  that.matrix[child._id][timePeriod] = val * that.serviceCloseMatrix;
                                 
                              }
                          }
                      });

                      //if (that.licenseConfiguration.Status == 'Open' && that.currentCentre.ServiceId != '' && that.bookingHoursCondition) {
                        if (that.licenseConfiguration && that.currentCentre.ServiceId != '' && that.bookingHoursCondition) {
                          if (that.firstClosure && that.holiday) {
                              
                              that.matrix[child._id]['total_hours_attended'] =that.serviceCloseMatrix* that.holidayMatrix * that.tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child, that.today,that.eceServiceschedule, that.attendanceList, that.childList, that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              //that.matrix[child._id]['claimable_fch']=that.matrix[child._id]['total_hours_attended'] < 6 ? that.matrix[child._id]['total_hours_attended'] * that.holidayMatrix * that.tempClousureMatrix  : that.holidayMatrix * that.tempClousureMatrix * 6;
                              that.matrix[child._id]['claimable_fch'] = that.serviceCloseMatrix*that.holidayMatrix * that.tempClousureMatrix * that.calculateClaimableFCH(that.matrix[child._id]['total_hours_attended'], weeklyLimit);
                              that.matrix[child._id]['ece_under_two_fch'] = that.serviceCloseMatrix*that.holidayMatrix * that.tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, that.today, that.matrix);
                              that.matrix[child._id]['ece_over_two_and_less_than_six'] = that.serviceCloseMatrix*that.holidayMatrix * that.tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, that.today, that.attendanceList, that.matrix);
                              that.matrix[child._id]['twenty_hours_ece'] = that.serviceCloseMatrix*that.holidayMatrix * that.tempClousureMatrix * that.getECETwentyHours(child);
                              that.matrix[child._id]['plus_ten_hours'] = that.serviceCloseMatrix*that.holidayMatrix * that.tempClousureMatrix * that.getECEPlusTenHours(child);
                          } else if (that.holiday && !that.firstClosure) {
                            
                              that.matrix[child._id]['total_hours_attended'] = that.serviceCloseMatrix*that.holidayMatrix * fchUtils.getChildAttededOrBookedHours(child, that.today,that.eceServiceschedule, that.attendanceList, that.childList, that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              //that.matrix[child._id]['claimable_fch']=that.matrix[child._id]['total_hours_attended'] < 6 ? that.matrix[child._id]['total_hours_attended'] * that.holidayMatrix   : that.holidayMatrix *  6;
                              that.matrix[child._id]['claimable_fch'] = that.serviceCloseMatrix*that.holidayMatrix * that.calculateClaimableFCH(that.matrix[child._id]['total_hours_attended'], weeklyLimit);
                              that.matrix[child._id]['ece_under_two_fch'] = that.serviceCloseMatrix*that.holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, that.today, that.matrix);
                              that.matrix[child._id]['ece_over_two_and_less_than_six'] = that.serviceCloseMatrix*that.holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, that.today, that.attendanceList, that.matrix);
                              that.matrix[child._id]['twenty_hours_ece'] = that.serviceCloseMatrix*that.holidayMatrix * that.getECETwentyHours(child);
                              that.matrix[child._id]['plus_ten_hours'] = that.serviceCloseMatrix*that.holidayMatrix * that.getECEPlusTenHours(child);
                          } else if (that.firstClosure && !that.holiday) {
                            
                              that.matrix[child._id]['total_hours_attended'] = that.serviceCloseMatrix*that.tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child, that.today,that.eceServiceschedule, that.attendanceList, that.childList, that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              //that.matrix[child._id]['claimable_fch']=that.matrix[child._id]['total_hours_attended'] < 6 ? that.matrix[child._id]['total_hours_attended'] * that.tempClousureMatrix   : that.tempClousureMatrix *  6;
                              that.matrix[child._id]['claimable_fch'] = that.serviceCloseMatrix*that.tempClousureMatrix * that.calculateClaimableFCH(that.matrix[child._id]['total_hours_attended'], weeklyLimit);
                              that.matrix[child._id]['ece_under_two_fch'] = that.serviceCloseMatrix*that.tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, that.today, that.matrix);
                              that.matrix[child._id]['ece_over_two_and_less_than_six'] = that.serviceCloseMatrix*that.tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, that.today, that.attendanceList, that.matrix);
                              that.matrix[child._id]['twenty_hours_ece'] = that.serviceCloseMatrix*that.tempClousureMatrix * that.getECETwentyHours(child);
                              that.matrix[child._id]['plus_ten_hours'] = that.serviceCloseMatrix*that.tempClousureMatrix * that.getECEPlusTenHours(child);
                          } else {
                            //console.log(4)
                           
                              that.matrix[child._id]['total_hours_attended'] = that.serviceCloseMatrix*fchUtils.getChildAttededOrBookedHours(child, that.today,that.eceServiceschedule, that.attendanceList, that.childList, that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                              //that.matrix[child._id]['claimable_fch']=that.matrix[child._id]['total_hours_attended'] < 6 ? that.matrix[child._id]['total_hours_attended']  :  6;
                              that.matrix[child._id]['claimable_fch'] = that.serviceCloseMatrix*that.calculateClaimableFCH(that.matrix[child._id]['total_hours_attended'], weeklyLimit);
                              that.matrix[child._id]['ece_under_two_fch'] = that.serviceCloseMatrix*fchUtils.getEceFundingUnderTwoFCH(child, that.today, that.matrix);
                              that.matrix[child._id]['ece_over_two_and_less_than_six'] = that.serviceCloseMatrix*fchUtils.getEceFundingOverTwoAndLessThanSix(child, that.today, that.attendanceList, that.matrix);
                              that.matrix[child._id]['twenty_hours_ece'] = that.serviceCloseMatrix*that.getECETwentyHours(child);
                              that.matrix[child._id]['plus_ten_hours'] = that.serviceCloseMatrix*that.getECEPlusTenHours(child);
                             
                          }

                          that.matrix[child._id]['absence'] = fchUtils.checkAbsence(child, that.today, that.attendanceList, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                          that.matrix[child._id]['three_week_rule'] = that.checkThreeWeekRule(child);
                      } else {
                          that.matrix[child._id]['total_hours_attended'] = that.serviceCloseMatrix*fchUtils.getChildAttededOrBookedHours(child, that.today,that.eceServiceschedule, that.attendanceList, that.childList, that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                          that.matrix[child._id]['absence'] = fchUtils.checkAbsence(child, that.today, that.attendanceList, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.lastfivedaysAttendance,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                          that.matrix[child._id]['three_week_rule'] = that.checkThreeWeekRule(child) * 0;
                          that.matrix[child._id]['claimable_fch'] = that.serviceCloseMatrix*that.matrix[child._id]['total_hours_attended'] < 6 ? that.matrix[child._id]['total_hours_attended'] * 0 : 6 * 0;
                          that.matrix[child._id]['ece_under_two_fch'] =that.serviceCloseMatrix*that.serviceCloseMatrix* fchUtils.getEceFundingUnderTwoFCH(child, that.today, that.matrix) * 0;
                          that.matrix[child._id]['ece_over_two_and_less_than_six'] = that.serviceCloseMatrix*fchUtils.getEceFundingOverTwoAndLessThanSix(child, that.today, that.attendanceList, that.matrix) * 0;
                          that.matrix[child._id]['twenty_hours_ece'] =that.serviceCloseMatrix* that.getECETwentyHours(child) * 0;
                          that.matrix[child._id]['plus_ten_hours'] = that.serviceCloseMatrix*that.getECEPlusTenHours(child) * 0;
                      }

                     //that.matrix[child._id]['far']=0;
                     //if(that.matrix[child._id]['absence']=='NF' && that.childFARCounter && that.childFARCounter[child._id] && that.childFARCounter[child._id].frequestabsencecounter >=3 ){
                     /* if(that.childFARCounter && that.childFARCounter[child._id] && that.childFARCounter[child._id].frequestabsencecounter >=3 ){
                        var monthKey=new Date(that.today).getMonth()+1;

                        if(that.childFARCounter[child._id].frequentAbsenceCountersFlags){
                          
                            if(that.childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey] && that.childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentHourlyAbsent){
                                that.matrix[child._id]['far']=that.childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentAbsentHours;
                            }else if(that.childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey] && (that.childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentDailyAbsent || that.childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentWeeklyAbsent)){
                                 
                                 var childAttendance=fchUtils.get_attendance(that.attendanceList, child);
                                 var childTodayBookingSchedule=fchUtils.getBookingSchedule(child, that.today);
                                 var booked_hours=0;
                                 var attended_hours=0;
                                  if (childAttendance && childAttendance.length) {
                                        _.each(childAttendance, function (att) {
                                             var attStartTime = moment(new Date(att.AttendanceTimeStart).toString(), 'DD/MM/YYYY HH:mm:ss');
                                            var attEndTime = moment(new Date(att.AttendanceTimeEnd).toString(), 'DD/MM/YYYY HH:mm:ss');
                                              attended_hours += (attEndTime.diff(attStartTime, 'minutes') / 60); 
                                        });
                                    }
                                 if (childTodayBookingSchedule && childTodayBookingSchedule.length) {
                                    _.each(childTodayBookingSchedule, function (booking) {
                                        var bookingStartTime = booking.startTime;
                                        var bookingEndTime = booking.endTime;
                                        booked_hours += (bookingEndTime.diff(bookingStartTime, 'minutes') / 60); //Math.ceil(bookingEndTime.diff(bookingStartTime,'minutes')/60);
                                    });

                                }
                                 that.matrix[child._id]['far']=(booked_hours-attended_hours > 0) ? booked_hours-attended_hours: 0;
                            }
                            
                        }
                        
                    }*
                      
                  /*console.log('hours');
                  console.log(fchUtils.getChildName(child));
                  console.log( that.matrix[child._id]['total_hours_attended']);*
                  });
                 
                  /*if(under2limitFlag){
                      that.matrix=fchUtils.adjustUnder2Values(that.today,that.matrix,that.childList,that.attendanceList,that.eceServiceschedule,that.firstClosure,that.holiday,that.holidayMatrix,that.tempClousureMatrix,that.serviceCloseMatrix,that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.weeklyMatrix,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                  }
                  
                  if(totallimitFlag){
                      that.matrix=fchUtils.adjustOver2Values(that.today,that.matrix,that.childList,that.attendanceList,that.eceServiceschedule,that.firstClosure,that.holiday,that.holidayMatrix,that.tempClousureMatrix,that.serviceCloseMatrix,that.currentCentre.ChildPlace, that.lastThreeWeeksAttendanceList, that.holidayList, that.temporaryClosureList,that.licenseConfiguration,that.lastfivedaysAttendance,that.weeklyMatrix,that.absenceReasonMap,that.TwelveWeekAttendanceList,that.childFARCounter);
                  }*
                  that.calculateTotalPerHour();
                  that.calTotalAttendedHours();
                  that.calTotalClaimableHours();
                  //that.calTotalFAR();
                  that.calTotalEceFundingUnderTwoFCH();
                  that.calTotalEceFundingOverTwoAndLessThanSix();
                  that.calTotalECETwentyHours();
                  that.calTotalECEPlusTenHours();
                  that.matrix=fchUtils.adjustTotalsforDay(that.matrix,that.licenseConfiguration);
              });

          }

        });


        $timeout(function() { 

            if (that.currentCentre && that.licenseConfiguration && ((that.licenseConfiguration.Status != 'Open' && that.licenseConfiguration.Status != 'Provisional') || that.currentCentre.ServiceId == '' || !that.bookingHoursCondition)) {
                if (that.licenseConfiguration.Status != 'Open' && that.licenseConfiguration.Status != 'Provisional') {
                    dialog.showOkDialog("Error", "Current centre Status is not funded");
                } else if (that.currentCentre.ServiceId == '') {
                    dialog.showOkDialog("Error", "Service ID missing");
                } else if (!that.bookingHoursCondition) {
                    dialog.showOkDialog("Error", "Centre doesn't meet criteria of minimum booking per day");
                }
            }else if(!that.licenseConfiguration){
              dialog.showOkDialog("Error", "Current centre status is not defined");
            }
            $scope.$broadcast('dataloaded');
        }, 100);
    });

}*/

  
 $timeout(function () {
     var user = Auth.getCurrentUser();
       var fac= ( user.facility && user.facility._id )  ? user.facility._id : user.facility;
       formlyAdapter.getList('licenseconfiguration', {query:JSON.stringify({facility:fac})}).then(function (obj) {
            that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
        });
     /* facilityService.getLicensing().then(function(obj){
          that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
        });*/
      
      formlyAdapter.getList('absencereason').then(function (data) {
          that.absenceReasons = data;
          that.filteredAbsenceReasons = _.filter(data, function (d) {
            return !d.IsTempClosureCode && d.UseForChild;
          });

          that.absenceReasonMap = {};
          _.each(data, function (d) {
            that.absenceReasonMap[d._id] = d;
          });
            setWeeklyDateRange();
          formlyAdapter.getList('centrestatus').then(function(data){
             that.centerstatusData=(data && data.length)? data[0]:null;
               initTable();
          });
        
        });
  
      
             
    });

    
});