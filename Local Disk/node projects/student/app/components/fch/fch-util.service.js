'use strict';

angular.module("sms.fch", [])
        .config(function () {
            //...
        })
        .factory('fchUtils', function (moment, $util, $q, formlyapi, formlyAdapter, Auth, facilityService) {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return {
                matchTimes: function (bookings, today) {

                    var match = false;
                    var day = days[today.getDay()];
                    _.each(bookings.Times, function (t) {
                        match = match || (t[day + "Start"] && t[day + "End"])
                    });
                    return match;
                },
                zeropad: function (n) {
                    return n > 9 ? n : "0" + n;
                },
                getLabel: function (hr, min) {
                    var nexthr = hr + 1;

                    return hr + "-" + (nexthr);
                },
                getParams: function (childList) {
                    var kids = childList;
                    return {
                        "$in": _.map(kids, function (c) {
                            return c._id;
                        })
                    }

                },
                timeFix: function (date, setToMidnight) {
                    var d = new Date(date.getTime());
                    if (setToMidnight)
                        d.setHours(23, 59, 59, 0);
                    else
                        d.setHours(0, 0, 0, 0);
                    return d;
                },
                getChildName: function (child) {

                    return (child.PreferredGiven1Name ? child.PreferredGiven1Name : child.OfficialGiven1Name) + ' ' + child.OfficialFamilyName;
                },
                checkServiceSchedule: function (serviceSchedule, today) {
                    if (serviceSchedule && serviceSchedule[days[today.getDay()]] && serviceSchedule[days[today.getDay()]]['Scheduled']) {
                        return 1;

                    } else {
                        return 0;
                    }
                },
                getEffectiveServiceSchedule: function (serviceSchedule, today) {

                    var t = moment(today);
                    var servicescheduleObj = null;
                    if (serviceSchedule && serviceSchedule.length) {
                        _.each(serviceSchedule, function (obj) {
                            if (t.isAfter(obj.EffectiveDate, 'day') || t.isSame(obj.EffectiveDate, 'day')) {
                                servicescheduleObj = obj;
                            }
                        });
                    }

                    return servicescheduleObj;
                },
                getServiceScheduleMap: function () {
                    return formlyAdapter.getList("eceserviceschedule", {sort: '+EffectiveDate'}).then(function (schedules) {
                        // make a year/month/day map
                        var schMap = {
                            _dates: [],
                            _arr: schedules,
                            // expects day in "YYYY-MM-DD"
                            match: function (day) {
                                if (schMap._dates.length > 1) {
                                    var m = schMap._arr[0];
                                    _.each(schMap._dates, function (d, idx) {
                                        if (day >= d)
                                            m = schMap._arr[idx];
                                    });
                                    return m;
                                } else
                                    return schMap._arr[0];
                            }
                        };

                        _.each(schedules, function (sch) {
                            schMap._dates.push(moment(sch.EffectiveDate).format("YYYY-MM-DD"));
                        });

                        return schMap;
                    });
                },
                matchHoliday: function (holiday, start, end, yr) {
                    var cmp;
                    if (holiday.ReoccurYearly) {
                        cmp = moment(holiday.Date).set('year', yr);
                    } else {
                        cmp = moment(holiday.Date);
                    }
                    return cmp.isBetween(start, end)
                },
                matchesTempClosure: function (day, closures) {
                    var matches = false;
                    _.each(closures, function (cl) {
                        var end = moment(cl.ClosureEndDate), start = moment(cl.ClosureStartDate);
                        matches = matches || ((end.isSame(day, 'day') || end.isAfter(day, 'day')) && (start.isSame(day, 'day') || start.isBefore(day, 'day')));
                    })
                    return matches;
                },
                calculateHolidays: function (month, holidays) {
                    var that = this;
                    var mStart = moment("01 " + month, "DD MMM YYYY").subtract(1, 'seconds').toDate();
                    var mEnd = moment("01 " + month, "DD MMM YYYY").add(1, "month").toDate();
                    var yr = moment(mStart.getTime()).add(15, "days").format("YYYY");
                    var arr = [];

                    var count = 0;
                    _.each(holidays, function (h) {
                        if (that.matchHoliday(h, mStart, mEnd, yr)) {
                            count++;
                            arr.push(moment(h.Date).set('year', moment().format('YYYY')));
                        }
                    })
                    return arr;

                },
                getBooking: function (kid, today) {
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
                },
                checkBookingSchedule: function (timePeriod, child, today) {
                    var bsObj = this.getBooking(child, today);
                    var fchutils = this;
                    var flag = 0;
                    var attStart = moment(timePeriod.split("-")[0], 'h:mma');
                    var attEnd = moment(timePeriod.split("-")[1], 'h:mma');
                    var day = days[today.getDay()];
                    if (bsObj && bsObj.Times && bsObj.Times.length) {

                        _.each(bsObj.Times, function (t) {

                            if (t[day + "Start"] && t[day + "End"]) {
                                var dayBsTimeStart = moment(t[day + 'Start'], 'h:mma');
                                var dayBsTimeEnd = moment(t[day + 'End'], 'h:mma');

                                while (dayBsTimeStart <= dayBsTimeEnd) {
                                    if (dayBsTimeStart.isBetween(attStart, attEnd) || dayBsTimeEnd.isBetween(attStart, attEnd)) {
                                        flag = 1;
                                        return false;
                                    }
                                    dayBsTimeStart = moment(dayBsTimeStart).add(30, 'minutes');
                                }

                            }
                        });

                    }
                    return flag;


                },
                getBookingSchedule: function (child, today) {
                    var bsObj = this.getBooking(child, today);
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
                },
                get_attendance: function (attendanceList, child) {
                    if(attendanceList){
                            var attendance = attendanceList.filter(function (att) {
                        if (att.Child == child._id) {

                            return true;
                        }
                    });
                    if (attendance && attendance.length)
                        return attendance;
                    else
                        return [];
                    }else{
                        return [];
                    }
                },
                checkChildAgeCondition: function (child, today) {
                    var childBirthDay = moment(child.ChildBirthDate);
                    var day = moment(today);
                    var months = day.diff(childBirthDay, 'months');
                    if (months < 72) {
                        return true;
                    } else {
                        return false;
                    }

                },
                checkThreeWeekRule: function (child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList) {

                    if (!this.checkChildAgeCondition(child, today)) {
                        return 0;
                    }
                  
                    var thisfchUtils = this;
                    var attendance = thisfchUtils.get_attendance(attendanceList, child);
                    var threeweekruleVal = 1;
                    if (attendance && attendance.length) {

                        _.each(attendance, function (a) {
                            if (a.IsAbsent) {
                                var absenceReason=(absenceReasonMap[a.AbsenceReason] && absenceReasonMap[a.AbsenceReason].Description) ? absenceReasonMap[a.AbsenceReason].Description:a.AbsenceReason.Description; 
                                if(absenceReason=='Exempt'){
                                     threeweekruleVal = 1;
                                     return  threeweekruleVal;
                                }else if (thisfchUtils.checkAbsenceFrequency(child, today, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList,absenceReasonMap,twelveWeekAttendanceList)) {
                                    threeweekruleVal = 0
                                    return false;
                                } else {

                                    threeweekruleVal = 1;
                                }

                            } else {

                                threeweekruleVal = 1;
                            }
                        });
                    }

                    return threeweekruleVal;
                },
                checkHoliday: function (day, holidayList) {
                    var flag = false;
                    if (holidayList && holidayList.length) {
                        _.each(holidayList, function (holiday) {
                            if (holiday) {
                                var holidayDay = new Date(holiday.Date).getDate();
                                var holidayMonth = new Date(holiday.Date).getMonth() + 1;
                                var holidayYear = new Date(holiday.Date).getYear();
                                var todayDay = new Date(day).getDate();
                                var todayMonth = new Date(day).getMonth() + 1;
                                var todayYear = new Date(day).getYear();
                                if (holiday.ReoccurYearly && holidayDay == todayDay && holidayMonth == todayMonth) {
                                    if (holiday.canMarkAttendance) {
                                        flag = false;
                                    } else {
                                        flag = true;
                                    }

                                } else if (holidayDay == todayDay && holidayMonth == todayMonth && holidayYear == todayYear) {
                                    if (holiday.canMarkAttendance) {
                                        flag = false;
                                    } else {
                                        flag = true;
                                    }
                                }
                            }
                        })
                    }
                    return flag;
                },
                checkTemperoryClousure: function (day, temporaryClosureList) {
                    var flag = false;
                    if (temporaryClosureList && temporaryClosureList.length) {
                        _.each(temporaryClosureList, function (data) {
                            var closureStartDay = moment(data.ClosureStartDate);
                            var closureEndDay = moment(data.ClosureEndDate);
                            var today = moment(day);

                            if (today.isBetween(closureStartDay, closureEndDay) || today.isSame(closureStartDay, 'day') || today.isSame(closureEndDay, 'day')) {
                                flag = true;
                            }

                        });
                    }
                    return flag;
                },
                get_TwelveWeekattendance:function(attendanceList,child,today){
                        if(attendanceList){
                        var attendance = attendanceList.filter(function (att) {
                        if (att.Child == child._id && (moment(att.Date).isBefore(today,'day') || moment(att.Date).isSame(today,'day'))) {

                            return true;
                        }
                    });
                    if (attendance && attendance.length)
                        return attendance;
                    else
                        return [];
                    }else{
                        return [];
                    }
                },
                checkAbsence: function (child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) {

                    var thisFchutils = this;
                    var booking = thisFchutils.getBooking(child, today);
                    var ifabsent = false;
                    var ifAnyPresent=false;
                    var returnFlag = "--";
                    var is_bookedForDay=false;
                    var bookingEffectivedate=null;
                    var isInFirstOnWeekOfFunding=false;
                    var attObj=null;
                    var bookingWeekdays={};
                    var attendance = thisFchutils.get_attendance(attendanceList, child);
                    var twelveWeekattendaceforchild= thisFchutils.get_TwelveWeekattendance(twelveWeekAttendanceList, child,today); //(twelveWeekAttendanceList && twelveWeekAttendanceList[child._id]) ? twelveWeekAttendanceList[child._id]: [];
                    var bookingDaysCounter=0;
                    if (booking && booking.EffectiveDate) {
                         is_bookedForDay=true;
                         bookingEffectivedate = new Date(moment(booking.EffectiveDate).toDate());
                         bookingWeekdays=thisFchutils.getWeeklyDateRange(bookingEffectivedate);

                         isInFirstOnWeekOfFunding=(moment(today).isSame(moment(bookingWeekdays[0]),'day') || moment(today).isSame(moment(bookingWeekdays[bookingWeekdays.length-1]),'day') || moment(today).isBetween(moment(bookingWeekdays[0]),moment(bookingWeekdays[bookingWeekdays.length-1]),'day'));
                         // Code to count the number of weekdays booked

                        if(booking.Times && booking.Times.length){
                             _.each(booking.Times,function(obbj){
                                        _.each(days,function(day){
                                            if(obbj[day+"Start"]!=''){
                                                bookingDaysCounter++;
                                            }
                                        })
                                    })
                        }
                         
                    }
                  
                  // patch to check if any present
                 _.each(twelveWeekattendaceforchild,function(obj){
                      
                       var key=obj.Date;
                        if(thisFchutils.checkTemperoryClousure(new Date(key),temporaryClosureList)){
                            
                        }else if(thisFchutils.checkHoliday(new Date(key),holidayList)){
                             
                        }else if(obj && obj.Date){ 
                          if(obj.Child==child._id){
                                var absence_reason=(absenceReasonMap[obj.AbsenceReason] && absenceReasonMap[obj.AbsenceReason].Description) ? absenceReasonMap[obj.AbsenceReason].Description:(obj.AbsenceReason && obj.AbsenceReason.Description)? obj.AbsenceReason.Description:''; 
                                if(!obj.IsAbsent || absence_reason=="Exempt"){
                                  ifAnyPresent=true;
                                }
                              }
                          }
                   });



                 /* _.each(twelveWeekAttendanceList,function(obj,key){
                        if(thisFchutils.checkTemperoryClousure(new Date(key),temporaryClosureList)){
                            
                        }else if(thisFchutils.checkHoliday(new Date(key),holidayList)){
                             
                        }else if(obj && obj.length){
                        _.each(obj,function(att){
                              if(att.Child==child._id){
                                var absence_reason=(absenceReasonMap[att.AbsenceReason] && absenceReasonMap[att.AbsenceReason].Description) ? absenceReasonMap[att.AbsenceReason].Description:(att.AbsenceReason && att.AbsenceReason.Description)? att.AbsenceReason.Description:''; 
                                if(!att.IsAbsent || absence_reason=="Exempt"){
                                   ifAnyPresent=true;
                                }
                              } 
                                
                           });
                       }
                   });*/

                
                    if(attendance && attendance.length){
                        _.each(attendance, function (att) {
                            if (att.IsAbsent) {
                                ifabsent = true;
                                attObj=att;
                            }
                        });
                    }
                    if(isInFirstOnWeekOfFunding && ifabsent){ 
                        return "F";  
                    }else if(ifabsent && ifAnyPresent){
                         var absenceReason=(absenceReasonMap[attObj.AbsenceReason] && absenceReasonMap[attObj.AbsenceReason].Description ) ? absenceReasonMap[attObj.AbsenceReason].Description:attObj.AbsenceReason.Description;
                         var isFunded=(absenceReasonMap[attObj.AbsenceReason] && absenceReasonMap[attObj.AbsenceReason].IsFunded) ? absenceReasonMap[attObj.AbsenceReason].IsFunded: false;  
                         
                         if(isFunded && ['Absent','Sick Leave'].indexOf(absenceReason)!=-1){
                             var three = thisFchutils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList);
                             
                              if (three) {
                                    returnFlag = "F";
                                 } else { 
                                    returnFlag = "NF";
                                } 
                           } else if(isFunded && absenceReason=="Exempt" ){
                               
                               var exemptAbsenceCounter=0;
                                _.each(twelveWeekattendaceforchild,function(att){
                      
                                       var key=att.Date;
                                        if(thisFchutils.checkTemperoryClousure(new Date(key),temporaryClosureList)){
                                                exemptAbsenceCounter++;
                                            }else if(thisFchutils.checkHoliday(new Date(key),holidayList)){
                                                   exemptAbsenceCounter++;
                                            }else if(att && att.Date){
                                                if(att.Child==child._id){
                                                   
                                                    if(att.IsAbsent){
                                                        var absence_reason=(absenceReasonMap[att.AbsenceReason] && absenceReasonMap[att.AbsenceReason].Description) ? absenceReasonMap[att.AbsenceReason].Description:att.AbsenceReason.Description; 
                                                       if(absence_reason=='Exempt' && moment(att.Date).isBefore(moment(new Date(today)),'day')){
                                                         exemptAbsenceCounter++;
                                                       }else if(absence_reason!='Exempt'){
                                                           exemptAbsenceCounter=0;
                                                       }
                                                    }else{
                                                       exemptAbsenceCounter=0;
                                                        
                                                    }
                                                  }
                                           }
                                   });
                              /* _.each(twelveWeekAttendanceList,function(obj,key){
                                            if(thisFchutils.checkTemperoryClousure(new Date(key),temporaryClosureList)){
                                                exemptAbsenceCounter++;
                                            }else if(thisFchutils.checkHoliday(new Date(key),holidayList)){
                                                   exemptAbsenceCounter++;
                                            }else if(obj && obj.length){
                                            _.each(obj,function(att){
                                                  if(att.Child==child._id){
                                                   
                                                    if(att.IsAbsent){
                                                        var absence_reason=(absenceReasonMap[att.AbsenceReason] && absenceReasonMap[att.AbsenceReason].Description) ? absenceReasonMap[att.AbsenceReason].Description:att.AbsenceReason.Description; 
                                                       if(absence_reason=='Exempt' && moment(att.Date).isBefore(moment(new Date(today)),'day')){
                                                         exemptAbsenceCounter++;
                                                       }else if(absence_reason!='Exempt'){
                                                           exemptAbsenceCounter=0;
                                                       }
                                                    }else{
                                                       exemptAbsenceCounter=0;
                                                        
                                                    }
                                                  } 
                                                    
                                               });
                                           }
                                       });*/
                                    
                                       var exemptcouterLimit=bookingDaysCounter*12;
                                       
                                       if(exemptAbsenceCounter >=exemptcouterLimit){
                                             returnFlag="NF";
                                       } else {
                                             returnFlag= 'F';

                                       }
                           }else if(absenceReason=='Educator Absent'){
                                returnFlag="NF"; 
                                
                           }else{
                              
                               returnFlag="NF";
                           }
                        
                    }else if(!ifAnyPresent && ifabsent){
                       returnFlag="NF"; 
                    } 
                    return returnFlag;
                    
                },
              
                        
                checkChildAttendance: function (attendanceList, timePeriod, child, today, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) {

                    var thisUtil = this;
                    var attendanceFlag = 0;

                    var attendance = attendanceList.filter(function (att) {
                        if (att.Child == child._id) {
                            return true;
                        } else
                            return false;
                    });

                    if (attendance && attendance.length) {
                        _.each(attendance, function (attndance) {

                            var startTime = timePeriod.split("-")[0];
                            var endTime = timePeriod.split("-")[1];
                            if (startTime && endTime) {
                                var attendanceDate = moment(new Date(attndance.Date));

                                today = new Date(today);

                                var cAbsence = thisUtil.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);

                                if (attendanceDate.isSame(today, 'day') && attndance.IsAbsent && cAbsence == 'F') {
                                    attendanceFlag = 1;

                                    if ($util.checkBookingAndEnrolment(child, true, today)) {

                                        attendanceFlag = thisUtil.checkBookingSchedule(timePeriod, child, today)

                                    }
                                    return false;
                                }
                                var beginningTime = moment(startTime, 'h:mma');
                                var EndTime = moment(endTime, 'h:mma');
                                var attStrtTime = new Date(attndance.AttendanceTimeStart).getHours() + ":" + new Date(attndance.AttendanceTimeStart).getMinutes();
                                var attendTime = new Date(attndance.AttendanceTimeEnd).getHours() + ":" + new Date(attndance.AttendanceTimeEnd).getMinutes();
                                var AttendanceTimeStart = moment(attStrtTime, 'h:mma');
                                var AttendanceTimeEnd = moment(attendTime, 'h:mma');

                                if ((beginningTime.isBetween(AttendanceTimeStart, AttendanceTimeEnd)) || (EndTime.isBetween(AttendanceTimeStart, AttendanceTimeEnd)) || (beginningTime.isSame(AttendanceTimeStart) && EndTime.isSame(AttendanceTimeEnd))) {

                                    attendanceFlag = 1;
                                    if (attndance.IsAbsent) {

                                        attendanceFlag = 0;
                                    }
                                    return false;
                                } else {

                                    attendanceFlag = 0;
                                }

                            }
                        });

                        return attendanceFlag;
                    } else {
                        return 0;
                    }

                },
                getLastThreeWeekDates: function (today, holidayList, temporaryClosureList, absenceReasonMap) {
                    var datesArray = [new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000)]
                    var lastDay = 28;
                    _.each(temporaryClosureList, function (closureDay) {
                        var closureStartDay = moment(closureDay.ClosureStartDate);
                        var closureEndDay = moment(closureDay.ClosureEndDate);
                        var dayDiff=closureEndDay.diff(closureStartDay,'day');
                        if(dayDiff >= 14){
                           _.each(datesArray, function (date) {
                            var day = moment(date);
                            var clousureData = (closureDay.ClosureReasonCode._id) ? closureDay.ClosureReasonCode._id : closureDay.ClosureReasonCode;

                            if ((day.isBetween(closureStartDay,closureEndDay) || day.isSame(closureStartDay,'day') || day.isSame(closureEndDay,'day')) && ( absenceReasonMap && absenceReasonMap[clousureData] &&  !absenceReasonMap[clousureData].IsFunded)) {

                                delete(datesArray[datesArray.indexOf(date)]);
                                var newdate=moment(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                if(newdate.isBefore(closureStartDay,'day')){
                                    datesArray.push(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                    lastDay += 7;
                                }else{
                                    while(!newdate.isBefore(closureStartDay,'day')){
                                        lastDay += 7; 
                                        newdate=moment(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                    }
                                   datesArray.push(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                    lastDay += 7;
                                }
                                
                                /*datesArray.push(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                lastDay += 7;*/
                            }
                            });
                        }
                    });
                    _.each(holidayList, function (holiday) {
                        _.each(datesArray, function (date) {
                            var holidayDay = new Date(holiday.Date).getDate();
                            var holidayMonth = new Date(holiday.Date).getMonth() + 1;
                            var holidayYear = new Date(holiday.Date).getYear();
                            var todayDay = new Date(date).getDate();
                            var todayMonth = new Date(date).getMonth() + 1;
                            var todayYear = new Date(date).getYear();
                            if (holiday.ReoccurYearly && holidayDay == todayDay && holidayMonth == todayMonth) {

                                //if (holiday.canMarkAttendance) {
                                delete(datesArray[datesArray.indexOf(date)]);
                                datesArray.push(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                lastDay += 7;
                                // } 
                                return false;
                            } else if (holidayDay == todayDay && holidayMonth == todayMonth && holidayYear == todayYear) {

                                // if (holiday.canMarkAttendance) {
                                delete(datesArray[datesArray.indexOf(date)]);
                                datesArray.push(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                                lastDay += 7;
                                // } 
                            }



                            /*if (moment(date, 'day').isSame(moment(holiday.Date, 'day'))) {
                             console.log(holiday.Date);
                             delete(datesArray[datesArray.indexOf(date)]);
                             datesArray.push(new Date(today.getTime() - lastDay * 24 * 60 * 60 * 1000));
                             lastDay += 7;
                             }*/
                        });
                    });
                  
                    return datesArray;
                },
                checkAbsenceFrequency: function (child, today, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, absenceReasonMap, twelveWeekAttendanceList) {
                    var datesArray = this.getLastThreeWeekDates(today, holidayList, temporaryClosureList, absenceReasonMap);
                    var thisFchutils=this;
                    var attFlag = [];
                    var absenceDates = [];
                    _.each(datesArray, function (date) {
                        if (lastThreeWeeksAttendanceList[date] && lastThreeWeeksAttendanceList[date].length) {
                           
                            _.each(lastThreeWeeksAttendanceList[date], function (att, i) {
                                if (att.Child == child._id && att.IsAbsent) {
                                    absenceDates.push(date);
                                    attFlag.push(1);
                                    return false;
                                }
                            });
                        }else{
                            if(thisFchutils.checkTemperoryClousure(date,temporaryClosureList)){
                                attFlag.push(1);
                            }
                        }
                    });

                    //  //  //    //    //  // //
                    //  PATCH TO TASK SMS-447  //
                    //  //  //    //    // //  //  
                    //console.log("attFlag before");
                    //console.log(attFlag);
                    ////attFlag = attFlag.concat(this._getHolidayAbsence(datesArray, attFlag, absenceDates, child, this));
                    //console.log("attFlag")
                    //console.log(attFlag);
                    if (attFlag.length >= 3) {
                        return true;
                    } else {
                        return false;
                    }



                },
                _getHolidayAbsence: function (datesArray, attFlag, absenceDates, child, self) {

                    var holidays_counted_absence = [];
                    var exclude_indexes = [];
                    if (attFlag.length && attFlag.length < 3) {



                        _.each(absenceDates, function (val, i) {

                            var idx = datesArray.indexOf(val);

                            var l_part = datesArray.slice(0, idx);
                            var r_part = datesArray.slice(idx + 1);
                            exclude_indexes = exclude_indexes.concat(self._findConsectiveMissingFromLast(l_part));
                            exclude_indexes = exclude_indexes.concat(self._findConsectiveMissingFromStart(r_part));

                        })
                        holidays_counted_absence = exclude_indexes;
                    }

                    return holidays_counted_absence;
                },
                _findConsectiveMissingFromLast: function (arr) {
                    var indexes = [];
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i])
                            break;
                        else
                            indexes.push(i);
                    }
                    return indexes;
                },
                _findConsectiveMissingFromStart: function (arr) {
                    var indexes = [];
                    for (var i = 0; i < arr.length - 1; i++) {
                        if (arr[i])
                            break;
                        else
                            indexes.push(i);
                    }
                    return indexes;
                },
                _getUniqueArray: function (arr) {
                    var unique_arr = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (unique_arr.indexOf(arr[i]) < 0)
                            unique_arr.push(arr[i]);
                    }
                    return unique_arr;
                },
                checkChildAttendanceOrBooking: function (timePeriod, child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) {

                    if (!this.checkChildAgeCondition(child, today))
                        return 0;

                    var child_attendance = this.get_attendance(attendanceList, child);
                    var ifabsent = false;
                    _.each(child_attendance, function (att) {
                        if (att.IsAbsent) {
                            ifabsent = true;
                        }
                    });

                    
                    if (ifabsent && this.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) == "NF") {
                          return 0;
                    }
                    if (child_attendance && child_attendance.length) {

                        var x2 = this.checkChildAttendance(attendanceList, timePeriod, child, today, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);

                        if (x2 == 0) {

                            return this.checkBookingSchedule(timePeriod, child, today);
                        } else {

                            return x2;
                        }

                    } else {
                        return this.checkBookingSchedule(timePeriod, child, today);

                    }
                },
                getTimeHeaders: function (day, eceServiceschedule, childList, attendanceList, format) {

                    var arr = [];

                    var startHour = this.getCentreStartTime(day, eceServiceschedule, childList, attendanceList);
                    var endHour = this.getCentreEndTime(day, eceServiceschedule, childList, attendanceList);

                    for (var i = startHour; i < endHour; i++) {
                        for (var j = 0; j < 60; j = j + 60) {
                            if (format) {
                                arr.push(this.getLabel(i, j));
                            } else {
                                arr.push(this.zeropad(i) + ':' + this.zeropad(j));

                            }
                        }
                    }

                    return arr;
                },
                getCentreStartTime: function (day, eceServiceschedule, childList, attendanceList) {
                    var startTime = 7;

                    var fchUtils = this;
                    if (eceServiceschedule && eceServiceschedule.length) {
                        var scheduleTimes = eceServiceschedule[eceServiceschedule.length - 1];
                        if (scheduleTimes[days[day.getDay()]] && scheduleTimes[days[day.getDay()]].Scheduled) {
                            startTime = (scheduleTimes[days[day.getDay()]].StartTime) ? parseInt(scheduleTimes[days[day.getDay()]].StartTime.split(":")[0]) : startTime;
                        }
                    }
                    if (childList && childList.length) {
                        _.each(childList, function (child) {
                            if ($util.checkBookingAndEnrolment(child, true, day)) {
                                var bs = fchUtils.getBookingSchedule(child, day);
                                if (bs && bs.length) {
                                    _.each(bs, function (times) {
                                        var time = times['startTime'].hour();
                                        if (time < startTime) {
                                            startTime = time;
                                        }
                                    });

                                }

                            }
                        });
                    }

                    if (attendanceList && attendanceList.length) {

                        _.each(attendanceList, function (attObj) {
                            var time = (attObj.AttendanceTimeStart && !attObj.IsAbsent) ? parseInt(new Date(attObj.AttendanceTimeStart).getHours()) : startTime;
                            if (time < startTime) {
                                startTime = time;
                            }
                        });
                    }

                    return parseInt(startTime);
                },
                getCentreEndTime: function (day, eceServiceschedule, childList, attendanceList) {
                    var fchUtils = this;
                    var endTime = null;
                    if (eceServiceschedule && eceServiceschedule.length) {
                        var scheduleTimes = eceServiceschedule[eceServiceschedule.length - 1];
                        if (scheduleTimes[days[day.getDay()]] && scheduleTimes[days[day.getDay()]].Scheduled) {
                            endTime = (scheduleTimes[days[day.getDay()]].EndTime) ? parseInt(scheduleTimes[days[day.getDay()]].EndTime.split(":")[0]) : endTime;
                        }
                    }

                    if (childList && childList.length) {
                        _.each(childList, function (child) {
                            if ($util.checkBookingAndEnrolment(child, true, day)) {

                                var bs = fchUtils.getBookingSchedule(child, day);
                                if (bs && bs.length) {
                                    _.each(bs, function (times) {
                                        var time = times['endTime'].hour();
                                        if (time > endTime) {
                                            endTime = time;
                                        }
                                    });

                                }

                            }
                        });

                    }

                    if (attendanceList && attendanceList.length) {
                        _.each(attendanceList, function (attObj) {
                            var time = (attObj.AttendanceTimeStart && !attObj.IsAbsent) ? parseInt(new Date(attObj.AttendanceTimeEnd).getHours()) : endTime;
                            if (!endTime) {
                                endTime = time;
                            } else if (time > endTime) {
                                endTime = time;
                            }
                        });
                    }
                    if (!endTime) {
                        endTime = 19;
                    }
                    return parseInt(endTime);
                },
                checkWeekTwentyHoursAttestation: function (child, today) {
                    var bs = this.getBooking(child, today);
                    var weeklyTwentyECEAttestation = false;
                    var eligibleTwentyHoursEce = (bs && bs.TwentyHoursECEAttestation) ? true : false;
                    if (eligibleTwentyHoursEce) {
                        var TwentyHoursECEAttestationObj = bs.TwentyHoursECEAttestation;
                        _.each(days, function (day) {
                            if ((TwentyHoursECEAttestationObj[day + "Hours"]) && TwentyHoursECEAttestationObj[day + "Hours"] > 0) {
                                weeklyTwentyECEAttestation = true;
                                return false;
                            }
                        });
                    }
                    return weeklyTwentyECEAttestation;
                },
                getECEPlusTenHours: function (FCH, child, day, attendanceList) {
                    if (child) {
                        var childBirthDay = moment(child.ChildBirthDate);
                        var today = moment(day);
                        var months = today.diff(childBirthDay, 'months');
                        // if(months > 24 && this.checkChildAgeCondition(child,day)){
                        if (months >= 36 && months <= 60) {
                            var ECETwentyHours = this.getECETwentyHours(FCH, child, day, attendanceList);
                            var ECEPlusTenHours = 0;

                            if (ECETwentyHours > 0 || this.checkWeekTwentyHoursAttestation(child, day)) {
                                ECEPlusTenHours = FCH - ECETwentyHours;
                            }
                            if (ECEPlusTenHours < 0) {
                                ECEPlusTenHours = 0;
                            }
                            return ECEPlusTenHours;
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                },
                getECETwentyHours: function (fch, child, today, attendanceList) {
                    var childBirthDay = moment(child.ChildBirthDate);
                    var day = moment(today);
                   
                    var months = day.diff(childBirthDay, 'months');
                    if (months >= 36 && months <= 60 && fch > 0) {

                        var bs = this.getBooking(child, today);
                       
                        var eligibleTwentyHoursEce = (bs && bs.TwentyHoursECEAttestation) ? true : false;
                        if (eligibleTwentyHoursEce) {
                            var TwentyHoursECEAttestationObj = bs.TwentyHoursECEAttestation;
                            var dayOfWeek = $util.getDayOfWeek(today);

                            return (TwentyHoursECEAttestationObj[dayOfWeek + "Hours"]) ? TwentyHoursECEAttestationObj[dayOfWeek + "Hours"] : 0;
                        } else {
                            return 0;
                        }

                    } else {
                        return 0;
                    }

                },
                validateAttendanceAndbookingTimings: function (attStartTime, attEndTime, bookingStartTime, bookingEndTime, child) {
                    return (new Date(attStartTime).getHours() <= new Date(bookingStartTime).getHours() && new Date(attEndTime).getHours() >= new Date(bookingStartTime).getHours()) || (new Date(attStartTime).getHours() > new Date(bookingStartTime).getHours() && new Date(attStartTime).getHours() <= new Date(bookingEndTime).getHours());
                    // return (attStartTime <= bookingStartTime && attEndTime >= bookingStartTime) || (attStartTime > bookingStartTime && attStartTime <= bookingEndTime);
                },
                getChildAttededOrBookedHours: function (child, today,eceserviceschedule, attendanceList, childList, ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) {
                    var childPlace = (licenseConfiguration) ? licenseConfiguration.ChildPlace : ChildPlace;
                    var childAttendance = this.get_attendance(attendanceList, child);
                    var childTodayBookingSchedule = this.getBookingSchedule(child, today);
                    var totalHours = 0;
                    var fchutils = this;

                    if (childAttendance && childAttendance.length) {
                        _.each(childAttendance, function (att) {
                            var attStartTime = moment(new Date(att.AttendanceTimeStart).toString(), 'DD/MM/YYYY HH:mm:ss');
                            var attEndTime = moment(new Date(att.AttendanceTimeEnd).toString(), 'DD/MM/YYYY HH:mm:ss');

                            if (att.IsAbsent && fchutils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) == 'F') {

                                if (childTodayBookingSchedule && childTodayBookingSchedule.length) {
                                    _.each(childTodayBookingSchedule, function (booking) {
                                        var bookingStartTime = booking.startTime;
                                        var bookingEndTime = booking.endTime;
                                        totalHours += (bookingEndTime.diff(bookingStartTime, 'minutes') / 60); //Math.ceil(bookingEndTime.diff(bookingStartTime,'minutes')/60);
                                    });

                                }
                            } else if (att.IsAbsent) {
                                totalHours = 0;
                            } else {

                                if (childTodayBookingSchedule && childTodayBookingSchedule.length) {
                                    var attendanceStartTime = moment(attStartTime, 'hh:mm');
                                    var attendanceEndTime = moment(attEndTime, 'hh:mm');
                                    var hasbookingmatched = false;
                                    var bookinghoursDiff = 0;
                                    _.each(childTodayBookingSchedule, function (booking) {
                                        var bookingStartTime = moment(booking.startTime, 'hh:mm');
                                        var bookingEndTime = moment(booking.endTime, 'hh:mm');

                                        bookinghoursDiff += (bookingEndTime.diff(bookingStartTime, 'minutes') / 60);

                                        if (fchutils.validateAttendanceAndbookingTimings(attendanceStartTime, attendanceEndTime, bookingStartTime, bookingEndTime, child)) {
                                            var diff = (attEndTime.diff(attStartTime, 'minutes') / 60); //Math.ceil(attEndTime.diff(attStartTime,'minutes')/60);
                                            totalHours = totalHours + diff;
                                            hasbookingmatched = true;
                                            // return false;
                                        }

                                    });
                                    if (!hasbookingmatched) {

                                        var attendanceDiff = (attEndTime.diff(attStartTime, 'minutes') / 60);
                                        totalHours = bookinghoursDiff + attendanceDiff;

                                    } else {
                                        if (totalHours < bookinghoursDiff) {
                                            totalHours = bookinghoursDiff;
                                        }
                                    }


                                } else {

                                    var attendanceStartTime = moment(attStartTime, 'hh:mm');
                                    var attendanceEndTime = moment(attEndTime, 'hh:mm');
                                    while (attendanceStartTime < attendanceEndTime) {
                                        var attStartTime = attendanceStartTime;
                                        var attEndTime = moment(attStartTime).add(1, 'hour');
                                        if (attEndTime.isAfter(attendanceEndTime)) {
                                            attEndTime = attendanceEndTime;
                                        }


                                        var bookedChildforthisHour = childList.filter(function (c) {
                                            var childBookingScheduleforToday = fchutils.getBookingSchedule(c, today);
                                            if (childBookingScheduleforToday && childBookingScheduleforToday.length) {
                                                var flag = false;
                                                _.each(childBookingScheduleforToday, function (booking) {
                                                    var bookingStrtTime = moment(booking.startTime, 'hh:mm');
                                                    var bookingEdTime = moment(booking.endTime, 'hh:mm');
                                                    if (fchutils.validateAttendanceAndbookingTimings(attendanceStartTime, attendanceEndTime, bookingStrtTime, bookingEdTime, child)) {
                                                        flag = true;
                                                    }
                                                });
                                                return flag;
                                            }
                                        });
                                        var totalAttendanceExceptthischild = attendanceList.filter(function (att) {
                                            if (att.Child != child._id) {
                                                var att_start_time = moment(att.AttendanceTimeStart, 'hh:mm');
                                                var att_end_time = moment(att.AttendanceTimeEnd, 'hh:mm');
                                                if (att_start_time.isBetween(attendanceStartTime, attendanceEndTime))
                                                    return true;
                                                if (att_end_time.isBetween(attendanceStartTime, attendanceEndTime))
                                                    return true;
                                                if (attendanceStartTime.isBetween(att_start_time, att_end_time))
                                                    return true;
                                                if (attendanceEndTime.isBetween(att_start_time, att_end_time))
                                                    return true;

                                            }
                                        });

                                        if (bookedChildforthisHour && bookedChildforthisHour.length < childPlace) {

                                            totalHours += (attEndTime.diff(attStartTime, 'minutes') / 60);
                                        } else if (totalAttendanceExceptthischild && totalAttendanceExceptthischild.length < childPlace) {

                                            totalHours += (attEndTime.diff(attStartTime, 'minutes') / 60);
                                        }

                                        attendanceStartTime.add(1, 'hour');
                                    }



                                }

                            }
                        });

                    } else {

                        if (childTodayBookingSchedule && childTodayBookingSchedule.length) {
                            _.each(childTodayBookingSchedule, function (booking) {
                                var bookingStartTime = booking.startTime;
                                var bookingEndTime = booking.endTime;
                                var diff = bookingEndTime.diff(bookingStartTime, 'minutes') / 60; //Math.ceil(bookingEndTime.diff(bookingStartTime,'minutes')/60);
                                totalHours += diff;
                            });

                        }
                    }
                    if (Auth.getCurrentUser().facility.CenterType == "Playcentre") {
                         var m = moment(today);
                         var sch = (eceserviceschedule && eceserviceschedule[m.format("dddd")]) ? eceserviceschedule[m.format("dddd")]:null;
                         if (licenseConfiguration && totalHours == 2.5 && (sch && sch.SessionType == "Sessional" || licenseConfiguration.SessionType == "Mixed")) {
                            totalHours = 3;
                        }
                    }
                    
                   /* if(childFARCounter && childFARCounter[child._id] && childFARCounter[child._id].frequestabsencecounter >=3 ){
                        
                        var monthKey=new Date(today).getMonth()+1;
                        if(childFARCounter[child._id].frequentAbsenceCountersFlags){
                            if(childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey] && childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentHourlyAbsent){
                                totalHours=totalHours-childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentAbsentHours;
                            }else if(childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey] && childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentDailyAbsent){
                                totalHours=0;
                            }
                            
                        }
                        
                        
                    }*/

                    return totalHours;
                },
                getEceFundingUnderTwoFCH: function (child, day, matrix) {

                    if (child) {
                        var childBirthDay = moment(child.ChildBirthDate);
                        var today = moment(day);
                        var months = today.diff(childBirthDay, 'months');
                      
                        if (months < 24) {
                            return matrix[child._id]['claimable_fch'];
                        } else {
                            return 0;
                        }

                    } else {
                        return 0;
                    }

                },
                getEceFundingOverTwoAndLessThanSix: function (child, day, attendanceList, matrix) {
                    if (child) {
                        var childBirthDay = moment(child.ChildBirthDate);
                        var today = moment(day);
                        var months = today.diff(childBirthDay, 'months');
                        if (months >= 24 && months < 72) {
                            var FCH = matrix[child._id]['claimable_fch'];
                            //var ECETwentyHours = this.getECETwentyHours(FCH, child, day, attendanceList);
                            var value = 0;
                            if (!this.checkWeekTwentyHoursAttestation(child, day) || months > 60) {
                                value = FCH;
                            }

                            if (value < 0)
                                value = 0;
                            return value;
                        } else {
                            return 0;
                        }

                    } else {
                        return 0;
                    }

                },
                filterAttendedOrBookedChild: function (day, childList, attendanceList) {
                    var child_list = [];
                    var fch_utils = this;

                    if (attendanceList && attendanceList.length) {
                        childList.map(function (child) {

                            var childAttendance = fch_utils.get_attendance(attendanceList, child);
                            if (childAttendance && childAttendance.length) {

                                child_list.push(child);
                            }
                        });
                    }
                    // check booked childs
                    childList.map(function (child) {
                        if ($util.checkBookingAndEnrolment(child, true, day)) {
                            var chekChildExist = child_list.filter(function (c) {
                                if (c._id == child._id) {
                                    return true;
                                }
                            });
                            if (!(chekChildExist && chekChildExist.length)) {
                                child_list.push(child);
                            }

                        }
                    });


                    return child_list;
                },
                checkBookingHoursCondition: function (day, childList, attendanceList) {
                    var fchUtils = this;
                    if (attendanceList && attendanceList.length) {

                        return 1;
                    }

                    if (childList && childList.length && day) {
                        var bookingHours = 0;
                        var bookedChildcount = 0;
                        var totalBookedHours = 0;
                        _.each(childList, function (child) {

                            if ($util.checkBookingAndEnrolment(child, true, day)) {
                                var bs = fchUtils.getBookingSchedule(child, day);
                                if (bs && bs.length) {
                                    _.each(bs, function (times) {
                                        var Start = times['startTime'];
                                        var End = times['endTime'];
                                        totalBookedHours += End.diff(Start,'minutes')/60;
                                    });
                                    bookedChildcount++;
                                }
                            }


                        });

                        var aggregateBookingHours = totalBookedHours / bookedChildcount;

                        if (aggregateBookingHours >= 2.5) {
                            return 1;
                        } else {
                            return 0;
                        }

                    }
                },
                calDailyTotalECEPlusTenHours: function (day, childList, firstClosure, holiday, holidayMatrix, tempClousureMatrix, dayMatrix, attendanceList, serviceCloseMatrix) {
                    var total = 0
                    _.each(childList, function (child) {
                        total += dayMatrix[child._id]['plus_ten_hours'];
                    });
                    if (firstClosure && holiday) {
                        total = total * holidayMatrix * tempClousureMatrix;
                    } else if (holiday && !firstClosure) {
                        total = total * holidayMatrix;
                    } else if (firstClosure && !holiday) {
                        total = total * tempClousureMatrix;

                    }
                    total = serviceCloseMatrix * total;
                    return Math.ceil(total);
                },
                calDailyTotalECETwentyHours: function (day, childList, attendanceList, firstClosure, holiday, tempClousureMatrix, holidayMatrix, dayMatrix, serviceCloseMatrix) {
                    var total = 0
                    _.each(childList, function (child) {
                        total += dayMatrix[child._id]['twenty_hours_ece'];

                    });
                    if (firstClosure && holiday) {
                        total = total * holidayMatrix * tempClousureMatrix;
                    } else if (holiday && !firstClosure) {
                        total = total * holidayMatrix;
                    } else if (firstClosure && !holiday) {
                        total = total * tempClousureMatrix;

                    }
                    total = total * serviceCloseMatrix;
                    return Math.ceil(total);
                },
                calDailyTotalEceFundingOverTwoAndLessThanSix: function (day, childList, attendanceList, holiday, firstClosure, tempClousureMatrix, holidayMatrix, dayMatrix, serviceCloseMatrix, licenseConfiguration) {
                    var total = 0;
                    var maxTotal = (licenseConfiguration && licenseConfiguration.UnderTwo) ? licenseConfiguration.OverTwo * 6 : 0;
                    _.each(childList, function (child) {
                        if (total + dayMatrix[child._id]['ece_over_two_and_less_than_six'] <= maxTotal) {
                            total += dayMatrix[child._id]['ece_over_two_and_less_than_six'];
                            
                        } else if (total < maxTotal) {
                            total += maxTotal - total;
                        }

                    });
                    if (firstClosure && holiday) {
                        total = total * holidayMatrix * tempClousureMatrix;
                    } else if (holiday && !firstClosure) {
                        total = total * holidayMatrix;
                    } else if (firstClosure && !holiday) {
                        total = total * tempClousureMatrix;

                    }
                    total = total * serviceCloseMatrix;
                    
                    return Math.ceil(total);
                },
                calDailyTotalEceFundingUnderTwoFCH: function (day, childList, holidayMatrix, tempClousureMatrix, holiday, firstClosure, dayMatrix, serviceCloseMatrix, licenseConfiguration) {
                    var total = 0;
                    var maxTotal = (licenseConfiguration && licenseConfiguration.UnderTwo) ? licenseConfiguration.UnderTwo * 6 : 0;
                    _.each(childList, function (child) {
                        if (total + dayMatrix[child._id]['ece_under_two_fch'] <= maxTotal) {
                            total += dayMatrix[child._id]['ece_under_two_fch'];
                        } else if (total < maxTotal) {
                            total += maxTotal - total;
                        }

                    });
                    if (firstClosure && holiday) {
                        total = total * holidayMatrix * tempClousureMatrix;
                    } else if (holiday && !firstClosure) {
                        total = total * holidayMatrix;
                    } else if (firstClosure && !holiday) {
                        total = total * tempClousureMatrix;

                    }
                    total = total * serviceCloseMatrix;

                    return Math.ceil(total);
                },
                calDailyTotalAttendedHours: function (day, childList, holiday, firstClosure, holidayMatrix, tempClousureMatrix, dayMatrix, serviceCloseMatrix) {
                    var total = 0;
                    _.each(childList, function (child) {
                        total += dayMatrix[child._id]['total_hours_attended'];

                    });
                    if (firstClosure && holiday) {
                        total = total * holidayMatrix * tempClousureMatrix;
                    } else if (holiday && !firstClosure) {
                        total = total * holidayMatrix;
                    } else if (firstClosure && !holiday) {
                        total = total * tempClousureMatrix;

                    }
                    total = total * serviceCloseMatrix;
                    return Math.ceil(total);
                },
                calDailyTotalClaimableHours: function (day, childList, holiday, firstClosure, tempClousureMatrix, holidayMatrix, currentCentre, dayMatrix, serviceCloseMatrix) {
                    var total = 0;
                    // var maxClaimableHour=(currentCentre) ? currentCentre.ChildPlace * 6 : 0;
                    _.each(childList, function (child) {
                        //if(total <= maxClaimableHour)
                        total += (dayMatrix[child._id]['claimable_fch']) ? dayMatrix[child._id]['claimable_fch'] : 0;
                        //else
                        // return false;
                    });
                    if (firstClosure && holiday) {
                        total = total * holidayMatrix * tempClousureMatrix;
                    } else if (holiday && !firstClosure) {
                        total = total * holidayMatrix;
                    } else if (firstClosure && !holiday) {
                        total = total * tempClousureMatrix;

                    }
                    total = total * serviceCloseMatrix;

                    return Math.ceil(total);
                },
                calculateClaimableFCH: function (total, weeklyLimit) {
                    var fch = 0;

                    if (total <= weeklyLimit) {
                        if (weeklyLimit <= 6) {
                            if (total <= weeklyLimit) {
                                fch = total;
                            } else {
                                fch = weeklyLimit;
                            }

                        } else if (total <= 6) {
                            fch = total;
                        } else {
                            fch = 6;
                        }
                    } else {
                        if (weeklyLimit >= 6 && total >= 6) {
                            fch = 6;
                        } else {
                            fch = weeklyLimit;
                        }
                    }

                    return fch;
                },
                getLastFiveDays: function (day) {
                    var datesArray = [];
                    var firstDay = moment(day).subtract(6, 'days');
                    var startDay = new Date(firstDay)
                    var lastDay = new Date(day);
                    while (startDay <= lastDay) {

                        datesArray.push(startDay);
                        startDay = new Date(startDay.getTime() + 24 * 60 * 60 * 1000);
                    }
                    return datesArray;
                },
                getDailyMatrix: function (day, CurrentCentre, ChildList, Eceserviceschedule, AttendanceList, HolidayList, TemporaryClosureList, LastThreeWeeksAttendanceList, absenceReasonMap, weeklydata, licenseConfiguration, serviceCloseMatrix, firstFiveDaysAttList, TwelveWeekAttendanceList,childFARCounter) {
                    var fchUtils = this;
                    var dayMatrix = [];
                    var d = $q.defer();
                    var temporaryClosureList = TemporaryClosureList;
                    var holidayList = HolidayList;
                    var eceServiceschedule = Eceserviceschedule;
                    var lastThreeWeeksAttendanceList = [];
                    var lastfiveDaysAttendance = firstFiveDaysAttList;
                    var twelveWeekAttendanceList = [];
                    var attendanceList = (AttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)]) ? AttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)] : [];
                    var childList = fchUtils.filterAttendedOrBookedChild(day, ChildList, attendanceList);


                    var holiday = null, holidayMatrix = null, firstClosure = null, tempClousureMatrix = null;
                    lastThreeWeeksAttendanceList = (LastThreeWeeksAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)]) ? LastThreeWeeksAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)] : [];
                    twelveWeekAttendanceList =TwelveWeekAttendanceList; // (TwelveWeekAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)]) ? TwelveWeekAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)] : [];
                    if (holidayList && holidayList.length) {
                        _.each(holidayList, function (holiDay) {
                            if (holiDay) {
                                var holidayDay = new Date(holiDay.Date).getDate();
                                var holidayMonth = new Date(holiDay.Date).getMonth() + 1;
                                var holidayYear = new Date(holiDay.Date).getYear();
                                var todayDay = new Date(day).getDate();
                                var todayMonth = new Date(day).getMonth() + 1;
                                var todayYear = new Date(day).getYear();

                                if (holiDay.ReoccurYearly && holidayDay == todayDay && holidayMonth == todayMonth) {
                                    holiday = holiDay;
                                    if (holiDay.canMarkAttendance) {
                                        holidayMatrix = 1;
                                    } else {
                                        holidayMatrix = 0;
                                    }
                                    return false;
                                } else if (holidayDay == todayDay && holidayMonth == todayMonth && holidayYear == todayYear) {

                                    holiday = holiDay;

                                    if (holiDay.canMarkAttendance) {
                                        holidayMatrix = 1;
                                    } else {
                                        holidayMatrix = 0;
                                    }


                                    return false;
                                } else {
                                    holiday = null;
                                    holidayMatrix = null;
                                }

                            }
                        })

                    }

                    if (temporaryClosureList && temporaryClosureList.length) {

                        _.each(temporaryClosureList, function (data) {

                            firstClosure = data;
                            var closureStartDay = moment(firstClosure.ClosureStartDate);
                            var closureEndDay = moment(firstClosure.ClosureEndDate);
                            var today = moment(day);

                            if (today.isBetween(closureStartDay, closureEndDay) || today.isSame(closureStartDay, 'day') || today.isSame(closureEndDay, 'day')) {

                                //if (firstClosure && firstClosure.ClosureReasonCode && (closureDay == todayDay && closureMonth == todayMonth && closureYear == todayYear)) {
                                var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;
                                if (absenceReasonMap[clousureData].IsFunded) {
                                    tempClousureMatrix = 1;
                                } else {
                                    tempClousureMatrix = 0;
                                }
                                return false;
                                /*} else {
                                 firstClosure = null;
                                 tempClousureMatrix = null;
                                 }*/
                            } else {
                                var closureDay = new Date(firstClosure.ClosureStartDate).getDate();
                                var closureMonth = new Date(firstClosure.ClosureStartDate).getMonth() + 1;
                                var closureYear = new Date(firstClosure.ClosureStartDate).getYear();
                                var todayDay = new Date(day).getDate();
                                var todayMonth = new Date(day).getMonth() + 1;
                                var todayYear = new Date(day).getYear();

                                if (firstClosure && firstClosure.ClosureReasonCode && (closureDay == todayDay && closureMonth == todayMonth && closureYear == todayYear)) {
                                    var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;

                                    if (absenceReasonMap[clousureData].IsFunded) {
                                        tempClousureMatrix = 1;
                                    } else {
                                        tempClousureMatrix = 0;
                                    }
                                    return false;
                                } else {
                                    firstClosure = null;
                                    tempClousureMatrix = null;
                                }
                            }



                        });
                    }
                    if (childList && childList.length) {

                        var currDay = moment(day).format("ddd");
                        _.each(childList, function (child) {

                            var weeklyLimit = (weeklydata[child._id] && currDay != 'Mon') ? 30 - weeklydata[child._id] : 30;
                            dayMatrix[child._id] = {};

                            //if (CurrentCentre.CenterStatus == 'Open' && CurrentCentre.ServiceId != '' && fchUtils.checkBookingHoursCondition(day, childList, attendanceList)) {
                            if (licenseConfiguration && CurrentCentre.ServiceId != '' && fchUtils.checkBookingHoursCondition(day, childList, attendanceList)) {
                                if (firstClosure && holiday) {
                                    dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, CurrentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                    dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(dayMatrix[child._id]['total_hours_attended'], weeklyLimit);
                                    dayMatrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, day, dayMatrix);
                                    dayMatrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, day, attendanceList, dayMatrix);
                                    dayMatrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                    dayMatrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                } else if (holiday && !firstClosure) {
                                    dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * holidayMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, CurrentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                    dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(dayMatrix[child._id]['total_hours_attended'], weeklyLimit)
                                    dayMatrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, day, dayMatrix);
                                    dayMatrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, day, attendanceList, dayMatrix);
                                    dayMatrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                    dayMatrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                } else if (firstClosure && !holiday) {
                                    dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, CurrentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                    dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(dayMatrix[child._id]['total_hours_attended'], weeklyLimit)
                                    dayMatrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, day, dayMatrix);
                                    dayMatrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, day, attendanceList, dayMatrix);
                                    dayMatrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                    dayMatrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                } else {
                                    dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, CurrentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                    dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(dayMatrix[child._id]['total_hours_attended'], weeklyLimit)
                                    dayMatrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, day, dayMatrix);
                                    dayMatrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, day, attendanceList, dayMatrix);
                                    dayMatrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                    dayMatrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList);
                                }

                                dayMatrix[child._id]['absence'] = fchUtils.checkAbsence(child, day, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                dayMatrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, day, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList);

                            } else {
                                dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, CurrentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                dayMatrix[child._id]['absence'] = fchUtils.checkAbsence(child, day, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                dayMatrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, day, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfiveDaysAttendance, absenceReasonMap, twelveWeekAttendanceList) * 0;
                                dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * 0 : 6 * 0;
                                dayMatrix[child._id]['ece_under_two_fch'] = fchUtils.getEceFundingUnderTwoFCH(child, day, dayMatrix) * 0;
                                dayMatrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, day, attendanceList, dayMatrix) * 0;
                                dayMatrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList) * 0;
                                dayMatrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(dayMatrix[child._id]['claimable_fch'], child, day, attendanceList) * 0;
                            }

                            //dayMatrix[child._id]['far']=0;
                                 //if(that.matrix[child._id]['absence']=='NF' && that.childFARCounter && that.childFARCounter[child._id] && that.childFARCounter[child._id].frequestabsencecounter >=3 ){
                                  /*if(childFARCounter && childFARCounter[child._id] && childFARCounter[child._id].frequestabsencecounter >=3 ){
                                    var monthKey=new Date(day).getMonth()+1;

                                    if(childFARCounter[child._id].frequentAbsenceCountersFlags){
                                      
                                        if(childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey] && childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentHourlyAbsent){
                                            dayMatrix[child._id]['far']=childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentAbsentHours;
                                        }else if(childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey] && (childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentDailyAbsent || childFARCounter[child._id].frequentAbsenceCountersFlags[monthKey].frequentWeeklyAbsent)){
                                             
                                             var childAttendance=fchUtils.get_attendance(attendanceList, child);
                                             var childTodayBookingSchedule=fchUtils.getBookingSchedule(child, day);
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
                                             dayMatrix[child._id]['far']=(booked_hours-attended_hours > 0) ? booked_hours-attended_hours: 0;
                                        }
                                        
                                    }
                                    
                                }*/

                        });
                        dayMatrix['total_claimable_fch'] = fchUtils.calDailyTotalClaimableHours(day, childList, holiday, firstClosure, tempClousureMatrix, holidayMatrix, CurrentCentre, dayMatrix, serviceCloseMatrix);
                        dayMatrix['total_attended_hours'] = fchUtils.calDailyTotalAttendedHours(day, childList, holiday, firstClosure, holidayMatrix, tempClousureMatrix, dayMatrix, serviceCloseMatrix);
                        dayMatrix['total_ecefuncding_under_two'] = fchUtils.calDailyTotalEceFundingUnderTwoFCH(day, childList, holidayMatrix, tempClousureMatrix, holiday, firstClosure, dayMatrix, serviceCloseMatrix, licenseConfiguration);
                        dayMatrix['total_ecefuncding_over_two_and_less_six'] = fchUtils.calDailyTotalEceFundingOverTwoAndLessThanSix(day, childList, attendanceList, holiday, firstClosure, tempClousureMatrix, holidayMatrix, dayMatrix, serviceCloseMatrix, licenseConfiguration);
                        dayMatrix['total_ecetwenty_hours'] = fchUtils.calDailyTotalECETwentyHours(day, childList, attendanceList, firstClosure, holiday, tempClousureMatrix, holidayMatrix, dayMatrix, serviceCloseMatrix);
                        dayMatrix['total_plus_ten_hours'] = fchUtils.calDailyTotalECEPlusTenHours(day, childList, firstClosure, holiday, tempClousureMatrix, holidayMatrix, dayMatrix, attendanceList, serviceCloseMatrix);
                        dayMatrix['day'] = day;

                    } else {

                        dayMatrix['total_claimable_fch'] = 0;
                        dayMatrix['total_attended_hours'] = 0;
                        dayMatrix['total_ecefuncding_under_two'] = 0;
                        dayMatrix['total_ecefuncding_over_two_and_less_six'] = 0;
                        dayMatrix['total_ecetwenty_hours'] = 0;
                        dayMatrix['total_plus_ten_hours'] = 0;
                        dayMatrix['day'] = day;

                    }
                    dayMatrix = fchUtils.adjustTotalsforDay(dayMatrix, licenseConfiguration);
                    return dayMatrix;

                },
                getMonthDates: function (month) {
                    var monthDates = [];
                    var y = month.getFullYear(), m = month.getMonth();
                    var firstDay = new Date(y, m, 1);
                    var lastDay = new Date(y, m + 1, 0);

                    while (firstDay <= lastDay) {
                        monthDates.push(firstDay);
                        firstDay = new Date(firstDay.getTime() + 24 * 60 * 60 * 1000);
                    }
                    return monthDates;
                },
                getMonthlyFch: function (month, licenseDetails, centerstatusData,ServiceSchedule) {
                    
                    var monthlyMatrix = [];
                    var promises = [];
                    var fchUtils = this;
                    var monthDates = fchUtils.getMonthDates(month);
                    var d = $q.defer();
                    var date = new Date(month), y = date.getFullYear(), m = date.getMonth();
                    var start = new Date(y, m, 1);
                    var end = new Date(y, m + 1, 0);
                    var monthDateParams={"$gte": fchUtils.timeFix(start, false), "$lte": fchUtils.timeFix(end, true)};
                  
                    var p = {
                        query:JSON.stringify({
                            Date:monthDateParams,
                            Facility: Auth.getCurrentUser().facility._id
                        })
                    };

                    var facility_all_license    = licenseDetails;
                    facility_all_license        =  _.sortBy(facility_all_license, function (conf){
                      return conf.EffectiveStartDate;
                    });
                    var end_of_month = moment(month).endOf('month');
                    // console.log('month', month)
                    // console.log('end_of_month', end_of_month)

                    var effective_license   = null;
                    var is_month_valid      = false;
                    effective_license = getEffectiveLicenseConfiguration(end_of_month, facility_all_license);
                    // console.log('effective_license', effective_license);
                    

                    var centre_type = Auth.getCurrentUser().facility.CenterType;
                    // console.log('centre_type',centre_type)
                    if(centre_type=='Centre based'){
                        
                        is_month_valid  = true;
                    }
                    else if(
                        centre_type =='Kindergarten' &&
                        effective_license && 
                        effective_license.SessionType
                    ){

                        var session_type = effective_license.SessionType;
                        if(session_type == 'All Day' || session_type == 'Mixed'){

                            is_month_valid  = true;
                        }
                    }

                    formlyAdapter.getList('contacthoursreport',p).then(function(monthly_contacthoursreport){

                        // console.log('monthly_contacthoursreport',monthly_contacthoursreport)

                        formlyAdapter.getList('dailyfchmatrix',{query:JSON.stringify({Date:monthDateParams})}).then(function(monthmatrix){
                       
                        _.each(monthDates,function(day){

                            var serviceSchedule=fchUtils.getEffectiveServiceSchedule(ServiceSchedule,day);
                            var serviceScheduleMatrix=fchUtils.checkServiceSchedule(serviceSchedule,day);;
                            
                            var getDayMatrix=null;
                            var getDayContactHous=null;

                            monthmatrix.map(function(m){
                                if(moment(m.Date).isSame(moment(day),'day')){
                                    getDayMatrix=m;
                                }
                            })

                            monthly_contacthoursreport.map(function(m){
                                if(moment(m.Date).isSame(moment(day),'day'))
                                getDayContactHous=m;
                            })

                            var matrix=[];

                            var is_day_valid = false;
                            if(centre_type=='Centre based'){
                                
                                is_day_valid = true;
                            }
                            else if(centre_type =='Kindergarten'){

                                is_day_valid = isDayValid(serviceSchedule, day);
                            }

                            // console.log('is_month_valid',is_month_valid)
                            if(
                                is_month_valid 
                                &&
                                is_day_valid
                                && 
                                getDayContactHous
                            ){

                                var reg_in_hrs    = 0;
                                var nonreg_in_hrs = 0;

                                reg_in_hrs = getDayContactHous.total_qualified_teacher_hours/60;
                                reg_in_hrs = reg_in_hrs.toFixed(2)/1;

                                nonreg_in_hrs = getDayContactHous.total_nonqualified_teacher_hours/60;
                                nonreg_in_hrs = nonreg_in_hrs.toFixed(2)/1;

                                matrix['registered']    = reg_in_hrs;
                                matrix['nonRegistered'] = nonreg_in_hrs;
                                matrix['shcTotal']      = parseInt(getDayContactHous.total_nonqualified_teacher_hours)+parseInt(getDayContactHous.total_qualified_teacher_hours);
                            } else{
                                
                                matrix['registered']    = 0;
                                matrix['nonRegistered'] = 0;
                                matrix['shcTotal']      = 0;
                            }
                           if(getDayMatrix){
                                matrix['total_claimable_fch'] = getDayMatrix.total_claimable_fch * serviceScheduleMatrix;
                                matrix['total_attended_hours'] = getDayMatrix.total_attended_hours * serviceScheduleMatrix;
                                matrix['total_ecefuncding_under_two'] = getDayMatrix.total_ecefuncding_under_two * serviceScheduleMatrix;
                                matrix['total_ecefuncding_over_two_and_less_six'] = getDayMatrix.total_ecefuncding_over_two_and_less_six * serviceScheduleMatrix;
                                matrix['total_ecetwenty_hours'] = getDayMatrix.total_ecetwenty_hours * serviceScheduleMatrix;
                                matrix['total_plus_ten_hours'] = getDayMatrix.total_plus_ten_hours * serviceScheduleMatrix;
                                matrix['day'] = day;  
                           }else{
                                matrix['total_claimable_fch'] = 0;
                                matrix['total_attended_hours'] = 0;
                                matrix['total_ecefuncding_under_two'] = 0;
                                matrix['total_ecefuncding_over_two_and_less_six'] = 0;
                                matrix['total_ecetwenty_hours'] = 0;
                                matrix['total_plus_ten_hours'] = 0;
                                matrix['day'] = day;
                           }
                            monthlyMatrix[day]=matrix;
                            if (monthlyMatrix['totalHours']) {
                                        monthlyMatrix['totalHours'] = monthlyMatrix['totalHours'] + matrix.total_attended_hours;
                                        monthlyMatrix['totalFch'] = monthlyMatrix['totalFch'] + matrix.total_claimable_fch;
                                        monthlyMatrix['total_fch_under_two'] = monthlyMatrix['total_fch_under_two'] + matrix.total_ecefuncding_under_two;
                                        monthlyMatrix['total_ecefuncding_over_two_and_less_six'] = monthlyMatrix['total_ecefuncding_over_two_and_less_six'] + matrix.total_ecefuncding_over_two_and_less_six;
                                        monthlyMatrix['total_ecetwenty_hours'] = monthlyMatrix['total_ecetwenty_hours'] + matrix.total_ecetwenty_hours;
                                        monthlyMatrix['total_plus_ten_hours'] = monthlyMatrix['total_plus_ten_hours'] + matrix.total_plus_ten_hours;
                                } else {
                                    monthlyMatrix['totalHours'] = matrix.total_attended_hours;
                                    monthlyMatrix['totalFch'] = matrix.total_claimable_fch;
                                    monthlyMatrix['total_fch_under_two'] = matrix.total_ecefuncding_under_two;
                                    monthlyMatrix['total_ecefuncding_over_two_and_less_six'] = matrix.total_ecefuncding_over_two_and_less_six;
                                    monthlyMatrix['total_ecetwenty_hours'] = matrix.total_ecetwenty_hours;
                                    monthlyMatrix['total_plus_ten_hours'] = matrix.total_plus_ten_hours;
                                }
                        })
                         d.resolve(monthlyMatrix);
                        })
                    });
                
                    return d.promise;

                },
                /*getMonthlyFch: function (month, licenseDetails, centerstatusData) {
                    var monthlyMatrix = [];
                    var promises = [];
                    var fchUtils = this;
                    var d = $q.defer();

                    formlyapi.getMonthlyFch(new Date(month).toISOString()).then(function (data) {

                        var currentCentre = data.currentCentre;
                        var attendanceList = data.attendanceList;
                        var holidayList = data.holidayList;
                        var childList = data.childList;
                        var temporaryClosureList = data.temporaryClosureList;
                        var Serviceschedule = (data.eceServiceschedule) ? data.eceServiceschedule : null;
                        var lastThreeWeeksAttendanceList = data.LastThreeWeeksAttendance;
                        var absenceReasonMap = data.absenceReasonMap;
                        var lastFiveDaysattendanceList = data.lastFiveDaysattendanceList;
                        var twelveWeekAttendanceList = data.LastTwelveWeekAttendance;
                        var monthDates = fchUtils.getMonthDates(month);
                        var childFARCounter=data.absenceFARCounter;
                        if (monthDates && monthDates.length) {

                            _.each(monthDates, function (day) {
                                var licenseConfiguration = $util.getEffectiveLicensDetails(licenseDetails, day);
                                var eceServiceschedule = fchUtils.getEffectiveServiceSchedule(Serviceschedule, day);
                                var serviceCloseMatrix = 0;
                                if (centerstatusData && licenseConfiguration) {
                                    if (centerstatusData[licenseConfiguration.Status] == "Funded") {
                                        serviceCloseMatrix = 1;
                                    } else {
                                        serviceCloseMatrix = 0;
                                    }
                                }
                                if (eceServiceschedule) {
                                    serviceCloseMatrix = fchUtils.checkServiceSchedule(eceServiceschedule, day);
                                }
                                // console.log(serviceCloseMatrix);
                                var weeklydata = fchUtils.calWeeklyLimit(day, currentCentre, childList, eceServiceschedule, attendanceList, holidayList, temporaryClosureList, lastThreeWeeksAttendanceList, absenceReasonMap, licenseConfiguration, serviceCloseMatrix,lastFiveDaysattendanceList, twelveWeekAttendanceList,childFARCounter);
                                var matrix = fchUtils.getDailyMatrix(day, currentCentre, childList, eceServiceschedule, attendanceList, holidayList, temporaryClosureList, lastThreeWeeksAttendanceList, absenceReasonMap, weeklydata, licenseConfiguration, serviceCloseMatrix, lastFiveDaysattendanceList, twelveWeekAttendanceList,childFARCounter);
                                 monthlyMatrix[day] = matrix;
                                 
                                if (monthlyMatrix['totalHours']) {
                                    monthlyMatrix['totalHours'] = monthlyMatrix['totalHours'] + matrix.total_attended_hours;
                                    monthlyMatrix['totalFch'] = monthlyMatrix['totalFch'] + matrix.total_claimable_fch;
                                    monthlyMatrix['total_fch_under_two'] = monthlyMatrix['total_fch_under_two'] + matrix.total_ecefuncding_under_two;
                                    monthlyMatrix['total_ecefuncding_over_two_and_less_six'] = monthlyMatrix['total_ecefuncding_over_two_and_less_six'] + matrix.total_ecefuncding_over_two_and_less_six;
                                    monthlyMatrix['total_ecetwenty_hours'] = monthlyMatrix['total_ecetwenty_hours'] + matrix.total_ecetwenty_hours;
                                    monthlyMatrix['total_plus_ten_hours'] = monthlyMatrix['total_plus_ten_hours'] + matrix.total_plus_ten_hours;
                                } else {
                                    monthlyMatrix['totalHours'] = matrix.total_attended_hours;
                                    monthlyMatrix['totalFch'] = matrix.total_claimable_fch;
                                    monthlyMatrix['total_fch_under_two'] = matrix.total_ecefuncding_under_two;
                                    monthlyMatrix['total_ecefuncding_over_two_and_less_six'] = matrix.total_ecefuncding_over_two_and_less_six;
                                    monthlyMatrix['total_ecetwenty_hours'] = matrix.total_ecetwenty_hours;
                                    monthlyMatrix['total_plus_ten_hours'] = matrix.total_plus_ten_hours;
                                }

                            });

                            d.resolve(monthlyMatrix);
                        }

                    });

                    return d.promise;

                },*/
                getWeeklyDateRange: function (day) {
                    var currDay = moment(day).format("ddd");
                    if (currDay == 'Sun') {
                        var startOfWeek = moment(new Date(day)).startOf('week').add(-6, 'days').toDate();
                        var endOfWeek = moment(new Date(day)).endOf('week').add(-6, 'days').toDate();
                    } else {
                        var startOfWeek = moment(new Date(day)).startOf('week').add(1, 'days').toDate();
                        var endOfWeek = moment(new Date(day)).endOf('week').add(1, 'days').toDate();
                    }


                    var arr = [];
                    var i = 0;

                    while (moment(startOfWeek) <= moment(endOfWeek)) {
                        arr[i] = new Date(startOfWeek);
                        startOfWeek = moment(startOfWeek).add(1, 'days');
                        i++;
                    }

                    return arr;

                },

                calWeeklyLimit: function (today, CurrentCentre, ChildList, Eceserviceschedule, AttendanceList, HolidayList, TemporaryClosureList, LastThreeWeeksAttendanceList, absenceReasonMap, licenseConfiguration, serviceCloseMatrix,lastFiveDaysattendanceList, twelveWeekAttendanceList,childFARCounter) {
                    var weeklyMatrix = [];
                    var fchUtils = this;
                    var weekDates = fchUtils.getWeeklyDateRange(today)
                    if (weekDates && weekDates.length) {
                        var promises = [];
                        weeklyMatrix = {};
                        _.each(weekDates, function (day) {

                            if (new Date(day).setHours(0, 0, 0, 0) < new Date(today).setHours(0, 0, 0, 0)) {
                                var d = $q.defer();


                                var matrix = fchUtils.getDailyMatrixforweekly(day, CurrentCentre, ChildList, Eceserviceschedule, AttendanceList, HolidayList, TemporaryClosureList, LastThreeWeeksAttendanceList, absenceReasonMap, licenseConfiguration, serviceCloseMatrix,lastFiveDaysattendanceList, twelveWeekAttendanceList,childFARCounter);

                                _.each(ChildList, function (child) {
                                    if (matrix[child._id]) {
                                        if (weeklyMatrix[child._id] >= 30) {
                                            return;
                                        }
                                        if (!weeklyMatrix[child._id]) {

                                            weeklyMatrix[child._id] = parseInt(matrix[child._id]['claimable_fch']);
                                        } else {

                                            weeklyMatrix[child._id] = parseInt(weeklyMatrix[child._id] + matrix[child._id]['claimable_fch']);
                                        }

                                    }

                                });

                            }



                        });



                    }
                    return weeklyMatrix;

                },

                getDailyMatrixforweekly: function (day, CurrentCentre, ChildList, Eceserviceschedule, AttendanceList, HolidayList, TemporaryClosureList, LastThreeWeeksAttendanceList, absenceReasonMap, licenseConfiguration, serviceCloseMatrix,lastFiveDaysattendanceList, TwelveWeekAttendanceList,childFARCounter) {

                    var d = $q.defer();
                    var dayMatrix = [];
                    var fchUtils = this;
                    var temporaryClosureList = TemporaryClosureList;
                    var holidayList = HolidayList;
                    var eceServiceschedule = Eceserviceschedule;
                    var lastThreeWeeksAttendanceList = (LastThreeWeeksAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)]) ? LastThreeWeeksAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)] : [];
                    var twelveWeekAttendanceList = (TwelveWeekAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)]) ? TwelveWeekAttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)] : [];
                    var childList = fchUtils.filterAttendedOrBookedChild(day, ChildList, attendanceList);
                    var attendanceList = (AttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)]) ? AttendanceList[new Date(day).getDate() + "-" + (new Date(day).getMonth() + 1)] : [];
                    var absenceReasonMap = absenceReasonMap;
                    var holiday = null, holidayMatrix = null, firstClosure = null, tempClousureMatrix = null;
                    var currentCentre = CurrentCentre;

                    if (holidayList && holidayList.length) {

                        _.each(holidayList, function (holiDay) {
                            if (holiDay) {
                                var holidayDay = new Date(holiDay.Date).getDate();
                                var holidayMonth = new Date(holiDay.Date).getMonth() + 1;
                                var holidayYear = new Date(holiDay.Date).getYear();
                                var todayDay = new Date(day).getDate();
                                var todayMonth = new Date(day).getMonth() + 1;
                                var todayYear = new Date(day).getYear();

                                if (holiDay.ReoccurYearly && holidayDay == todayDay && holidayMonth == todayMonth) {
                                    holiday = holiDay;
                                    if (holiDay.canMarkAttendance) {
                                        holidayMatrix = 1;
                                    } else {
                                        holidayMatrix = 0;
                                    }
                                    return false;
                                } else if (holidayDay == todayDay && holidayMonth == todayMonth && holidayYear == todayYear) {

                                    holiday = holiDay;

                                    if (holiDay.canMarkAttendance) {
                                        holidayMatrix = 1;
                                    } else {
                                        holidayMatrix = 0;
                                    }


                                    return false;
                                } else {
                                    holiday = null;
                                    holidayMatrix = null;
                                }

                            }
                        })

                    }

                    if (temporaryClosureList && temporaryClosureList.length) {

                        _.each(temporaryClosureList, function (data) {

                            firstClosure = data;
                            var closureDay = new Date(firstClosure.ClosureStartDate).getDate();
                            var closureMonth = new Date(firstClosure.ClosureStartDate).getMonth() + 1;
                            var closureYear = new Date(firstClosure.ClosureStartDate).getYear();
                            var todayDay = new Date(day).getDate();
                            var todayMonth = new Date(day).getMonth() + 1;
                            var todayYear = new Date(day).getYear();

                            if (firstClosure && firstClosure.ClosureReasonCode && (closureDay == todayDay && closureMonth == todayMonth && closureYear == todayYear)) {
                                var clousureData = (data.ClosureReasonCode._id) ? data.ClosureReasonCode._id : data.ClosureReasonCode;

                                if (absenceReasonMap[clousureData] && absenceReasonMap[clousureData].IsFunded) {

                                    tempClousureMatrix = 1;
                                } else {
                                    tempClousureMatrix = 0;
                                }
                                return false;
                            } else {
                                firstClosure = null;
                                tempClousureMatrix = null;
                            }
                        });
                    }
                    if (childList && childList.length) {

                        _.each(childList, function (child) {
                            dayMatrix[child._id] = [];
                            if (firstClosure && holiday) {                                                                                                                   
                                dayMatrix[child._id]['total_hours_attended'] =serviceCloseMatrix* holidayMatrix * tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, currentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList,licenseConfiguration,lastFiveDaysattendanceList,absenceReasonMap,twelveWeekAttendanceList);

                                dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * holidayMatrix * tempClousureMatrix : holidayMatrix * tempClousureMatrix * 6;
                            } else if (holiday && !firstClosure) {

                                dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * holidayMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, currentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, absenceReasonMap, twelveWeekAttendanceList);
                                dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * holidayMatrix : holidayMatrix * 6;
                            } else if (firstClosure && !holiday) {

                                dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, currentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, absenceReasonMap, twelveWeekAttendanceList);
                                dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] * tempClousureMatrix : tempClousureMatrix * 6;
                            } else {
                                dayMatrix[child._id]['total_hours_attended'] = serviceCloseMatrix * fchUtils.getChildAttededOrBookedHours(child, day,eceServiceschedule, attendanceList, childList, currentCentre.ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, absenceReasonMap, twelveWeekAttendanceList);

                                dayMatrix[child._id]['claimable_fch'] = serviceCloseMatrix * dayMatrix[child._id]['total_hours_attended'] < 6 ? dayMatrix[child._id]['total_hours_attended'] : 6;
                            }


                        });
                        dayMatrix['day'] = day;
                    }


                    return dayMatrix;

                },
                adjustUnder2Values: function (today, matrix, childList, attendanceList, eceServiceschedule, firstClosure, holiday, holidayMatrix, tempClousureMatrix, serviceCloseMatrix, ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfivedaysAttendance, weeklyMatrix, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) {
                    var fchUtils = this;
                    var timeheaders = fchUtils.getTimeHeaders(today, eceServiceschedule, childList, attendanceList, 'dd-MM-yyyy');
                    var NotAttendedChild=[];
                    var presentChild=[];
                    var absentChild=[];
                    
                     _.each(childList, function (child) {
                        var childBirthDay = moment(child.ChildBirthDate);
                        var day = moment(today);
                        var months = day.diff(childBirthDay, 'months');
                        
                        if (months < 24) {
                            var attendance = fchUtils.get_attendance(attendanceList, child);
                            var ifabsent = false;
                           var booking = fchUtils.getBooking(child);
                            if(!(attendance && attendance.length) && (booking && booking.Times && booking.Times.length)){
                                NotAttendedChild.push(child);
                            } 
                            _.each(attendance, function (att) {
                                if (att.IsAbsent) {
                                    ifabsent = true;
                                }
                            });
                            if(ifabsent){
                                absentChild.push(child);
                               }else{
                                   presentChild.push(child);
                                 }
                            
                            }
                 
                    });
                   // adjusting from under2 absent children first 
                    if(absentChild && absentChild.length){
                        _.each(absentChild,function(child){
                              var booking = fchUtils.getBooking(child);
                                  if (booking && booking.Times && booking.Times.length) {
                                
                                _.each(timeheaders, function (timeperiod) {
                                    
                                    if (matrix[timeperiod] && matrix[timeperiod]['under2'] && matrix[timeperiod]['under2']['flag'] && matrix[timeperiod]['under2']['adjustedvalue'] > 0) {
                                      
                                        matrix[timeperiod]['under2']['adjustedvalue']--;
                                        matrix[child._id][timeperiod] = 0;
                                        matrix[child._id]['total_hours_attended']--;
                                        matrix[timeperiod]['adjustedvalue']--;
                                        console.log(fchUtils.getChildName(child));
                                        console.log(timeperiod);
                                    }

                                });
                                if (matrix[child._id]['total_hours_attended'] < 0) {
                                    matrix[child._id]['total_hours_attended'] = 0;
                                }
                                var currDay = moment(today).format("ddd");
                                var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;

                                if (firstClosure && holiday) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else if (holiday && !firstClosure) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else if (firstClosure && !holiday) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                }

                                matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);


                            }
                        })
                    }
                    
                    // adjusting from under2 booked but not present children 2nd 
                    if(NotAttendedChild && NotAttendedChild.length){
                        _.each(NotAttendedChild,function(child){
                                var booking = fchUtils.getBooking(child);

                            if (booking && booking.Times && booking.Times.length) {
                                
                                _.each(timeheaders, function (timeperiod) {
                                    
                                    if (matrix[timeperiod] && matrix[timeperiod]['under2'] && matrix[timeperiod]['under2']['flag'] && matrix[timeperiod]['under2']['adjustedvalue'] > 0) {
                                      
                                        matrix[timeperiod]['under2']['adjustedvalue']--;
                                        matrix[child._id][timeperiod] = 0;
                                        matrix[child._id]['total_hours_attended']--;
                                        matrix[timeperiod]['adjustedvalue']--;
                                    }

                                });
                                if (matrix[child._id]['total_hours_attended'] < 0) {
                                    matrix[child._id]['total_hours_attended'] = 0;
                                }
                                var currDay = moment(today).format("ddd");
                                var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;

                                if (firstClosure && holiday) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else if (holiday && !firstClosure) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else if (firstClosure && !holiday) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                }

                                matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);


                            }
                        })
                    }
                    
                    // adjusting from under2 Present children 3rd 
                    if(presentChild && presentChild.length){
                        _.each(presentChild,function(child){
                             var attendance = fchUtils.get_attendance(attendanceList, child)

                            if (attendance && attendance.length) {
                                
                                _.each(timeheaders, function (timeperiod) {
                                    
                                    if (matrix[timeperiod] && matrix[timeperiod]['under2'] && matrix[timeperiod]['under2']['flag'] && matrix[timeperiod]['under2']['adjustedvalue'] > 0) {
                                      
                                        matrix[timeperiod]['under2']['adjustedvalue']--;
                                        matrix[child._id][timeperiod] = 0;
                                        matrix[child._id]['total_hours_attended']--;
                                        matrix[timeperiod]['adjustedvalue']--;
                                    }

                                });
                                if (matrix[child._id]['total_hours_attended'] < 0) {
                                    matrix[child._id]['total_hours_attended'] = 0;
                                }
                                var currDay = moment(today).format("ddd");
                                var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;

                                if (firstClosure && holiday) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else if (holiday && !firstClosure) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else if (firstClosure && !holiday) {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                } else {
                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                }

                                matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                                matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);


                            }
                        })
                    }
                    
                    
