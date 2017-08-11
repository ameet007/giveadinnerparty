'use strict';

angular.module("sms.attendance", [])
  .controller('AttendanceCtrl', function ($timeout,$rootScope,$cookies,$document, messageService, Auth, formlyAdapter, facilityService, fchUtils,
                                          $state, ngTableParams,formlyapi, tableService, $scope, growlService, moment, $util, dialog) {
    var applyTime = function (str) {
      _.each(that.attendanceList, function (l) {
        if (l.$edit) l[str] = that[str]
      });
    };
    var buildTime = function (dtg) {
      var d = dtg || new Date();
      d.setHours(d.getHours(), d.getMinutes(), 0, 0);
      return d;
    };
    
    
    var that = this;
    that.format='dd-MM-yyyy';
    that.currentUser=Auth.getCurrentUser();
   
    $scope.dateOptions={
      format:'dd-MM-yyyy'
    }
    that.stopDate = new Date();
    that.startDate = new Date(that.stopDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    that.today = new Date();
    if($cookies.get('attdate')){
      that.today=new Date($cookies.get('attdate'));
    } 
 
    that.attendanceList = [];
    that.AttendanceTimeStart = buildTime();
    that.AttendanceTimeEnd = buildTime();
   that.syncDailyfch=function(){
      formlyapi.syncDailyFch(new Date(timeFix(that.today)).toISOString()).then(function(){

      });
    }

  
    that.applyStartTime = function () {
      applyTime('AttendanceTimeStart');
    };

    that.applyEndTime = function () {
      applyTime('AttendanceTimeEnd');
    };
    that.searchChildrens = function () {
        if(that.onlyBookedChildren){

          if(that.currentSession.Name == "All"){
            //that.filterAttendanceList = that.attendanceList;
            that.filterAttendanceList =  _.each(that.attendanceList, function (w) {
                delete w['Session']; 
              });
          }else{
              that.filterAttendanceList = that.attendanceList.filter(function(child, i){

                 child.Session = that.currentSession; 
                return validKid(child.Child, child.Date);
            })
          }

          that.tableEdit = new ngTableParams({
            count:that.filterAttendanceList.length, // count per page
            page: 1
          }, { 
            total: that.filterAttendanceList.length, // length of data
            data: that.filterAttendanceList 
          });
        }
    }
    that.applySession = function () {
      if (that.currentSession) {
        _.each(that.attendanceList, function (r) {
          if (r.$edit) setSession(r, that.currentSession);
        });
      }

    }

    var midnight = function () {
      return moment(that.today).startOf('day').add(12, 'hours').toDate();
    }

    that.markAllAbsent = function () {
      var holidayCode = "HOL"; // what is it?
      var code = that.firstClosure ? that.firstClosure.ClosureReasonCode.Code : holidayCode;
      _.each(that.attendanceList, function (l) {
        l.IsAbsent = true;
        l.AbsenceReason = _.filter(that.absenceReasons, function (d) {
          return d.Code == code;
        })[0]._id;
        that.markRowAbsent(l);
      });
    }
    that.overrideHoliday=function(holiday,value){
      holiday.canMarkAttendance=value;
      formlyAdapter.saveObject('holiday', holiday, holiday._id).then(function (d) {
         if(value){
            growlService.growl('Attendance Marking Enabled!', 'danger');
         }else{
            growlService.growl('Attendance Marking Disabled!', 'danger');
         }
        
       
      }, function (err) {
        growlService.growl(err, 'danger');
      });
      
    }
    that.markRowAbsent = function (l) {
      if (l.$edit && l.IsAbsent) {
        l.AttendanceTimeStart = midnight();
        l.AttendanceTimeEnd = midnight();
        _.each(that.absenceReasons,function(reason){
            if(reason.Description=='Absent'){
              l.AbsenceReason=reason._id;
              return;
              
            }
        });

      }
    };

    var filterTypes = ['Room', 'Child'];
    var filterIdx = 0;

    var updateFilteredChildList = function() {
      that.filteredChildlist = _.filter(that.childlist, function(kid) {
        return validKid(kid._id);
      });
    }

    var updateSelectedItem = function() {
      that.selectedRoom = that.roomList && that.roomList.length ? that.roomList[0] : null;
      that.selectedChild = that.filteredChildlist && that.filteredChildlist.length ? that.filteredChildlist[0] : null;
      that.selectedEducator = that.educatorList && that.educatorList.length ? that.educatorList[0] : null;
    }

    that.cycleFilter = function () {
      filterIdx++;
      if (filterIdx >= filterTypes.length) filterIdx = 0;
      that.currentFilter = filterTypes[filterIdx];
      updateFilteredChildList();
      updateSelectedItem();
      that.filterChange();
    };

    var getTime = function(t) {
      // parse out mil time to hours/min and set that on a new date
      var d = new Date();
      d.setTime(that.today.getTime());
      d.setHours(t.split(":")[0]);
      d.setMinutes(t.split(":")[1], 0, 0);
      return d;
    }

    var checkTimes = function(t) {
      var match = false;
      var day = days[that.today.getDay()];
      var start = t[day+"Start"], end = t[day+"End"];

      var obj = null;
      if ( start && end ) {
        obj = {start: getTime(start), end: getTime(end)};
      }
      return obj;
    }
    that.getChildEducator=function(kidId){
      var childList=getChildList();
      var kidEducator=null;

      _.map(getChildList(),function(kid){
          if(kid._id==kidId && kid.HBEducator){
              
              kidEducator=that.allEducatorsMap[kid.HBEducator];
          }
      });
      
      return kidEducator;
    }
    that.addRow = function (kidId, data, idx, addAllBookings) {
      kidId = kidId || that.selectedChild._id;
      that.attendanceList = that.attendanceList || [];
      data = data || that.attendanceList;
      var kidEducator=that.getChildEducator(kidId);
      var times = [];
      if ( addAllBookings ) {
        var kid = _.filter(that.childlist, function (d) {
          return d._id == kidId;
        })[0];
        if ( kid && kid.Enrolments && kid.Enrolments.length && kid.Enrolments[kid.Enrolments.length-1].BookingSchedule &&
          kid.Enrolments[kid.Enrolments.length-1].BookingSchedule.length) {
          
          var bs=fchUtils.getBooking(kid,that.today);
          if ( bs && bs.Times ) {
            _.each(bs.Times, function (t) {
              var booking = checkTimes(t);
              if (booking) times.push(booking);
            })
          }

          /*var enrol = kid.Enrolments.length-1;
          var bs = kid.Enrolments[kid.Enrolments.length-1].BookingSchedule.length-1;

          if ( kid.Enrolments[enrol].BookingSchedule[bs].Times ) {
            _.each(kid.Enrolments[enrol].BookingSchedule[bs].Times, function (t) {
              var booking = checkTimes(t);
              if (booking) times.push(booking);
            })
          }*/
        }
      }

      if ( !times || times.length == 0) {
        times = [{start:that.today, end:that.today}];

      }

      _.each(times, function(t) {
        
        var obj = {
          Child: kidId,
          Date: new Date(that.today.getTime()),
          AttendanceTimeStart: buildTime(t.start),
          AttendanceTimeEnd: buildTime(t.end),
          $edit: true
        };

        if (that.isHomeBased) obj.Educator = (kidEducator) ? kidEducator: that.selectedEducator.educator;
        if (idx || idx == 0) {
          // positional insert.

          var front = data.splice(0, idx + 1);
          data.unshift(obj);
          for (var i = front.length - 1; i > -1; i--) {
            data.unshift(front[i]);
          }

          //data = front.concat([obj]).concat(data);
        } else {
          data.push(obj)
        }
      });
    }

    var editing = [];
    that.startEdit = function (row, idx) {
      _.each(that.attendanceList, function(r) {if (r && r._id) r.$edit = false;});
      editing = _.filter(editing, function(r) {return r && !r._id;});
      editing[idx] = angular.copy(row);
      //row.__prev = angular.copy(row);
      row.$edit = true;
    }


    // use 15 min increment checks for now:
    var childPlaceIncrement = 1;

    var getChildPlaceCounts = function(row) {
      var kids = getChildList(true);
      var kidMap = {};
      _.each(kids, function(kid) {
        kidMap[kid._id] = kid;
      })

      var counts = {};
      for ( var i = 0; i < 23; i++ ) {
        for ( var j = 0; j < 60; j += childPlaceIncrement ) {
          counts[$util.zeropad(i)+":"+$util.zeropad(j)] = {total:0,under2:0}
        }
      }
      var kidIsUnderTwo = function(k) {
        k = k._id ? k : kidMap[k];
        return $util.getAge(new Date(k.ChildBirthDate)) < 2;
      }

      var underTwo = 0, total = 0;
      var processRow = function(row, edit) {
        if ( row.IsAbsent || edit ) return;
        else {
          var m1 = moment(row.AttendanceTimeStart), m2 = moment(row.AttendanceTimeEnd);

          var hStart = parseInt(m1.format("H"), 10), mStart = parseInt(m1.format("m"), 10),
            hEnd = parseInt(m2.format("H"), 10), mEnd = parseInt(m2.format("m"), 10)-1;
          mStart = mStart - (mStart % childPlaceIncrement);
          mEnd = parseInt(mEnd, 10) + parseInt((childPlaceIncrement - (mEnd%childPlaceIncrement)), 10);
          if ( mEnd == 60 ) {
            mEnd = 0;
            hEnd++;
          }

          for ( var i = hStart; i <= hEnd; i++ ) {
            var minuteStart = i == hStart ? mStart : 0;
            var minuteEnd = i == hEnd ? mEnd : 60;
            for ( var j = minuteStart; j < minuteEnd; j+= childPlaceIncrement ) {
              if(counts[$util.zeropad(i)+":"+$util.zeropad(j)] && counts[$util.zeropad(i)+":"+$util.zeropad(j)].total){
                  counts[$util.zeropad(i)+":"+$util.zeropad(j)].total++;
              }else{
                counts[$util.zeropad(i)+":"+$util.zeropad(j)]={};
                counts[$util.zeropad(i)+":"+$util.zeropad(j)]['total']=1;
              }
              if (kidIsUnderTwo(row.Child)) counts[$util.zeropad(i)+":"+$util.zeropad(j)].under2++;
              underTwo = counts[$util.zeropad(i)+":"+$util.zeropad(j)].under2 > underTwo ? counts[$util.zeropad(i)+":"+$util.zeropad(j)].under2 : underTwo;
              total = counts[$util.zeropad(i)+":"+$util.zeropad(j)].total > total ? counts[$util.zeropad(i)+":"+$util.zeropad(j)].total : total;
            }
          }
        }
      }

      processRow(row, false);

      _.each(that.attendanceList, function(currRow) {
        processRow(currRow, currRow.$edit);
      });

      return {under2Count: underTwo, totalCount: total};

    }


    // SMS-425 Limit per session type and schedule.
    /**
     Check session type for the centre if sessional or mixed then
     Check ECE service schedule for the day if sessional then
     Limit maximum hours a child can be booked for to 4 hours
     Limit attendance per child to maximum 4 hours
     */

    var overSessionalLimit = function(row) {
      var count = 0, kid = row.Child._id ? row.Child._id : row.Child;

      var processRow = function(row, edit) {
        if (row.IsAbsent || edit) return;
        var k = row.Child._id ? row.Child._id : row.Child;
        if ( k == kid ) {
          var s = moment(row.AttendanceTimeStart), e = moment(row.AttendanceTimeEnd);
          count += (60*(e.hour() - s.hour())) + (e.minute() - s.minute());
        }
      }

      if ( that.isSessionalOrMixed ) {
        var m = moment(that.today);
        var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[m.format("dddd")];
        if ( sch && sch.Scheduled && sch.SessionType == 'Sessional') {
          processRow(row, false);
          _.each(that.attendanceList, function(currRow) {
            processRow(currRow, currRow.$edit);
          });

          return count > 240;
        }
      }
      return false;
    }

    /*var endtimeBeforeCurrentTime=function(row){
      var currentTime=moment();
      var attendanceEndtime=moment(row.AttendanceTimeEnd);
      return currentTime<attendanceEndtime && !row.IsAbsent;
    }*/

    var endtimeBeforeCurrentTime=function(row){
      var currentTime=moment();
      var attendanceEndtime=moment(that.today).set({hours:parseInt(row.AttendanceTimeEnd.getHours(),10),minute:parseInt(row.AttendanceTimeEnd.getMinutes(),10),second:parseInt(row.AttendanceTimeEnd.getSeconds(),10)});//);
      if(attendanceEndtime.isBefore(currentTime,'day')){
        return false;
      }else{
        return currentTime<attendanceEndtime && !row.IsAbsent;  
      }
      
    }

    var outsideHours = function(row) {
      if(row.IsAbsent){
        return false;
      }
      var m = moment(that.today);
      var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[m.format("dddd")];
      if ( sch && sch.Scheduled ) {
        var sTime = moment(row.AttendanceTimeStart).format("HH:mm"), eTime = moment(row.AttendanceTimeEnd).format("HH:mm");
        var schStart = sch.StartTime, schEnd = sch.EndTime;
        if ( (schStart && sTime < schStart) || (schEnd && eTime > schEnd) ) {
          return true;
        }
      }
      return false;
    }

    that.finishEdit = function (row, idx) {

      if ( !row.IsAbsent && moment(that.today).isAfter(new Date(), 'day') ) {
        growlService.growl("Can only set Absences in the future!", 'danger');
        return;
      }

      if (!row.IsAbsent) {
        if ( row.AttendanceTimeEnd.getTime() == row.AttendanceTimeStart.getTime() ) {
          growlService.growl("Time In and Time Out cannot be the same!", 'danger');
          return;
        } else {
          row.AttendanceTimeStart = buildTime(row.AttendanceTimeStart);
          row.AttendanceTimeEnd = buildTime(row.AttendanceTimeEnd);
        }
      } else if ( !row.AbsenceReason ) {
        growlService.growl("Please select Absence Reason if child is Absent!", 'danger');
        return;
      }

      if ( that.isHomeBased ) {
        if (!row.Educator ) {
          growlService.growl("Please select Educator for Child!", 'danger');
          return;
        }
        if ( row.Educator._id ) row.Educator = row.Educator._id;
      } else {
        delete row.Educator;
      }

      // SMS-416 Attendance marking limitation
      if ( that.licenseConfiguration ) {
        var msg;
        var kidCounts = getChildPlaceCounts(row);

        if ( that.licenseConfiguration.ChildPlace < kidCounts.totalCount ) msg = "Child Place limit exceeded";
        else if ( that.licenseConfiguration.UnderTwo < kidCounts.under2Count ) msg = "Under 2 Child Place limit exceeded";
        if ( msg ) {
          growlService.growl(msg, 'danger');
          return;
        }
      }

      if ( overSessionalLimit(row) ) {
        growlService.growl("4 Hour Sessional Limit Exceeded!", 'danger');
        return;
      }
      if(endtimeBeforeCurrentTime(row)){
         growlService.growl("End time must be before current Time!", 'danger');
        return;
      }

      if ( outsideHours(row) ) {
        growlService.growl("Cannot save booking start and end time outside licensing hours!", 'danger');
        return;
      }

      formlyAdapter.saveObject('attendance', row, row._id).then(function (d) {
        var description='';
                
                var child_name=that.getChildName(row.Child);
                var childEducatorName=that.getEducatorName(row.Child.Educator);
                var childParentName=that.getParentName(row.Child.ParentGuardians);
               
                if(child_name) description=child_name+" / ";
                if(childEducatorName) description=description+childEducatorName+" / ";
                if(childParentName) description=description+childParentName+" / ";

                if(row.IsAbsent){
                    description=description+'Marked Absent';
                }else{
                  description=description+'Marked Present';
                }
                formlyAdapter.saveObject('usereventlogs',{EventDate:row.Date,EventType:'Saved Attendance',EventDescription:description}).then(function(u){
                  
                })
        
        
        growlService.growl('Saved Succesfully!', 'inverse');
        delete editing[idx];
        delete row.$edit;
        if ( d && d.data && d.data._id ) row._id = d.data._id;
      }, function (err) {
        //that.cancelEdit(row, idx);
        if (err == "attendance validation failed") {
          err = "Start & End Times are required for Attendance!";
        }
        growlService.growl(err, 'danger');
      });
    }

    that.deleteRow = function (row, idx) {
      if (row._id) {
        var description='';
                
        var child_name=that.getChildName(row.Child);
        var childEducatorName=that.getEducatorName(row.Child.Educator);
        var childParentName=that.getParentName(row.Child.ParentGuardians);
       
        if(child_name) description=child_name+" / ";
        if(childEducatorName) description=description+childEducatorName+" / ";
        if(childParentName) description=description+childParentName+" / ";

        if(row.IsAbsent){
            description=description+'Delete Absent';
        }else{
          description=description+'Delete Present';
        }
        formlyAdapter.deleteObject('attendance', row._id,row.Date,description).then(function (d) {
         
          growlService.growl('Deleted Succesfully!', 'inverse');
          if ( idx == 0 ) {
            that.attendanceList.shift();
          } else {
            that.attendanceList.splice(idx, 1);
          }
          delete editing[idx];
        }, function (err) {
          //that.cancelEdit(row, idx);
          growlService.growl(err, 'danger');
        });

      }
    }

    that.cancelEdit = function (row, idx) {
      if (row._id) {
        if ( idx == 0 ) {
          that.attendanceList.shift();
          that.attendanceList.unshift(editing[idx]);
        } else {
          that.attendanceList.splice(idx, 1, editing[idx]);
        }
        delete editing[idx]
      } else {
        if ( idx == 0 ) {
          that.attendanceList.shift();
        } else {
          that.attendanceList.splice(idx, 1);
        }
      }
    }

    that.getChildName = function (theKid) {
      var id = theKid._id ? theKid._id : theKid;
      var child = _.filter(getChildList(true), function (k) {
        return k._id == id;
      })[0];
      if (!child) return '--';

      return child.OfficialFamilyName+" "+(child.PreferredGiven1Name?child.PreferredGiven1Name:child.OfficialGiven1Name);
    };

    var kidsSame = function(r1, r2) {
      var k1 = r1.Child._id ? r1.Child._id : r1.Child;
      var k2 = r2.Child._id ? r2.Child._id : r2.Child;
      return k1==k2;
    }

    that.showDeleteButton = function(row, isEdit) {
      var show = false;
      if ( isEdit ) {
        // only show if we have a second one or we are cancelling the first one
        var isSecondRow = _.filter(that.attendanceList, function(r2) {
          return kidsSame(r2, row) && row._id != r2._id;
        }).length > 0;
        show = row._id || isSecondRow;
      }
      return show;
    }

    that.showDeleteRowButton = function(row, isEdit) {
      var show = false;
      if ( isEdit && row._id) {
        show = true;
        // // only show if we have a second one or we are cancelling the first one
        // var isSecondRow = _.filter(that.attendanceList, function(r2) {
        //     return kidsSame(r2, row) && row._id != r2._id;
        //   }).length > 0;
        // show = isSecondRow;
        //
        // if ( !show ) {
        //   // SMS-209 check if future dated absence and allow
        //   show = ( row.IsAbsent && (moment().isBefore(row.AttendanceTimeStart, 'day')));
        // }

      }
      return show;
    }

    that.getEducatorName = function (edu) {
      if(!edu) return '';
      if (that.allEducatorsMap[edu]) edu = that.allEducatorsMap[edu];
 
      return edu.FirstName + ' ' + edu.LastName;
    }
    that.getParentName=function(parents){
      if(parents && parents.length){
          var parentId=parents[0];
          var parent=that.parentListMap[parentId];
          return parent.GivenName+" "+parent.FamilyNameSurname;
      }else{
        return '';
      }
    }
    //var f1 = $scope.$watch('selectedChild', initTable);
    //var f2 = $scope.$watch('startDate', initTable);
    //var f3 = $scope.$watch('stopDate', initTable);

    var f1 = $scope.$watch(function (scope) {
      return ( that.selectedChild );
    }, initTable);
    var f2 = $scope.$watch(function (scope) {
      return ( that.startDate );
    }, function(){
      that['startOpened']=false;
      initTable();
    });
    var f3 = $scope.$watch(function (scope) {
      return ( that.stopDate );
    },function(){
      that['stopOpened']=false;
      initTable();
    });

    var initialized = false;
    var f4 = $scope.$watch(function (scope) {
      return ( that.today );
    }, function () {
     
      if ( initialized ) {
        that['todayOpened']=false;
        initTable();
        return;
      }

      // check if today is before eli cutover date and set to that date if so
      facilityService.getCurrentCenter().then(function (c) {
        initialized = true;
        that.isHomeBased = c.CenterType == 'Home Based';
        if ( that.isHomeBased ) {
          filterTypes = ['Educator', 'Child'];
        }

        fchUtils.getServiceScheduleMap().then(function(svcScheduleMap) {
          that.serviceScheduleMap = svcScheduleMap;
          var m = moment(that.today);
          var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[m.format("dddd")];
         that.isSessionalOrMixed = ( sch.SessionType == 'Sessional' || sch.SessionType == 'Mixed' );

        });

        formlyAdapter.getList("temporaryClosure").then(function (tempClosures) {
          that.closures = tempClosures;
        });

       // that.isSessionalOrMixed = ( c.SessionType == 'Sessional' || c.SessionType == 'Mixed' );

        filterTypes.push('Enrolled Children');
        that.onlyBookedChildren = true;
        filterIdx = 1;
        that.cycleFilter();
        if (!c.CutoverDate || moment(c.CutoverDate).isBefore(that.today, 'day') || moment(c.CutoverDate).isSame(that.today, 'day')) initTable();
        else {
          $timeout(function () {
            growlService.growl("Cannot select date prior to Cutover Date of " + c.CutoverDate, 'danger');
            that.today = c.CutoverDate;
          });
        }

      });
    });

    $scope.$on('destroy', function () {
      f1();
      f2();
      f3();
      f4();
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
    $scope.$watch("attendance.today", function(newValue, oldValue) {
        if(that.onlyBookedChildren){
          that.currentSession = null;
        }
    });
    function initTable() {
     
       $cookies.put('attdate',new Date(that.today),{}); 
      // SMS-440 prevent recording attendance if day is not scheduled or a temp closure has been recorded.
      if ( !that.serviceScheduleMap || !that.closures ) {
        $timeout(initTable, 1000);
        return;
      }

      var msg = null;
      if ($state.is('main.addAttendance')) {

        var m = moment(that.today);
        var currDay = m.format("dddd");
        //var sch = that.serviceSchedule[currDay];
        var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[currDay];
        if (!sch || !sch.Scheduled) {
          msg = "Centre is not scheduled for " + currDay;
        } else if (fchUtils.matchesTempClosure(m, that.closures)) {
          var closure=that.closures[0];
            _.each(that.closures, function(cl) {
                        var end=moment(cl.ClosureEndDate), start=moment(cl.ClosureStartDate);
                       if((end.isSame(m,'day') || end.isAfter(m,'day')) && (start.isSame(m,'day') || start.isBefore(m,'day'))){
                         closure=cl;
                         return false;
                       }
                    })
            // msg = "Centre has a Temporary Closure scheduled for " + m.format("YYYY-MM-DD");
            msg = "Centre is temporary closed for the reason "
            +closure.Description
            +" and admin is not required to mark attendance/absence. Please delete temporary closure under attendance section if this is an error";
        }
      }


      if ( msg ) {
        growlService.growl(msg, 'danger');
        that.tableEdit = new ngTableParams({
          count: 10,           // count per page
          page: 1
        }, {
          total: 0,
          getData: function ($defer, params) {
            $defer.resolve([]);
          }
        });
        return;
      }

      if (!that.selectedChild) return;

      facilityService.getLicensing().then(function(obj){
        that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
        that.licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,that.today);
      });


      that.tableEdit = new ngTableParams({
        count:10,           // count per page
        page: 1
        
      }, {
        total: that.attendanceList.length, // length of data
        getData: function ($defer, params) {
          $timeout(checkLoaded($defer,params), 100);

        }
      });
    }
    that.allowedMarking=function(holiday){
      if(['SYSTEM_ADMIN_ROLE','COMPANY_ADMIN_ROLE','REGION_ADMIN_ROLE','FACILITY_ADMIN_ROLE'].indexOf(Auth.getCurrentUser().role.type)!==-1){
        return true;
      }
      return false;
    }
    that.onlyBookedChildren = true;
    that.toggleOnlyBookedChildren = function() {
      that.currentSession = null;
      if(that.onlyBookedChildren){
        var commonSessionOption = {Name: 'All',Start: '',End: '', };
        that.sessionList.push(commonSessionOption);
      }else{
        that.sessionList = that.sessionList.filter(function(option){
            if(option.Name == 'All'){
              return false;
            }
            return true;    
        })
      }
      //that.onlyBookedChildren = !that.onlyBookedChildren;
      updateFilteredChildList();
      that.filterChange();
    };

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var checkBookingAndEnrolment = function(kid) {
      return $util.checkBookingAndEnrolment(kid, that.onlyBookedChildren, that.today);
    }

    var addToday = function (data) {
      var foundKids = _.map(data, function (d) {
        return d.Child._id ? d.Child._id : d.Child
      });
      var allKids = _.map(getChildList(), function (d) {
        return d._id
      });


      _.each(data, function(kid) {
       
        if ( that.isHomeBased ) {
          // fix up educator for found kids
          kid.Educator = that.allEducatorsMap[kid.Educator];
        }
        //if ( kid.IsAbsent ) {
        //  kid.AbsenceReason = that.absenceReasonMap[kid.AbsenceReason];
        //}
      })

      
      var missingKids = _.difference(allKids, foundKids);

      _.each(missingKids, function (kidId) {
        if (validKid(kidId)) that.addRow(kidId, data, null, true);
      });
      return data;
    }

     function validKid(id, attdate) {
      //console.log(that.childlist);
      var kid = _.filter(that.childlist, function (k) {
        return k._id == id;
      })[0];

      //if ( !kid.NationalStudentNumber ) return false;
      if(that.currentSession){
          var bookingEnrolment = $util.checkBookingAndEnrolment(kid, that.onlyBookedChildren, that.today,that.currentSession.Start,that.currentSession.End,that.currentSession);
            
           if(bookingEnrolment && bookingEnrolment.Times){

            var flag=false;
            var att_day       = null;
            var key_to_check  = null;
            if(attdate){
              att_day = moment(attdate).format('dddd');
              key_to_check = att_day+'Session';
            }

            _.each(bookingEnrolment.Times[(bookingEnrolment.Times).length-1], function (val,key) { 

                if(
                  key_to_check &&
                  key == key_to_check &&
                  val == that.currentSession.Name
                ){
                  flag = true;
                }
            });


            if(flag){
              return true;
            }else{
              return false;
            }
          }else{
            return false;
          }
      }else{
        return checkBookingAndEnrolment(kid);
      }
      
    }

    function checkLoaded($defer,params) {
      return function () {
        if (that.selectedChild) {
          getAttendanceData().then(function (data) {
            if ($state.is('main.addAttendance')) {
              that.attendanceList = addToday(data);

            //} else if (reportFilterIdx > 0 && (that.startDate.getTime() == that.stopDate.getTime())) {
            //  that.attendanceList = addToday([]);
            } else {
              that.attendanceList = data;
            }
            if (that.holiday){
               if(!moment(that.holiday.Date).isSame(new Date(that.today.getTime()), "day")) {
                 that.holiday = null;
               }
            }else{
              $timeout(function(){
                //formlyAdapter.getList('systemholiday').then(function (data) {
                formlyAdapter.getList('holiday').then(function (data) {
                  //data = data.concat(data2);
                  _.each(data, function (h) { 
                    if(h.ReoccurYearly && (moment(h.Date).get('month')==moment(new Date(that.today)).get('month')) && (moment(h.Date).get('date')==moment(new Date(that.today)).get('date'))){
                      that.holiday = h;
                    }else if(!h.ReoccurYearly && moment(h.Date).isSame(new Date(that.today.getTime()), "day") ) {
                        that.holiday = h;
                    }
                  })
                });
             // });

                /*formlyAdapter.getList('temporaryClosure', getClosureParams()).then(function (data) {
                  
                       that.firstClosure = data && data.length ? data[0] : null;
                });*/

                formlyAdapter.getList('temporaryClosure').then(function (data) {
                  
                   that.firstClosure=null;
                  _.each(data,function(obj){
                        var closureStartDay=moment(obj.ClosureStartDate);
                        var closureEndDay=moment(obj.ClosureEndDate);
                        var today=moment(that.today);
                        
                        if(today.isBetween(closureStartDay,closureEndDay) || today.isSame(closureStartDay,'day') || today.isSame(closureEndDay,'day')){
                             that.firstClosure = obj;
                        }
                  });
                   
                });

              },200);
            } 
            var total = that.attendanceList.length ; //> 10 ? that.attendanceList.length :10 ;
            that.tableEdit.total(total);
            //that.tableEdit.count(total);
            //$defer.resolve(that.attendanceList.slice((params.page()-1)*params.count(),params.page()*params.count()));
      
            if(that.filterEducator){
              that.attendanceList = _.filter(that.attendanceList,  function (attendance){
                if(attendance.Educator._id == that.filterEducator._id) return attendance;
              });
            }
            $defer.resolve(that.attendanceList);

          });
        }
        else $timeout(checkLoaded($defer,params), 100);
      }
    }

    var timeFix = function (date, setToMidnight) {
      
      var d = new Date(date.getTime());
      
      if (setToMidnight) d.setHours(23, 59, 59, 0);
      else d.setHours(0, 0, 0, 0);
      return d.toISOString();
    }

    var getChildList = function (all) {
      var kids = [];

      if ( that.currentFilter == 'Enrolled Children' ) kids = that.childlist;
      else if (that.currentFilter == 'Room') kids = that.selectedRoom.children;
      else if (that.currentFilter == 'Child') kids = all?that.childlist:[that.selectedChild];
      else if (that.currentFilter == 'Educator') kids = that.selectedEducator.children;
      return kids;
    }

    var getParams = function () {
      if ($state.is('main.addAttendance') ) {
        var kids = getChildList(true);

        return {
          "$in": _.map(kids, function (c) {
            return c._id;
          })
        }
      } else {
        return that.selectedChild._id;
      }
    }

    var getDateParams = function (_start, _end) {
      var start = _start || that.startDate, end = _end || that.stopDate;
      if ($state.is('main.addAttendance') && !_start && !_end) {
        start = end = that.today;
      }
      //console.log({"$gte": timeFix(start, false), "$lte": timeFix(end, true)});
      return {"$gte": timeFix(start, false), "$lte": timeFix(end, true)};
    }

    var buildMoment = function (time) {
      var h = parseInt(time.split(":")[0], 10), m = parseInt(time.split(":")[1], 10);
      var d = new Date(that.today);
      d.setHours(h, m, 0, 0);
      return d;
    }

    var buildAttendanceParams = function () {
      var p = {
        query: JSON.stringify({
          Child: getParams(),
          Date: getDateParams(),
          facility:Auth.getCurrentUser().facility._id,
        })
      }
     /* if ($state.is('main.addAttendance')) {
        p['populate'] = 'Child';
      }
      p['sort']='+Date'*/
      return p;
    };

    var getClosureParams = function () {
      var start = moment(that.today).startOf('day').toDate();
      var end = moment(that.today).endOf('day').toDate();
      
      var p = {
        query: JSON.stringify({
          $or: [{
            ClosureStartDate: getDateParams(start, end)
          },
            {ClosureStopDate: getDateParams(start, end)},
          ]

        })
      }
      
      return p;
    }

    function getAttendanceData() {
      //return formlyAdapter.getList('attendance', buildAttendanceParams());
      return formlyAdapter.getListFromPost('attendance',buildAttendanceParams());
    }

    that.getAbsenceCode = function (code) {
      return;
    }

    that.filterChange = function () {
      $timeout(initTable, 100);
    };
    that.getSessionList = function (row) {
      var sessionList = that.sessionList.filter(function(option){
            if(option.Name == 'All'){
              return false;
            }
            return true;    
        })
      return sessionList;
    };
    that.sessionChange = function (row) {
      if (row.Session) {
        setSession(row, row.Session);
      }
    };

    that.print = function() {
      window.print();
    }

    function setSession(row, s) {
      row.IsAbsent = false;
      delete row.AbsenceReason;
      row.AttendanceTimeStart = buildMoment(s.Start);
      row.AttendanceTimeEnd = buildMoment(s.End);
    }

     $timeout(function () {
      formlyAdapter.getModels().then(function () {
        var params={}      
        params.populate ='Room,Educator';  
        
        if(Auth.getCurrentUser().role.type=='PARENT_ROLE' || Auth.getCurrentUser().role.type=='STAFF_PARENT_ROLE'){
          var user=Auth.getCurrentUser().parentId;
           params.query =JSON.stringify({
            ParentGuardians: { $in: [user] }})       
        } 
        
        formlyAdapter.getList('child', params).then(function (data) {
          
          $timeout(function () {
            var sortedChilds=_.sortBy(data,function(o){
                return o.OfficialFamilyName ? o.OfficialFamilyName.toLowerCase():''+" "+(o.PreferredGiven1Name?o.PreferredGiven1Name.toLowerCase():(o.OfficialGiven1Name)? o.OfficialGiven1Name.toLowerCase():'')
            })
            that.childlist = sortedChilds;            
            //that.childlist = data;
            updateFilteredChildList();
            that.roomList = parseRooms(data);
            that.selectedChild = data && data.length ? data[0] : {};
            that.selectedRoom = that.roomList.length ? that.roomList[0] : {};
            
            formlyAdapter.getList('parent').then(function(parents){
              that.parentList=parents;
              
           
            formlyAdapter.getList('staff').then(function (educators) {
              console.log('educators',educators)
              var educatorsData=educators.filter(function(data){
                return data.EducationalRoleCodeValue=="HBE" || data.EducationalRoleCode2Value=="HBE";
              });
               
              that.educatorList = parseEducators(data);
              if(!that.educatorList.length){

                that.educatorList =educatorsData;
              }

             
              that.allEducators = educatorsData;

              that.allEducatorsMap = {};
              _.each(that.allEducators, function (d) {
                that.allEducatorsMap[d._id] = d;
              });

              _.each(that.educatorList, function(ed2) {
                if (ed2.educator && that.allEducatorsMap[ed2.educator._id] ){
                    ed2.educator = that.allEducatorsMap[ed2.educator._id];
                }else  if (that.allEducatorsMap[ed2._id] ){
                  ed2.educator = that.allEducatorsMap[ed2._id];
                }
             
                 
              });
               that.parentListMap={};
              _.each(that.parentList, function (d) {
                that.parentListMap[d._id] = d;
              });
              that.selectedEducator = that.educatorList.length ? that.educatorList[0] : {};
              initTable();
            });
          });

          });
        });

        //formlyAdapter.getList('systemholiday').then(function (data) {
          formlyAdapter.getList('holiday').then(function (data) {
            //data = data.concat(data2);
            _.each(data, function (h) {
              if(h.ReoccurYearly && (moment(h.Date).get('month')==moment(new Date(that.today)).get('month')) && (moment(h.Date).get('date')==moment(new Date(that.today)).get('date'))){
                    that.holiday = h;
                  }else if(!h.ReoccurYearly && moment(h.Date).isSame(new Date(that.today.getTime()), "day") ) {
                      that.holiday = h;
                  }
              /*if (moment(h.Date).isSame(new Date(that.today.getTime()), "day")) {
                console.log(h.Date);
                console.log(new Date(that.today.getTime()));
                that.holiday = h;
              }*/
              ;
            })
          });
       // });
        formlyAdapter.getList('session').then(function (data) {
          //console.log(that.onlyBookedChildren);

          that.sessionList = data;
          var commonSessionOption = {
                           Name: 'All',
                           Start: '',
                           End: '',
                            };

         that.sessionList.push(commonSessionOption);
        });
        formlyAdapter.getList('temporaryClosure').then(function (data) {
      
           that.firstClosure=null;
          _.each(data,function(obj){
                var closureStartDay=moment(obj.ClosureStartDate);
                var closureEndDay=moment(obj.ClosureEndDate);
                var today=moment(that.today);
                
                if(today.isBetween(closureStartDay,closureEndDay) || today.isSame(closureStartDay,'day') || today.isSame(closureEndDay,'day')){
                     that.firstClosure = obj;
                }
          });
           
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
        });
      });

    }, 300);
   /* $timeout(function () {
      formlyAdapter.getModels().then(function () {
        formlyAdapter.getList('child', {populate: 'Room,Educator'}).then(function (data) {
          $timeout(function () {
            var sortedChilds=_.sortBy(data,function(o){
                return o.OfficialFamilyName ? o.OfficialFamilyName.toLowerCase():''+" "+(o.PreferredGiven1Name?o.PreferredGiven1Name.toLowerCase():(o.OfficialGiven1Name)? o.OfficialGiven1Name.toLowerCase():'')
            })
            that.childlist = sortedChilds;
            //that.childlist = data;
            updateFilteredChildList();
            that.roomList = parseRooms(data);
            that.selectedChild = data && data.length ? data[0] : {};
            that.selectedRoom = that.roomList.length ? that.roomList[0] : {};
            formlyAdapter.getList('educator').then(function (educators) {
              that.educatorList = parseEducators(data);
              if(!that.educatorList.length){
                that.educatorList =educators;
              }
             
              that.allEducators = educators;

              that.allEducatorsMap = {};
              _.each(that.allEducators, function (d) {
                that.allEducatorsMap[d._id] = d;
              });

              _.each(that.educatorList, function(ed2) {
                if (ed2.educator && that.allEducatorsMap[ed2.educator._id] ){
                    ed2.educator = that.allEducatorsMap[ed2.educator._id];
                }else  if (that.allEducatorsMap[ed2._id] ){
                  ed2.educator = that.allEducatorsMap[ed2._id];
                }
             
                 
              });
              

              that.selectedEducator = that.educatorList.length ? that.educatorList[0] : {};
              initTable();
            });

          });
        });

        //formlyAdapter.getList('systemholiday').then(function (data) {
          formlyAdapter.getList('holiday').then(function (data) {
            //data = data.concat(data2);
            _.each(data, function (h) {
              if(h.ReoccurYearly && (moment(h.Date).get('month')==moment(new Date(that.today)).get('month')) && (moment(h.Date).get('date')==moment(new Date(that.today)).get('date'))){
                    that.holiday = h;
                  }else if(!h.ReoccurYearly && moment(h.Date).isSame(new Date(that.today.getTime()), "day") ) {
                      that.holiday = h;
                  }
              /*if (moment(h.Date).isSame(new Date(that.today.getTime()), "day")) {
                console.log(h.Date);
                console.log(new Date(that.today.getTime()));
                that.holiday = h;
              }*
              ;
            })
          });
       // });
        formlyAdapter.getList('session').then(function (data) {
          that.sessionList = data;
        });
        formlyAdapter.getList('temporaryClosure').then(function (data) {
      
           that.firstClosure=null;
          _.each(data,function(obj){
                var closureStartDay=moment(obj.ClosureStartDate);
                var closureEndDay=moment(obj.ClosureEndDate);
                var today=moment(that.today);
                
                if(today.isBetween(closureStartDay,closureEndDay) || today.isSame(closureStartDay,'day') || today.isSame(closureEndDay,'day')){
                     that.firstClosure = obj;
                }
          });
           
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
        });
      });

    }, 300);*/

    var parseEducators = function (data) {
      return parseRooms(data, true);
    }

    var parseRooms = function (data, isEducator) {
      var key = isEducator ? 'Educator' : 'Room';
      var roomLookup = {};
      _.each(data, function (child) {
        // if no room or educator defined, skip it.
        if (!child[key] || !child[key]._id) return;

        if (!roomLookup[child[key]._id]) {
          roomLookup[child[key]._id] = {children: []};
          roomLookup[child[key]._id][key.toLowerCase()] = child[key];
        }
        roomLookup[child[key]._id].children.push(child);
      });
      var r = [];
      for (var k in roomLookup) {
        r.push(roomLookup[k]);
      }
      return r;
    }

    that.absenceReasonChanged = function (all_absence_reasons, selected_absence_reason){
      
      var reason = _searchById(all_absence_reasons, selected_absence_reason).Description.toLowerCase();
      if(reason == "exempt"){ 
        var exemption_message = "Please ensure that center has a completed EC12 and EC13 form and submitted to MOE. Also, note \"exempt\" type of absence is allowed up to maximum up to 12 weeks. After that system won't be claiming any funding";
        dialog.showOkDialog("Warning", exemption_message);
      }
    }

    function _searchById(arr_of_obj, id){
      var elt = null;
      angular.forEach(arr_of_obj, function (value, idx){
        if(value._id == id) elt = value;
      })
      return elt;
    }
  });