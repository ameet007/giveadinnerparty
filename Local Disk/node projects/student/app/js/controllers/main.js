materialAdmin
  // =========================================================================
  // Base controller for common functions
  // =========================================================================




  // =========================================================================
  // Header
  // =========================================================================

  // =========================================================================
  // Best Selling Widget
  // =========================================================================

  .controller('bestsellingCtrl', function (bestsellingService) {
    // Get Best Selling widget Data
    this.img = bestsellingService.img;
    this.name = bestsellingService.name;
    this.range = bestsellingService.range;

    this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
  })


  // =========================================================================
  // Todo List Widget
  // =========================================================================

  .controller('todoCtrl', function (todoService) {

    //Get Todo List Widget Data
    this.todo = todoService.todo;

    this.tdResult = todoService.getTodo(this.todo);

    //Add new Item (closed by default)
    this.addTodoStat = false;
  })


  // =========================================================================
  // Recent Items Widget
  // =========================================================================

  .controller('recentitemCtrl', function (recentitemService) {

    //Get Recent Items Widget Data
    this.id = recentitemService.id;
    this.name = recentitemService.name;
    this.parseInt = recentitemService.price;

    this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
  })


  // =========================================================================
  // Recent Posts Widget
  // =========================================================================

  .controller('recentpostCtrl', function (recentpostService) {

    //Get Recent Posts Widget Items
    this.img = recentpostService.img;
    this.user = recentpostService.user;
    this.text = recentpostService.text;

    this.rpResult = recentpostService.getRecentpost(this.img, this.user, this.text);
  })

  // =========================================================================
  // Booking schedule overview Widget
  // =========================================================================

  .controller('bookingScheduleCtrl', function ($timeout,facilityService,formlyAdapter,$scope, moment,$util,fchUtils) {
    var that=this;
    that.today=new Date();
    that.bookingScheduleMatrix={};
   that.weekDates=fchUtils.getWeeklyDateRange(that.today);
    
   

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

   
  $scope.getDate=function(day){
    return new Date(day).getDate();
  }
   function initTable() {
      that.timeslots=fchUtils.getTimeHeaders(that.today, that.serviceScheduleMap, null, null, 'dd-MM-yyyy');
      that.licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,that.today);
     
      _.each(that.weekDates,function(day){
           var timeSlots=fchUtils.getTimeHeaders(day, that.serviceScheduleMap, null, null, 'dd-MM-yyyy');
           var bookedChildsForDay=that.childList.filter(function(kid){
               return $util.checkBookingAndEnrolment(kid, true, day);
           });
          var licenseConfiguration=$util.getEffectiveLicensDetails(that.licenseDetails,day);
           
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
            that.licenseDetails=(obj && obj.length) ? obj[0].LicensingConfiguration : null;
         });
        formlyAdapter.getList('eceserviceschedule').then(function(eceserviceschedule) {
          that.serviceScheduleMap = eceserviceschedule;
          formlyAdapter.getList('child', {populate: 'Room,Educator'}).then(function (data) {
             that.childList=data;
             initTable();
          });
      });
        
    });
  })


  //=================================================
  // Profile
  //=================================================

  .controller('profileCtrl', function (growlService) {

    //Get Profile Information from profileService Service

    //User
    this.profileSummary = "Sed eu est vulputate, fringilla ligula ac, maximus arcu. Donec sed felis vel magna mattis ornare ut non turpis. Sed id arcu elit. Sed nec sagittis tortor. Mauris ante urna, ornare sit amet mollis eu, aliquet ac ligula. Nullam dolor metus, suscipit ac imperdiet nec, consectetur sed ex. Sed cursus porttitor leo.";

    this.fullName = "Mallinda Hollaway";
    this.gender = "female";
    this.birthDay = "23/06/1988";
    this.martialStatus = "Single";
    this.mobileNumber = "00971123456789";
    this.emailAddress = "malinda.h@gmail.com";
    this.twitter = "@malinda";
    this.twitterUrl = "twitter.com/malinda";
    this.skype = "malinda.hollaway";
    this.addressSuite = "10098 ABC Towers";
    this.addressCity = "Dubai Silicon Oasis, Dubai";
    this.addressCountry = "United Arab Emirates";


    //Edit
    this.editSummary = 0;
    this.editInfo = 0;
    this.editContact = 0;


    this.submit = function (item, message) {
      if (item === 'profileSummary') {
        this.editSummary = 0;
      }

      if (item === 'profileInfo') {
        this.editInfo = 0;
      }

      if (item === 'profileContact') {
        this.editContact = 0;
      }

      growlService.growl(message + ' has updated Successfully!', 'inverse');
    }

  })


  //=================================================
  // LOGIN
  //=================================================

  .controller('loginCtrl1', function () {

    //Status

    this.login = 1;
    this.register = 0;
    this.forgot = 0;
  })


  //=================================================
  // CALENDAR
  //=================================================

  .controller('calendarCtrl', function ($modal) {

    //Create and add Action button with dropdown in Calendar header.
    this.month = 'month';

    this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
      '<li class="dropdown" dropdown>' +
      '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
      '<ul class="dropdown-menu dropdown-menu-right">' +
      '<li class="active">' +
      '<a data-calendar-view="month" href="">Month View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="basicWeek" href="">Week View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="basicDay" href="">Day View</a>' +
      '</li>' +
      '<li>' +
      '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
      '</li>' +
      '</ul>' +
      '</div>' +
      '</li>';


    //Open new event modal on selecting a day
    this.onSelect = function (argStart, argEnd) {
      var modalInstance = $modal.open({
        templateUrl: 'addEvent.html',
        controller: 'addeventCtrl',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          calendarData: function () {
            var x = [argStart, argEnd];
            return x;
          }
        }
      });
    }
  })

  //Add event Controller (Modal Instance)
  .controller('addeventCtrl', function ($scope, $modalInstance, calendarData) {

    //Calendar Event Data
    $scope.calendarData = {
      eventStartDate: calendarData[0],
      eventEndDate: calendarData[1]
    };

    //Tags
    $scope.tags = [
      'bgm-teal',
      'bgm-red',
      'bgm-pink',
      'bgm-blue',
      'bgm-lime',
      'bgm-green',
      'bgm-cyan',
      'bgm-orange',
      'bgm-purple',
      'bgm-gray',
      'bgm-black',
    ]

    //Select Tag
    $scope.currentTag = '';

    $scope.onTagClick = function (tag, $index) {
      $scope.activeState = $index;
      $scope.activeTagColor = tag;
    }

    //Add new event
    $scope.addEvent = function () {
      if ($scope.calendarData.eventName) {

        //Render Event
        $('#calendar').fullCalendar('renderEvent', {
          title: $scope.calendarData.eventName,
          start: $scope.calendarData.eventStartDate,
          end: $scope.calendarData.eventEndDate,
          allDay: true,
          className: $scope.activeTagColor

        }, true); //Stick the event

        $scope.activeState = -1;
        $scope.calendarData.eventName = '';
        $modalInstance.close();
      }
    }

    //Dismiss
    $scope.eventDismiss = function () {
      $modalInstance.dismiss();
    }
  })

  // =========================================================================
  // COMMON FORMS
  // =========================================================================

  .controller('formCtrl', function () {

    //Input Slider
    this.nouisliderValue = 4;
    this.nouisliderFrom = 25;
    this.nouisliderTo = 80;
    this.nouisliderRed = 35;
    this.nouisliderBlue = 90;
    this.nouisliderCyan = 20;
    this.nouisliderAmber = 60;
    this.nouisliderGreen = 75;

    //Color Picker
    this.color = '#03A9F4';
    this.color2 = '#8BC34A';
    this.color3 = '#F44336';
    this.color4 = '#FFC107';
  })


  // =========================================================================
  // PHOTO GALLERY
  // =========================================================================

  .controller('photoCtrl', function () {

    //Default grid size (2)
    this.photoColumn = 'col-md-2';
    this.photoColumnSize = 2;

    this.photoOptions = [
      {value: 2, column: 6},
      {value: 3, column: 4},
      {value: 4, column: 3},
      {value: 1, column: 12},
    ]

    //Change grid
    this.photoGrid = function (size) {
      this.photoColumn = 'col-md-' + size;
      this.photoColumnSize = size;
    }

  })


  // =========================================================================
  // ANIMATIONS DEMO
  // =========================================================================
  .controller('animCtrl', function ($timeout) {

    //Animation List
    this.attentionSeekers = [
      {animation: 'bounce', target: 'attentionSeeker'},
      {animation: 'flash', target: 'attentionSeeker'},
      {animation: 'pulse', target: 'attentionSeeker'},
      {animation: 'rubberBand', target: 'attentionSeeker'},
      {animation: 'shake', target: 'attentionSeeker'},
      {animation: 'swing', target: 'attentionSeeker'},
      {animation: 'tada', target: 'attentionSeeker'},
      {animation: 'wobble', target: 'attentionSeeker'}
    ]
    this.flippers = [
      {animation: 'flip', target: 'flippers'},
      {animation: 'flipInX', target: 'flippers'},
      {animation: 'flipInY', target: 'flippers'},
      {animation: 'flipOutX', target: 'flippers'},
      {animation: 'flipOutY', target: 'flippers'}
    ]
    this.lightSpeed = [
      {animation: 'lightSpeedIn', target: 'lightSpeed'},
      {animation: 'lightSpeedOut', target: 'lightSpeed'}
    ]
    this.special = [
      {animation: 'hinge', target: 'special'},
      {animation: 'rollIn', target: 'special'},
      {animation: 'rollOut', target: 'special'}
    ]
    this.bouncingEntrance = [
      {animation: 'bounceIn', target: 'bouncingEntrance'},
      {animation: 'bounceInDown', target: 'bouncingEntrance'},
      {animation: 'bounceInLeft', target: 'bouncingEntrance'},
      {animation: 'bounceInRight', target: 'bouncingEntrance'},
      {animation: 'bounceInUp', target: 'bouncingEntrance'}
    ]
    this.bouncingExits = [
      {animation: 'bounceOut', target: 'bouncingExits'},
      {animation: 'bounceOutDown', target: 'bouncingExits'},
      {animation: 'bounceOutLeft', target: 'bouncingExits'},
      {animation: 'bounceOutRight', target: 'bouncingExits'},
      {animation: 'bounceOutUp', target: 'bouncingExits'}
    ]
    this.rotatingEntrances = [
      {animation: 'rotateIn', target: 'rotatingEntrances'},
      {animation: 'rotateInDownLeft', target: 'rotatingEntrances'},
      {animation: 'rotateInDownRight', target: 'rotatingEntrances'},
      {animation: 'rotateInUpLeft', target: 'rotatingEntrances'},
      {animation: 'rotateInUpRight', target: 'rotatingEntrances'}
    ]
    this.rotatingExits = [
      {animation: 'rotateOut', target: 'rotatingExits'},
      {animation: 'rotateOutDownLeft', target: 'rotatingExits'},
      {animation: 'rotateOutDownRight', target: 'rotatingExits'},
      {animation: 'rotateOutUpLeft', target: 'rotatingExits'},
      {animation: 'rotateOutUpRight', target: 'rotatingExits'}
    ]
    this.fadeingEntrances = [
      {animation: 'fadeIn', target: 'fadeingEntrances'},
      {animation: 'fadeInDown', target: 'fadeingEntrances'},
      {animation: 'fadeInDownBig', target: 'fadeingEntrances'},
      {animation: 'fadeInLeft', target: 'fadeingEntrances'},
      {animation: 'fadeInLeftBig', target: 'fadeingEntrances'},
      {animation: 'fadeInRight', target: 'fadeingEntrances'},
      {animation: 'fadeInRightBig', target: 'fadeingEntrances'},
      {animation: 'fadeInUp', target: 'fadeingEntrances'},
      {animation: 'fadeInBig', target: 'fadeingEntrances'}
    ]
    this.fadeingExits = [
      {animation: 'fadeOut', target: 'fadeingExits'},
      {animation: 'fadeOutDown', target: 'fadeingExits'},
      {animation: 'fadeOutDownBig', target: 'fadeingExits'},
      {animation: 'fadeOutLeft', target: 'fadeingExits'},
      {animation: 'fadeOutLeftBig', target: 'fadeingExits'},
      {animation: 'fadeOutRight', target: 'fadeingExits'},
      {animation: 'fadeOutRightBig', target: 'fadeingExits'},
      {animation: 'fadeOutUp', target: 'fadeingExits'},
      {animation: 'fadeOutUpBig', target: 'fadeingExits'}
    ]
    this.zoomEntrances = [
      {animation: 'zoomIn', target: 'zoomEntrances'},
      {animation: 'zoomInDown', target: 'zoomEntrances'},
      {animation: 'zoomInLeft', target: 'zoomEntrances'},
      {animation: 'zoomInRight', target: 'zoomEntrances'},
      {animation: 'zoomInUp', target: 'zoomEntrances'}
    ]
    this.zoomExits = [
      {animation: 'zoomOut', target: 'zoomExits'},
      {animation: 'zoomOutDown', target: 'zoomExits'},
      {animation: 'zoomOutLeft', target: 'zoomExits'},
      {animation: 'zoomOutRight', target: 'zoomExits'},
      {animation: 'zoomOutUp', target: 'zoomExits'}
    ]

    //Animate
    this.ca = '';

    this.setAnimation = function (animation, target) {
      if (animation === "hinge") {
        animationDuration = 2100;
      }
      else {
        animationDuration = 1200;
      }

      angular.element('#' + target).addClass(animation);

      $timeout(function () {
        angular.element('#' + target).removeClass(animation);
      }, animationDuration);
    }

  })

