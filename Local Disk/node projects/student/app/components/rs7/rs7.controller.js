'use strict';


angular.module('sms.rs7', ['cfp.loadingBar'])

  .controller('RS7Ctrl', function RS7Ctrl($rootScope,$scope, $timeout, popup, dialog, $util, formlyAdapter, $state,
                                          fchUtils,$location, $q, Auth, moment, facilityService, ELI, growlService,cfpLoadingBar) {

    var that = this;

    var currPage = 0;
    that.pages = ['Prerequisite Check', 'Daily Data Screen', 'Advance Days', 'Attestation', 'Declaration'];

    that.getPage = function() {
      return 'components/rs7/rs7page'+(currPage+1)+".html";
    }

    that.getStepStyle = function(idx) {
      if ( idx == currPage ) return {"font-weight":"bold"};
      return {};
    }


    /**
     *                     <tr ng-repeat="row in rs7.getDailyData(month)">
     <td>{{row.day}}</td>
     <td>{{row.date}}</td>
     <td>{{row.under2}}</td>
     <td>{{row.over2}}</td>
     <td>{{row.twentyHoursECE}}</td>
     <td>{{row.plus10}}</td>
     <td>{{row.eceTotal}}</td>
     <td ng-if="!rs7.hideSHC()">{{row.registered}}</td>
     <td ng-if="!rs7.hideSHC()">{{row.nonRegistered}}</td>
     <td ng-if="!rs7.hideSHC()">{{row.shcTotal}}</td>
     * @param month
     */
    that.getDailyData = function(month) {
      if ( that.dailyData ) return that.dailyData[month];
      else return [];
    }

    that.monthlySums = {};
    that.getMonthlyTotal = function(month, field) {
      if ( !that.dailyData ) return 0;

      if (!that.monthlySums[month]) {
        return 0;
      } else return that.monthlySums[month][field];
    }

    //Mon Feb 01 2016 00:00:00 GMT-0700 (MST)
    function normalizeMatrix(object) {
      var obj = {};
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          var m = moment(property, "ddd MMM D YYYY");
          if (m.isValid()) {
            obj[m.format("D-M-YY")] = object[property];
          } else {
            obj[property] = object[property];
          }
        }
      }
      return obj;
    }

    function initDailyData() {
      that.dailyData = {};
      var chain=$q.when();
      _.each(that.getPayPeriodMonths(), function(month) {
        chain=chain.then(function(){
           cfpLoadingBar.start();
            var m = moment("01 "+month, "DD MMM YYYY");
            var d = m.format("D");
            return fchUtils.getMonthlyFch(m.toDate(),that.licenseDetails,that.centerstatusData,that.eceserviceschedule).then(function(matrix) {
              $timeout(function () {
                var monthlyMatrix = normalizeMatrix(matrix);

                that.dailyData[month] = [];

                do {
                  var obj = {};
                  obj.day = m.format("dddd");
                  obj.date = m.format("D-M-YY");
                  var w = obj.date;

                  // get monthly fch via service here
                  var dayMatrix = monthlyMatrix[w];
                  obj.under2 = dayMatrix ? dayMatrix.total_ecefuncding_under_two : 0;
                  obj.over2 = dayMatrix ? dayMatrix.total_ecefuncding_over_two_and_less_six : 0;
                  obj.twentyHoursECE = dayMatrix ? dayMatrix.total_ecetwenty_hours : 0;
                  obj.plus10 = dayMatrix ? dayMatrix.total_plus_ten_hours : 0;

                  // todo

                  obj.eceTotal = 0;
                  // obj.registered = 0;
                  // obj.nonRegistered = 0;
                  // obj.shcTotal = 0;
                  obj.shcTotal      = dayMatrix ? (dayMatrix.shcTotal ? dayMatrix.shcTotal           : 0) :0;
                  obj.registered    = dayMatrix ? (dayMatrix.registered ? dayMatrix.registered       : 0) :0;
                  obj.nonRegistered = dayMatrix ? (dayMatrix.nonRegistered ? dayMatrix.nonRegistered : 0) :0;
                  obj.remarks = '--';

                  that.dailyData[month].push(obj);
                  m.add(1, 'd');
                  d = m.format("D");
                } while (d != 1);

                that.monthlySums[month] = {
                  under2: 0,
                  over2: 0,
                  twentyHoursECE: 0,
                  plus10: 0,
                  eceTotal: 0,
                  registered: 0,
                  nonRegistered: 0,
                  shcTotal: 0
                }

                _.each(that.dailyData[month], function(day) {
                  _.each(Object.keys(that.monthlySums[month]), function(key) {
                    that.monthlySums[month][key] += day[key];
                  });
                });

              });
        });
        })
      })

      chain.then(function(){
        cfpLoadingBar.complete();
      })
      /*_.each(that.getPayPeriodMonths(), function(month) {
        var m = moment("01 "+month, "DD MMM YYYY");
        var d = m.format("D");
        fchUtils.getMonthlyFch(m.toDate(),that.licenseDetails,that.centerstatusData).then(function(matrix) {
          $timeout(function () {
            var monthlyMatrix = normalizeMatrix(matrix);

            that.dailyData[month] = [];

            do {
              var obj = {};
              obj.day = m.format("dddd");
              obj.date = m.format("D-M-YY");
              var w = obj.date;

              // get monthly fch via service here
              var dayMatrix = monthlyMatrix[w];
              obj.under2 = dayMatrix ? dayMatrix.total_ecefuncding_under_two : 0;
              obj.over2 = dayMatrix ? dayMatrix.total_ecefuncding_over_two_and_less_six : 0;
              obj.twentyHoursECE = dayMatrix ? dayMatrix.total_ecetwenty_hours : 0;
              obj.plus10 = dayMatrix ? dayMatrix.total_plus_ten_hours : 0;

              // todo
              obj.eceTotal = 0;
              obj.registered = 0;
              obj.nonRegistered = 0;
              obj.shcTotal = 0;
              obj.remarks = '--';

              that.dailyData[month].push(obj);
              m.add(1, 'd');
              d = m.format("D");
            } while (d != 1);

            that.monthlySums[month] = {
              under2: 0,
              over2: 0,
              twentyHoursECE: 0,
              plus10: 0,
              eceTotal: 0,
              registered: 0,
              nonRegistered: 0,
              shcTotal: 0
            }

            _.each(that.dailyData[month], function(day) {
              _.each(Object.keys(that.monthlySums[month]), function(key) {
                that.monthlySums[month][key] += day[key];
              });
            });

          });
        });
      });*/
    }
    var f1 = $scope.$watch(function (scope) {
      return ( that.selectedPayPeriod );
    }, function(){
      that.dailyData=null;      
    });

    $scope.$on('destroy', function () {
      f1();
     
    })
   

    that.dailyData = null;
    function checkPage() {
      Auth.updateSessionTimeout();
      if (currPage == 1 && that.dailyData == null) {
         initDailyData();
      }
    }

    that.back = function() { 
      if ( currPage == 4 && that.facility.CenterType != 'Centre based' ) currPage--;
      currPage--;
      checkPage();
    }


    that.continue = function() {
      if ( currPage == 2 && that.facility.CenterType != 'Centre based' ) currPage++;
      currPage++;
      checkPage();

      if(currPage==2){

        setAdvanceDaysOptions();
      }
    }



    that.cancel = function() {
      currPage = 0;
    }


    //// Page 1
    that.getSubmitWithinDates = function(startDate) {
      if ( !that.selectedPayPeriod ) return;
      else if (startDate) return moment(that.selectedPayPeriod.RS7SubmissionNotification).format("MMM D");
      else return moment(that.selectedPayPeriod.CutOffDate).format("MMM D");
    }

    var rs7Map = {};
    that.isSubmitted = function() {
      if ( !that.selectedPayPeriod ) return '--';
      var year=new Date(that.selectedPayPeriod.RS7SubmissionNotification).getFullYear();
      var payperiodMonth=that.selectedPayPeriod.StartPayPeriodMonth;
      if(payperiodMonth.toLowerCase()=='oct'){
          year=year-1;
      }
       //var start = moment("01 "+that.selectedPayPeriod.StartPayPeriodMonth+" "+new Date().getFullYear(), "DD MMM YYYY");
      var start = moment("01 "+that.selectedPayPeriod.StartPayPeriodMonth+" "+year, "DD MMM YYYY");
     
      var lookup = start.format("YYYY-MM-DD");
      return rs7Map[lookup] || 'N/A';
    }


    that.facility_all_license = [];
    facilityService.getLicensing().then(function (licenseDetails){

      if(licenseDetails && licenseDetails.length && licenseDetails[0].LicensingConfiguration){

        that.facility_all_license=licenseDetails[0].LicensingConfiguration;
        that.facility_all_license =  _.sortBy(that.facility_all_license, function (conf){
          return conf.EffectiveStartDate;
        });
      }
    });

    //// Page 2
    function getEffectiveLicenseConfiguration (day_of_month){

      var conf = null;
      var tmp = that.facility_all_license;
      tmp     = _.filter(tmp, function (one_license_configuration){

        var start = moment(one_license_configuration.EffectiveStartDate);
        if(start.isBefore(day_of_month, 'day') || start.isSame(day_of_month, 'day'))
        return one_license_configuration;
      });

      if(tmp && tmp.length)
      conf = tmp[tmp.length-1];

      return conf;
    }

    that.hideSHC = function(day, monthdate) {

      var flag = true;
      if(that.facility.CenterType == 'Kindergarten'){

        if(day){
  
          day = moment(day,"D-M-YY");
          if( that.isAllDay(day) || that.isMixed(day) ){

            flag = false;
          }
        } else if(monthdate){

          /*check global license*/
          monthdate = monthdate.split(' ');
          var date_build = moment().month(monthdate[0]).year(monthdate[1]).endOf('month');

          var effective_license = getEffectiveLicenseConfiguration(date_build);
          // console.log('date_build',date_build)
          // console.log('effective_license',effective_license)
          if(effective_license && effective_license.SessionType){

            var session_type = effective_license.SessionType;
            if(session_type == 'All Day' || session_type == 'Mixed')
            flag = false;
          }

        }      
      } else if(that.facility.CenterType == 'Centre based'){
        
        flag = false;
      }
      return flag;
      // return (that.isKinder() && that.isSessional(day)) ||
      //   that.isHBorPC();
    }

    that.isHBorPC = function() {
      return that.facility.CenterType == "Home Based" || that.facility.CenterType == 'Playcentre';
    }

    that.isCB = function() {
      return that.facility.CenterType == "Centre Based";
    }

    that.isHB = function() {
      return that.facility.CenterType == "Home Based";
    }

    that.isPC = function() {
      return that.facility.CenterType == "Playcentre";
    }

    that.isSessional = function(dayd) {
      var day = dayd.format("D");
       var currDay = dayd.format("dddd");
        //var sch = that.serviceSchedule[currDay];
        var sch = that.serviceScheduleMap.match(dayd.format("YYYY-MM-DD"))[currDay];
      return  sch && sch.Scheduled && sch.SessionType == 'Sessional';
     // return that.facility.SessionType == 'Sessional';
    }

    that.isKinder = function() {
      return that.facility.CenterType == 'Kindergarten';
    }

    that.isAllDay = function(m) {
      var day = m.format("D");
       var currDay = m.format("dddd");
        //var sch = that.serviceSchedule[currDay];
        var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[currDay];
      return  sch && sch.Scheduled && sch.SessionType =='All Day';
      //return that.facility.SessionType == 'All Day';
    }

    that.isMixed = function(m) {
       var day = m.format("D");
       var currDay = m.format("dddd");
        //var sch = that.serviceSchedule[currDay];
        var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[currDay];
      return  sch && sch.Scheduled && sch.SessionType =='Mixed';
      //return that.facility.SessionType == 'Mixed';
    }

    that.showAllDayAdvance = function(month) {
      
      if(!moment.isMoment(month)){

        month = month.split(' ');
        month = moment().month(month[0]).year(month[1]);
      }
      return !that.isHBorPC() && (that.isAllDay(month) || that.isMixed(month));
    }

    that.showSessionalAdvance = function(month) {
      return !that.isPC() || !(that.isKinder() && (that.isAllDay(month) || that.isMixed(month)));
    }

    //// Page 3
    function setAdvanceDaysOptions(){

      var advanceMonths = that.getAdvanceMonths();

      that.data                   = {};
      var monthdate               = advanceMonths[advanceMonths.length-1].split(' ');
      var date_build              = moment().month(monthdate[0]).year(monthdate[1]).endOf('month');
      var effective_license       = getEffectiveLicenseConfiguration(date_build);
      that.data.effective_license = effective_license;

      that.data.titles = [];
      that.data.months = [];
      if(that.data.effective_license.SessionType == 'All Day'){

        that.data.all_day   = {};
        that.data.titles.push('All Day');
      } else if(that.data.effective_license.SessionType == 'Sessional'){
        
        that.data.sessional = {};
        if(that.facility.CenterType == 'Playcentre')
        that.data.titles.push('Parentled');
        else
        that.data.titles.push('Sessional');
      } else if(that.data.effective_license.SessionType == 'Mixed'){

        that.data.all_day   = {};
        that.data.sessional = {};
        that.data.titles.push('All Day');

        if(that.facility.CenterType == 'Playcentre')
        that.data.titles.push('Parentled');
        else
        that.data.titles.push('Sessional');
      }

      advanceMonths.forEach(function (month){

        that.data.months.push(month);
  
          if(that.data.all_day){

            if(!that.data.all_day[month])that.data.all_day[month] ={};
            that.data.all_day[month].max_days = that.getMaxDaysMonth(month)
            that.data.all_day[month].funded_days = that.getAdvanceDaysInMonth(month, 'All Day');
          }

          if(that.data.sessional){

            if(!that.data.sessional[month])that.data.sessional[month] ={};
            that.data.sessional[month].max_days = that.getMaxDaysMonth(month)
            that.data.sessional[month].funded_days = that.getAdvanceDaysInMonth(month, 'Sessional');
          }
      });
    } 

    function getMonths(d) {
      var arr = [];
      var year=new Date(that.selectedPayPeriod.RS7SubmissionNotification).getFullYear();
      // in case user selected the payment cycle from oct-jan
      if(d.toLowerCase()=='oct'){
         year=new Date().getFullYear()-1;
      }
      var start = moment("01 "+d+" "+year, "DD MMM YYYY");
      for (var i = 0; i < 4; i++ ) {
        arr.push(moment(start).format("MMM YYYY"));
        start = moment(start).add(1, "months");
      }
      return arr;
    }
    that.getYear=function(d,date){
      if(d.toLowerCase()=='oct'){
        return new Date(date).getFullYear()-1;  
      }
      return new Date(date).getFullYear();
    }
    that.getPayPeriodMonths = function() {
      return getMonths(that.selectedPayPeriod.StartPayPeriodMonth);
    }

    that.getAdvanceMonths = function() {
      return getMonths(that.selectedPayPeriod.StartAdvanceMonth);
    }



    that.getMaxDaysMonth = function(month) {

      var m = moment("01 "+month, "DD MMM YYYY");
      var count = 0;
      var day = m.format("D");
      var hols = fchUtils.calculateHolidays(month, that.holidayList);
      var holMap = {};
      _.each(hols, function(hol) {
        holMap[hol.format("D")] = hol.format("dddd");
      })

      console.log('---------------------')
      console.log('month', month)
      var dd = _.pluck(that.holidayList, 'Date')
      console.log('that.holidayList', dd)
      console.log('holMap', holMap)
      console.log('hols', hols)

      do {
        var currDay = m.format("ddd");
        var currDayFmt = m.format("dddd");
         var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[currDayFmt];
        if ( sch && sch.Scheduled && currDay != "Sat" && currDay != "Sun" && (!holMap[day] || !holMap[day] == currDayFmt)  ) count++;

        m.add(1, 'days');
        day = m.format("D");
      } while ( day > 1 )

      return count;
    }


    var advanceDaysCache = {};

    that.getAdvanceDaysInMonth = function(month, type) {
      if ( advanceDaysCache[month+type] ) return advanceDaysCache[month+type];
      var m = moment("01 "+month, "DD MMM YYYY");
      var count = 0;
      var hols = fchUtils.calculateHolidays(month, that.holidayList);

      var holMap = {};
      _.each(hols, function(hol) {
        holMap[hol.format("D")] = hol.format("dddd");
      })

      var day = m.format("D");
      do {
        var currDay = m.format("dddd");
        //var sch = that.serviceSchedule[currDay];
        var sch = that.serviceScheduleMap.match(m.format("YYYY-MM-DD"))[currDay];
        if ( sch && sch.Scheduled && (sch.SessionType == 'Both' || type == sch.SessionType) && (!holMap[day] || !holMap[day] == currDay) ) {
          if ( !fchUtils.matchesTempClosure(m, that.closures) ) {
            count++;
          }
        }
        m.add(1, 'days');
        day = m.format("D");
      } while ( day > 1 );

      advanceDaysCache[month+type] = count;
      return count;
    }



    //// Page 4
    that.attestationAnswer = null;
    that.attestation = function(answer) {
      that.attestationAnswer = answer;
    }

    that.getAttestationStyle = function(b) {
      if ( that.attestationAnswer == null ) return {};
      else if ( b == that.attestationAnswer ) return { 'font-weight':900, 'font-size':'16px' }
    }

    /**
     *
     * <xs:element name="SubmitterName" type="String100min2"/>
     1.4 Final In confidence Page 41
     RS7 Return Data Collection Specification
     <xs:element name="ContactNumber" type="String50min2"/>
     <xs:element name="Designation" type="String100min2"/>
     */
    function validatePreSubmit() {
      var msg = null;
      if ( !that.declarationName || that.declarationName.length > 100 || that.declarationName.length < 2 ) {
        msg = "Declaration Name must be between 2-100 Characters";
      } else if ( !that.declarationContactPhone || that.declarationContactPhone.length > 50 || that.declarationContactPhone.length < 2 ) {
        msg = "Declaration Phone must be between 2-50 Characters";
      } else if ( !that.declarationDesignation || that.declarationDesignation.length > 100 || that.declarationDesignation.length < 2 ) {
        msg = "Declaration Designation must be between 2-100 Characters";
      }

      if ( msg ) {
        growlService.growl(msg, 'warning');
      }
      return msg == null;
    }

    //// Page 5
    that.submit = function() {
      if ( !validatePreSubmit() ) return;


      that.showAll = true;
      $timeout(function() {
        var htmlContent = document.getElementById("rs7Content").innerHTML;

        htmlContent = htmlContent.replace('declarationName"', 'declarationName" value="'+that.declarationName+'"');
        htmlContent = htmlContent.replace('declarationContactPhone"', 'declarationContactPhone" value="'+that.declarationContactPhone+'"');
        htmlContent = htmlContent.replace('declarationDesignation"', 'declarationDesignation" value="'+that.declarationDesignation+'"');

        var regex = /<button.*<\/button>/;
        while (htmlContent.match(regex) ) {
          htmlContent = htmlContent.replace(regex, "");
        }

        createRS7Event(htmlContent);
      });
    }

    /**
     *
     '<PeriodStartDate>${PeriodStartDate}</PeriodStartDate>'+
     '<DailyData>'+
     '${DayCounts}'+
     '</DailyData>'+
     '${AdvanceMonthCounts}'+
     '<Declaration>'+
     '<RegisteredTeachersSalariesAttestation>${RegisteredTeachersSalariesAttestation}</RegisteredTeachersSalariesAttestation>'+
     '<SubmitterName>${SubmitterName}</SubmitterName>'+
     '<ContactNumber>${ContactNumber}</ContactNumber>'+
     '<Designation>${Designation}</Designation>'+
     '</Declaration>';
     */

    /*
     <DayCounts>
     <CountsDate>2014-02-02</CountsDate>
     <SubsidyFundedChildUnderTwoCount>30</SubsidyFundedChildUnderTwoCount>
     <SubsidyFundedChildTwoAndOverCount i:nil="true" />
     <TwentyHoursFundedChildCount i:nil="true" />
     <TwentyHoursFundedChildPlusTenCount i:nil="true" />
     <StaffHourQualifiedCount i:nil="true" />
     <StaffHourNotQualifiedCount i:nil="true" />
     </DayCounts>

     obj.under2 = 0;
     obj.over2 = 0;
     obj.twentyHoursECE = 0;
     obj.plus10 = 0;
     obj.eceTotal = 0;
     obj.registered = 0;
     obj.nonRegistered = 0;
     obj.shcTotal = 0;
     obj.remarks = '--';

     */


    function printOrNil(tag, val) {
      if ( val == null || val == 0 || parseInt(val, 10) < 0 ) {
        return '<'+tag+' i:nil="true" />';
      } else {
        return "<"+tag+">"+val+"</"+tag+">";
      }
    }

    function computeDayCounts() {
      var str = "";

      _.each(that.getPayPeriodMonths(), function(month) {
        _.each(that.dailyData[month], function(day) {
          str += "<DayCounts>";

          str += "<CountsDate>"+moment(day.date,'D-M-YY').format("YYYY-MM-DD")+"</CountsDate>";
          str += printOrNil("SubsidyFundedChildUnderTwoCount", Math.round(day.under2));
          str += printOrNil("SubsidyFundedChildTwoAndOverCount", Math.round(day.over2));
          str += printOrNil("TwentyHoursFundedChildCount", Math.round(day.twentyHoursECE));
          str += printOrNil("TwentyHoursFundedChildPlusTenCount", Math.round(day.plus10));

          if(!that.hideSHC(null, month) ){

            if ( that.hideSHC(day.date) ) {
              str += '<StaffHourQualifiedCount i:nil="true" />';
              str += '<StaffHourNotQualifiedCount i:nil="true" />';
            } else {
              str += printOrNil("StaffHourQualifiedCount", day.registered);
              str += printOrNil("StaffHourNotQualifiedCount", day.nonRegistered);
            }
          }

          str += "</DayCounts>";
        })
      })

      return str;
    }


    function computeAdvanceMonthCounts() {

      var str = "";
      var arr = that.getAdvanceMonths();

      that.data.months.forEach(function (month, i){

        str += "<AdvanceMonth" + (i+1) + ">";

        if(that.data.all_day) {
          
          str += "<AllDayDaysCount>"+that.data.all_day[month].funded_days+"</AllDayDaysCount>";         
        } else{

          str += '<AllDayDaysCount i:nil="true"/>';
        }
        
        if(that.data.sessional){

          if ( that.facility.CenterType=='Playcentre' ) {
            str += '<SessionalDaysCount i:nil="true"/>';
            str += printOrNil("ParentLedDaysCount", that.getAdvanceDaysInMonth(month, 'Sessional'));
          } else {
            str += printOrNil("SessionalDaysCount", that.getAdvanceDaysInMonth(month, 'Sessional'));
            str += '<ParentLedDaysCount i:nil="true"/>';
          }
        } else {

          str += '<SessionalDaysCount i:nil="true"/>';
          str += '<ParentLedDaysCount i:nil="true"/>';
        }
        
        str += "</AdvanceMonth"+(i+1)+">"
      });

      return str;
    }

    /**
     * <AdvanceMonth1>
     * <AllDayDaysCount>12</AllDayDaysCount>
     <SessionalDaysCount>22</SessionalDaysCount>
     <ParentLedDaysCount i:nil="true" />
     </AdvanceMonth1>
     * @returns {string}
     */
    // function computeAdvanceMonthCounts() {
    //   var str = "";
    //   var arr = that.getAdvanceMonths();
    //   for ( var i = 1; i <= 4; i++ ) {
    //     var month = arr[i-1];
    //     str += "<AdvanceMonth" + i + ">";

    //     if (that.showAllDayAdvance(month)) {
    //       str += "<AllDayDaysCount>"+that.getAdvanceDaysInMonth(month, 'All Day')+"</AllDayDaysCount>";
    //     } else {
    //       str += '<AllDayDaysCount i:nil="true"/>';
    //     }

    //     if ( that.showSessionalAdvance(month) ) {
    //       if ( that.facility.CenterType=='Playcentre' ) {
    //         str += '<SessionalDaysCount i:nil="true"/>';
    //         str += printOrNil("ParentLedDaysCount", that.getAdvanceDaysInMonth(month, 'Sessional'));
    //       } else {
    //         str += printOrNil("SessionalDaysCount", that.getAdvanceDaysInMonth(month, 'Sessional'));
    //         str += '<ParentLedDaysCount i:nil="true"/>';
    //       }

    //     } else {
    //       str += '<SessionalDaysCount i:nil="true"/>';
    //       str += '<ParentLedDaysCount i:nil="true"/>';

    //     }



    //     str += "</AdvanceMonth"+i+">"
    //   }
    //   return str;
    // }

    function createRS7Event(htmlContent) {

      var values = {};
      var payperiodYear=new Date(that.selectedPayPeriod.RS7SubmissionNotification).getFullYear();
      var payPeriodMonth=that.selectedPayPeriod.StartPayPeriodMonth;
      if(payPeriodMonth.toLowerCase()=='oct'){
         payperiodYear=new Date(that.selectedPayPeriod.RS7SubmissionNotification).getFullYear()-1;
      } 
      //var dtg = moment("01 "+that.selectedPayPeriod.StartPayPeriodMonth+" "+new Date().getFullYear(), "DD MMM YYYY");
      var dtg = moment("01 "+that.selectedPayPeriod.StartPayPeriodMonth+" "+payperiodYear, "DD MMM YYYY");
      values.PeriodStartDate = dtg.format("YYYY-MM-DD");
      var registeredVal = (that.attestationAnswer == null ? false : that.attestationAnswer)
      values.RegisteredTeachersSalariesAttestation = printOrNil('RegisteredTeachersSalariesAttestation', registeredVal);
      values.SubmitterName = that.declarationName;
      values.ContactNumber = that.declarationContactPhone;
      values.Designation = that.declarationDesignation;

      values.DayCounts = computeDayCounts();
      values.AdvanceMonthCounts = computeAdvanceMonthCounts();

      var eliObj = {
        Values: values,//{'StartDate': d.start, 'EndDate': d.end, 'ConfirmationDataEntityId': confirmID},
        EventType : "RS7Return",
        EventDateTime: new Date(),
        SaveDate: new Date(),
        Content: htmlContent
      };
      return formlyAdapter.saveObject('eliEvent', eliObj, null).then(function(d) {
        that.showAll = false;
        var evt = d.data;
        growlService.growl('RS7 Data Saved!', 'success', 4000);
        growlService.growl('Submitting RS7.  Please Wait...', 'info', 4000);

        var xml = vkbeautify.xml(evt.Values.DayCounts);
        xml += vkbeautify.xml(evt.Values.AdvanceMonthCounts);
        var str = "<hr/><h3>XML</h3><textarea  style='width:100%' rows='20' disabled>"+xml+"</textarea>";
        
        dialog.showOkDialog('RS7 XML',str)
        
        var obj = _.extend({_id: evt._id, RS7ReturnEntityId: evt._id, EventDateTime:evt.EventDateTime, SaveDate:evt.SaveDate}, evt.Values);
        //that.rs7Submitted = true;
        // ELI.rs7(obj).then(function(d) {
        //   growlService.growl('RS7 Submitted!', 'success', 4000);
        //   $timeout(function() {
        //     $state.go("main.rs7history");
        //   }, 4000);
        // }, function(err) {
        //   growlService.growl('RS7 Error:'+JSON.stringify(err), 'warning');
        //   that.sendErrorToAdmin(obj._id);
        // })
      });
    };

    that.print = function() {
      $timeout(function() {
        that.showAll = true;
        $timeout(function() {
          window.print();
          $timeout(function() {
            that.showAll = false;
          });
        });
      });
    }


    that.viewReturn = function(row) {
      dialog.showOkDialog("RS7 History", row.Content || "N/A", true);
    }

    that.sendErrorToAdmin = function(id) {
      ELI.rs7Error({_id: id});
    }

    var fmt = function(d, days) {
      //var m = moment(d).format("MMM D "+moment().year()+" 00:00:00");
      var m = moment(d).format("MMM D YYYY 00:00:00");
      m = moment(m, "MMM D YYYY hh:mm:ss");

      if ( days ) m.add(days, 'days');
      var s = m.format("MMM D "+m.year()+" 00:00:00");
      return moment(s, "MMM D YYYY hh:mm:ss");
    }

    function init() {

      $timeout(function () {
        formlyAdapter.getModels().then(function () {
          formlyAdapter.getList("payperiodnotification").then(function (payPeriods) {
            fchUtils.getServiceScheduleMap().then(function(svcScheduleMap) {
              formlyAdapter.getList("temporaryClosure").then(function (tempClosures) {
                formlyAdapter.getList("holiday").then(function (holidays) {
                  that.holidayList = holidays
                });

                that.closures = tempClosures;
                 facilityService.getCurrentCenter().then(function (c) {
                  that.facility = c;
                  var fac=(that.facility && that.facility._id) ? that.facility._id : that.facility;
                   var constraints={};
                    constraints["EventType"]="RS7Return";
                    constraints["facility"]=fac;
                  formlyAdapter.getList('eliEvent', {query:JSON.stringify(constraints), sort:'-SaveDate'}).then(function (data) {
                    that.rs7History = data;
                    _.each(data, function(r) {
                      if (rs7Map[r.Values.PeriodStartDate] == "Submitted") return;
                      else {
                        rs7Map[r.Values.PeriodStartDate] = (r.SaveDate && r.SubmittedDate) ? 'Submitted' : 'Failed';
                      }
                    })
                  });
                })
                

                $timeout(function () {
                  var now = fmt(new moment());
                  that.payPeriods = _.filter(payPeriods, function(p) {
                    return (
                      (
                        now.isBefore(fmt(p.CutOffDate, 10)) || now.isSame(fmt(p.CutOffDate, 10))
                      ) &&
                    (
                      now.isAfter(fmt(p.RS7SubmissionNotification)) || now.isSame(fmt(p.RS7SubmissionNotification))
                      )
                    );
                  });
                  
                  that.selectedPayPeriod = that.payPeriods[0];
                  that.serviceScheduleMap = svcScheduleMap;
                });
               
                facilityService.getLicensing().then(function(obj){
                  that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
                });
                 formlyAdapter.getList('centrestatus').then(function(data){
                   that.centerstatusData=(data && data.length)? data[0]:null;
               });
              formlyAdapter.getList('eceserviceschedule').then(function(data){
                   that.eceserviceschedule=data;
               });

              });
            });
          });
        });
      });
    }

    $timeout(init);



  });
