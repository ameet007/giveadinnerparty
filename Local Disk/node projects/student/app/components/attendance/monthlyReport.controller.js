'use strict';

angular.module("sms.attendance")
  .controller('MonthlyAttendanceCtrl', function ($timeout,dialog,$q, $rootScope, messageService, Auth, formlyAdapter, facilityService, fchUtils,
                                          $state, ngTableParams, tableService, $scope, growlService, moment, $util) {
  
    var buildTime = function (dtg) {
      var d = dtg || new Date();
      d.setHours(d.getHours(), d.getMinutes(), 0, 0);
      return d;
    };
    
    var that = this;
    that.format='dd-MM-yyyy';
    that.stopDate = new Date();
    that.startDate = new Date(that.stopDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    that.month=new Date();
    that.attendanceList=[];
    that.frequestabsencecounter=0;
   
    /*that.monthDates=[];
    that.daysCount={};*/
    $scope.daywithKey={
      'Mon':'Monday',
      'Tue':'Tuesday',
      'Wed':'Wednesday',
      'Thur':'Thursday',
      'Fri':'Friday',
      'Sat':'Saturday',
      'Sun':'Sunday'
    };
    $scope.days = [ 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat','Sun'];
    $scope.weeks = [ 'WK1', 'WK2', 'WK3', 'WK4', 'WK5'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var getDaysCount=function(monthDates){
      var daysCount={};
        _.each(days,function(val){
            daysCount[val]=weekdaysBetween(monthDates[0],monthDates[monthDates.length-1],val);
      });
      return daysCount;
    }
   var setmonthDates=function(month){
       var monthDates=[];
       var y = month.getFullYear(), m = month.getMonth();
       var firstDay = new Date(y, m, 1);
       var lastDay = new Date(y, m + 1, 0);
      
      while(firstDay <=lastDay){
        monthDates.push(firstDay);
        firstDay=new Date(firstDay.getTime()+24*60*60*1000);
      }
      
     return monthDates;

     
   }

   function weekAndDay(day) {

      var date = new Date(day), prefixes = {1:'First', 2:'Second', 3:'Third', 4:'Fourth', 5:'Fifth',6:'Sixth'};
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return prefixes[0 | Math.ceil((date.getDate() + firstDay)/7)];

  }

    var getTime = function(t) {
      // parse out mil time to hours/min and set that on a new date
      var d = new Date();
      d.setTime(that.month.getTime());
      d.setHours(t.split(":")[0]);
      d.setMinutes(t.split(":")[1], 0, 0);
      return d;
    }

    var checkTimes = function(t) {
      var match = false;
      var day = days[that.month.getDay()];
      var start = t[day+"Start"], end = t[day+"End"];

      var obj = null;
      if ( start && end ) {
        obj = {start: getTime(start), end: getTime(end)};
      }
      return obj;
    }

    

    that.getChildName = function (theKid) {
      var id = theKid._id ? theKid._id : theKid;
      var child = _.filter(getChildList(true), function (k) {
        return k._id == id;
      })[0];
      if (!child) return '--';

      return (child.PreferredGiven1Name?child.PreferredGiven1Name:child.OfficialGiven1Name) + ' ' + child.OfficialFamilyName;
    };

   

   var f1 = $scope.$watch(function (scope) {
      return ( that.selectedChild );
    }, initTable);
     var initialized = false;
    

    var f2 = $scope.$watch(function (scope) {
      return ( that.month );
    }, function () {
        that['startOpened'] = false;
         initTable();
   });

    $scope.$on('destroy', function () {
      f1();
      f2();
    })
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

    function initTable() {
      if (!that.selectedChild) return;
      that.monthDates=setmonthDates(that.month);
      that.daysCount=getDaysCount(that.monthDates);
      that.tableMonthlyEdit = new ngTableParams({
        count: 10,           // count per page
        page: 1
      }, {
        total: that.attendanceList.length, // length of data
        getData: function ($defer, params) {
          $timeout(checkLoaded($defer), 100);
        }
      });
   
    }
    
    
    that.getDay=function(date){
        return days[date.getDay()];
    }
    
    function weekdaysBetween(d1, d2, isoWeekday) {
      
        d1 = moment(d1);
        d2 = moment(d2);
       
        var daysToAdd = ((7 + isoWeekday) - d1.isoWeekday()) % 7;
        var nextTuesday = d1.clone().add(daysToAdd, 'days');
       
        if (nextTuesday.isAfter(d2)) {
            return 0;
        }
       
        var weeksBetween = d2.diff(nextTuesday, 'weeks');
        return weeksBetween + 1;
  }
  
  that.getRowClass=function(row){

       var flag=detectFrequentAbsencePattern(row,that.absentDays,that.daysCount,that.attendLessthanBooking,that.weekdaysArr,that.bookedDays);
       
       if(flag){
          return 'danger';
       }else{
        return '';
       }
  }

 function detectFrequentAbsencePattern(row,absentDays,daysCount,attendLessthanBooking,weekdaysArr,bookedDays){
    var att=row.attendance;
     var booking=row.booking;
     var day=att.Date;

     var bookedHours=((booking && booking.length)) ? (((booking[0].endTime - booking[0].startTime) / (1000*60*60)) % 24): 0;
     if(bookedHours >6) bookedHours=6;
     if((att && att.AttendanceTimeEnd) &&  (booking && booking.length)){
          var attendedHours=(att && att.AttendanceTimeEnd) ? (((att.AttendanceTimeEnd- att.AttendanceTimeStart) / (1000*60*60)) % 24): 0;
         var absenceReason='';
         if(att.IsAbsent)
           absenceReason=(that.absenceReasonMap[att.AbsenceReason] && that.absenceReasonMap[att.AbsenceReason].Description) ? that.absenceReasonMap[att.AbsenceReason].Description:att.AbsenceReason.Description; 
             
         if(att.IsAbsent && absenceReason!='Exempt' && absentDays[days[att.Date.getDay()]] >= Math.ceil(daysCount[days[att.Date.getDay()]]/2)){
             return 1;
         }else if(!att.AttendanceTimeEnd && attendLessthanBooking >= Math.ceil(bookedDays /2) && attendedHours <  bookedHours){
              return 1;
         }else if(weekdaysArr[weekAndDay(day)]){
            var totalweeks=weekdaysArr.length;
            var frequestabsencecount=0;
            _.each(weekdaysArr,function(obj){
                if(obj && obj.attendance && obj.booking){
                  if(obj.attendance < obj.booking){
                    frequestabsencecount++;
                  }
                }
            });
            if(frequestabsencecount >= Math.ceil(totalweeks/2)){
               return 1;
            }
         }
     }else if(!(att && att.AttendanceTimeEnd) && (booking && booking.length) ){
       return 1;
     }
     /*else if(!(att && att.AttendanceTimeEnd) && (booking && booking.length) ){ console.log('hii'+att.Date)
           if(att.IsAbsent && absentDays[days[att.Date.getDay()]] >= Math.ceil(daysCount[days[att.Date.getDay()]]/2)){
              absenceReason=(that.absenceReasonMap[att.AbsenceReason] && that.absenceReasonMap[att.AbsenceReason].Description) ? that.absenceReasonMap[att.AbsenceReason].Description:att.AbsenceReason.Description; 
              if(absenceReason=='Exempt'){
                return 0;
              }else{
                return 1;  
              }
              
          }
     }*/
     
     return 0;
 }

 function setFrequentAbsenceCounter(month,child){
  that.frequestabsencecounter=0;
  that.filteredData=[];
    var booking=getBooking(child,month);
   
    var bookingEffDate=(booking && booking.EffectiveDate) ? booking.EffectiveDate : null;
 
 //   if(!moment(month).isSame(moment(bookingEffDate),'month')){ 
  if(moment(month).isAfter(moment(bookingEffDate),'month') || moment(month).isSame(moment(bookingEffDate),'month')){    
          
          var startMonth=moment(bookingEffDate);
          var promises=[];
         
            while(startMonth.isBefore(moment(month),'month') || startMonth.isSame(moment(month),'month') ){
              
          
             var monthDates=setmonthDates(startMonth.toDate());
             _.each(monthDates,function(day,i){
                if(moment(day).isBefore(moment(bookingEffDate),'day')){
                     delete(monthDates[i]);
                    }
                 });
           
              var promise=getAttendanceData(startMonth,that.selectedChild).then(function (data) {
                    return data;
                 });
               
                   
              startMonth=startMonth.add(1,'month');
              promises.push(promise);
            }
            $q.all(promises).then(function(data){

                 _.each(data,function(dataObj){
                              var day=(dataObj.length && dataObj[0].Date) ? dataObj[0].Date:null;
                              if(day){
                               
                                 var month_dates=setmonthDates(day);
                                   var daysCount=getDaysCount(month_dates);
                                   var filteredData = parseMonthlyAttendance(dataObj,month_dates,that.selectedChild);
                                   
                                   var attendanceList=filteredData.attendanceList;
                                   var absentDays=filteredData.absentDays;
                                   var bookedDays=filteredData.bookedDays;
                                   
                                  var attendLessthanBooking=filteredData.attendLessthanBooking;
                                  var weekdaysArr=filteredData.weekdaysArr;
                                  var absenceruleflag=0;
                                 
                                 _.each(attendanceList,function(row){ 
                                        absenceruleflag=detectFrequentAbsencePattern(row,absentDays,daysCount,attendLessthanBooking,weekdaysArr,bookedDays);
                                        if(absenceruleflag){
                                          return false;
                                        }
                                  });
                                
                                 if(absenceruleflag){
                                    that.frequestabsencecounter=that.frequestabsencecounter+1;
                                 }else{
                                   
                                   that.frequestabsencecounter=0;
                                 }
                              }
                             
                      })
                    
                       if(that.frequestabsencecounter ==1){
                            dialog.showOkDialog("Error", "Discovered Frequent absence rule for "+((that.selectedChild.PreferredGiven1Name?that.selectedChild.PreferredGiven1Name:that.selectedChild.OfficialGiven1Name)+' '+that.selectedChild.OfficialFamilyName)+", please monitor absence pattern for month. May have to get enrolment form attested again as funding may impact");
                        }
              
                        if(that.frequestabsencecounter ==2){
                            dialog.showOkDialog("Error", "Discovered Frequent absence rule for "+((that.selectedChild.PreferredGiven1Name?that.selectedChild.PreferredGiven1Name:that.selectedChild.OfficialGiven1Name)+' '+that.selectedChild.OfficialFamilyName)+", please monitor absence pattern for month. May have to get enrolment form attested again as funding may impact");
                          }
              
                            if(that.frequestabsencecounter ==3){
                            dialog.showOkDialog("Error", "Discovered Frequent absence rule for "+((that.selectedChild.PreferredGiven1Name?that.selectedChild.PreferredGiven1Name:that.selectedChild.OfficialGiven1Name)+' '+that.selectedChild.OfficialFamilyName)+" for month, please reconfirm the child’s enrolment agreement with their parent/guardian and create new booking schedule");
                          }
                
                        if(that.frequestabsencecounter >=4){
                            dialog.showOkDialog("Error", "Discovered Frequent absence rule for "+((that.selectedChild.PreferredGiven1Name?that.selectedChild.PreferredGiven1Name:that.selectedChild.OfficialGiven1Name)+' '+that.selectedChild.OfficialFamilyName)+" for month. You are legally required to have enrolment agreement that matches attendance pattern with their parent/guardian and create new booking schedule from 1st of fourth month");
                          }
                
              });
            
        
    }
    
 
 }
 function setSummaryCounters(data,monthDates,selectedChild){
    that.bookedWeeksCount=0;
    that.bookedHoursCount=0;
   // that.absentHoursCount=0;
    that.bookedDaysCount=0;
    that.bookedCountDays=[];
    that.bookedCountWeeks=[];
    that.attendedCountDays=[];
    that.attendedCountWeeks=[];
    //that.absentCountDays=[];
    //that.absentCountWeeks=[];
    that.attendedHoursCount=0;
    that.attendedDaysCount=0;
    that.attendedWeeksCount=0;
   // that.hourAbsentPercentage=0;
    //that.dayAbsentPercentage={};
   // that.weekAbsentPercentage={};
     var checkedBookedWeeks=[];
     var checkedAttendedWeeks=[];
    // var checkedabsentWeeks=[];
     _.each(monthDates,function(day){
             var bookingforDay=getBookingSchedule(selectedChild,day);
             
             if(bookingforDay && bookingforDay.length){
                 that.bookedDaysCount++;
                 var bookedHours=((bookingforDay && bookingforDay.length)) ? (((bookingforDay[0].endTime - bookingforDay[0].startTime) / (1000*60*60)) % 24): 0;
                 that.bookedHoursCount=that.bookedHoursCount +bookedHours;
                 that.bookedCountDays[days[day.getDay()]]=(that.bookedCountDays[days[day.getDay()]]) ? that.bookedCountDays[days[day.getDay()]]+bookedHours: bookedHours;
                  var weekNumber=moment(day).week();
                  that.bookedCountWeeks[weekNumber]=(that.bookedCountWeeks[weekNumber]) ? that.bookedCountWeeks[weekNumber]+bookedHours: bookedHours;
                  if(checkedBookedWeeks.indexOf(weekNumber) < 0){
                     checkedBookedWeeks.push(weekNumber);
                     that.bookedWeeksCount++;
                 }
             }
             _.each(data,function(att){
                if(moment(att.Date).isSame(day,'day')){
                 /* var absenceReason='';
                  if(att.IsAbsent)
                   absenceReason=(that.absenceReasonMap[att.AbsenceReason] && that.absenceReasonMap[att.AbsenceReason].Description) ? that.absenceReasonMap[att.AbsenceReason].Description:att.AbsenceReason.Description; 
              
                  if(att.IsAbsent && absenceReason!='Exempt'){
                    var bookingforDay=getBookingSchedule(selectedChild,day);
                    var bookedHours=((bookingforDay && bookingforDay.length)) ? (((bookingforDay[0].endTime - bookingforDay[0].startTime) / (1000*60*60)) % 24): 0;
                    //that.absentDaysCount++;
                    //that.absentHoursCount=that.absentHoursCount + bookedHours;
                
                    var weekNumber=moment(day).week();
                    that.absentCountDays[days[day.getDay()]]=(that.absentCountDays[days[day.getDay()]]) ? that.absentCountDays[days[day.getDay()]]+attendedHours: attendedHours;
                    var weekNumber=moment(day).week();
                    that.absentCountWeeks[weekNumber]=(that.absentCountWeeks[weekNumber]) ? that.absentCountWeeks[weekNumber]+attendedHours: attendedHours;
                  
                    if(checkedabsentWeeks.indexOf(weekNumber) < 0){
                        checkedabsentWeeks.push(weekNumber);
                        that.absentWeeksCount++;
                    }
                  }else{*/
                    that.attendedDaysCount++;
                    var attendedHours=(att && att.AttendanceTimeEnd) ? (((att.AttendanceTimeEnd- att.AttendanceTimeStart) / (1000*60*60)) % 24): 0;
                    that.attendedHoursCount=that.attendedHoursCount + attendedHours;
                     var weekNumber=moment(day).week();
                    that.attendedCountDays[days[day.getDay()]]=(that.attendedCountDays[days[day.getDay()]]) ? that.attendedCountDays[days[day.getDay()]]+attendedHours: attendedHours;
                    var weekNumber=moment(day).week();
                    that.attendedCountWeeks[weekNumber]=(that.attendedCountWeeks[weekNumber]) ? that.attendedCountWeeks[weekNumber]+attendedHours: attendedHours;
                  
                    if(checkedAttendedWeeks.indexOf(weekNumber) < 0){
                        checkedAttendedWeeks.push(weekNumber);
                        that.attendedWeeksCount++;
                    }
                  //}
                  
                }
            });
     });

     _.each(checkedBookedWeeks,function(wk,key){
        switch(key){
          case 0: if(that.bookedCountWeeks[wk]){
                      that.bookedCountWeeks['WK1']=that.bookedCountWeeks[wk];
                      delete(that.bookedCountWeeks[wk]);
                  }else{
                    that.bookedCountWeeks['WK1']=0;
                  } 
                  if(that.attendedCountWeeks[wk]){
                      that.attendedCountWeeks['WK1']=that.attendedCountWeeks[wk];
                      delete(that.attendedCountWeeks[wk]);
                  }else{
                    that.attendedCountWeeks['WK1']=0;
                  }
                 /* if(that.absentCountWeeks[wk]){
                      that.absentCountWeeks['WK1']=that.absentCountWeeks[wk];
                      delete(that.absentCountWeeks[wk]);
                  }else{
                    that.absentCountWeeks['WK1']=0;
                  }*/
                 break;
          case 1:if(that.bookedCountWeeks[wk]){
                      that.bookedCountWeeks['WK2']=that.bookedCountWeeks[wk];
                      delete(that.bookedCountWeeks[wk]);
                  }else{
                    that.bookedCountWeeks['WK2']=0;
                  }  
                   if(that.attendedCountWeeks[wk]){
                      that.attendedCountWeeks['WK2']=that.attendedCountWeeks[wk];
                      delete(that.attendedCountWeeks[wk]);
                  }else{
                    that.attendedCountWeeks['WK2']=0;
                  }
                  /*if(that.absentCountWeeks[wk]){
                      that.absentCountWeeks['WK2']=that.absentCountWeeks[wk];
                      delete(that.absentCountWeeks[wk]);
                  }else{
                    that.absentCountWeeks['WK2']=0;
                  }*/

                  break;
          case 2:if(that.bookedCountWeeks[wk]){
                      that.bookedCountWeeks['WK3']=that.bookedCountWeeks[wk];
                      delete(that.bookedCountWeeks[wk]);
                  }else{
                    that.bookedCountWeeks['WK3']=0;
                  }  
                   if(that.attendedCountWeeks[wk]){
                      that.attendedCountWeeks['WK3']=that.attendedCountWeeks[wk];
                      delete(that.attendedCountWeeks[wk]);
                  }else{
                    that.attendedCountWeeks['WK3']=0;
                  }
                 /* if(that.absentCountWeeks[wk]){
                      that.absentCountWeeks['WK3']=that.absentCountWeeks[wk];
                      delete(that.absentCountWeeks[wk]);
                  }else{
                    that.absentCountWeeks['WK3']=0;
                  }*/
                  break;
          case 3: if(that.bookedCountWeeks[wk]){
                      that.bookedCountWeeks['WK4']=that.bookedCountWeeks[wk];
                      delete(that.bookedCountWeeks[wk]);
                  }else{
                    that.bookedCountWeeks['WK4']=0;
                  } 
                   if(that.attendedCountWeeks[wk]){
                      that.attendedCountWeeks['WK4']=that.attendedCountWeeks[wk];
                      delete(that.attendedCountWeeks[wk]);
                  }else{
                    that.attendedCountWeeks['WK4']=0;
                  }
                 /* if(that.absentCountWeeks[wk]){
                      that.absentCountWeeks['WK4']=that.absentCountWeeks[wk];
                      delete(that.absentCountWeeks[wk]);
                  }else{
                    that.absentCountWeeks['WK4']=0;
                  }*/

                   break;
          case 4:if(that.bookedCountWeeks[wk]){
                      that.bookedCountWeeks['WK5']=that.bookedCountWeeks[wk];
                      delete(that.bookedCountWeeks[wk]);
                  }else{
                    that.bookedCountWeeks['WK5']=0;
                  }   
                   if(that.attendedCountWeeks[wk]){
                      that.attendedCountWeeks['WK5']=that.attendedCountWeeks[wk];
                      delete(that.attendedCountWeeks[wk]);
                  }else{
                    that.attendedCountWeeks['WK5']=0;
                  }
                  /*if(that.absentCountWeeks[wk]){
                      that.absentCountWeeks['WK5']=that.absentCountWeeks[wk];
                      delete(that.absentCountWeeks[wk]);
                  }else{
                    that.absentCountWeeks['WK5']=0;
                  }*/

                  break;
        }

     });
 
    /*that.hourAbsentPercentage=(that.absentHoursCount > 0)? Math.ceil((that.absentHoursCount*100)/that.bookedHoursCount):0;
    _.each(days,function(day){
          that.dayAbsentPercentage[day]=(that.absentCountDays[day] > 0)? Math.ceil((that.absentCountDays[day]*100)/that.bookedCountDays[day]):0;
      });
     _.each($scope.weeks,function(wk){
        that.weekAbsentPercentage[wk]=(that.absentCountWeeks[wk] > 0) ? Math.ceil((absentCountWeeks*100)/that.bookedCountWeeks[wk]):0;
     });
     */
    // that.weekAbsentPercentage=(that.attendedWeeksCount > 0) ? 100-Math.ceil((that.attendedWeeksCount*100)/that.bookedWeeksCount):0;
 }
 $scope.getPercentage=function(val){
   if(val<0) return 0;
    return Math.ceil(val)
 }
  function checkLoaded($defer) {
      return function () {
        if (that.selectedChild) {
          formlyAdapter.getList('absencereason').then(function (data) {
              that.absenceReasons = data;
              that.filteredAbsenceReasons = _.filter(data, function (d) {
                return !d.IsTempClosureCode && d.UseForChild;
              });

              that.absenceReasonMap = {};
              _.each(data, function (d) {
                that.absenceReasonMap[d._id] = d;
              });
        });

        fchUtils.getServiceScheduleMap().then(function(svcScheduleMap) {
          that.serviceScheduleMap = svcScheduleMap;
        });
          getAttendanceData(that.month,that.selectedChild).then(function (data) {
            var filteredData = parseMonthlyAttendance(data,that.monthDates,that.selectedChild);
            that.attendanceList=filteredData.attendanceList;
            that.absentDays=filteredData.absentDays;
            that.bookedDays=filteredData.bookedDays;
            that.attendLessthanBooking=filteredData.attendLessthanBooking;
            that.weekdaysArr=filteredData.weekdaysArr;
            var total = that.attendanceList.length > 10 ? 10 : that.attendanceList.length;
            setSummaryCounters(data,that.monthDates,that.selectedChild)

            that.tableMonthlyEdit.total(total);
            $defer.resolve(that.attendanceList);
          });
          
          setFrequentAbsenceCounter(that.month,that.selectedChild);
        }
        else $timeout(checkLoaded($defer), 100);
      }
    }
    var getBookingSchedule= function (child, today) {
        var bsObj = getBooking(child, today);
        var dayBsTimeStart = null;
        var dayBsTimeEnd = null;
        var day = days[today.getDay()];
        var t = moment(today);
        if (bsObj) {
            var flag = 0;

            var todaySchedule = [];
            if (bsObj && bsObj.Times && bsObj.Times.length) {

                _.each(bsObj.Times, function (t) {

                    if (t[day + "Start"] && t[day + "End"]) {
                        dayBsTimeStart = moment(t[day + 'Start'], 'h:mma');
                        dayBsTimeEnd = moment(t[day + 'End'], 'h:mma');
                        todaySchedule.push({"startTime": dayBsTimeStart, "endTime": dayBsTimeEnd});

                    }
                });

            }

            return todaySchedule;
        } else {
            return null;
        }
    }
    var getBooking=function (kid, today) {
          var t = moment(today);
          var en = null, bs = null, enrollment = null;
          if (kid.Enrolments && kid.Enrolments.length) {
              // iterate over all enrolments and booking schedules to find one that matches the date range, otherwise take the last one
              _.each(kid.Enrolments, function (enrol) {
                  enrollment = enrol;
                  // find a good enrolment
                  if ((t.isAfter(enrollment.EnrolmentSection.EnrolmentStartDate, 'day') || t.isSame(enrollment.EnrolmentSection.EnrolmentStartDate, 'day'))
                          &&
                          (!enrollment.EnrolmentSection.EnrolmentEndDate ||
                                  (t.isBefore(enrollment.EnrolmentSection.EnrolmentEndDate, 'day') || t.isSame(enrollment.EnrolmentSection.EnrolmentEndDate, 'day')))) {
                      // found a good enrolment
                      en = enrollment.EnrolmentSection;
                      if (enrollment.BookingSchedule) {
                          _.each(enrollment.BookingSchedule, function (bookingSched) {
                              if (t.isAfter(bookingSched.EffectiveDate, 'day') || t.isSame(bookingSched.EffectiveDate, 'day')) {
                                  bs = bookingSched;
                              }
                          })
                      }
                  }

              });

              // take the last one if we didn't match
              if (!en || !bs || !enrollment) {
                  enrollment = kid.Enrolments[kid.Enrolments.length - 1];
                  en = enrollment.EnrolmentSection;
                  bs = enrollment.BookingSchedule ? enrollment.BookingSchedule[enrollment.BookingSchedule.length - 1] : null;
              }
              return bs;
          }
      }
    var parseMonthlyAttendance=function(data,monthDates,selectedChild){
     
       var returnData={};
          returnData.attendanceList={};
          returnData.absentDays={};
          returnData.bookedDays=0;
          returnData.attendLessthanBooking=0;
          returnData.weekdaysArr={};
        _.each(monthDates,function(day){
             var attFlag=false;
              if(!returnData.weekdaysArr[weekAndDay(day)]){
                returnData.weekdaysArr[weekAndDay(day)]=[];
              }

             var bookingforDay=getBookingSchedule(selectedChild,day);
             if(bookingforDay && bookingforDay.length){
              returnData.bookedDays++;
              if(returnData.weekdaysArr[weekAndDay(day)]['booking']){
                returnData.weekdaysArr[weekAndDay(day)]['booking']=returnData.weekdaysArr[weekAndDay(day)]['booking']+1;
              }else{
                returnData.weekdaysArr[weekAndDay(day)]={};
                returnData.weekdaysArr[weekAndDay(day)]['booking']=1;  
              
              }
             
             }   
            _.each(data,function(att){
                if(moment(att.Date).isSame(day,'day')){
                  attFlag=true;
                  var absenceReason='';
                  if(att.IsAbsent)
                   absenceReason=(that.absenceReasonMap[att.AbsenceReason] && that.absenceReasonMap[att.AbsenceReason].Description) ? that.absenceReasonMap[att.AbsenceReason].Description:att.AbsenceReason.Description; 
             
                  if(att.IsAbsent && absenceReason!='Exempt'){  
                    if(returnData.absentDays[days[day.getDay()]]){
                        returnData.absentDays[days[day.getDay()]]= returnData.absentDays[days[day.getDay()]]+1;
                    }else{
                        returnData.absentDays[days[day.getDay()]]=1;
                    }
                  }else{
                    if(returnData.weekdaysArr[weekAndDay(day)]['attendance']){
                      returnData.weekdaysArr[weekAndDay(day)]['attendance']=returnData.weekdaysArr[weekAndDay(day)]['attendance']+1;
                    }else{
                      returnData.weekdaysArr[weekAndDay(day)]={};
                      returnData.weekdaysArr[weekAndDay(day)]['attendance']=1;  
                    }
                  }
                  returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]={};
                  returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['attendance']=att;
                  returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['booking']=bookingforDay;
                  
                }
            });
            if(!attFlag){
              if(moment(day).isBefore(moment(new Date())) && bookingforDay && bookingforDay.length){
                /*if(returnData.absentDays[days[day.getDay()]]){
                      returnData.absentDays[days[day.getDay()]]= returnData.absentDays[days[day.getDay()]]+1;
                  }else{
                      returnData.absentDays[days[day.getDay()]]=1;
                  }*/
               returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]={};
               returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['attendance']={Date:day};//{Date:day,IsAbsent:true};
               returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['booking']=bookingforDay;
              }else{
                returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]={};
               returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['attendance']={Date:day};
               returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['booking']=bookingforDay;
              }
                
               
           }
             var bookedHours=((bookingforDay && bookingforDay.length)) ? (((bookingforDay[0].endTime - bookingforDay[0].startTime) / (1000*60*60)) % 24): 0;
             var m = moment(day);
             var currDay = m.format("dddd");
             var sch = (that.serviceScheduleMap && that.serviceScheduleMap.length)?  that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[currDay]: null;
           
             if(bookedHours >6) bookedHours=6;
             var attendance=returnData.attendanceList[day.getDate()+"-"+(day.getMonth()+1)]['attendance'];
             var attendedHours=(attendance && attendance.AttendanceTimeEnd) ? (((attendance.AttendanceTimeEnd- attendance.AttendanceTimeStart) / (1000*60*60)) % 24): 0;
             if(attendedHours < bookedHours && !attendance.IsAbsent && sch && sch.Scheduled ){

              returnData.attendLessthanBooking++;
             } 
        });
        
        return returnData;
    }

    var timeFix = function (date, setToMidnight) {
      var d = new Date(date.getTime());
      if (setToMidnight) d.setHours(23, 59, 59, 0);
      else d.setHours(0, 0, 0, 0);
      return d;
    }

   

    var getParams = function (selectedChild) {
         return selectedChild._id;
    }

    var getDateParams = function (month) {
       var date = new Date(month), y = date.getFullYear(), m = date.getMonth();
        var start = new Date(y, m, 1);
        var end = new Date(y, m + 1, 0);
      
      return {"$gte": timeFix(start, false), "$lte": timeFix(end, true)};
    }

    var buildMoment = function (time) {
      var h = parseInt(time.split(":")[0], 10), m = parseInt(time.split(":")[1], 10);
      var d = new Date();

      d.setHours(h, m, 0, 0);
      return d;
    }

    var buildAttendanceParams = function (month,selectedChild) {
      var p = {
        query: JSON.stringify({
          Child: getParams(selectedChild),
          Date: getDateParams(month),
        })
      }
      
      p['sort']='+Date'
      return p;
    };

    

    function getAttendanceData(month,selectedChild) {
      return formlyAdapter.getList('attendance', buildAttendanceParams(month,selectedChild));
    }

   /* that.getAbsenceCode = function (code) {
      return;
    }*/

   /* that.filterChange = function () {
         $timeout(initTable, 100);
    };
*/
  /*  that.sessionChange = function (row) {
      if (row.Session) {
          setSession(row, row.Session);
      }
    };*/

    that.print = function() {
      window.print();
    }

    /*function setSession(row, s) {
      row.IsAbsent = false;
      delete row.AbsenceReason;
      row.AttendanceTimeStart = buildMoment(s.Start);
      row.AttendanceTimeEnd = buildMoment(s.End);
    }*/


    $timeout(function () {
      formlyAdapter.getModels().then(function () {
        formlyAdapter.getList('child').then(function (data) {
          $timeout(function () {
            that.childlist = data;
            //updateFilteredChildList();
            that.selectedChild = data && data.length ? data[0] : {};
           });
        });

      });

    }, 300);

  

  });