'use strict';

angular.module("sms.fch")
  .controller('WeeklyFchCtrl', function ($timeout,$stateParams,dialog,$cookies, Auth,facilityService,formlyAdapter,
                                          $state,$scope, moment,$util,formlyapi,fchUtils) {



   var params = params && params.stateParams ? params.stateParams : $stateParams;
   
	 var that = this;
   that.lastThreeWeeksAttendanceList=[];
	 that.format='dd-MM-yyyy';
   if($cookies.get('fchweekdate')){
    that.today=new Date($cookies.get('fchweekdate'));
   }else{
    that.today=new Date();
    $cookies.put('fchweekdate',new Date(),{}); 
   }
 
	 that.childList=[];
	 that.attendanceList=[];
   that.holidayList=[];
   that.temporaryClosureList=[];
   that.currentCentre=(Auth.getCurrentUser().facility && Auth.getCurrentUser().facility.length) ? Auth.getCurrentUser().facility : null ;
   that.weeklyDateRange=[];
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
  var openAlert=function(child){ 
   var childName=that.getChildName(child);
   var msg='Funding criteria not met for '+ childName;
   dialog.showOkDialog("Alert", msg);
  }

  $scope.setWeeklyDateRange=function(){
   
   var currDay = moment(that.today).format("ddd");
      if(currDay =='Sun'){
           var startOfWeek = moment(new Date(that.today)).startOf('week').add(-6,'days').toDate();
           var endOfWeek   = moment(new Date(that.today)).endOf('week').add(-6,'days').toDate();
      }else{
           var startOfWeek = moment(new Date(that.today)).startOf('week').add(1,'days').toDate();
           var endOfWeek   = moment(new Date(that.today)).endOf('week').add(1,'days').toDate();
      }
    //var startOfWeek = moment(new Date(that.today)).startOf('week').add(1,'days').toDate();
    //var endOfWeek   = moment(new Date(that.today)).endOf('week').add(1,'days').toDate();
    var arr=[];
    var i=0;
    that.weekrange=moment(startOfWeek).format('DD-MM-YYYY')+" - "+moment(endOfWeek).format('DD-MM-YYYY');
    while(moment(startOfWeek)<=moment(endOfWeek)){
       arr[i]=new Date(startOfWeek);

      startOfWeek=moment(startOfWeek).add(1,'days');
     
      i++;
    }
    that.weeklyDateRange=arr;
    
  }
  $scope.getWeeklydateRange=function(){
    return that.weeklyDateRange;
  }
 
   $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks:'false'
  };
  $scope.filterBookedAndAttendedChildForWeek=function(childList,attendanceList){
    var weeklychildList=[];
    _.each(that.weeklyDateRange,function(day){
        
        var childListforday=fchUtils.filterAttendedOrBookedChild(day,childList,attendanceList[new Date(day).getDate()+"-"+(new Date(day).getMonth()+1)]);
         
         childListforday.map(function(child){
              var childExist=weeklychildList.filter(function(c){
                  if(c._id==child._id){
                       return true;
                  }
              });
            if(childExist && !childExist.length){
                weeklychildList.push(child);
              }   
          })
        
    });
    return weeklychildList;
  }
  that.getChildName = function (theKid) {

        var id = theKid._id ? theKid._id : theKid;
        var child = _.filter(that.childList, function (k) {
          return k._id == id;
        })[0];
        if (!child) return '--';

        return (child.PreferredGiven1Name?child.PreferredGiven1Name:child.OfficialGiven1Name) + ' ' + child.OfficialFamilyName;
    };
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
    function checkWeeklyLimit(total,weeklyLimit,child){
         
          var fchval=(total > 6)? 6:total;
         var exceedingValue=fchval-weeklyLimit;
         
         if(exceedingValue >0 ){
            if(that.weeklyMatrix['adjusted_claim']){
                  that.weeklyMatrix['adjusted_claim'][child._id]+=exceedingValue;
              }else{
                that.weeklyMatrix['adjusted_claim']=[];
                that.weeklyMatrix['adjusted_claim'][child._id]=exceedingValue;
              }
           }
      
      
    }
function calWeeklytotalperChild(day,matrix){

  _.each(that.childList,function(child){
          
           var total=(matrix[child._id] && matrix[child._id]['total_hours_attended'])? matrix[child._id]['total_hours_attended']:0;
          if(that.weeklyMatrix[child._id]){
              var currDay = moment(day).format("ddd");
              var weeklyLimit=(that.weeklyMatrix[child._id] && currDay!='Mon') ? 30 - that.weeklyMatrix[child._id] : 30;
              checkWeeklyLimit(total,weeklyLimit,child);
              that.weeklyMatrix[child._id]+=(matrix[child._id] && matrix[child._id]['claimable_fch']) ? matrix[child._id]['claimable_fch'] : 0;
            }else{
               that.weeklyMatrix[child._id]=(matrix[child._id] && matrix[child._id]['claimable_fch']) ? matrix[child._id]['claimable_fch'] : 0;  
               var currDay = moment(day).format("ddd");
               var weeklyLimit=(that.weeklyMatrix[child._id] && currDay!='Mon') ? 30 - that.weeklyMatrix[child._id] : 30;
               checkWeeklyLimit(total,weeklyLimit,child);
            }
           
            
       
    })
}
  function calWeeklytotals(matrix){
      var total=0;
    _.each(that.childList,function(child){
        total+=matrix[child._id] || 0;
//         if(that.weeklyMatrix['total_fch']){
//              that.weeklyMatrix['total_fch']+=parseInt(matrix[child._id] || 0);
//            }else{
//               that.weeklyMatrix['total_fch']=parseInt(matrix[child._id] || 0); 
//            }
        
    })
    that.weeklyMatrix['total_fch']=Math.ceil(total);
  }
    function initTable(){

      that.weeklyMatrix=[];
            $cookies.put('fchweekdate', new Date(that.today), {});
            $scope.setWeeklyDateRange(); 
            formlyapi.getWeeklyFch(that.today).then(function(data){
                that.currentCentre=data.currentCentre;
                that.childList=$scope.filterBookedAndAttendedChildForWeek(data.childList,data.attendanceList);
                that.attendanceList=data.attendanceList;
             
                var absenceReasonMap=data.absenceReasonMap;
                var start =(that.weeklyDateRange && that.weeklyDateRange[0]) ? that.weeklyDateRange[0]: new Date();
                var end = (that.weeklyDateRange && that.weeklyDateRange[that.weeklyDateRange.length-1]) ? that.weeklyDateRange[that.weeklyDateRange.length-1]: new Date();
                var weekDateParams={"$gte": fchUtils.timeFix(start, false), "$lte": fchUtils.timeFix(end, true)};
                   formlyAdapter.getList('dailyfchmatrix',{query:JSON.stringify({Date:weekDateParams})}).then(function(monthmatrix){
                   _.each(that.weeklyDateRange,function(day){
                        var getDayMatrix=null;
                        monthmatrix.map(function(m){
                                if(moment(m.Date).isSame(moment(day),'day')){
                                    getDayMatrix=m;
                                }
                         })
                    

                          var attendanceList=(that.attendanceList[new Date(day).getDate()+"-"+(new Date(day).getMonth()+1)]) ? that.attendanceList[new Date(day).getDate()+"-"+(new Date(day).getMonth()+1)]:[];

                          var childList=fchUtils.filterAttendedOrBookedChild(day,that.childList,attendanceList);
                         
                          var matrix={};
                          if(getDayMatrix){
                            
                            _.each(getDayMatrix.matrix,function(objMatrix){
                  
                              matrix[objMatrix.Child]=objMatrix;
                            })

                            matrix['total_attended_hours']=getDayMatrix.total_attended_hours;
                            matrix['total_claimable_fch']=getDayMatrix.total_claimable_fch;
                            matrix['total_ecefuncding_over_two_and_less_six']=getDayMatrix.total_ecefuncding_over_two_and_less_six;
                            matrix['total_ecefuncding_under_two']=getDayMatrix.total_ecefuncding_under_two;
                            matrix['total_ecetwenty_hours']=getDayMatrix.total_ecetwenty_hours;
                            matrix['total_far']=getDayMatrix.total_far;
                            matrix['total_plus_ten_hours']=getDayMatrix.total_plus_ten_hours;
                          }
                          that.weeklyMatrix[day]=matrix;

                          calWeeklytotalperChild(day,matrix);
                      
                    })

                })
               
                calWeeklytotals(that.weeklyMatrix);
                $scope.$broadcast('dataloaded');
                
            });

     }
    /*function initTable(){

      that.weeklyMatrix=[];
            $cookies.put('fchweekdate', new Date(that.today), {});
            $scope.setWeeklyDateRange(); 
            formlyapi.getWeeklyFch(that.today).then(function(data){
                that.currentCentre=data.currentCentre;
                that.childList=$scope.filterBookedAndAttendedChildForWeek(data.childList,data.attendanceList);
                that.temporaryClosureList=data.temporaryClosureList;
                that.holidayList=data.holidayList;
                that.attendanceList=data.attendanceList;
                that.eceServiceschedule=data.eceServiceschedule;
                that.lastThreeWeeksAttendanceList=data.LastThreeWeeksAttendance;
                that.TwelveWeekAttendanceList=data.LastTwelveWeekAttendance;
                that.childFARCounter=data.absenceFARCounter;
                var absenceReasonMap=data.absenceReasonMap;
                _.each(that.weeklyDateRange,function(day){
                    
                    var licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,day);
                    var serviceCloseMatrix=1;
                    if(that.centerstatusData && licenseConfiguration){
                      if(that.centerstatusData[licenseConfiguration.Status]=="Funded"){
                        serviceCloseMatrix=1;
                      }else{
                        serviceCloseMatrix=0;
                      }
                  }

                    var attendanceList=(that.attendanceList[new Date(day).getDate()+"-"+(new Date(day).getMonth()+1)]) ? that.attendanceList[new Date(day).getDate()+"-"+(new Date(day).getMonth()+1)]:[];

                    var childList=fchUtils.filterAttendedOrBookedChild(day,that.childList,attendanceList);
                    var currentCentre=that.currentCentre;
                    var temporaryClosureList=that.temporaryClosureList;
                    var eceServiceschedule=fchUtils.getEffectiveServiceSchedule(that.eceServiceschedule,that.today);//that.eceServiceschedule;
                    var holidayList=that.holidayList;
                    var lastThreeWeeksAttendanceList=that.lastThreeWeeksAttendanceList;
                    var TwelveWeekAttendanceList=that.TwelveWeekAttendanceList;
                    var weeklydata=that.weeklyMatrix;
                    var firstFiveDaysAttList=data.lastFiveDaysattendanceList;
                    if(eceServiceschedule){
                        serviceCloseMatrix=fchUtils.checkServiceSchedule(eceServiceschedule,day);
                    }

                    var matrix= fchUtils.getDailyMatrix(day,currentCentre,childList,eceServiceschedule,that.attendanceList,holidayList,temporaryClosureList,lastThreeWeeksAttendanceList,absenceReasonMap,weeklydata,licenseConfiguration,serviceCloseMatrix,firstFiveDaysAttList,TwelveWeekAttendanceList,that.childFARCounter);
                    //console.log(matrix);
                    that.weeklyMatrix[day]=matrix;

                    calWeeklytotalperChild(day,matrix);
                    
                })
                calWeeklytotals(that.weeklyMatrix);
                $scope.$broadcast('dataloaded');
                //$scope.$broadcast('weekselected');
            });

     }*/
  
 $timeout(function () {
        facilityService.getLicensing().then(function(obj){
          that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
        });
        formlyAdapter.getList('centrestatus').then(function(data){
           that.centerstatusData=(data && data.length)? data[0]:null;
       });
       formlyAdapter.getList('absencereason').then(function (data) {
          that.absenceReasons = data;
          that.filteredAbsenceReasons = _.filter(data, function (d) {
            return !d.IsTempClosureCode && d.UseForChild;
          });

          that.absenceReasonMap = {};
          _.each(data, function (d) {
            that.absenceReasonMap[d._id] = d;
          });
          

          initTable();
        });
  
      
    }, 100);

    
});