//                    _.each(childList, function (child) {
//                        var childBirthDay = moment(child.ChildBirthDate);
//                        var day = moment(today);
//                        var months = day.diff(childBirthDay, 'months');
//                        
//                        if (months < 24) {
//                            var attendance = fchUtils.get_attendance(attendanceList, child);
//                            var ifabsent = false;
//                            var ifNotAttended=false;
//                            if(!attendance.length){
//                               ifNotAttended=true;
//                                NotAttendedChild.push(child);
//                            } 
//                            _.each(attendance, function (att) {
//                                if (att.IsAbsent) {
//                                    ifabsent = true;
//                                }
//                            });
//                            
//
//                            var booking = fchUtils.getBooking(child);
//
//                            if (booking && booking.Times && booking.Times.length && (ifabsent || ifNotAttended )) {
//                                
//                                _.each(timeheaders, function (timeperiod) {
//                                    
//                                    if (matrix[timeperiod] && matrix[timeperiod]['under2'] && matrix[timeperiod]['under2']['flag'] && matrix[timeperiod]['under2']['adjustedvalue'] > 0) {
//                                      
//                                        matrix[timeperiod]['under2']['adjustedvalue']--;
//                                        matrix[child._id][timeperiod] = 0;
//                                        matrix[child._id]['total_hours_attended']--;
//                                        
//                                    }
//
//                                });
//                                if (matrix[child._id]['total_hours_attended'] < 0) {
//                                    matrix[child._id]['total_hours_attended'] = 0;
//                                }
//                                var currDay = moment(today).format("ddd");
//                                var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;
//
//                                if (firstClosure && holiday) {
//                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                } else if (holiday && !firstClosure) {
//                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                } else if (firstClosure && !holiday) {
//                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                } else {
//                                    matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                    matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                    matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                    matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                    matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                }
//
//                                matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
//                                matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
//
//
//                            }
//
//                        }
//                    });


                    return matrix;
                },
                adjustOver2Values: function (today, matrix, childList, attendanceList, eceServiceschedule, firstClosure, holiday, holidayMatrix, tempClousureMatrix, serviceCloseMatrix, ChildPlace, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, licenseConfiguration, lastfivedaysAttendance, weeklyMatrix, absenceReasonMap, twelveWeekAttendanceList,childFARCounter) {

                    var fchUtils = this;
                    var adjustment_flag = false;
                    var presentChild=[];
                    var absentChild=[];
                    var bookedNotpresentChild=[];
                    var timeheaders = fchUtils.getTimeHeaders(today, eceServiceschedule, childList, attendanceList, 'dd-MM-yyyy');
                    
                     _.each(childList, function (child) {
                        var childBirthDay = moment(child.ChildBirthDate);
                        var day = moment(today);
                        var months = day.diff(childBirthDay, 'months');
                        if (months > 24) {
                            var attendance = fchUtils.get_attendance(attendanceList, child);
                            var booking = fchUtils.getBooking(child);
                            var ifabsent = false;
                            if(!(attendance && attendance.length) && (booking && booking.Times && booking.Times.length)){
                                bookedNotpresentChild.push(child)
                            }
                            _.each(attendance, function (att) {
                                if (att.IsAbsent) {
                                    ifabsent = true;
                                }
                            });
                            
                            if(ifabsent){
                                absentChild.push(child);
                            }else{
                                presentChild.push(child);
                            }

                            
                        }




                    });
                    
                    
                   
                // adjustment from absent child first
                
                _.each(absentChild,function(child){
                     _.each(timeheaders, function (timeperiod) {
                        
                                    if (matrix[timeperiod] && matrix[timeperiod]['limitFlag'] && matrix[timeperiod]['adjustedvalue'] > 0) {
                                         
                                        matrix[timeperiod]['adjustedvalue']--;
                                        matrix[child._id][timeperiod] = 0;
                                        matrix[child._id]['total_hours_attended']--;

                                        if (matrix[child._id]['total_hours_attended'] < 0) {
                                            matrix[child._id]['total_hours_attended'] = 0;
                                        }

                                    }
                                });
                          
                          var currDay = moment(today).format("ddd");
                            var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;

                            if (firstClosure && holiday) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else if (holiday && !firstClosure) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else if (firstClosure && !holiday) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            }

                            matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                            matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList);

                                
                                
                                
                });
                // adjustmenmt for booked not present child
                 _.each(bookedNotpresentChild,function(child){
                     _.each(timeheaders, function (timeperiod) {
                                    if (matrix[timeperiod] && matrix[timeperiod]['limitFlag'] && matrix[timeperiod]['adjustedvalue'] > 0) {
                                        matrix[timeperiod]['adjustedvalue']--;
                                        matrix[child._id][timeperiod] = 0;
                                        matrix[child._id]['total_hours_attended']--;

                                        if (matrix[child._id]['total_hours_attended'] < 0) {
                                            matrix[child._id]['total_hours_attended'] = 0;
                                        }

                                    }
                                });
                          
                          var currDay = moment(today).format("ddd");
                            var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;

                            if (firstClosure && holiday) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else if (holiday && !firstClosure) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else if (firstClosure && !holiday) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            }

                            matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                            matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList);

                                
                                
                                
                });
                
                // adjustment for present child
                 _.each(presentChild,function(child){
                     _.each(timeheaders, function (timeperiod) {
                                    if (matrix[timeperiod] && matrix[timeperiod]['limitFlag'] && matrix[timeperiod]['adjustedvalue'] > 0) {
                                        matrix[timeperiod]['adjustedvalue']--;
                                        matrix[child._id][timeperiod] = 0;
                                        matrix[child._id]['total_hours_attended']--;

                                        if (matrix[child._id]['total_hours_attended'] < 0) {
                                            matrix[child._id]['total_hours_attended'] = 0;
                                        }

                                    }
                                });
                          
                          var currDay = moment(today).format("ddd");
                            var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;

                            if (firstClosure && holiday) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else if (holiday && !firstClosure) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else if (firstClosure && !holiday) {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            } else {
                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
                            }

                            matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
                            matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList);

                                
                                
                                
                });
                    
                    
                    
