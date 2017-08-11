'use strict';

angular.module('sms.util',
  [
    'ngCookies'
  ])
  .config(function () {
    //...
  })
  .factory('$util', function (moment) {
    return {
      convertToPlain: function (name) {
        return diacritics_util.convertToPlain(name);
      },

      findWeekStart: function(d) {
        var day = d.getDay();
        var d = new Date(d);
        d.setDate(1);
        return d;
      },
      findWeekEnd: function(d) {
        var day = d.getDay();

        return d;
      },

      getDayOfWeek: function(date) {

        var weekday = new Array(7);
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[date.getDay()];
      },
      parseDateUTC: function (dateStr) {
        if (angular.isDate(dateStr)) {
          console.log('Convert me to UTC');
          return dateStr;
        }
        var d = new Date();
        d.setYear(dateStr.substr(0, 4));
        d.setUTCMonth(Number(dateStr.substr(4, 2)) - 1);
        d.setUTCDate(dateStr.substr(6, 2));
        d.setUTCHours(0, 0, 0, 0);
        return d;
      },
      getAge: function (birthDate) {
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      },
      getVerification: function (v) {
        if (v.indexOf('Passport') > -1) return 'P';
        if (v.indexOf('Birth Certificate') > -1) return 'B';
        if (v.indexOf('Unsighted') > -1) return 'U';
        if (v != '' && v != null) return 'O';
        return 'U';
      },

      zeropad: function (n) {
        return n > 9 ? "" + n : "0" + n;
      },

      /** Note: This should normally use UTC functions BUT we're using THIS as the ONE place to cover the following assumption:
       *        When the user originally inputs a date via the date control (ie birthdate), they are making the assumption
       *        that it is UTC. In reality, the date is stored in their own timezone. At this point this is the easiest place to account
       *        for this assumption. If this application ever operates west of UTC, we'll need to do more work.
       */
      format: function (datestr) {
        var d = new Date(datestr);
        return d.getFullYear() + "" + this.zeropad(d.getMonth() + 1) + this.zeropad(d.getDate());
      },
      formatGender: function (gender) {
        if (gender && gender.length > 1) return gender.substr(0, 1);
        else return gender;
      },

      getOfficialGiven1Name: function (obj) {
        if (!obj.OfficialGiven1Name || obj.OfficialGiven1Name == '') return '~';
        else return obj.OfficialGiven1Name;
      },
      formatTime: function(d) {
        return this.zeropad(d.getHours()) + ":" + this.zeropad(d.getMinutes());
      },
      formatDate:function(date){
          return moment(date).format("YYYY-MM-DD");
      },
      formatName: function (record) {
        var names = [this.getOfficialGiven1Name(record), record.OfficialFamilyName];
        //var names = [record.OfficialGiven1Name, record.OfficialGiven2Name, record.OfficialGiven3Name, record.OfficialFamilyName];

        return _.map(names, function (name) {
          return (name != null && name != '') ? (name + ' ') : '';
        }).join("").trim();
      },
      checkBookingAndEnrolment: function (kid, onlyBookedChildren, today, starttime, endtime,currentSession) {
        if (kid) {
          var en = null, bs = null, enrollment = null;
          var t = moment(today);
          if (kid.Enrolments && kid.Enrolments.length) {
            // iterate over all enrolments and booking schedules to find one that matches the date range, otherwise take the last one
            _.each(kid.Enrolments, function(enrol) {
              enrollment = enrol;
              // find a good enrolment
              if ( (t.isAfter(enrollment.EnrolmentSection.EnrolmentStartDate, 'day') || t.isSame(enrollment.EnrolmentSection.EnrolmentStartDate, 'day'))
                &&
                (!enrollment.EnrolmentSection.EnrolmentEndDate ||
                (t.isBefore(enrollment.EnrolmentSection.EnrolmentEndDate, 'day') || t.isSame(enrollment.EnrolmentSection.EnrolmentEndDate, 'day')) )) {
                // found a good enrolment
                en = enrollment.EnrolmentSection;
                if ( enrollment.BookingSchedule) {
                  _.each(enrollment.BookingSchedule, function(bookingSched) {
                    if ( t.isAfter(bookingSched.EffectiveDate, 'day') || t.isSame(bookingSched.EffectiveDate, 'day') ) {
                      bs = bookingSched;
                    }
                  })
                }
              }

            });
            // take the last one if we didn't match
            if ( !en || !bs || !enrollment ) {
              enrollment = kid.Enrolments[kid.Enrolments.length - 1];
              en = enrollment.EnrolmentSection;
              bs = enrollment.BookingSchedule ? enrollment.BookingSchedule[enrollment.BookingSchedule.length-1] : null;
            }

          }

          if(currentSession){
            return bs;
          }

          if (onlyBookedChildren &&
            (!en || !bs || !this.matchTimes(bs, today, starttime, endtime) )) {
            return false;
          }
          

          var start = en ? en.EnrolmentStartDate : null;
          var ef = bs ? bs.EffectiveDate : null;
          var end = en ? en.EnrolmentEndDate : null;

          if (onlyBookedChildren && (!start || !ef)) return false;
          if (end && t.isAfter(end, 'day')) return false;
          return (t.isAfter(start, 'day') || t.isSame(start, 'day')) && (!onlyBookedChildren || (ef &&
            (t.isAfter(ef, 'day') || t.isSame(ef, 'day'))));
        } else {
          return false;
        }
      },

      getEffectiveLicensDetails:function(data,day){
        var t=moment(day);
        var licenseconfig=null;
        if(data && data.length){
           licenseconfig=data[data.length-1];
          _.each(data,function(obj){
              if ((t.isAfter(obj.EffectiveStartDate, 'day') || t.isSame(obj.EffectiveStartDate, 'day'))){
               
                licenseconfig=obj;
              }
          })
        } 
        
        if(licenseconfig && licenseconfig.EffectiveEndDate){
         
           if ((t.isAfter(licenseconfig.EffectiveEndDate, 'day'))){
                licenseconfig=null;
              }
        }
        return licenseconfig; 
      },
      matchAttendaceTime: function(att, starttime, endtime) {
        var s=moment(att[0].AttendanceTimeStart).format("HH:mm");
        var e=moment(att[0].AttendanceTimeEnd).format("HH:mm");
        return (s==starttime && e > starttime) || (s < starttime && e > starttime) || (s > starttime && s < endtime);
      },
      matchTimes: function(bookings, today, starttime, endtime) {
       
        var match = false;
        var day = this.getDayOfWeek(today);
        _.each(bookings.Times, function(t) {
          var matchtime = (t[day+"Start"] && t[day+"End"]);
          if ( starttime && endtime && matchtime ) {
            var s = t[day+"Start"], e = t[day+"End"];
            //matchtime = (s <= starttime && e >= starttime) || (s > starttime && s <= endtime)
            
            matchtime = (s==starttime && e > starttime) || (s < starttime && e > starttime) || (s > starttime && s < endtime)
          }
          match = match || matchtime
        })
        
        return match;
      },
      getECETwentyHours:function(fch,child,today){
        var en=null,bs=null,eligibleTwentyHoursEce=false;
         if(child.Enrolments && child.Enrolments.length){
             en=child.Enrolments[child.Enrolments.length-1];
             bs=(en && en.BookingSchedule && en.BookingSchedule.length) ? en.BookingSchedule[en.BookingSchedule.length-1] : null;
             eligibleTwentyHoursEce= (bs && bs.TwentyHoursECEAttestation) ? true:false;
          }

        if(eligibleTwentyHoursEce){
            var TwentyHoursECEAttestationObj=bs.TwentyHoursECEAttestation;
            var dayOfWeek=this.getDayOfWeek(today);
            return (TwentyHoursECEAttestationObj[dayOfWeek+"Hours"]) ? TwentyHoursECEAttestationObj[dayOfWeek+"Hours"] :0;
          }else{
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
      getMaxDaysMonth:function(month) {
      var m = moment("01 "+month, "DD MMM YYYY");
      var count = 0;
      var day
      do {
        var currDay = m.format("ddd");
        if ( currDay != "Sat" && currDay != "Sun" ) count++;

        m.add(1, 'days');
        day = m.format("D");
      } while ( day > 1 )

      return count;
      },

      getAdvanceDaysInMonth:function(month, type,serviceSchedule) {
        var m = moment("01 "+month, "DD MMM YYYY");
        var count = 0;
        var day
        do {
          var currDay = m.format("dddd");
          var sch =serviceSchedule[currDay];
          if ( sch && sch.Scheduled && (sch.SessionType == 'Both' || type == sch.SessionType))
            count++;
          m.add(1, 'days');
          day = m.format("D");
        } while ( day > 1 )

        return count;
      },
      isHBorPC :function(facility) {
        return facility.CenterType == "Home Based" || facility.CenterType == 'Playcentre';
      },
      isHB :function(facility) {
        return facility.CenterType == "Home Based";
      },
      isPC :function(facility) {
        return facility.CenterType == "Playcentre";
      },
      isSessional : function(facility) {
        return facility.SessionType == 'Sessional';
      },
      isKinder : function(facility) {
         facility.CenterType == 'Kindergarten';
      },
      isAllDay : function(facility) {
        return facility.SessionType == 'All Day';
      },
      isMixed : function(facility) {
        return facility.SessionType == 'Mixed';
      },
      showAllDayAdvance : function(facility) {
        return !this.isHBorPC(facility) && (this.isAllDay(facility) || this.isMixed(facility));
      },
     showSessionalAdvance :function(facility) {
        return !this.isPC(facility) || !(this.isKinder(facility) && (this.isAllDay(facility) || this.isMixed(facility)));

      }
    
  }
});

