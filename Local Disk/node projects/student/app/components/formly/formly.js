'use strict';

var formlyRoutePrefix = '';
formlyRoutePrefix = '../';

var formlyStatePrefix = '';
formlyStatePrefix = 'main.';

angular.module('sms.forms',
  [
    'formly',
    'formlyBootstrap',
    'ui.bootstrap',
    'ui.mask',
    'ui.grid',
      'ui.grid.selection',
      'ui.grid.pagination',
      'ui.grid.resizeColumns',
      'ui.grid.moveColumns',
    'ui.router',
    'ngResource',
    'ngCookies'
  ])
    .config(function ($stateProvider) {

      
        $stateProvider
            .state(formlyStatePrefix+'formly', {
                abstract:true,
                url: '/formly',
                templateUrl: formlyRoutePrefix + 'components/formly/formly-base.html',
                controller: 'FormlyCtrl as formsCtrl',
                resolve: {
                    $modalInstance: function () {
                        return {}
                    }
                }
            })
            .state(formlyStatePrefix+'formly.new', {
                url: '/new/:type',
                templateUrl: formlyRoutePrefix + 'components/formly/formly-edit.html'
            })
            .state(formlyStatePrefix+'formly.home', {
                url: '/home',
                templateUrl: formlyRoutePrefix + 'components/formly/formly-home.html'
            })

            .state(formlyStatePrefix+'formly.edit', {
                url: '/edit/:type/:id',
                templateUrl: formlyRoutePrefix + 'components/formly/formly-edit.html'
            })
            .state(formlyStatePrefix+'formly.list', {
                url: '/list/:type',
                templateUrl: formlyRoutePrefix + 'components/formly/formly-list.html'
            });
    })
  .config(function (formlyConfigProvider) {

      // set templates here
      formlyConfigProvider.setType({
          name: 'nested',
          template: '<formly-form model="model[options.key]" fields="options.data.fields"></formly-form>'
      });

      formlyConfigProvider.setWrapper({
          name: 'validation',
          types: ['input', 'numberinput', 'select', 'datepicker', 'refselect'],
          templateUrl: formlyRoutePrefix + 'components/formly/error-messages.html'
      });

      formlyConfigProvider.setWrapper({
          name: 'customHtml',
          types: ['input', 'select', 'refselect', 'datepicker','checkbox'],
          templateUrl: formlyRoutePrefix + 'components/formly/custom.html'
      });


      formlyConfigProvider.setWrapper({
          name: 'panel',
          types: ['nested'],
          templateUrl: formlyRoutePrefix + 'components/formly/panel.html'
      });

      // Remove Chrome auto-complete:
      formlyConfigProvider.extras.removeChromeAutoComplete = true;

  })
  .run(function ($rootScope, $location, Auth, formlyConfig, formlyValidationMessages, formlyApiCheck, formlyUtils, dialog) {
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function(event, next, toParams, fromState, fromParams){
          Auth.isLoggedInAsync(function(loggedIn) {
              if (next.authenticate && !loggedIn) {

                  // check for token in path
                  $location.path('/login');
              }
          });
      });

      formlyApiCheck.config.disabled = true;

      var attributes = [
          'date-disabled',
          'custom-class',
          'show-weeks',
          'starting-day',
          'init-date',
          'min-mode',
          'max-mode',
          'format-day',
          'format-month',
          'format-year',
          'format-day-header',
          'format-day-title',
          'format-month-title',
          'year-range',
          'shortcut-propagation',
          //'datepicker-popup',
          'show-button-bar',
          'current-text',
          'clear-text',
          'close-text',
          'close-on-date-selection',
          'datepicker-append-to-body'
      ];

      var bindings = [
          'datepicker-mode',
          'min-date',
          'max-date'
      ];

      var ngModelAttrs = {};

      angular.forEach(attributes, function(attr) {
          ngModelAttrs[camelize(attr)] = {attribute: attr};
     });

      angular.forEach(bindings, function(binding) {
          ngModelAttrs[camelize(binding)] = {bound: binding};
          
           
      });

      //console.log(ngModelAttrs);

      formlyConfig.setType({
          name: 'datepicker',
          controller: 'FormlyDatePickerCtrl',
          extends: 'input',
          templateUrl: formlyRoutePrefix + 'components/formly/datepicker.html',
          //template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
          //template: '<input ng-click="open($event, \'opened\')" type="text" class="form-control" show-weeks="false" ng-model="model[options.key]" is-open="to.isOpen" min-date="minDate" datepicker-options="to.dateOptions" close-text="Close" placeholder="Select Date" />',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          defaultOptions: {
              ngModelAttrs: ngModelAttrs,
              templateOptions: {
                  /*onFocus: function($viewValue, $modelValue, scope) {
                      scope.opened = !scope.opened;
                  },*/
                  datepickerOptions: {}
              }
          }
      });

      function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }
      formlyConfig.setType({
          name: 'refselect',
          controller: 'FormlyRefCtrl',
          templateUrl: formlyRoutePrefix + 'components/formly/refselect.html',
          overwriteOk: true,

          //template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
          //template: '<input ng-click="open($event, \'opened\')" type="text" class="form-control" show-weeks="false" ng-model="model[options.key]" is-open="to.isOpen" min-date="minDate" datepicker-options="to.dateOptions" close-text="Close" placeholder="Select Date" />',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          defaultOptions: function defaultOptions(options) {
              /* jshint maxlen:195 */

              var ngOptions = options.templateOptions.ngOptions || 'option[to.valueProp || \'value\'] as option[to.labelProp || \'name\'] group by option[to.groupProp || \'group\'] for option in to.options';
              
              return {
                  ngModelAttrs: _defineProperty({}, ngOptions, {
                      value: 'ng-options',
                      
                  })
              };
          },
      });

      formlyConfig.setType({
          name: 'refcbselect',
          controller: 'FormlyRefCtrl',
          templateUrl: formlyRoutePrefix + 'components/formly/refcbselect.html',
          overwriteOk: true,

          //template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
          //template: '<input ng-click="open($event, \'opened\')" type="text" class="form-control" show-weeks="false" ng-model="model[options.key]" is-open="to.isOpen" min-date="minDate" datepicker-options="to.dateOptions" close-text="Close" placeholder="Select Date" />',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          defaultOptions: function defaultOptions(options) {
              /* jshint maxlen:195 */
              var ngOptions = options.templateOptions.ngOptions || 'option[to.valueProp || \'value\'] as option[to.labelProp || \'name\'] group by option[to.groupProp || \'group\'] for option in to.options';
              return {
                  ngModelAttrs: _defineProperty({}, ngOptions, {
                      value: 'ng-options'
                  })
              };
          },
      });

      formlyConfig.setType({
          name: 'checkbox',
          templateUrl: formlyRoutePrefix + 'components/formly/checkbox.html',
          overwriteOk: true,

          //template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
          //template: '<input ng-click="open($event, \'opened\')" type="text" class="form-control" show-weeks="false" ng-model="model[options.key]" is-open="to.isOpen" min-date="minDate" datepicker-options="to.dateOptions" close-text="Close" placeholder="Select Date" />',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          controller: function($scope,dialog,formlyData){
            if(formlyData.getData().ECEQualificationsDetails){
                $scope.customclass='custom-checkbox';
               $scope.showPrompt = function(){
                if(formlyData.getData().ECEQualificationsDetails.IsRegistered == true){
                    dialog.showOkDialog("Registered Teacher", RegisteredTeacherPrompt());
                }
              }
            }
           
          }  

      });

      

      formlyConfig.setType({
          name: 'imageupload',
          templateUrl: formlyRoutePrefix + 'components/formly/imageupload.html',
          overwriteOk: true,

          //template: '<input class="form-control" ng-model="model[options.key]" is-open="to.isOpen" datepicker-options="to.datepickerOptions" />',
          //template: '<input ng-click="open($event, \'opened\')" type="text" class="form-control" show-weeks="false" ng-model="model[options.key]" is-open="to.isOpen" min-date="minDate" datepicker-options="to.dateOptions" close-text="Close" placeholder="Select Date" />',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          defaultOptions: {
              ngModelAttrs: ngModelAttrs
          },
          controller: function($scope,dialog,formlyData){
              console.log($scope.model);
              

          } 
      });

      formlyConfig.setType({
          name: 'numberinput',
          extends: 'input',
          template: '<input type="number" step="{{options.templateOptions.step}}" class="form-control" ng-model="model[options.key]">',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          defaultOptions: {
              ngModelAttrs: ngModelAttrs
          }
      });
      
      
      formlyConfig.setType({
          name: 'multiInput',
          templateUrl: formlyRoutePrefix + 'components/formly/multiInput.html',
          defaultOptions: {
              noFormControl: true,
              wrapper: ['bootstrapLabel', 'bootstrapHasError'],
              templateOptions: {
                  inputOptions: {
                      wrapper: null
                  }
              }
          },
          controller: /* @ngInject */ function($scope) {
              $scope.copyItemOptions = copyItemOptions;

              function copyItemOptions() {
                  return angular.copy($scope.to.inputOptions);
              }
          }
      });

      var deleteIdRecursively = function(obj) {
          if ( obj._id ) {
              delete obj._id;
          }

          for ( var key in obj ) {
              if (!obj.hasOwnProperty(key))
                  continue;
              if ( obj[key] && obj[key]._id ) {
                  // handle date validation
                  delete obj[key]._id;
              } else if ( obj[key] && typeof obj[key] === 'object' && key.indexOf("_") != 0 && key.indexOf("$") != 0) {
                  console.log("parsing:"+key);
                  deleteIdRecursively(obj[key]);
              } else if ( obj[key] && obj[key].length ) {
                  _.each(obj[key], deleteIdRecursively);
              }
          }
      }

      formlyConfig.setType({
          name: 'repeatSection',
          templateUrl: formlyRoutePrefix + 'components/formly/repeatSection.html',
          controller: function($scope, $timeout, formlyData, formlyUtils) {
              $scope.formOptions = {formState: $scope.formState};
              $scope.addNew = addNew;
              $scope.deleteRow = deleteRow;
              $scope.isDisabled = isDisabled;

              $scope.copyFields = copyFields;

              /*to apply attendace existance check on child booking schedule deletion*/
              $scope.attendanceCheck = function(model, modelVal, key, index) {

                var obj = modelVal[index];

                if(obj && key=='BookingSchedule' && obj.EffectiveDate)
                return checkAttendanceBookingSchedule(obj.EffectiveDate);
                
                else if(obj && key=='Enrolments' && obj.EnrolmentSection && obj.EnrolmentSection.EnrolmentStartDate)
                return checkAttendanceEnrolment(obj);

                else return false;
              }

              /*only allow the latest one to be deleted*/
              $scope.isLatest = function(model, modelVal, key, index){

                var is_latest = true;

                if(key == 'BookingSchedule' || key=='Enrolments'){

                  if(index != modelVal.length-1) is_latest = false;
                }
                return is_latest;
              }

              function checkAttendanceEnrolment (obj){

                var start_date  = obj.EnrolmentSection.EnrolmentStartDate;
                var end_date    = obj.EnrolmentSection.EnrolmentEndDate;
                var if_hide     = false;
                var attendace   = formlyData.getchildAttendance();

                if(attendace && attendace.length){
                  
                  var all_dates = _.pluck(attendace, 'Date');
                  all_dates.forEach(function (one_attendance_date){

                    var att_same_or_after_start = moment(one_attendance_date).isSame(moment(start_date) , 'day' ) 
                    || moment(one_attendance_date).isAfter(moment(start_date) , 'day' );
                    
                    if( !end_date && att_same_or_after_start )
                    if_hide = true;

                    else if(start_date && end_date){

                      var att_same_or_before_end = moment(one_attendance_date).isSame(moment(end_date) , 'day' ) 
                      || moment(one_attendance_date).isBefore(moment(end_date) , 'day' );

                      if(att_same_or_after_start && att_same_or_before_end)
                      if_hide = true;
                    }
                  });
                }                
                return if_hide;
              }

              function checkAttendanceBookingSchedule (EffectiveDate){

                  var if_hide       = false;
                  var attendace     = formlyData.getchildAttendance();
                  var date_to_check = EffectiveDate;

                  if(attendace.length){
                    
                    var all_dates = _.pluck(attendace, 'Date');
                    all_dates.forEach(function (one_attendance_date){

                      if( 
                        moment(one_attendance_date).isSame(moment(date_to_check) , 'day' ) ||
                        moment(one_attendance_date).isAfter(moment(date_to_check) , 'day' ) 
                      )
                      if_hide = true;
                    });
                  }
                  return if_hide;
              }
              $scope.hideDeleteBtn = function(model, modelVal, key, index) {
                var old=formlyData.getOriginal();
                var data=formlyData.getData();
               
                if(key=='BookingSchedule' && Auth.getCurrentUser().role.type!="SYSTEM_ADMIN_ROLE" && typeof(old)!='undefined'){
                  var lastEnrolment= old && old.Enrolments && old.Enrolments.length ?  old.Enrolments[old.Enrolments.length-1]:null;
                  var oldBookings=old && old.Enrolments && old.Enrolments.length && old.Enrolments[old.Enrolments.length-1].BookingSchedule && old.Enrolments[old.Enrolments.length-1].BookingSchedule.length ? old.Enrolments[old.Enrolments.length-1].BookingSchedule.length : 0;
                  var newBookings=data && data.Enrolments && data.Enrolments.length && data.Enrolments[data.Enrolments.length-1].BookingSchedule && data.Enrolments[data.Enrolments.length-1].BookingSchedule.length ? data.Enrolments[old.Enrolments.length-1].BookingSchedule.length : 0;
                  if(newBookings > oldBookings && index == (newBookings-1) && model._id==lastEnrolment._id){
                    return false;
                   }else{
                    return true;
                   }
                }
                if(key=="Times" && typeof(old)!='undefined'){

                  var oldDatalastBooking=old && old.Enrolments && old.Enrolments.length && old.Enrolments[old.Enrolments.length-1].BookingSchedule && old.Enrolments[old.Enrolments.length-1].BookingSchedule.length ? old.Enrolments[old.Enrolments.length-1].BookingSchedule[old.Enrolments[old.Enrolments.length-1].BookingSchedule.length-1] :null;
                 var newDataLastBooking=data && data.Enrolments && data.Enrolments.length && data.Enrolments[data.Enrolments.length-1].BookingSchedule && data.Enrolments[data.Enrolments.length-1].BookingSchedule ? data.Enrolments[old.Enrolments.length-1].BookingSchedule[data.Enrolments[old.Enrolments.length-1].BookingSchedule.length-1] : null;
                 
                 var oldTimesCount=oldDatalastBooking && oldDatalastBooking.Times && oldDatalastBooking.Times.length ? oldDatalastBooking.Times.length:0;
                 var newTimesCount=newDataLastBooking && newDataLastBooking.Times && newDataLastBooking.Times.length ? newDataLastBooking.Times.length:0;
                if(typeof(oldDatalastBooking)=='undefined' || !oldDatalastBooking){
                  return false;
                }else if(typeof(oldDatalastBooking)!='undefined' && oldDatalastBooking && oldDatalastBooking._id==newDataLastBooking._id && newTimesCount > oldTimesCount && index==(newTimesCount-1)){
                   return false
                 }else if(typeof(oldDatalastBooking)!='undefined' && oldDatalastBooking && oldDatalastBooking._id!=newDataLastBooking._id && model._id==newDataLastBooking._id){
                  return false;
                 }else{
                  return true;
                 }
                }
               return $scope.options.templateOptions.extras.hideDeleteBtn || false;
              }

              $scope.hideAddBtn = function(model, modelVal, key, index) {
                return $scope.options.templateOptions.extras.hideAddBtn || false;
              }


              function copyFields(fields) {
                  return angular.copy(fields);
              }

              var enrolmentEnabled = formlyUtils.enrolmentEnabled;

              function isDisabled(model, modelVal, key, index) {
                return $scope.options.templateOptions.extras.addRowDisabled? eval($scope.options.templateOptions.extras.addRowDisabled) : false;
              }

              function deleteRow(idx) {
                  dialog.showOkCancelDialog("Confirm Delete", "Are you sure you wish to delete this item?", "Yes", "No").then(function () {
                      delete $scope.model[$scope.options.key][idx];
                      $scope.model[$scope.options.key].splice(idx, 1);//[idx];
                  });
              }
              

              function addNew() {
                  $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                  var repeatsection = $scope.model[$scope.options.key];
                 
                  var lastSection = repeatsection[repeatsection.length - 1];
                  var newsection = {};
                  if (lastSection) {
                      if ( $scope.options.templateOptions.extras.copyLastRow ) {
                          newsection = angular.copy(lastSection);
                          deleteIdRecursively(newsection);
                      } else {
                          newsection = {};/// angular.copy(lastSection);
                      }
                  }

                  var rs = repeatsection.pop();
                  $timeout(function() {
                      if ( rs ) repeatsection.push(rs);
                      repeatsection.push(newsection);
                  });

              }
          }
      });

      formlyConfig.setType({
          name: 'repeatSectionCheckbox',
          templateUrl: formlyRoutePrefix + 'components/formly/repeatSectionCheckbox.html',
          controller: function($scope, $timeout, formlyData, formlyUtils) {
              $scope.formOptions = {formState: $scope.formState};
              $scope.isDisabled = isDisabled;

              $scope.copyFields = copyFields;

              function copyFields(fields) {
                  return angular.copy(fields);
              }

              function isDisabled(model, modelVal, key, index) {
                  return $scope.options.templateOptions.extras.addRowDisabled ? eval($scope.options.templateOptions.extras.addRowDisabled) : false;
              }
          }
      });



      formlyConfig.setType({
          name: 'maskedInput',
          extends: 'input',
          template: '<input class="form-control" ng-model="model[options.key]" />',
          defaultOptions: {
              ngModelAttrs: {
                  mask: {
                      attribute: 'ui-mask'
                  },
                  maskPlaceholder: {
                      attribute: 'ui-mask-placeholder'
                  }
              },
              templateOptions: {
                  maskPlaceholder: ''
              }
          }
      });


      //formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

      //formlyValidationMessages.addStringMessage('required', 'This field is required');
      //formlyValidationMessages.addStringMessage('numberRange', 'This field is out of range');



      function camelize(string) {
          string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
              return chr ? chr.toUpperCase() : '';
          });
          // Ensure 1st char is always lowercase
          return string.replace(/^([A-Z])/, function(match, chr) {
              return chr ? chr.toLowerCase() : '';
          });
      }


        function RegisteredTeacherPrompt() {
        return "A ‘registered teacher’ is a holder of a current practising certificate that has been issued by the New Zealand Teachers Council, or a letter from the Teachers’ Council advising that registration has been approved and that the practising certificate will be mailed within four to six weeks. confirmation’, and fully registered teachers. For more information please refer to the Teacher’s Council website Note: For ECE funding purposes, ’registered teachers’ must be ECE qualified teachers, or New Zealand qualified primary teachers. Where a registered teacher’s registration lapses, they may continue to be counted as registered on the Staff Hour Count from the date they submitted their application for registration renewal to the New Zealand Teachers Council. This period must not exceed three months. Services accessing this provision must keep a copy of the completed application, which must be signed and dated by the centre supervisor or manager. Any teacher applying for registration renewal must provide their employer service with a copy of the completed application. If, after three months, registration renewal has not been approved the teacher must be counted as ‘other’ on the Staff Hour Count. Should registration renewal be declined, the Ministry will recover any associated funding";

      }


  })

  //.filter('to_trusted', ['$sce', '$compile', '$rootScope', function($sce, $compile, $rootScope){
  //    return function(text) {
  //
  //        //var template = "<button ng-click='doSomething()'>{{label}}</button>";
  //        var linkFn = $compile(text);
  //        var content = linkFn($rootScope);
  //        return content;
  //
  //        //return $sce.trustAsHtml(content);
  //    };
  //}])

  .directive('compile', ['$compile', '$sce', function ($compile, $sce) {
      return {
          replace: true,
          link: function (scope, element, attrs) {

              scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    //value = $sce.trustAsHtml(value)
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
              );
          }
      };
  }]);