//                    _.each(childList, function (child) {
//                        var childBirthDay = moment(child.ChildBirthDate);
//                        var day = moment(today);
//                        var months = day.diff(childBirthDay, 'months');
//                        if (months > 24) {
//                            var attendance = fchUtils.get_attendance(attendanceList, child);
//
//                            var ifabsent = false;
//                            _.each(attendance, function (att) {
//                                if (att.IsAbsent) {
//                                    ifabsent = true;
//                                }
//                            });
//
//                            var booking = fchUtils.getBooking(child);
//
//                            if (booking && booking.Times && booking.Times.length && ifabsent) {
//                                adjustment_flag = true;
//
//                                _.each(timeheaders, function (timeperiod) {
//                                    if (matrix[timeperiod] && matrix[timeperiod]['limitFlag'] && matrix[timeperiod]['adjustedvalue'] > 0) {
//                                        matrix[timeperiod]['adjustedvalue']--;
//                                        matrix[child._id][timeperiod] = 0;
//                                        matrix[child._id]['total_hours_attended']--;
//
//                                        if (matrix[child._id]['total_hours_attended'] < 0) {
//                                            matrix[child._id]['total_hours_attended'] = 0;
//                                        }
//
//                                    }
//                                });
//                            }
//
//
//                            if (!adjustment_flag) {
//
//                                var childBirthDay = moment(child.ChildBirthDate);
//                                var day = moment(today);
//                                var months = day.diff(childBirthDay, 'months');
//                                if (months > 24) {
//                                    var attendance = fchUtils.get_attendance(attendanceList, child);
//                                    var booking = fchUtils.getBooking(child);
//
//                                    if (!booking) {
//                                        _.each(timeheaders, function (timeperiod) {
//                                            if (matrix[timeperiod] && matrix[timeperiod]['limitFlag'] && matrix[timeperiod]['adjustedvalue'] > 0) {
//
//                                                matrix[timeperiod]['adjustedvalue']--;
//                                                matrix[child._id][timeperiod] = 0;
//                                                matrix[child._id]['total_hours_attended']--;
//
//
//                                                if (matrix[child._id]['total_hours_attended'] < 0) {
//                                                    matrix[child._id]['total_hours_attended'] = 0;
//                                                }
//
//                                            }
//                                        });
//                                    } else if (!(attendance && attendance.length)) {
//                                        _.each(timeheaders, function (timeperiod) {
//
//                                            if (matrix[timeperiod] && matrix[timeperiod]['limitFlag'] && matrix[timeperiod]['adjustedvalue'] > 0) {
//
//                                                matrix[timeperiod]['adjustedvalue']--;
//                                                matrix[child._id][timeperiod] = 0;
//                                                matrix[child._id]['total_hours_attended']--;
//
//                                                if (matrix[child._id]['total_hours_attended'] < 0) {
//                                                    matrix[child._id]['total_hours_attended'] = 0;
//                                                }
//                                            }
//                                        });
//                                    }
//
//
//                                }
//
//                            }
//
//
//                            if (matrix[child._id]['total_hours_attended'] < 0) {
//                                matrix[child._id]['total_hours_attended'] = 0;
//                            }
//                            var currDay = moment(today).format("ddd");
//                            var weeklyLimit = (weeklyMatrix[child._id] && currDay != 'Mon') ? 30 - weeklyMatrix[child._id] : 30;
//
//                            if (firstClosure && holiday) {
//                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                            } else if (holiday && !firstClosure) {
//                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * holidayMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * holidayMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                            } else if (firstClosure && !holiday) {
//                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * tempClousureMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                            } else {
//                                matrix[child._id]['claimable_fch'] = serviceCloseMatrix * fchUtils.calculateClaimableFCH(matrix[child._id]['total_hours_attended'], weeklyLimit);
//                                matrix[child._id]['ece_under_two_fch'] = serviceCloseMatrix * fchUtils.getEceFundingUnderTwoFCH(child, today, matrix);
//                                matrix[child._id]['ece_over_two_and_less_than_six'] = serviceCloseMatrix * fchUtils.getEceFundingOverTwoAndLessThanSix(child, today, attendanceList, matrix);
//                                matrix[child._id]['twenty_hours_ece'] = serviceCloseMatrix * fchUtils.getECETwentyHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                                matrix[child._id]['plus_ten_hours'] = serviceCloseMatrix * fchUtils.getECEPlusTenHours(matrix[child._id]['claimable_fch'], child, today, attendanceList);
//                            }
//
//                            matrix[child._id]['absence'] = fchUtils.checkAbsence(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList,childFARCounter);
//                            matrix[child._id]['three_week_rule'] = fchUtils.checkThreeWeekRule(child, today, attendanceList, lastThreeWeeksAttendanceList, holidayList, temporaryClosureList, lastfivedaysAttendance, absenceReasonMap, twelveWeekAttendanceList);
//
//                        }
//
//
//
//
//                    });

                    return matrix;
                },
                adjustTotalsforDay: function (matrix, licenseConfiguration) {
                    var under2Limit = (licenseConfiguration && licenseConfiguration.UnderTwo) ? licenseConfiguration.UnderTwo * 6 : 0;
                    var maxTotalLimit = (licenseConfiguration && licenseConfiguration.ChildPlace) ? licenseConfiguration.ChildPlace * 6 : 0;

                    var under2totalforday = matrix['total_ecefuncding_under_two'];
                    var totalFchforDay = matrix['total_ecefuncding_under_two'] + matrix['total_ecefuncding_over_two_and_less_six'] + matrix['total_ecetwenty_hours'] + matrix['total_plus_ten_hours'];

                    if (under2totalforday > under2Limit) {
                        matrix['total_ecefuncding_under_two'] = under2Limit;
                        totalFchforDay = matrix['total_ecefuncding_under_two'] + matrix['total_ecefuncding_over_two_and_less_six'] + matrix['total_ecetwenty_hours'] + matrix['total_plus_ten_hours'];
                    }
                    if (totalFchforDay > maxTotalLimit) {
                        var totaldiff = totalFchforDay - maxTotalLimit;
                        if (matrix['total_ecetwenty_hours'] > 0) {
                            if (totaldiff > matrix['total_plus_ten_hours']) {
                                matrix['total_plus_ten_hours'] = 0;
                                totaldiff = totaldiff - matrix['total_plus_ten_hours'];
                                if (totaldiff > matrix['total_ecefuncding_over_two_and_less_six']) {
                                    matrix['total_ecefuncding_over_two_and_less_six'] = 0;
                                } else {
                                    matrix['total_ecefuncding_over_two_and_less_six'] = matrix['total_ecefuncding_over_two_and_less_six'] - totaldiff;
                                    if (matrix['total_ecefuncding_over_two_and_less_six'] < 0) {
                                        matrix['total_ecefuncding_over_two_and_less_six'] = 0;
                                    }
                                }
                            } else {
                                matrix['total_plus_ten_hours'] = matrix['total_plus_ten_hours'] - totaldiff;
                                if (matrix['total_plus_ten_hours'] < 0) {
                                    matrix['total_plus_ten_hours'] = 0;
                                }
                            }
                        } else {
                            if (totaldiff > matrix['total_ecefuncding_over_two_and_less_six']) {
                                matrix['total_ecefuncding_over_two_and_less_six'] = 0;
                            } else {
                                matrix['total_ecefuncding_over_two_and_less_six'] = matrix['total_ecefuncding_over_two_and_less_six'] - totaldiff;
                                if (matrix['total_ecefuncding_over_two_and_less_six'] < 0) {
                                    matrix['total_ecefuncding_over_two_and_less_six'] = 0;
                                }
                            }
                        }
                    }
                    return  matrix;
                },
                getFrequentAbsenceCounter: function (month, child,absenceReasonMap) {
                    var getParams = function (selectedChild) {
                        return selectedChild._id;
                    }
                    var timeFix = function (date, setToMidnight) {
                        var d = new Date(date.getTime());
                        if (setToMidnight)
                            d.setHours(23, 59, 59, 0);
                        else
                            d.setHours(0, 0, 0, 0);
                        return d;
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

                    var buildAttendanceParams = function (month, selectedChild) {
                        var p = {
                            query: JSON.stringify({
                                Child: getParams(selectedChild),
                                Date: getDateParams(month),
                            })
                        }

                        p['sort'] = '+Date'
                        return p;
                    };

                    var parseMonthlyAttendance = function (data, monthDates, selectedChild,absenceReasonMap) {

                        var returnData = {};
                        returnData.attendanceList = {};
                        returnData.absentDays = {};
                        returnData.bookedDays = 0;
                        returnData.attendLessthanBooking = 0;
                        returnData.weekdaysArr = {};
                        _.each(monthDates, function (day) {
                            var attFlag = false;
                            if (!returnData.weekdaysArr[weekAndDay(day)]) {
                                returnData.weekdaysArr[weekAndDay(day)] = [];
                            }
                            var bookingforDay = fchUtils.getBookingSchedule(selectedChild, day);
                            if (bookingforDay && bookingforDay.length) {
                                returnData.bookedDays++;
                                if (returnData.weekdaysArr[weekAndDay(day)]['booking']) {
                                    returnData.weekdaysArr[weekAndDay(day)]['booking'] = returnData.weekdaysArr[weekAndDay(day)]['booking'] + 1;
                                } else {
                                    returnData.weekdaysArr[weekAndDay(day)] = {};
                                    returnData.weekdaysArr[weekAndDay(day)]['booking'] = 1;
                                }

                            }
                            _.each(data, function (att) {
                                if (moment(att.Date).isSame(day, 'day')) {
                                    attFlag = true;
                                    if (att.IsAbsent) {
                                        if (returnData.absentDays[days[day.getDay()]]) {
                                            returnData.absentDays[days[day.getDay()]] = returnData.absentDays[days[day.getDay()]] + 1;
                                        } else {
                                            returnData.absentDays[days[day.getDay()]] = 1;
                                        }
                                    } else {
                                        if (returnData.weekdaysArr[weekAndDay(day)]['attendance']) {
                                            returnData.weekdaysArr[weekAndDay(day)]['attendance'] = returnData.weekdaysArr[weekAndDay(day)]['attendance'] + 1;
                                        } else {
                                            returnData.weekdaysArr[weekAndDay(day)] = {};
                                            returnData.weekdaysArr[weekAndDay(day)]['attendance'] = 1;
                                        }
                                    }
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)] = {};
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['attendance'] = att;
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['booking'] = bookingforDay;

                                }
                            });
                            if (!attFlag) {
                                if (moment(day).isBefore(moment(new Date())) && bookingforDay && bookingforDay.length) {
                                    if (returnData.absentDays[days[day.getDay()]]) {
                                        returnData.absentDays[days[day.getDay()]] = returnData.absentDays[days[day.getDay()]] + 1;
                                    } else {
                                        returnData.absentDays[days[day.getDay()]] = 1;
                                    }
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)] = {};
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['attendance'] = {Date: day};//{Date:day,IsAbsent:true};
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['booking'] = bookingforDay;
                                } else {
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)] = {};
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['attendance'] = {Date: day};
                                    returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['booking'] = bookingforDay;
                                }


                            }
                            var bookedHours = ((bookingforDay && bookingforDay.length)) ? (((bookingforDay[0].endTime - bookingforDay[0].startTime) / (1000 * 60 * 60)) % 24) : 0;
                            if (bookedHours > 6)
                                bookedHours = 6;
                            var attendance = returnData.attendanceList[day.getDate() + "-" + (day.getMonth() + 1)]['attendance'];
                            var attendedHours = (attendance && attendance.AttendanceTimeEnd) ? (((attendance.AttendanceTimeEnd - attendance.AttendanceTimeStart) / (1000 * 60 * 60)) % 24) : 0;
                            if (attendedHours < bookedHours)
                                returnData.attendLessthanBooking++;
                        });

                        return returnData;
                    }

                    var detectFrequentAbsencePattern = function (row, absentDays, daysCount, attendLessthanBooking, weekdaysArr, bookedDays) {
                        var att = row.attendance;
                        var booking = row.booking;
                        var day = att.Date;

                        var bookedHours = ((booking && booking.length)) ? (((booking[0].endTime - booking[0].startTime) / (1000 * 60 * 60)) % 24) : 0;
                        if (bookedHours > 6)
                            bookedHours = 6;
                        if ((att && att.AttendanceTimeEnd) && (booking && booking.length)) {
                            var attendedHours = (att && att.AttendanceTimeEnd) ? (((att.AttendanceTimeEnd - att.AttendanceTimeStart) / (1000 * 60 * 60)) % 24) : 0;

                            if (att.IsAbsent && absentDays[days[att.Date.getDay()]] >= Math.ceil(daysCount[days[att.Date.getDay()]] / 2)) {
                                return 1;
                            }
                            if (attendLessthanBooking >= Math.ceil(bookedDays / 2) && attendedHours < bookedHours) {
                                return 1;
                            } else if (weekdaysArr[weekAndDay(day)]) {
                                var totalweeks = weekdaysArr.length;
                                var frequestabsencecount = 0;
                                _.each(weekdaysArr, function (obj) {
                                    if (obj && obj.attendance && obj.booking) {
                                        if (obj.attendance < obj.booking) {
                                            frequestabsencecount++;
                                        }
                                    }
                                });
                                if (frequestabsencecount >= Math.ceil(totalweeks / 2)) {
                                    return 1;
                                }
                            }
                        } else if (!(att && att.AttendanceTimeEnd) && (booking && booking.length)) {
                            if (att.IsAbsent && absentDays[days[att.Date.getDay()]] >= Math.ceil(daysCount[days[att.Date.getDay()]] / 2)) {
                                return 1;
                            }
                        }

                        return 0;
                    }
                    var getDaysCount=function(monthDates){
                    var daysCount={};
                      _.each(days,function(val){
                          daysCount[val]=weekdaysBetween(monthDates[0],monthDates[monthDates.length-1],val);
                    });
                    return daysCount;
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
                  function weekAndDay(day) {

                        var date = new Date(day), prefixes = {1:'First', 2:'Second', 3:'Third', 4:'Fourth', 5:'Fifth',6:'Sixth'};
                        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
                        return prefixes[0 | Math.ceil((date.getDate() + firstDay)/7)];

                    }
                    var frequestabsencecounter = 0;
                    var fchUtils = this;
                    var booking = fchUtils.getBooking(child, month);
                    var bookingEffDate = (booking && booking.EffectiveDate) ? booking.EffectiveDate : null;
                    if (moment(month).isAfter(moment(bookingEffDate), 'month')) {
                        if (moment(month).isAfter(moment(bookingEffDate), 'month')) {
                            var startMonth = moment(bookingEffDate);
                            var promises = [];
                            while (startMonth.isBefore(moment(month), 'month') || startMonth.isSame(moment(month), 'month')) {

                                var monthDates = fchUtils.getMonthDates(startMonth.toDate());
                                _.each(monthDates, function (day, i) {
                                    if (moment(day).isBefore(moment(bookingEffDate), 'day')) {
                                        delete(monthDates[i]);
                                    }
                                });

                                var promise = formlyAdapter.getList('attendance', buildAttendanceParams(startMonth, child)).then(function (data) {
                                    return data;
                                });


                                startMonth = startMonth.add(1, 'month');
                                promises.push(promise);
                            }
                            $q.all(promises).then(function (data) {
                                _.each(data, function (dataObj) {
                                   
                                    var day = (dataObj.length && dataObj[0].Date) ? dataObj[0].Date : null;
                                    if (day) {

                                        var month_dates =fchUtils.getMonthDates(day);
                                        var daysCount = getDaysCount(month_dates);
                                        var filteredData = parseMonthlyAttendance(dataObj, month_dates, child,absenceReasonMap);
                                        var attendanceList = filteredData.attendanceList;
                                        var absentDays = filteredData.absentDays;
                                        var bookedDays = filteredData.bookedDays;
                                        var attendLessthanBooking = filteredData.attendLessthanBooking;
                                        var weekdaysArr = filteredData.weekdaysArr;
                                        var absenceruleflag = 0;

                                        _.each(attendanceList, function (row) {
                                            absenceruleflag = detectFrequentAbsencePattern(row, absentDays, daysCount, attendLessthanBooking, weekdaysArr, bookedDays);

                                            if (absenceruleflag) {
                                                return false;
                                            }
                                        });

                                        if (absenceruleflag) {
                                            frequestabsencecounter = frequestabsencecounter + 1;
                                        } else {

                                            frequestabsencecounter = 0;
                                        }
                                    }

                                })
                                
                                return frequestabsencecounter;

                            });

                        }
                    }
                }
            }
        });

function getEffectiveLicenseConfiguration (day_of_month, facility_all_license){

  var conf = null;
  var tmp = facility_all_license;
  tmp     = _.filter(tmp, function (one_license_configuration){

    var start = moment(one_license_configuration.EffectiveStartDate);
    if(start.isBefore(day_of_month, 'day') || start.isSame(day_of_month, 'day'))
    return one_license_configuration;
  });

  if(tmp && tmp.length)
  conf = tmp[tmp.length-1];

  return conf;
}

function isDayValid (serviceSchedule, date){

    var is_valid = false;
    var dayname = moment(date).format('dddd');
    if(serviceSchedule[dayname].SessionType == 'All Day' || serviceSchedule[dayname].SessionType == 'Mixed')
    is_valid = true;

    return is_valid;    
}