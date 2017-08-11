'use strict';

angular.module("sms.roster", [])
  .controller('RosterCtrl', function ($timeout, $rootScope, messageService, Auth, formlyAdapter, facilityService,
                                      $state, ngTableParams, tableService, $scope, growlService, moment, $util,fchUtils, dialog) {

    var that = this;

    var isContactHours = $state.is("main.recordContactHours");
    var isRosterReport = $state.is("main.roster");
    var isWeeklyRoster = $state.is("main.weeklyRoster");

    that.types = ["Daily", "Weekly"];
    that.reportType = that.types[0];
    that.discretCount = 0;
    that.resetVal=false;
    that.today = new Date();
    that.payPerPeriodRecord = {};
    that.payPerPeriodFilterRecord = {};
    that.discretionRosterCount  = 0;
    $scope.weeklyContactHoursRoster = [];

    if(isWeeklyRoster){
      that.reportType = that.types[1];
    }

    that.formClicked=function(type){
      that[type + 'Opened'] = false;
    }
    that.currentuser=Auth.getCurrentUser();
    that.currentCentreType=(that.currentuser.facility && that.currentuser.facility.CenterType) ? that.currentuser.facility.CenterType:'';
      
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

    that.startTime = "07:30";
    that.endTime = "17:30";

    that.rosterParamsChange = function (e) {
      // todo check if unsaved work
      that.resetVal=true;
      that.roster=null;
      initTable();
    }

    function zeropad(n) {
      return n > 9 ? n : "0" + n;
    }

    function getLabel(hr, min) {
      var ampm = "AM";
      if (hr == 0) {
        hr = 12;
      } else if (hr > 11) {
        ampm = "PM";
        hr = (hr > 12) ? hr - 12 : hr;
      }
      return hr + ":" + zeropad(min) + " " + ampm;
    }

    function getTimes(format) {
      var arr = [];
      arr.push('');
      for (var i = 0; i < 24; i++) {
        for (var j = 0; j < 60; j = j + 15) {
          if (format) {
            arr.push(getLabel(i, j));
          } else {
            arr.push(zeropad(i) + ':' + zeropad(j));
          }
        }
      }
      return arr;
    }

    function getLabels() {
      return getTimes(true)
    }
    that.format='dd-MM-yyyy';
    that.startTimes = [];
    that.intervals = [30, 60];
    that.interval = 60;

    var times = getTimes();
    var labels = getLabels();
    that.timeMap = {};
    angular.forEach(times, function (t, idx) {
      if (t == '') return;
      that.startTimes.push({Value: t, Label: labels[idx]});
      that.timeMap[t] = labels[idx];
    })

    that.getTimeLabel = function (t) {
      return that.timeMap[t];
    };

    var initialized = false;

    that.getEducatorName = function (edu) {

      if ( !that.educatorMap ) return '';
      if (that.educatorMap[edu]) edu = that.educatorMap[edu];
      return (edu && edu.FirstName) ? edu.FirstName + ' ' + edu.LastName : '';
    }

    function getTime(h, m, int) {

      var _m = m + int;
      var _h = h + Math.floor(_m / 60);

      return zeropad(_h) + ":" + zeropad(_m % 60);
    }


    function _handleChange(w, dutyList, required, max) {
    
      if (!w[dutyList]) {
        w[dutyList] = [];
      }


      var curr = _.filter(w[dutyList], function (w) {
        if(w && w.filler){
          return !w.filler;
        }else{
          return true;
        }
      }).length;

      if (curr >= w[required]) { 
        w[dutyList].splice(w[required], w[dutyList].length - w[required]);
      } else if (curr < w[required]) {
        w[dutyList].splice(curr, max - curr);
      }
      /*else if(curr >=max) { 
        w[dutyList].splice(w[required], w[dutyList].length - max);
      }else if(curr < max){
         w[dutyList].splice(curr, max - curr);
      }*/
      
       for (var i = w[dutyList].length; i < max; i++) { 
              if(dutyList=='Educators'){
                if(that.educatorList && that.educatorList.length && that.educatorList[0]._id){
                  w[dutyList].push(that.educatorList[0]._id);
                }
                
              }else{
                if(that.dutyListItems && that.dutyListItems[0]._id){
                  w[dutyList].push(that.dutyListItems[0]._id);
                }
                  
              }
              
               if (i >= w[required]) w[dutyList][w[dutyList].length - 1] = {filler:true};
            }
      
      w[dutyList] = w[dutyList].filter(function (val) {
        return val
      });
      

      //initTable(true);
    }


    that.enrolledChange = function (w) {

      //that.validateAttendance(w);
       w.MinStaffRequired = computeRequired(w, 'Educators');
       w.MinQualifiedStaffRequired = computeMinQualifiedStaffRequired(w, 'Educators');
       w.QualifiedStaffRequiredMaxFunding = computeMaxQualifiedStaffFunding(w, 'Educators');
       that.educatorsRequiredChange(w);
      
    }

    var lastEducatorsChange = 0;
    var lastEducatorTimeout = null;
    that.educatorsRequiredChange = function (w,checkVal) {
       if(w && isContactHours){
        that.validateAttendance(w);
       }
      if (lastEducatorTimeout) {
        $timeout.cancel(lastEducatorTimeout)
      }
      
      lastEducatorTimeout = $timeout(function () {
        lastEducatorTimeout = null;
        
        handleEducatorsRequiredChange(w)
      }, 300);
    }

    function handleEducatorsRequiredChange(w) {
       var latestEducators=[];
       
        for ( var i = 0; i < that.getMaxEducators(); i++ ) {
            if ( that.roster.Educators && !that.roster.Educators[i] ){
                latestEducators[i] = (that.educatorList[0]) ? that.educatorList[0]._id : null;    
            }else{
              latestEducators[i]=that.roster.Educators[i];
            } 
          
          }
          if(that.roster && that.roster["Educators"]=='undefined'){
            that.roster.Educators=angular.copy(latestEducators);
          }else{
            if(!that.roster) that.roster={};
            that.roster['Educators']={};
            that.roster.Educators=angular.copy(latestEducators);
          }
          
        
         _.each(that.roster.Hours, function (w) {
             _handleChange(w, 'EducatorDutyList', 'MinStaffRequired', that.getMaxEducators());
             _handleChange(w, 'Educators', 'MinStaffRequired', that.getMaxEducators());

          });    
      
        //initTable(true);
    }

    that.parentsRequiredChange = function (w) {
      _.each(that.roster.Hours, function (w) {
        _handleChange(w, 'ParentDutyList', 'ParentsRequired', that.getMaxParents());
      });
      initTable(true);
    }

    that.getMaxEducators = function (type) {
      var m = 0;
      if (!that.roster) return 0;
       _.each(that.roster.Hours, function (w){
        m = (m < w.MinStaffRequired ) ? w.MinStaffRequired : m;
      });
      
      return m;
    }

    that.getMaxParents = function () {
      var m = 0;
      if (!that.roster) return 0;
      _.each(that.roster.Hours, function (w) {
        m = (m < w.ParentsRequired ) ? w.ParentsRequired : m;
      });
      return m;
    }

    /*
     Use the Option 1 values from the min supervision qualification to check against educator 1 column.
     Same for 2 and 3. As long as educator has at least one of the values in the table, we are in
     compliance. When we get to column 2 or 3, we check option 2 or 3 to determine which option we are
     using (as we can only comply with one)
     */

    function minSupervisionQualificationMet() {
      var met = false;

      var hasCode = function(edId, code) {
        var ed = that.educatorMap[edId];
    
         if ( !ed  || !ed.ECEQualificationsDetails || !ed.ECEQualificationsDetails.HighestPlaycentreQualificationCode) return false;
         return _.filter(ed.ECEQualificationsDetails.HighestPlaycentreQualificationCode, function(c) {
          return c == code;
        }).length > 0;
      }
     

      // set up a double arr, one for educators, second for codes per educator.  Then compare to each option until one matches
      var arr = [];
      _.each(that.playcentreQualifications, function(pcq, idx) {
        arr[idx] = [];
        arr[idx][0] = pcq.Educator1;
        arr[idx][1] = pcq.Educator2;
        arr[idx][2] = pcq.Educator3;
      });

     
      _.each(arr, function(option) {
        if ( met || !option ) return;
        var match = true;
        for (var i = 0; i < that.getMaxEducators(); i++) {
          if (i >= option.length || !option[i]) continue;
          var ed = that.roster.Educators[i];
          match = match && hasCode(ed, option[i]);
        }
        met = met || match;
      });



      return met;
    }

    that.getPayPerPeriodNotificationData=function(){ 
     formlyAdapter.getList('payperiodnotification').then(function(data) {
        if ( data && data.length ) {
            that.payPerPeriodRecord = data;
            that.getDiscretionRoster();
        }
      })
    }

    that.getStartOrEndDate = function(month,type){
      var date=new Date(that.today);
      var currentYear=date.getFullYear();
      if(month=="Oct"){
        currentYear=currentYear-1;
      }
       if(type == 'start'){
         return new Date('01 '+month+" "+currentYear);
       }else{
           var startDate = new Date('01 '+month+" "+currentYear);
           var endDate = moment(startDate).endOf('month');
          return new Date(endDate.toString());
       }
    }

    that.getDiscretionRoster = function(){    
      if(that.payPerPeriodRecord.length){
        var currDateMonth = moment(that.today).format("MMM");
        var currMonth = parseInt(moment().month(currDateMonth).format("M"));
          that.payPerPeriodFilterRecord =_.filter(that.payPerPeriodRecord, function(p) {
             var rosterStartDate = that.getStartOrEndDate(p.StartPayPeriodMonth,'start');
             var rosterEndDate = that.getStartOrEndDate(p.EndPayPeriodMonth,'end');
             return ((moment(that.today).isSame(moment(rosterStartDate),'day') || moment(that.today).isAfter(moment(rosterStartDate),'day')) && (moment(that.today).isSame(moment(rosterEndDate),'day') || moment(that.today).isBefore(moment(rosterEndDate),'day')));
        });
         
        var startPayPeriodMonth = (that.payPerPeriodFilterRecord.length) ? moment().month(that.payPerPeriodFilterRecord[0].StartPayPeriodMonth).format("MMM"):moment().month(currMonth).format("MMM");
        var rosterStartDate = that.getStartOrEndDate(startPayPeriodMonth,'start');
        var rosterEndDate = new Date(moment(that.today).subtract(1,'days').format('MM-DD-YYYY'));

        var p = {
                query: JSON.stringify({
                  IsContactHours :true,
                  DiscretionCount : 1,
                  Date: {"$gte": timeFix(rosterStartDate, false), "$lte": timeFix(rosterEndDate, true)},
                })
              }
        formlyAdapter.getList('roster',p).then(function(data) {
            if ( data && data.length ) {
              that.discretionRosterCount = parseInt(data.length);
            }else{
              that.discretionRosterCount=0;
            }
        });
      }
    }

    that.getPayPerPeriodNotificationData();
    that.setDiscretionCount=function(){ 
      that.displayDiscretCount=0;
      var rosterDate = moment(that.today).format("DD-MM-YYYY");
      var currentDate = moment().format("DD-MM-YYYY");
        _.each(that.roster.Hours,function(h){
           var criteriaMet=0;
              if ( !that.educatorMap  ) return "danger";
                var educatorsAssigned = _.filter(h.Educators, function (edl, idx) {
               if ( idx >= that.getMaxEducators() ) return false;
                return ( edl && that.educatorMap[edl] && that.educatorMap[edl].ECEQualificationsDetails &&
                that.educatorMap[edl].ECEQualificationsDetails.IsRegistered )
              }).length;

              var minQualStaffRequired = computeMinQualifiedStaffRequired(h);
              var maxQualStaffRequired = computeMaxQualifiedStaffFunding(h);

              if (educatorsAssigned >= minQualStaffRequired){
                 criteriaMet++;
              }
              if(educatorsAssigned >= maxQualStaffRequired){
                criteriaMet++;
              }

              if(criteriaMet==0 && minQualStaffRequired!=0){
                 that.discretCount=1;
               }
          })
      if(that.discretCount){
         that.displayDiscretCount=parseInt(that.discretionRosterCount)+that.discretCount;
      }else{
        that.displayDiscretCount=parseInt(that.discretionRosterCount);
      }
      
     
    }

    that.getDiscretionCountClass=function(){
      var count=that.discretCount;
      if (count == 0) return "alert alert-danger";
      else return "alert alert-success";
    }

    /**
     * First number is the number of educators required based on booked children. Say to there are 30 children and
     * as per adult to child ratio, we need six educators. Which means six educators should be showing up for rostering

     Second is that they need to maintain minimum supervision qualification which we have already created. This is
     a combination of certificates that educators should possess at to qualify for quality rates.
     * @param r
     */
    that.getRowClass = function (r) {

      var criteriaMet=0;
      if ( !that.educatorMap  ) return "danger";
        var educatorsAssigned = _.filter(r.Educators, function (edl, idx) {
       if ( idx >= that.getMaxEducators() ) return false;
        return ( edl && that.educatorMap[edl] && that.educatorMap[edl].ECEQualificationsDetails &&
        that.educatorMap[edl].ECEQualificationsDetails.IsRegistered )
      }).length;

      var minQualStaffRequired = computeMinQualifiedStaffRequired(r);
      var maxQualStaffRequired = computeMaxQualifiedStaffFunding(r);

      if (educatorsAssigned >= minQualStaffRequired){
         criteriaMet++;
      }
     if(educatorsAssigned >= maxQualStaffRequired){
        criteriaMet++;
      }
      that.setDiscretionCount();

      if (criteriaMet == 0) return "danger";
      else if (criteriaMet == 1) return "warning";
      else return "success";
    }

    that.getHours = function () {

      if (that.roster) return that.roster.Hours;
      else return [];
    }

    var arr = ['Hours', 'Booked', 'Staff/Educators Required'];
    if ( isContactHours ) arr.splice(1,1,"Attendance");
    that.getHeaders = function () {
      $scope.timeHeaders=arr;
      return arr;
    }

    var headerWidths = [115,60,95];
    that.getHeaderWidths = function () {
      return headerWidths;
    }


    that.getEducatorHeaders = function(includeDuties) {
      var arr = [];

     for (var i = 1; i <= that.getMaxEducators(); i++) {
          arr.push("Educator " + i);
          if ( includeDuties ) arr.push("Duties");
        }
     
      return arr;
    }

    that.getEducatorDutyList = function(w) {
     var arr = [];
      if ( !w.Educators ) w.Educators = [];
      _.each(w.EducatorDutyList, function(ed, idx) {
        if ( ed.filler ) {
          arr.push(ed);
          arr.push(ed);
          return;
        }

        if (!w.Educators[idx]) {
          w.Educators[idx] = that.roster.Educators[idx];
        }

        arr.push(w.Educators[idx]);
        arr.push(ed);
      })

      return arr;
    }

    that.getParentHeaders = function() {
      var arr = [];
      for (var i = 1; i <= that.getMaxParents(); i++) {
        arr.push("Parent " + i);
      }
      $scope.ParentHeaders=arr;
      return arr;
    }

    that.firstAidCount = 0;
    that.discretionCount = 0;

    that.checkEducators = function (idx,change) {
      var count = 0;
      if ( !that.educatorMap || !that.roster) return;

      _.each(that.roster.Educators, function (e) {
        /*if (e && !e.Staff) {
          e = that.educatorMap[e];
        }
        if (e && e.Staff && e.Staff.FirstAidCertificate) count++;*/
        if (e && !e._id) {
          e = that.educatorMap[e];
        }
        if (e && e.FirstAidCertificate) count++;
      })
      $timeout(function () {
        that.firstAidCount = count;
        
        _.each(that.roster.Hours, function (h) {
            var ed = that.roster.Educators[idx];
            if(!ed){
               ed= (that.educatorList && that.educatorList.length) ? that.educatorList[0]._id:null;
            }
            h.Educators[idx] = (h.Educators[idx] && !change) ? h.Educators[idx]: ed;
           
         
        });
      });

      that.minSupervisionMet = minSupervisionQualificationMet();
      
    }
    that.getColspan = function(idx){
      if(idx==0){
        return 1;
      }else if(idx==2){
        return 3;
      }
      return 2;
    }

    that.getFirstAidClass = function () {
      if (that.firstAidCount == 0) return "alert alert-danger";
      else return "alert alert-success";
    }

   that.getDutyName=function(name){
      if(!name) return '';
      return name;
    }
    that.getDuty = function(day, row) {

        var dutylist='';
          var rosterData=_.filter(that.weeklyRoster,function(wr){
          return moment(wr.Date).isSame(moment(day),'day');
        });

       var roster=(rosterData && rosterData.length) ? rosterData[0]:null;
        if(roster){

          var startTime=row.StartTime;
          var endTime=row.EndTime;
          
          var row_start = moment().hours(startTime.split(':')[0]).minutes(startTime.split(':')[1]).format('HH:mm');
          var row_end = moment().hours(endTime.split(':')[0]).minutes(endTime.split(':')[1]).format('HH:mm');


          var rosterHours=(roster.Hours)? roster.Hours:null;
          if(rosterHours && rosterHours.Hours){
            // console.log('***************************************')
            // console.log('row.StartTime',row.StartTime)
            // console.log('row.endTime',row.EndTime)
            
            _.each(rosterHours.Hours,function(h){ 

              var tmp_h_start = moment().hours(h.StartTime.split(':')[0]).minutes(h.StartTime.split(':')[1]).format('HH:mm');
              var tmp_h_end = moment().hours(h.EndTime.split(':')[0]).minutes(h.EndTime.split(':')[1]).format('HH:mm');

               // if(
              //   (h.StartTime==startTime && h.EndTime==endTime)
              //   || (tmp_h_start >= row_start && tmp_h_start <= row_end)
              //   || (tmp_h_end >= row_start && tmp_h_end <= row_end)
              // ) 

              if(
                (tmp_h_start >= row_start &&  tmp_h_start < row_end )
                ||
                (tmp_h_end > row_start && tmp_h_end <= row_end)
                ||
                (row_start > tmp_h_start &&  row_end < tmp_h_end )
              )
              {
              //    console.log("tmp_h_start",tmp_h_start)
              // console.log("tmp_h_end",tmp_h_end)
                
              // console.log("case 1",(tmp_h_start >= row_start &&  tmp_h_start < row_end ))
              // console.log("case2",(tmp_h_end > row_start && tmp_h_end <= row_end))
              // console.log("case 3",(row_start > tmp_h_start &&  row_end < tmp_h_end ))
                
            
                // console.log('in process')
                // console.log('h.Educators', h.Educators)
                var educatorMatchedIndex=null;
                  _.each(h.Educators,function(ed,index){
                    if(ed==that.rosterReportEducator){
                       educatorMatchedIndex=index;
                    }  
                  })
                  // console.log('day',day)
                  // console.log('educatorMatchedIndex',educatorMatchedIndex)
                if(dutylist){

                  return false;
                }
                dutylist=that.dutyListMap[h.EducatorDutyList[educatorMatchedIndex]];
                // console.log('dutylist',dutylist)
              }
           })
         }
        }
       // console.log('dutylist111',dutylist)
       // console.log('***************************************')
        return (dutylist && dutylist.Name)? dutylist.Name:''; 
    }

    function newRoster() {


      that.firstAidCount = 0;
      var obj = {Date: that.today, StartTime: that.startTime, EndTime: that.endTime, Hours: [],Educators:[]}
      var starthr = parseInt(that.startTime.split(':')[0], 10), startmin = parseInt(that.startTime.split(':')[1], 10);
      var endhr = parseInt(that.endTime.split(':')[0], 10), endmin = parseInt(that.endTime.split(':')[1], 10);
      var interval = parseInt(that.interval, 10);
      var first = true;

      var starting_time_full  = moment().hours(starthr).minutes(startmin).seconds(0);
      var ending_time_full    = moment().hours(endhr).minutes(endmin).seconds(0);
      var starting_time       = starting_time_full.format('HH:mm');
      var ending_time         = ending_time_full.format('HH:mm');

      while(starting_time <= ending_time){

        var o = {

          StartTime: starting_time.toString(),
          ParentsRequired: 0,
          EnrolledUnderTwo:0,
          EnrolledOverTwo:0,
          MinStaffRequired:0,
          MinQualifiedStaffRequired:0,
          QualifiedStaffRequiredMaxFunding:0,
          Educators:[],
          EducatorDutyList:[]
        };

        starting_time_full  = starting_time_full.add(interval, 'minutes');
        starting_time       = starting_time_full.format('HH:mm');

        o['EndTime'] = starting_time.toString();        

        obj.Hours.push(o);
      }

      // for (var h = starthr; h <= endhr; h++) {
      //   for (var m = (interval == 60 || (startmin % interval > 0) ? startmin : 0); m < 60; m += interval) {

      //     if ((interval == 60 && m == 60) ||
      //       (first && m < startmin) ||
      //       ((m > endmin || m == endmin) && (h == endhr))) {

      //       if (first && m < startmin) {
      //         first = false;
      //         m = startmin;
      //       } else {
      //         continue;
      //       }
      //     }

      //     obj.Hours.push({
      //       StartTime: getTime(h, m, 0),
      //       EndTime: getTime(h, m, interval),
      //       ParentsRequired: 0,
      //       EnrolledUnderTwo:0,
      //       EnrolledOverTwo:0,
      //       MinStaffRequired:0,
      //       MinQualifiedStaffRequired:0,
      //       QualifiedStaffRequiredMaxFunding:0,
      //       Educators:[],
      //       EducatorDutyList:[],

      //     })
      //   }
      // }
      return obj;
    }
    function removeHoursOutSideRange(obj){
      var starthr = parseInt(that.startTime.split(':')[0], 10), startmin = parseInt(that.startTime.split(':')[1], 10);
      var endhr = parseInt(that.endTime.split(':')[0], 10), endmin = parseInt(that.endTime.split(':')[1], 10);
      var interval = parseInt(that.interval, 10);
      obj.Hours=obj.Hours.map(function(h){
         var HourStartTime = parseInt(h.StartTime.split(':')[0], 10);
         var HourEndTime = parseInt(h.EndTime.split(':')[0], 10)
        if( HourStartTime < starthr){
          return null;
        }
        if( HourEndTime > endhr ){
          return null;
        }
        return h;
      })
      obj.Hours=obj.Hours.filter(function(h){
        return h;
      });
      return obj; 
    }
    function updateRoster(){
      var obj=that.roster;
      var starthr = parseInt(that.startTime.split(':')[0], 10), startmin = parseInt(that.startTime.split(':')[1], 10);
      var endhr = parseInt(that.endTime.split(':')[0], 10), endmin = parseInt(that.endTime.split(':')[1], 10);
      var interval = parseInt(that.interval, 10);
      var first = true;
      obj=removeHoursOutSideRange(obj);
    
      for (var h = starthr; h <= endhr; h++) {
        for (var m = (interval == 60 || (startmin % interval > 0) ? startmin : 0); m < 60; m += interval) {

          if ((interval == 60 && m == 60) ||
            (first && m < startmin) ||
            ((m > endmin || m == endmin) && (h == endhr))) {

            if (first && m < startmin) {
              first = false;
              m = startmin;
            } else {
              continue;
            }
          }

          if(!checkRosterHours(h,m,obj.Hours,interval)){
              
              obj.Hours.push({
                StartTime: getTime(h, m, 0),
                EndTime: getTime(h, m, interval),
                ParentsRequired: 0,
                EnrolledUnderTwo:0,
                EnrolledOverTwo:0,
                MinStaffRequired:0,
                MinQualifiedStaffRequired:0,
                QualifiedStaffRequiredMaxFunding:0,
                Educators:[],
                EducatorDutyList:[],

              }) 
          }
          obj.Hours=_.sortBy(obj.Hours,function(h){
            var startHr=parseInt(h.StartTime.split(':')[0], 10);
            return startHr;
          })


          
        }
      }
      
      return obj;
    }

    function checkRosterHours(h,m,Hours,interval){
      var status=false;
      var hours=Hours.map(function(hour){

        if(hour.StartTime==getTime(h, m, 0) && hour.EndTime==getTime(h, m, interval)){
          status=true;
          return false;
        }
      })

      return status;
    }

    //that.roster = newRoster();

    function initTable(keepData) { 
      $timeout(checkLoaded(keepData), 100);
    }

    function computeAttendence(h,type) {

      if(type=='under2'){
          return _.filter(that.childlist, function (kid) {
            var childAge=moment(that.today).diff(moment(kid.ChildBirthDate),'month');
            if(childAge <= 24){
              var att = fchUtils.get_attendance(that.attendanceList,kid);


              if(att.length){
                return $util.matchAttendaceTime(att,h.StartTime,h.EndTime);
              }
            }else{
              return false;
            }
            
      }).length;
      }else if(type=='over2'){
          return _.filter(that.childlist, function (kid) {
              var childAge=moment(that.today).diff(moment(kid.ChildBirthDate),'month');
            if(childAge > 24){
              var att =fchUtils.get_attendance(that.attendanceList,kid);
              if(att.length){
                return $util.matchAttendaceTime(att,h.StartTime,h.EndTime);
              }
            }else{
              return false;
            }
      }).length;
      }else{
        return _.filter(that.childlist, function (kid) {
        var att =fchUtils.get_attendance(that.attendanceList,kid);
        if(att.length){
            return $util.matchAttendaceTime(att,h.StartTime,h.EndTime);
        }
      }).length;  
      }
      
    }

    function computeBooked(h,type) {
      if(type=='under2'){
          return _.filter(that.childlist, function (kid) {
            var childAge=moment(that.today).diff(moment(kid.ChildBirthDate),'month');
            if(childAge <= 24){
              return $util.checkBookingAndEnrolment(kid, true, that.today, h.StartTime, h.EndTime);  
            }else{
              return false;
            }
            
      }).length;
      }else if(type=='over2'){
          return _.filter(that.childlist, function (kid) {
              var childAge=moment(that.today).diff(moment(kid.ChildBirthDate),'month');
            if(childAge > 24){
              return $util.checkBookingAndEnrolment(kid, true, that.today, h.StartTime, h.EndTime);  
            }else{
              return false;
            }
      }).length;
      }else{
        return _.filter(that.childlist, function (kid) {
        return $util.checkBookingAndEnrolment(kid, true, that.today, h.StartTime, h.EndTime);
      }).length;  
      }
      
    }
    function getEffectiveStaffRatio(fromAge,toAge){
      var staffRatio=null;
      if(that.currentCentreType=='Playcentre'){
          if(that.staffRatios && that.staffRatios.length){
            var staffRatio=that.staffRatios[0];
            _.each(that.staffRatios,function(ratio){
              if(ratio.CenterType==that.currentCentreType){
                staffRatio=ratio;
              }
            })
          }
      }else{
           if(that.staffRatios && that.staffRatios.length){
            var staffRatio=that.staffRatios[0];
            _.each(that.staffRatios,function(ratio){
              if(ratio.CenterType==that.currentCentreType && ratio.ageFrom ==fromAge && ratio.ageTo==toAge){
                staffRatio=ratio;
              }
            })
          }
      }
      
      if(staffRatio)
      return staffRatio.Ratios;
      else return staffRatio;
    }
    function getEfectiveRatio(staffRatios){
        var currentDate=moment(that.today);
        var staffRatio=[];
        if(staffRatios && staffRatios.length){

          _.each(staffRatios,function(ratio,key){
            //var lastEffDate=(key==0)? moment(staffRatios[key].EffectiveStartDate) : moment(staffRatios[key-1].EffectiveStartDate); 
             var effStartDate=moment(ratio.EffectiveStartDate);
             
             if(ratio.EffectiveEndDate){
              var effEndDate=moment(ratio.EffectiveEndDate);
               if((currentDate.isAfter(effStartDate) || currentDate.isSame(effStartDate)) && currentDate.isBefore(effEndDate)){
                staffRatio.push(ratio);
               }
             }else{
               if((currentDate.isAfter(effStartDate) || currentDate.isSame(effStartDate))){
                staffRatio.push(ratio);
               }
             }
             

          })
          if(!staffRatio.length){
            staffRatio=staffRatios;
          }
        }
        return staffRatio;
    }

    function computeRequired(h,val) {

      var bookedunder2=h.EnrolledUnderTwo;
      var bookedOver2=h.EnrolledOverTwo;
      
       if(that.currentCentreType=='Playcentre'){
          var booked=bookedunder2+bookedOver2;
          var staffRatio=getEffectiveStaffRatio(0,72);
            var ratio = getEfectiveRatio(staffRatio); //that.staffRatios && that.staffRatios[0];
            var count=0;

            if (!ratio) count=0;
            _.each(ratio, function (r) {
              if (booked >= r.Minimum && booked <= r.Maximum) count = r.MaximumStaffRequired;
            })
            return count;
       }else{
        var countunder2 = 0;
        var countover2 = 0;
        var staffRatioUnder2=getEffectiveStaffRatio(0,24);

        var staffRatioOver2=getEffectiveStaffRatio(24,72);
        var ratiounder2 = getEfectiveRatio(staffRatioUnder2); //that.staffRatios && that.staffRatios[0];
        if (!ratiounder2) countunder2=0;
        _.each(ratiounder2, function (r) {
          if (bookedunder2 >= r.Minimum && bookedunder2 <= r.Maximum) {
             countunder2 = r.MaximumStaffRequired; 
          }
        })
        
        var ratioover2 = getEfectiveRatio(staffRatioOver2); //that.staffRatios && that.staffRatios[0];
        if (!ratioover2) countover2=0;
        _.each(ratioover2, function (r) {
          if (bookedOver2 >= r.Minimum && bookedOver2 <= r.Maximum){
                countover2 = r.MaximumStaffRequired;
          } 
        })
        
       
        return countover2+countunder2;
       }
      
    }

    function computeMinQualifiedStaffRequired(h,val) {
      
      var bookedunder2=h.EnrolledUnderTwo;
      var bookedOver2=h.EnrolledOverTwo;
      if(that.currentCentreType=='Playcentre'){
          var booked=bookedunder2+bookedOver2;
          var staffRatio=getEffectiveStaffRatio(0,72);
            var ratio = getEfectiveRatio(staffRatio); //that.staffRatios && that.staffRatios[0];
            var count=0;

            if (!ratio) count=0;
            _.each(ratio, function (r) {
              if (booked >= r.Minimum && booked <= r.Maximum) count = r.MinimumQualifiedStaffRequired;
            })
            return count;
      }else{
          var countunder2 = 0;
          var countover2 = 0;
          var staffRatioUnder2=getEffectiveStaffRatio(0,24);
          var staffRatioOver2=getEffectiveStaffRatio(24,72);
          var ratiounder2 = getEfectiveRatio(staffRatioUnder2); //that.staffRatios && that.staffRatios[0];
          if (!ratiounder2) countunder2=0;
          _.each(ratiounder2, function (r) {
            if (bookedunder2 >= r.Minimum && bookedunder2 <= r.Maximum) countunder2 = r.MinimumQualifiedStaffRequired;
          })
          
          var ratioover2 = getEfectiveRatio(staffRatioOver2); //that.staffRatios && that.staffRatios[0];
          if (!ratioover2) countover2=0;
          _.each(ratioover2, function (r) {
            if (bookedOver2 >= r.Minimum && bookedOver2 <= r.Maximum) countover2 = r.MinimumQualifiedStaffRequired;
          })
          return countover2+countunder2;
      }
      
    }
    function computeMaxQualifiedStaffFunding(h,val) {
      var bookedunder2=h.EnrolledUnderTwo;
      var bookedOver2=h.EnrolledOverTwo;
       if(that.currentCentreType=='Playcentre'){
          var booked=bookedunder2+bookedOver2;
          var staffRatio=getEffectiveStaffRatio(0,72);
            var ratio = getEfectiveRatio(staffRatio); //that.staffRatios && that.staffRatios[0];
            var count=0;

            if (!ratio) count=0;
            _.each(ratio, function (r) {
              if (booked >= r.Minimum && booked <= r.Maximum) count = r.StaffingForMaxFunding;
            })
            return count;
       }else{
          var countunder2 = 0;
          var countover2 = 0;
          var staffRatioUnder2=getEffectiveStaffRatio(0,24);
          var staffRatioOver2=getEffectiveStaffRatio(24,72);
          var ratiounder2 = getEfectiveRatio(staffRatioUnder2); //that.staffRatios && that.staffRatios[0];
          if (!ratiounder2) countunder2=0;
          _.each(ratiounder2, function (r) {
            if (bookedunder2 >= r.Minimum && bookedunder2 <= r.Maximum) countunder2 = r.StaffingForMaxFunding;
          })
          
          var ratioover2 = getEfectiveRatio(staffRatioOver2); //that.staffRatios && that.staffRatios[0];
          if (!ratioover2) countover2=0;
          _.each(ratioover2, function (r) {
            if (bookedOver2 >= r.Minimum && bookedOver2 <= r.Maximum) countover2 = r.StaffingForMaxFunding;
          })
          
         
          return countover2+countunder2;
       }
      
      
    }

    function initRoster() {
      _.each(that.roster.Hours, function (h) {
        h.EnrolledUnderTwo = (isContactHours)? computeAttendence(h,'under2'):computeBooked(h,'under2');
        h.EnrolledOverTwo = (isContactHours)? computeAttendence(h,'over2'):computeBooked(h,'over2');
        
        h.MinStaffRequired=(h.MinStaffRequired) ? h.MinStaffRequired: computeRequired(h);
        h.MinQualifiedStaffRequired=(h.MinQualifiedStaffRequired) ? h.MinQualifiedStaffRequired: computeMinQualifiedStaffRequired(h);
        h.QualifiedStaffRequiredMaxFunding=(h.QualifiedStaffRequiredMaxFunding) ? h.QualifiedStaffRequiredMaxFunding: computeMaxQualifiedStaffFunding(h);
       
        //that.educatorsRequiredChange()
      })
      
      
    }

    that.validateAttendance = function (row,saveFlag){

      if(!row || 
        !that.minimum_attendance_start_time_today || 
        !that.minimum_attendance_end_time_today
      ) {
        if(saveFlag){
          return true;
        }
        console.log('no attendance check')
        
      }

      var row_starttime = moment().hours(row.StartTime.split(':')[0]).minutes(row.StartTime.split(':')[1]).seconds(0);
      row_starttime = row_starttime.format('HH:mm');
      var row_endtime   = moment().hours(row.EndTime.split(':')[0]).minutes(row.EndTime.split(':')[1]).seconds(0);
      row_endtime = row_endtime.format('HH:mm');

      /*console.log('row_starttime',row_starttime)
      console.log('row_endtime',row_endtime.toString())
      console.log('att_starttime',that.minimum_attendance_start_time_today)
      console.log('att_endtime',that.minimum_attendance_end_time_today)
      console.log("att1",(that.minimum_attendance_start_time_today <= row_starttime &&  row_starttime < that.minimum_attendance_end_time_today  ))
      console.log("att2",(that.minimum_attendance_end_time_today >= row_starttime &&
        that.minimum_attendance_end_time_today <= row_endtime))*/
     /* if(
        !(that.minimum_attendance_start_time_today <= row_starttime &&
        that.minimum_attendance_start_time_today < row_endtime)
        &&
        !(that.minimum_attendance_end_time_today >= row_starttime &&
        that.minimum_attendance_end_time_today < row_endtime)
      )*/
       if(
        !(that.minimum_attendance_start_time_today <= row_starttime &&  row_starttime < that.minimum_attendance_end_time_today  )
        &&
        !(that.minimum_attendance_end_time_today > row_starttime &&
        that.minimum_attendance_end_time_today <= row_endtime)
      ){
        if(saveFlag){
          return true;
        }
        dialog.showOkDialog("Error", "You are trying to record contact hours outside child attendance hours");
        row.ParentsRequired = 0;
        row.EnrolledOverTwo = 0;
        row.EnrolledUnderTwo = 0;
        row.MinStaffRequired = 0;
        row.MinQualifiedStaffRequired = 0;
        row.QualifiedStaffRequiredMaxFunding = 0;
      }
      //console.log('row',row)
    }

    that.activateAttendanceValidation = function(){

      if(!isContactHours)return;
      $timeout(function() {

        // console.log('that.roster', that.roster);
        // if(!that.roster) return;

        that.minimum_attendance_start_time_today = null;
        that.minimum_attendance_end_time_today = null;

        var date = that.today;
        var date_start = new Date(date);
        date_start.setHours(0,0,0);
        var date_end = new Date(date);
        date_end.setHours(23,59,59);

        var params = {
          query: JSON.stringify({
            Date: {$gte:date_start,$lte:date_end}
          }),
          sort:'+AttendanceTimeStart'
        }

        formlyAdapter.getList('attendance', params).then(function (attendances_for_day){

          if(attendances_for_day && attendances_for_day.length){

            var tmp = _.sortBy(attendances_for_day, 'AttendanceTimeEnd');

            if(attendances_for_day[0] && attendances_for_day[0].AttendanceTimeStart)
              that.minimum_attendance_start_time_today = moment(attendances_for_day[0].AttendanceTimeStart).format('HH:mm');

            if(tmp && tmp.length && tmp[tmp.length-1].AttendanceTimeEnd)
              that.minimum_attendance_end_time_today = moment(tmp[tmp.length-1].AttendanceTimeEnd).format('HH:mm');

            //console.log('attendance', attendances_for_day);
            //console.log('minimum_attendance_start_time_today', that.minimum_attendance_start_time_today);
            //console.log('minimum_attendance_end_time_today', that.minimum_attendance_end_time_today);
          }
        })
      }, 1000);
    }

    function processRoster(roster, copyFrom) {

     console.log('processRoster')
      if(copyFrom){
          roster.Date=that.today;
          roster._id=that.roster._id;
       }
     
      roster.Educators = _.map(roster.Educators, function (e) {
        return e.Educators || e
      });

      _.each(roster.Hours, function (h) {
        if(isContactHours){ 
          h.EnrolledUnderTwo = (h.EnrolledUnderTwo) ? h.EnrolledUnderTwo: computeAttendence(h,'under2');
          h.EnrolledOverTwo =(h.EnrolledOverTwo) ? h.EnrolledOverTwo: computeAttendence(h,'over2');
        }else{
          h.EnrolledUnderTwo = (h.EnrolledUnderTwo) ? h.EnrolledUnderTwo: computeBooked(h,'under2');
          h.EnrolledOverTwo =(h.EnrolledOverTwo) ? h.EnrolledOverTwo: computeBooked(h,'over2');
        }
        
        h.MinStaffRequired=(h.MinStaffRequired) ? h.MinStaffRequired: computeRequired(h);
        h.MinQualifiedStaffRequired=(h.MinQualifiedStaffRequired) ? h.MinQualifiedStaffRequired: computeMinQualifiedStaffRequired(h);
        h.QualifiedStaffRequiredMaxFunding=(h.QualifiedStaffRequiredMaxFunding) ? h.QualifiedStaffRequiredMaxFunding: computeMaxQualifiedStaffFunding(h);
      
        h.EducatorDutyList = _.map(h.EducatorDutyList, function (ed) {
          return ed.EducatorDutyList || ed;
        });
        h.Educators = _.map(h.Educators, function (ed) {

         return ed.Educators || ed;
        });
      
      });
     
      return roster;
    }

    function setupContactHoursAttendance() {
  
      return formlyAdapter.getList('attendance', buildAttendanceParams(that.today)).then(function(data) {
        if ( data && data.length ) {
          that.attendanceList = data;
        }
      })
    }

    function checkLoaded(keepData) {

      return function () {
        that.attendanceList=null;
        if (keepData && that.roster) {
          var _roster = that.roster;
           $timeout(function () {
            that.roster = _roster;
            $timeout(that.checkEducators)
           });
          return;
        }

        getRosterData().then(function (data) {

           $timeout(function () {
            // check if we have a contact hours roster.
            var roster, contactHours;
            that.roster = null;
            var checkroster=false;
            if ( data.length > 0 ) {
              _.each(data, function(d) {
                if (d.IsContactHours ) {
                  contactHours = d;
                } else if (!d.IsContactHours) {
                  roster = d;
                }
              });
              $timeout(that.educatorsRequiredChange);
              $timeout(that.checkEducators);
            }

            if (!isContactHours && roster) { 
                 that.roster = processRoster(roster);
                $timeout(that.educatorsRequiredChange);
               $timeout(that.checkEducators);
            } else if (isContactHours) { 
              if ( roster && !contactHours ) {  
                  checkroster=true;

                  setupContactHoursAttendance().then(function(){
                     that.roster = processRoster(roster);
                     delete that.roster._id;
                     that.roster.IsContactHours = isContactHours;
                     $timeout(that.educatorsRequiredChange);
                    $timeout(that.checkEducators);
                    
                 }) 
                } else if ( contactHours ) {  
                  checkroster=true;
                   setupContactHoursAttendance().then(function(){
                     that.roster = processRoster(contactHours);
                     $timeout(that.educatorsRequiredChange);
                    $timeout(that.checkEducators);
                   
                   });
                    
              }
               
            }
            
            if (!that.roster && !checkroster) { 
              
              if ( isContactHours ) {  
                  setupContactHoursAttendance().then(function(data){
                    that.roster = newRoster();
                    initRoster();
                    that.roster.IsContactHours = isContactHours;
                    contactHours=that.roster;
                    $timeout(that.educatorsRequiredChange);
                    $timeout(that.checkEducators);
                    
                    
                  })
              }
              else{
                  that.roster = newRoster();
                  initRoster();
                  that.roster.IsContactHours = isContactHours;
                   $timeout(that.educatorsRequiredChange);
                  $timeout(that.checkEducators);
                  
              }
               
              
            }
            else{
              if(that.resetVal){

                that.resetVal=false;
                that.roster=updateRoster();
                _.each(that.roster.Hours, function (h) {
                  if(h.Educators && h.Educators.length){

                  }else{
                    h.EnrolledUnderTwo = ( isContactHours ) ? computeAttendence(h,'under2') : computeBooked(h,'under2');
                    h.EnrolledOverTwo = ( isContactHours ) ?computeAttendence(h,'over2') : computeBooked(h,'over2');
                    h.MinStaffRequired=(h.MinStaffRequired) ? h.MinStaffRequired: computeRequired(h);
                    h.MinQualifiedStaffRequired=(h.MinQualifiedStaffRequired) ? h.MinQualifiedStaffRequired: computeMinQualifiedStaffRequired(h);
                    h.QualifiedStaffRequiredMaxFunding=(h.QualifiedStaffRequiredMaxFunding) ? h.QualifiedStaffRequiredMaxFunding: computeMaxQualifiedStaffFunding(h); 
                  }
                  
                })
                $timeout(that.educatorsRequiredChange);
               $timeout(that.checkEducators);
              }
               /*$timeout(that.educatorsRequiredChange);
               $timeout(that.checkEducators);*/
               
            }
         
          });
        });
      }
    }
  function initReport(){

    if(that.reportType=='Weekly'){

        var weeklyDateRange=getWeekdateRange();
        that.weeklyDateRange=weeklyDateRange;
        that.weeklyRoster={};
        if(isContactHours || isWeeklyRoster){

        
            _.each(weeklyDateRange,function(w,k){

               var p = {
                  query: JSON.stringify({
                    Date: getDateParams(w),
                    IsContactHours :true
                  })
                }
                p['sort'] = '+Date'
                formlyAdapter.getList('roster', p).then(function(data){
                    if(data && data.length){
                      var rosterData=processRoster(data[0]);  
                    }else{
                      var rosterData=processRoster(data);  
                    }

                    that.weeklyRoster[k]={Date:w,Hours:rosterData};

                })

            })
            
        }else{

        _.each(weeklyDateRange,function(w,k){
            formlyAdapter.getList('roster', buildAttendanceParams(w)).then(function(data){
                if(data && data.length){
                  var rosterData=processRoster(data[0]);  
                }else{
                  var rosterData=processRoster(data);  
                }

                that.weeklyRoster[k]={Date:w,Hours:rosterData};

            })

        })
      }

    }else{

        formlyAdapter.getList('roster', buildAttendanceParams(that.today)).then(function(data){
              if(data && data.length){
                that.roster=processRoster(data[0]);

                $timeout(function() {
                  that.educatorsRequiredChange();
                  that.checkEducators();
                 });
              }else{
                that.roster=newRoster()
                $timeout(function() {
                  that.educatorsRequiredChange();
                  that.checkEducators();

                 });
                
              }
         }) 
    }
  }
  
  
  that.rosterDateChange=function(){ 
    if(isContactHours){
      that.discretCount=0;
      that.roster=null;
      that.getDiscretionRoster();
      console.log('date changed')
    }
    
    if(isRosterReport){
            $timeout(initReport, 100); 
         }else{ 
             $timeout(initTable, 100);
         }
  }
    var f1 = $scope.$watch(function (scope) {
      return ( that.today );
    }, function() {
    that['todayOpened']=false;
     });
    var f2 = $scope.$watch(function (scope) {
      return ( that.copyFromDate );
    }, function() {
    that['copyFromOpened']=false;
     
    });
    var f3 = $scope.$watch(function (scope) {
      return ( that.reportType );
    }, function() {
       initReport();
    });

   

    $scope.$on('destroy', function () {
      f1();
      f2();
      f3();
    })
    
    function getWeekdateRange(){
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
          return arr;
    }
    

    var getDateParams = function (date) {

      var start = date || that.today;
      var end = date || that.today;
      if ( that.type = "Weekly" && !date ) {
        start = $util.findWeekStart(start);
        end = $util.findWeekEnd(end);
      }

      return {"$gte": timeFix(start, false), "$lte": timeFix(end, true)};
    }

    var timeFix = function (date, setToMidnight) {
      var d = new Date(date.getTime());
      if (setToMidnight) d.setHours(23, 59, 59, 0);
      else d.setHours(0, 0, 0, 0);
      return d;
    }


    var buildMoment = function (time) {
      var h = parseInt(time.split(":")[0], 10), m = parseInt(time.split(":")[1], 10);
      var d = new Date();

      d.setHours(h, m, 0, 0);
      return d;
    }

    that.updateRosterReport = function(b) {
        initReport()
    }

    $timeout(function () {
      formlyAdapter.getModels().then(function () {
        formlyAdapter.getList('eceserviceschedule').then(function(data){
         
           that.eceServiceschedule = fchUtils.getEffectiveServiceSchedule(data,that.today);
           var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
           var todayTimimg=(that.eceServiceschedule && that.eceServiceschedule[days[that.today.getDay()]]) ? that.eceServiceschedule[days[that.today.getDay()]] : null;
           if(todayTimimg && todayTimimg.Scheduled){
            that.startTime=todayTimimg.StartTime;
            that.endTime=todayTimimg.EndTime;
           }
           
        })
        that.dutyListMap={};
        formlyAdapter.getList("dutylist").then(function (data) {
           that.dutyListItems = data;
           _.each(that.dutyListItems, function (e) {
            that.dutyListMap[e._id] = e;
          });
        

          formlyAdapter.getList("parent").then(function (parents) {
            that.parentList = parents;
            //formlyAdapter.getList("educator").then(function (educators) {

            formlyAdapter.getList("staff").then(function (educators) {
               that.educatorList = educators;
             

              
              that.educatorMap = {};
            
              _.each(that.educatorList, function (e) {
                that.educatorMap[e._id] = e;

              });
             
              
              formlyAdapter.getList('child', {populate: 'Room,Educator'}).then(function (kids) {
                that.childlist = kids;
                var user=Auth.getCurrentUser();
                  var currentCentreType=(user.facility && user.facility.CenterType) ? user.facility.CenterType:'';
                  if(currentCentreType=="Playcentre"){
                    var childrenParents=[];
                     that.childlist.map(function(kid){
                            if($util.checkBookingAndEnrolment(kid, true, that.today)){
                               if(kid.ParentGuardians){
                                  kid.ParentGuardians.map(function(kidguardian){
                                      that.parentList.map(function(parent){
                                         if(kidguardian.ParentGuardians==parent._id){
                                           if(parent.isStaffParent && parent.staff && childrenParents.indexOf(parent.staff)==-1){
                                             childrenParents.push(parent.staff);
                                            }
                                           }
                                          
                                       });
                                  });
                                  
                                }
                            };
                         });
                     
                    
                    
                   /* that.educatorList=that.educatorList.filter(function(eduObj){
                          if(childrenParents.indexOf(eduObj._id)!=-1){
                            return true;
                          }
                          return false;
                        
                    });
                    if(!that.educatorList.length){
                      that.educatorList=educators;
                    }*/
                    
                  }
                  that.rosterReportEducator =(that.educatorList && that.educatorList.length) ?  that.educatorList[0]._id : null;
                  formlyAdapter.getList('licenseconfiguration', {query:JSON.stringify({facility:user.facility._id})}).then(function (obj) {
                    that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
                    that.licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,that.today);
                  // todo pull from current facility
                    var centerType =(user.facility && user.facility.CenterType) ? user.facility.CenterType:"Playcentre";
                   var sessionType=that.licenseConfiguration? that.licenseConfiguration.SessionType:'';
                    var p = {query: JSON.stringify({CenterType: centerType,SessionType:sessionType})}
                    formlyAdapter.getList('staffratio', p).then(function (staffratios) {
                      that.staffRatios = staffratios;
                        formlyAdapter.getList("playcentrequalification").then(function (pcqual) {
                        that.playcentreQualifications = pcqual;
                        formlyAdapter.getList("playcentrequalificationcode").then(function (pcqualcode) {
                          that.playcentreQualificationCodes = pcqualcode;
                          that.pcQualCodeMap = {};
                          _.each(that.playcentreQualificationCodes, function (e) {
                            that.pcQualCodeMap[e._id] = e;
                          });
                          return initTable();
                        });
                      });
                    });
                });
              });
            });
          });
        })
      });
    });


    function getRosterData() {

      if(isContactHours){
        that.activateAttendanceValidation();
      }

      return formlyAdapter.getList('roster', buildAttendanceParams(that.today));
    }

    that.getAbsenceCode = function (code) {
      return;
    }

    that.filterChange = function () {
      $timeout(initTable, 100);
    };


    that.print = function () {
      if(that.reportType=='Daily'){
            var educatorsLength=that.roster.Educators.length;
            var totalpages=2 * Math.floor(educatorsLength/5);
            var lastPageEducators=educatorsLength%5;
            if(lastPageEducators>0){
              totalpages++;
            }
            var pageHtml=[];
            var x=0;
            var printPage=0;
            for(var i=1; i<=totalpages;i++){
              if(i%2!=0){ printPage++; }
              
                var html='<table  class="table table-bordered table-vmiddle no-print-padding" ng-if="!roster.hideRoster">'+
               '<thead>'+
               '<tr>'+
               '<th class="roster-header print-padding">'+
               '<span>Hours</span>'+
               '</th>';
               _.each(that.getParentHeaders(),function(h,l){
                html+='<th class="roster-header" style="min-width:"'+that.getHeaderWidths()[l]+'"px; text-align:center;">'+
               '<span>'+h+'</span>'+
               '<span ng-if="val.indexOf(\'Parent \')>-1">'+
               //'<select class="form-control"  ng-options="a._id as a.GivenName+' '+a.FamilyNameSurname for a in roster.parentList"></select>'+
              '</span>'+
               '</th>';
               });
               
               _.each(that.getEducatorHeaders(),function(val,n){
                if(printPage%2==0){
                    if(n>=5){
                        html+='<th colspan="2" style="text-align:center;"  class="roster-header">'+
                     '<span>Staff/'+val+'</span>'+
                     '</th>';
                    }
                }else{
                    if(n<5){
                    html+='<th colspan="2" style="text-align:center;"  class="roster-header">'+
                     '<span>Staff/'+val+'</span>'+
                     '</th>';
                    }
                }
                

               })
               
               html+='</tr></thead>'+
              '<tbody>';
              
              _.each(that.getHours(),function(w,m){
                if(printPage%2==0 && i%2==0){
                      if(m>=(that.getHours().length/2)){
                         html+='<tr class="no-print-padding">'+
                        '<td data-title="Hours" class="print-padding">'+
                        '<span>'+that.getTimeLabel(w.StartTime)+ ' to '+ that.getTimeLabel(w.EndTime)+'</span>'+
                        '</td>';
                        if(that.getParentHeaders().length){
                          html+='<td ng-if="roster.getParentHeaders().length"><span></span></td>';
                        }
                        _.each(that.getEducatorDutyList(w),function(edu,k){
                         if(k/2>=5){ 
                           html+='<td title="Dutylist" class="no-print-padding">';
                            if(k%2==0 && edu && !edu.filler){
                              html+='<div>'+that.getEducatorName(w.Educators[(k)/2]) +'</div>';
                            }
                            if(k%2!=0 && edu && !edu.filler){
                              html+='<div>'+that.dutyListMap[w.EducatorDutyList[(k-1)/2]].Name+'</div>'
                            }
                            html+='</td>';
                         }
                        })
                        html+='</tr>';
                    }
                }else if(printPage%2!=0 && i%2==0){
                     if(m>=(that.getHours().length/2)){
                         html+='<tr class="no-print-padding">'+
                        '<td data-title="Hours" class="print-padding">'+
                        '<span>'+that.getTimeLabel(w.StartTime)+ ' to '+ that.getTimeLabel(w.EndTime)+'</span>'+
                        '</td>';
                        if(that.getParentHeaders().length){
                          html+='<td ng-if="roster.getParentHeaders().length"><span></span></td>';
                        }
                        _.each(that.getEducatorDutyList(w),function(edu,k){
                         if(k/2<5){
                           html+='<td title="Dutylist" class="no-print-padding">';
                            if(k%2==0 && edu && !edu.filler){
                              html+='<div>'+that.getEducatorName(w.Educators[(k)/2]) +'</div>';
                            }
                            if(k%2!=0 && edu && !edu.filler){
                              html+='<div>'+that.dutyListMap[w.EducatorDutyList[(k-1)/2]].Name+'</div>'
                            }
                            html+='</td>';
                         }
                        })
                        html+='</tr>';
                    }
                }else{
                      if(m<(that.getHours().length/2)){
                         html+='<tr class="no-print-padding">'+
                        '<td data-title="Hours" class="print-padding">'+
                        '<span>'+that.getTimeLabel(w.StartTime)+ ' to '+ that.getTimeLabel(w.EndTime)+'</span>'+
                        '</td>';
                        if(that.getParentHeaders().length){
                          html+='<td ng-if="roster.getParentHeaders().length"><span></span></td>';
                        }
                        _.each(that.getEducatorDutyList(w),function(edu,k){
                          if(printPage%2==0 && i%2!=0){
                            if(k/2>=5){
                               html+='<td title="Dutylist" class="no-print-padding">';
                                if(k%2==0 && edu && !edu.filler){
                                  html+='<div>'+that.getEducatorName(w.Educators[(k)/2]) +'</div>';
                                }
                                if(k%2!=0 && edu && !edu.filler){
                                  html+='<div>'+that.dutyListMap[w.EducatorDutyList[(k-1)/2]].Name+'</div>'
                                }
                                html+='</td>';
                             }
                          }else{
                              if(k/2<5){
                               html+='<td title="Dutylist" class="no-print-padding">';
                                if(k%2==0 && edu && !edu.filler){
                                  html+='<div>'+that.getEducatorName(w.Educators[(k)/2]) +'</div>';
                                }
                                if(k%2!=0 && edu &&  !edu.filler){
                                  html+='<div>'+that.dutyListMap[w.EducatorDutyList[(k-1)/2]].Name+'</div>'
                                }
                                html+='</td>';
                             }
                          }
                         
                        })
                        html+='</tr>';
                    }
                }
                
               
              })

                html+='</tbody></table>';
                pageHtml[x]= html; 
                x++;
          
            }

            if(pageHtml.length){
              var title = "Print View";
              var mywindow = window.open('', title);
                _.each(pageHtml,function(html,j){
                    if(j>0){
                      mywindow.document.write('<div class="page-break"></div>')
                    }
                    mywindow.document.write('<html><head><title>'+title+'</title>');

                    var css = '<link href="/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">'+
                    ' <link href="/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">'+
                    ' <link href="/vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css" rel="stylesheet">'+
                    ' <link href="/vendors/bower_components/angular-loading-bar/src/loading-bar.css" rel="stylesheet">'+
                    ' <link rel="stylesheet" type="text/css" href="/vendors/bower_components/angular-ui-grid/ui-grid.min.css">'+
                    ' <link rel="stylesheet" href="/components/formly/formly.css">'+
                    ' <link rel="stylesheet" href="/css/legacyapp.css">'+
                    ' <link rel="stylesheet" type="text/css" media="print" href="/css/print.css" />'+
                      ' <link href="css/app.min.css" rel="stylesheet" id="app-level">'+
                    ' <link href="css/demo.css" rel="stylesheet">';
                    
                    if(isContactHours){
                      var headerTitle = 'Contact Hours';
                    }else{
                      var headerTitle = that.reportType;
                    }

                    var header='<div class="container">'+
                    '<div class="col-md-12" style="text-align:center;margin-top:20px;">'+headerTitle+' Roster Report</div>'+
                    '<div class="row"><div class="col-md-3 logo-box" style=" float:left;">'
                    +'<img style="float:left;width:200px;" src="img/logo/juniorlogo2.png" alt="" class=""></div>';
                   
                    if(Auth.getCurrentUser().facility){
                       var centreName=Auth.getCurrentUser().facility.name;
                        header+='<div class="col-md-6 center-name-top" style="text-align: center;font-size: 21px; color: #000; margin: 49px 0 0 0; float:left; width:50%;">'+centreName+'</div>';
                     } 
                      header+='<div class="col-md-3 date-top">'+moment(that.today).format('DD-MM-YYYY')+'</div>'; 
                      header+='</div></div>';
                      mywindow.document.write(css);
                      mywindow.document.write('<style>.roster-header{min-width:0}</style></head><body class="landscape">');
                      mywindow.document.write(header);
                      mywindow.document.write(html);
                      mywindow.document.write('</body></html>');

                       // necessary for IE >= 10
                      
                })   
                mywindow.document.close();
                mywindow.focus(); // necessary for IE >= 10

                setTimeout(function() {
                  mywindow.print();
                }, 1000);

             }

            
         }else if(that.reportType=='Weekly') {  // closing daily report   
          
            //var html = document.getElementById("datatable").innerHTML.replace("height500", "");
            // var totalpages=2;
            var totalpages=1;
            var pageHtml=[];
            var x=0;
           for(i=1;i<=totalpages;i++){
               var html='<table  class="table table-bordered table-vmiddle no-print-padding" style="margin-top: 20px;">'
               +'<thead><tr><th class="roster-header"><span>Hours</span></th>';
             _.each(that.weeklyDateRange,function(w){
                 html+='<th class="roster-header"><span>'+moment(w).format("DD-MM-YYYY")+'</span></th>';
              })
              html+='</tr></thead><tbody>';
              _.each(that.roster.Hours,function(w,m){

                html+='<tr class="no-print-padding"><td class="no-print-padding">'+'<span>'+that.getTimeLabel(w.StartTime)+' to '+ that.getTimeLabel(w.EndTime)+'</span></td>';
                
                _.each(that.weeklyDateRange,function(d){
                  html+='<td class="no-print-padding spanPadding">'+'<span>'+that.getDuty(d, w)+'</span>'+'</td>';
                })  
                html+='</tr>';
                
                  // if(i%2==0){
                  //   if(m>=(that.roster.Hours.length/2)){
                  //       html+='<tr class="no-print-padding"><td class="no-print-padding">'+'<span>'+that.getTimeLabel(w.StartTime)+' to '+ that.getTimeLabel(w.EndTime)+'</span></td>';
                  //     _.each(that.weeklyDateRange,function(d){
                  //         html+='<td class="no-print-padding spanPadding">'+'<span>'+that.getDuty(d, w)+'</span>'+'</td>';
                  //     })  
                  //      html+='</tr>';
                  //   }
                  // }else{
                  //     if(m<(that.roster.Hours.length/2)){
                  //       html+='<tr class="no-print-padding"><td class="no-print-padding">'+'<span>'+that.getTimeLabel(w.StartTime)+' to '+ that.getTimeLabel(w.EndTime)+'</span></td>';
                  //     _.each(that.weeklyDateRange,function(d){
                  //         html+='<td class="no-print-padding spanPadding">'+'<span>'+that.getDuty(d, w)+'</span>'+'</td>';
                  //     })  
                  //      html+='</tr>';
                  //   }
                  // }
                  
                });


               html+='</tbody></table>';
               pageHtml[x]= html; 
               x++;
            }

             if(pageHtml.length){
              var title = "Print View";
              var mywindow = window.open('', title);
              
              var edu_name = _.where(that.educatorList, {'_id': that.rosterReportEducator});
              if(edu_name && edu_name.length){

                edu_name = edu_name[0];
                edu_name = edu_name.FirstName+' '+edu_name.LastName;
              }
              if(!edu_name) edu_name='';

              var header   = '';
                _.each(pageHtml,function(html,j){
                    if(j>0){
                      mywindow.document.write('<div class="page-break"></div>')
                    }
                    if(j==0){

                    mywindow.document.write('<html><head><title>'+title+'</title>');

                    var css = '<link href="/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">'+
                    ' <link href="/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">'+
                    ' <link href="/vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css" rel="stylesheet">'+
                    ' <link href="/vendors/bower_components/angular-loading-bar/src/loading-bar.css" rel="stylesheet">'+
                    ' <link rel="stylesheet" type="text/css" href="/vendors/bower_components/angular-ui-grid/ui-grid.min.css">'+
                    ' <link rel="stylesheet" href="/components/formly/formly.css">'+
                    ' <link rel="stylesheet" href="/css/legacyapp.css">'+
                    ' <link rel="stylesheet" type="text/css" media="print" href="/css/print.css" />'+
                      ' <link href="css/app.min.css" rel="stylesheet" id="app-level">'+
                    ' <link href="css/demo.css" rel="stylesheet">';
                    
                    if(isContactHours){
                      var headerTitle = 'Contact Hours';
                    }else{
                      var headerTitle = that.reportType;
                    }

                    header='<div class="container">'+
                    '<div class="col-md-12" style="text-align:center;margin-top:20px;">'+headerTitle+' Roster Report</div>'+
                    '<div class="row"><div class="col-md-3 logo-box" style=" float:left;">'
                    +'<img style="float:left;width:200px;" src="img/logo/juniorlogo2.png" alt="" class=""></div>';
                   
                    if(Auth.getCurrentUser().facility){
                       var centreName=Auth.getCurrentUser().facility.name;
                        header+='<div class="col-md-6 center-name-top" style="text-align: center;font-size: 21px; color: #000; margin: 49px 0 0 0; float:left; width:50%;">'+centreName+'</div>';
                     } 
                       var weekrange=getWeekdateRange();
                      header+='<div class="col-md-3 date-top">'+
                      moment(weekrange[0]).format('DD-MM-YYYY')
                      +'-  to -'+
                      moment(weekrange[weekrange.length-1]).format('DD-MM-YYYY') 
                      +'<div class="edu-name text-right" style="margin-top:35px;text-transform:capitalize">'
                      +edu_name
                      +'</div>'
                      +'</div>'; 
                      header+='</div></div>';
                      mywindow.document.write(css);
                      mywindow.document.write('<style>.roster-header{min-width:0}</style></head><body class="landscape">');
                      mywindow.document.write(header);
                    }
                      mywindow.document.write(html);
                      mywindow.document.write('</body></html>');

                       // necessary for IE >= 10
                      
                })   
                mywindow.document.close();
                mywindow.focus(); // necessary for IE >= 10

                setTimeout(function() {
                  mywindow.print();
                }, 1000);

             }
           
            
              /*var title = "Print View";
              var mywindow = window.open('', title);
              mywindow.document.write('<html><head><title>'+title+'</title>');

              var css = '<link href="/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">'+
              ' <link href="/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">'+
              ' <link href="/vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css" rel="stylesheet">'+
              ' <link href="/vendors/bower_components/angular-loading-bar/src/loading-bar.css" rel="stylesheet">'+
              ' <link rel="stylesheet" type="text/css" href="/vendors/bower_components/angular-ui-grid/ui-grid.min.css">'+
              ' <link rel="stylesheet" href="/components/formly/formly.css">'+
              ' <link rel="stylesheet" href="/css/legacyapp.css">'+
              ' <link rel="stylesheet" type="text/css" media="print" href="/css/print.css" />'+
                ' <link href="css/app.min.css" rel="stylesheet" id="app-level">'+
              ' <link href="css/demo.css" rel="stylesheet">';
              
              if(isContactHours){
                var headerTitle = 'Contact Hours';
              }else{
                var headerTitle = that.reportType;
              }

              var header='<div class="container">'+
              '<div class="col-md-12" style="text-align:center;">'+headerTitle+' Roster Report</div>'+
              '<div class="row"><div class="col-md-3 logo-box" style=" float:left;">'
              +'<img style="float:left;width:200px;" src="img/logo/juniorlogo2.png" alt="" class=""></div>';
             
              if(Auth.getCurrentUser().facility){
                 var centreName=Auth.getCurrentUser().facility.name;
                  header+='<div class="col-md-6 center-name-top" style="text-align: center;font-size: 21px; color: #000; margin: 49px 0 0 0; float:left; width:50%;">'+centreName+'</div>';
               } 
                 var weekrange=getWeekdateRange();
                header+='<div class="col-md-3 date-top">'+moment(weekrange[0]).format('DD-MM-YYYY')+'-  to -'+moment(weekrange[weekrange.length-1]).format('DD-MM-YYYY') +'</div>'; 
                header+='</div></div>';
                mywindow.document.write(css);
                mywindow.document.write('<style>.roster-header{min-width:0}</style></head><body class="landscape">');
                mywindow.document.write(header);
                mywindow.document.write(html);
                mywindow.document.write('</body></html>');

                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10

                setTimeout(function() {
                  mywindow.print();
                  //mywindow.close();
                }, 1000);*/
          
         }
         
      

      
      

      return true;
    }

    that.reset = function () {
      that.roster = null;
      that.resetVal=true;
      initTable();
    }

    that.clearAll = function () {
      that.roster.Educators=[];
      _.each(that.roster.Hours,function(h){
        h.Educators=[];
      })
      /*var id = that.roster._id;
      that.roster = newRoster();
      that.roster._id = id;
      initRoster();
      initTable(true);*/
    }

    var buildAttendanceParams = function (date) {
      var p = {
        query: JSON.stringify({
          Date: getDateParams(date),
        })
      }
      p['sort'] = '+Date'
      return p;
    };
    that.copyFromDate = new Date(that.today.getTime()-(24*60*60*1000));


    that.copyFrom = function () {
      if ( !that.copyFromDate ) return;

      formlyAdapter.getList('roster', buildAttendanceParams(that.copyFromDate)).then(function(d) {
        if ( !d || !d.length ) {
          growlService.growl("No Roster Found on that date!", "danger");
        }
        else {
          
          that.roster = processRoster(d[0],true);
         
          $timeout(function() {
            that.educatorsRequiredChange();
            that.checkEducators();
            //$timeout(that.save);
          });
        }
      });

      // var id = that.roster._id;

      // that.roster._id = id;
      // initRoster();
      // initTable(true);
    }

    var _filterFiller = function (w) {
      return typeof(w) === "string";
    }
    function educatorsDuplicatedHours(){
     
      var dupe=false;
      _.each(that.roster.Hours,function(h,i){
               var ed=h.Educators;
                 if(ed && ed.length){
                   var edCount={};
                  _.each(ed,function(edu){
                   if(typeof(edu)!='object'){
                      if (!edCount[edu]) {
                      edCount[edu]=1;
                    } else edCount[edu]++;
                      dupe = dupe || (edCount[edu] > 1);
                        if(dupe){
                        return false;
                      }
                    }
                    
                  })
                }
     
        })
      
       
      return dupe;
    }

    function attendanceOutSideHours(){
     
      var outsideFlag=false;
      _.each(that.roster.Hours,function(h,i){
              if(that.validateAttendance(h,true)){
                if(h.EnrolledOverTwo || h.EnrolledUnderTwo){
                  outsideFlag=true;
                  return false;
                }
              }
     
        })
      
       
      return outsideFlag;
    }


    function educatorsDuplicated() {
      var edCount = {};
      var dupe = false;
      for ( var i = 0; i < that.getMaxEducators(); i++ ) {
        var ed = that.roster.Educators[i];
        if (!edCount[ed]) {
          edCount[ed]=1;
        } else edCount[ed]++;
        dupe = dupe || (edCount[ed] > 1);
      }

      return dupe;
    }

    that.save = function () {
     //educatorsDuplicatedHours();
      if ( educatorsDuplicatedHours() ) {
        growlService.growl("Cannot have duplicate educators", "danger");
        return;
      }

       if ( attendanceOutSideHours() ) {
        growlService.growl("You are trying to record contact hours outside child attendance hours", "danger");
        return;
      }
    

      var _roster = angular.copy(that.roster);

      _.each(_roster.Hours, function (w) {
        w.EducatorDutyList = _.filter(w.EducatorDutyList, _filterFiller);
        w.ParentDutyList = _.filter(w.ParentDutyList, _filterFiller);
        w.Educators = _.filter(w.Educators, _filterFiller);
     
      });

      _roster.Educators = that.roster.Educators.filter(function (val) {
        return val
      });
      if(isContactHours){
        _roster.DiscretionCount=that.discretCount;
      }
      formlyAdapter.saveObject("roster", _roster, _roster._id).then(function (d) {
        that.roster = processRoster(d.data);
        if(isContactHours){
          formlyAdapter.saveObject('usereventlogs',{EventDate:new Date(that.roster.Date),EventType:'Contact Hours',EventDescription:"Saved Contact Hours"}).then(function(u){
                  
          })
        }
        initTable();
        growlService.growl('Saved Succesfully!', 'success');
      }, function (err) {
        growlService.growl("Error Saving: " + err, "danger")
      });
    }


  });