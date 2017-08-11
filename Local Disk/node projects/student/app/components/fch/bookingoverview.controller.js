'use strict';

angular.module("sms.fch")
  .controller('BookingOverviewCtrl', function ($timeout,$stateParams,dialog,$cookies,$q, Auth,facilityService,formlyAdapter,
                                          $state,$scope, moment,$util,fchUtils) {



   var params = params && params.stateParams ? params.stateParams : $stateParams;
   
	 var that = this;
   if($cookies.get('bookoverviewdate')){
    that.today=new Date($cookies.get('bookoverviewdate'));
   } else {
    that.today=new Date();
    $cookies.put('bookoverviewdate',new Date(),{}); 
   }
   
   that.bookingScheduleMatrix={};
   that.weekDates=fchUtils.getWeeklyDateRange(that.today);
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
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks:'false'
      };

  that.getTotalRowClass=function(day,timeslot){ 
       if(that.bookingScheduleMatrix[$scope.getDate(day)][timeslot] && that.bookingScheduleMatrix[$scope.getDate(day)][timeslot]['total']< that.bookingScheduleMatrix[$scope.getDate(day)]['childplaces']){
          return 'cyanColor';
       }else if(that.bookingScheduleMatrix[$scope.getDate(day)][timeslot] && that.bookingScheduleMatrix[$scope.getDate(day)][timeslot]['total'] > that.bookingScheduleMatrix[$scope.getDate(day)]['childplaces']){
        return 'redColor';
       }
       return "greenColor";
  }

  that.getunder2RowClass=function(day,timeslot){
       if(that.bookingScheduleMatrix[$scope.getDate(day)][timeslot] && that.bookingScheduleMatrix[$scope.getDate(day)][timeslot]['under2']< that.bookingScheduleMatrix[$scope.getDate(day)]['under2']){
          return 'cyanColor';
       }else if(that.bookingScheduleMatrix[$scope.getDate(day)][timeslot] && that.bookingScheduleMatrix[$scope.getDate(day)][timeslot]['under2'] > that.bookingScheduleMatrix[$scope.getDate(day)]['under2']){
         return 'redColor';
       }
       return "greenColor";
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
     that.weekrange=moment(startOfWeek).format('DD-MM-YYYY')+" - "+moment(endOfWeek).format('DD-MM-YYYY');
   
   
    
  }
   var f1 = $scope.$watch(function (scope) {
      return ( that.today );
    }, function() {
    that['todayOpened']=false;
     
    });
   

    $scope.$on('destroy', function () {
      f1();
     
    })

    that.dateFilter=function(){
      that.weekDates=fchUtils.getWeeklyDateRange(that.today)
      that.bookingScheduleMatrix={};
       initTable();
    }
  
  $scope.getDate=function(day){
    return new Date(day).getDate();
  }
   function initTable() {

      $cookies.put('bookoverviewdate', new Date(that.today), {});
      $scope.setWeeklyDateRange();
      
      that.timeslots=fchUtils.getTimeHeaders(that.today, that.serviceScheduleMap, null, null, 'dd-MM-yyyy');
      var licenseDetailsForDay=$util.getEffectiveLicensDetails(that.licenseDetails,that.today);
      that.licenseConfiguration=(licenseDetailsForDay.LicensingConfiguration && licenseDetailsForDay.LicensingConfiguration.length ) ?licenseDetailsForDay.LicensingConfiguration[0]:null;
      _.each(that.weekDates,function(day){
           var timeSlots=fchUtils.getTimeHeaders(day, that.serviceScheduleMap, null, null, 'dd-MM-yyyy');
           var bookedChildsForDay=that.childList.filter(function(kid){
               return $util.checkBookingAndEnrolment(kid, true, day);
           });
           
          var licenseDetails=$util.getEffectiveLicensDetails(that.licenseDetails,day);
          var  licenseConfiguration=(licenseDetails.LicensingConfiguration && licenseDetails.LicensingConfiguration.length ) ?licenseDetails.LicensingConfiguration[0]:null;

           that.bookingScheduleMatrix[day.getDate()]={};
           that.bookingScheduleMatrix[day.getDate()]['childplaces']=(licenseConfiguration) ? licenseConfiguration.ChildPlace:0;
           that.bookingScheduleMatrix[day.getDate()]['under2']=(licenseConfiguration)? licenseConfiguration.UnderTwo:0;
           _.each(timeSlots,function(timeslot){
            var totalBooking=0;
            var under2booking=0;
              _.each(bookedChildsForDay,function(child){
                  var isBooked=fchUtils.checkBookingSchedule(timeslot,child,day);
                  if(isBooked){
                    totalBooking++;
                    var childBirthDay = moment(child.ChildBirthDate);
                    var date = moment(day);
                    var months = date.diff(childBirthDay, 'months');
                    if(months < 24){
                        under2booking++;
                    }
                  }
              });
              that.bookingScheduleMatrix[day.getDate()][timeslot]={};

              that.bookingScheduleMatrix[day.getDate()][timeslot]['total']=totalBooking;
              that.bookingScheduleMatrix[day.getDate()][timeslot]['under2']=under2booking;
          });

      })  
      
    }


   $timeout(function() {
        facilityService.getLicensing().then(function(obj){
          
            that.licenseDetails=obj; //(obj && obj.length) ? obj[0].LicensingConfiguration : null;
          
        });
            formlyAdapter.getList('eceserviceschedule').then(function(eceserviceschedule) {
              that.serviceScheduleMap = eceserviceschedule;
              formlyAdapter.getList('child', {populate: 'Room,Educator'}).then(function (data) {
                 that.childList=data;
                 initTable();
              });
          });
        
        
       
        
    });
});