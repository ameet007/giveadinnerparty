'use strict';

angular.module('sms.ecereturn', [
  'cfp.loadingBar',
  'ui.bootstrap'
])

.controller('EcereturnCtrl', function EcereturnCtrl(
  $rootScope,$scope, $timeout, popup, dialog, $util, formlyAdapter, $state,
  fchUtils,$location, $q, Auth, moment, facilityService, ELI, growlService,cfpLoadingBar, 
  EcereturnService, formlyData, $modal, $log, $document, $stateParams
) {

  var that = this;
  that.date_format  = 'dd-MM-yyyy';
  that.dateOptions  = { format:'dd-MM-yyyy' };
  that.facility_details = {};
  that.is_edit_mode = false;
  that.ece_db_data = [];
  that.serviceschedule=null;
  that.ece_return_id_params = $stateParams.ecereturnid || null;
  that.genderData=[{value:'M-Male',label:"M-Male"},{value:'F-Female',label:"F-Female"},{value:'U-Unknown',label:"U-Unknown"}]

  /**
   * Initializer to keep all the fields set and ready to use
   * All the fields that will be required through all the steps
   *
   */  
  that.initFields = function (){

    that.loading = true;
    that.back_btn_activated_at = false;
    that.open_subpage = false;
    that.open_final_warning_page = false;
    that.open_final_response_page = false;
    that.subpage_staff_index = null;
    that.subpage_staff = null;
    that.subpage_staff_bckp = null;
    that.educatorText="";
    that.registeredText="Is this person a NZTC registered teacher?";
    if(Auth.getCurrentUser().facility.CenterType=="Playcentre"){
      that.educatorText="This Person is a Playcentre Educator rostered/organised to be primarily engaged in the education & care of children.";
    }else if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
      that.registeredText="Does this person hold a current, practising certificate from Education Council?";
    }else if(Auth.getCurrentUser().facility.CenterType=="Centre based"){
      that.personText="A person in this role working 25 hours per week or more is considered full-time";
      that.educatorText="This Person is an ECE Teacher engaged in the education and care of children";
    }
    
    if(!that.is_edit_mode) {

      that.fields = {
        this_year: new Date().getFullYear(),
        current_page: 1, 
        today:  new Date(),
        ecereturn_date : '',
        ecereturnweekstart_date : '',
        ecereturnweekend_date : '',
        ecereturn_year : '',
        ecereturn_date_last_year : '',
        ecereturn_date_readable : '',
        ece_wait_times : [],
        ece_wait_times_selected : {
          'a0_12': '',
          'a12_24': '',
          'a24_36': '',
          'a36_48': '',
          'a48_60': '',
        },
        filtered_age_categories: [],
        status_report_data: [],
        all_languages : [],
        center_languages : [],
        center_language_1:{
          Percentage:null,
          Id:'',
        },
        center_language_2:{
          Percentage:null,
          Id:'',
        },
        center_language_3:{
          Percentage:null,
          Id:'',
        },
        center_language_4:{
          Percentage:null,
          Id:'',
        },
        center_language_5:{
          Percentage:null,
          Id:'',
        },
        facility_staff:[],
        facility_staff_backup:[],
        staff:[],
        facility_staff_role_codes:[],
        facility_staff_role_codes_MGMT:[],
        facility_staff_role_codes_SUPS:[],
        facility_staff_role_codes_SPEC:[],
        facility_staff_role_codes_EDU:[],
        ethnic_codes:[],
        educator_qualification_codes:[],
        playcentre_qualification_codes:[],
      }
    }


    // if(!that.is_edit_mode){

      $timeout(function() {
        
        that.fields.facility =  Auth.getCurrentUser().facility,
         formlyAdapter.getList('eceserviceschedule').then(function (serviceschedule){
          if(serviceschedule && serviceschedule.length){
            that.serviceschedule = fchUtils.getEffectiveServiceSchedule(serviceschedule,new Date());
            
          }
         }); 
        that.getFacilityDetails().then(function (){

          var params = {
            query: JSON.stringify({
              Year: that.fields.this_year
            }),
          }
          return formlyAdapter.getList('ecereturnweek', params);
        }).then(function (ecereturnweekObj){

          if(ecereturnweekObj.length){

            ecereturnweekObj = ecereturnweekObj[0];

            if(!that.is_edit_mode) that.fields.ecereturn_date = ecereturnweekObj.ECEReturnWeek;

            that.fields.ecereturn_year = ecereturnweekObj.Year;
            that.fields.ecereturnweekstart_date=ecereturnweekObj.ECEReturnStartDate;
            that.fields.ecereturnweekend_date=ecereturnweekObj.ECEReturnEndDate;
            that.fields.ecereturn_date_readable = moment(that.fields.ecereturn_date).format('MMMM DD, YYYY');
            

            /*check for date validation */
            var is_date_valid = that.checkDateValid(that.fields.ecereturnweekstart_date, that.fields.ecereturnweekend_date);
            
            if(!is_date_valid){

              var err_m = "Cannot proceed to ECE Return - ECE Return can only be submitted between "+
              moment(that.fields.ecereturnweekstart_date).format('MMMM DD, YYYY')+
              " and "+
              moment(that.fields.ecereturnweekend_date).format('MMMM DD, YYYY');

              dialog.showOkDialog("Error", err_m).then(function (okClick){$state.go('main.home');});
            } 

          }

          var params = {
            query: JSON.stringify({
              facility: that.fields.facility._id,
              Year: (that.fields.this_year-1)
            }),
          }
          // if(!that.ece_return_id_params) 
            that.loading = false;
          return formlyAdapter.getList('ecereturnweek', params);
        }).then(function (ecereturnweekObjLastYear){

          if(ecereturnweekObjLastYear.length){
            ecereturnweekObjLastYear = ecereturnweekObjLastYear[0];
            that.fields.ecereturn_date_last_year = ecereturnweekObjLastYear.ECEReturnWeek;
          }
        });
      }, 400);
    // } else{

      // that.loading = false;

      // /*fetch latest ece dates here*/
      // var params = {
      //   query: JSON.stringify({
      //     Year: that.fields.this_year
      //   }),
      // }
      // formlyAdapter.getList('ecereturnweek', params).then(function (ecereturnweekObj){      
      // });
      // /*check for date validation */
      // var is_date_valid = that.checkDateValid(that.fields.ecereturnweekstart_date, that.fields.ecereturnweekend_date);

      // if(!is_date_valid){

      //   var err_m = "Cannot proceed to ECE Return - ECE Return can only be submitted between"+
      //   moment(that.fields.ecereturnweekstart_date).format('MMMM DD, YYYY')+
      //   " and "+
      //   moment(that.fields.ecereturnweekend_date).format('MMMM DD, YYYY');

      //   dialog.showOkDialog("Error", err_m).then(function (okClick){$state.go('main.home');});
      // }

    // }


    /**
     * Watching over date picker if date selected close picker
     *
     */
    $scope.$watch(function (scope) { return ( that.fields.ecereturn_date ); }, function(){ that['startOpened']=false;});

  }


  that.checkDateValid = function (ecereturnweekstart_date, ecereturnweekend_date){

    // console.log('date chekc')
    var flag      = false;
    var this_day  = new Date();
    this_day.setHours(0,0,0,0);

    if(!ecereturnweekstart_date || !ecereturnweekend_date)     return false;

    ecereturnweekstart_date = new Date(ecereturnweekstart_date);
    ecereturnweekend_date   = new Date(ecereturnweekend_date);

    ecereturnweekstart_date.setHours(0,0,0,0);
    ecereturnweekend_date.setHours(23,59,59,59);

    if( this_day >= ecereturnweekstart_date && this_day <= ecereturnweekend_date) flag = true;

    return flag;
  }

  /***
      Function : to check if ece return week condition
      developed by : Mishu
      return type: Boolean
   ***/
  that.checkReturnWeek=function(){
    if(that.fields.ecereturn_date && that.fields.ecereturnweekend_date){
        if(moment(that.fields.ecereturn_date).isAfter(moment(that.fields.ecereturnweekend_date),'day')){
          return true;
        }
      return false;
    }
    return true;
  }

  if(that.ece_return_id_params){

    var params = {
      query: JSON.stringify({
        _id: that.ece_return_id_params
      }),
    }
    formlyAdapter.getList('eliEvent', params).then(function (ece_db_data){

      if(ece_db_data.length){
        that.ece_db_data = ece_db_data;
        that.fields = ece_db_data[0].JsonData;
        that.fields.current_page = 1;
        that.is_edit_mode = true;
      } else{
        growlService.growl('Ece Return not found!', 'danger', 3000);
        $state.go('main.ecereturn');
      }
      that.initFields();      
    }, function (err){

      growlService.growl('Ece Return not found!', 'danger', 3000);
      $state.go('main.ecereturn');
    });
  } else{

    that.initFields();      
  }

  that.dateNotValid = function (datePassed){

    var today = moment().hours(0).minutes(0).seconds(0);
    var date_arg = moment(datePassed).hours(0).minutes(0).seconds(0);
    var err_msg = '';

    var invalid = false;
    

    var this_day = new Date(datePassed);
    var ecereturnweekstart_date = new Date(that.fields.ecereturnweekstart_date);
    var ecereturnweekend_date = new Date(that.fields.ecereturnweekend_date);

    this_day.setHours(23,59,59,59)
    ecereturnweekstart_date.setHours(0,0,0,0);
    ecereturnweekend_date.setHours(23,59,59,59);

    if(!datePassed){
      
      invalid = true;
      err_msg='Ece return date is required';      
    } 
    else if(date_arg.isAfter(today)){

      invalid = true;
      err_msg='Ece return date can not be later than today';
    } 
    else if ( !(this_day >= ecereturnweekstart_date && this_day <= ecereturnweekend_date) ){

      invalid = true;
      err_msg='Ece return date should be lie beetween  ECE return start date and  ECE return end date';      
    }
    else if( datePassed && date_arg.format('ddd') !== 'Mon'){

      invalid = true;
      err_msg='Ece return day must be Monday only';
    } 
    return {invalid:invalid, err: err_msg};
  }


  /**
   * To get details of the facility for use ahead
   *
   */
  that.getFacilityDetails = function(){

    var deferred = $q.defer();
    var params = {
      query: JSON.stringify({
        _id: that.fields.facility._id
      }),
    }

    formlyAdapter.getList('facility', params).then(function (facility_details){
      that.facility_details = facility_details[0];
      deferred.resolve();
    });   

    return deferred.promise;
  }

 
  
  /**
   * To switch the page in view
   *
   */
  that.getCurrentPage = function (current_page){

    var prefix_path = 'components/ecereturn/ecereturn.page';
    var postfix_path = '.html';

    // return prefix_path + that.fields.current_page + postfix_path;
    if(current_page) return prefix_path + current_page + postfix_path;
  }

  /**
   * To switch view to sub page
   *
   */
  that.getCurrentSubPage = function (){

    var prefix_path = 'components/ecereturn/ecereturn.page5.sub';
    var postfix_path = '.html';

    return prefix_path + 1 + postfix_path;
  }

  /**
   * Continue button click handler to next page 
   * by checking certain conditions  
   *
   */
  that.gotoPage = function (currentPage, nextPage, isBack){

    if(nextPage == 2) that.check6DayCondition(nextPage);
    else if(nextPage == 3){ 
      that.initWaitTimePage();
    } else if(nextPage == 4){  
      that.initLanguagePage();
    } else if(nextPage == 5){  
      that.initStaffPage();
    }
    else{
      that.fields.current_page = nextPage;
    }
    if(isBack && (that.back_btn_activated_at <= currentPage || !that.back_btn_activated_at)) that.back_btn_activated_at = currentPage;
  }

  function deActivateBack (page){

    if(that.back_btn_activated_at == page) that.back_btn_activated_at = false; /*reset back button to false*/
  }

  /** 
   * To cancel and empty all the selections made so far
   * leaving the form in fresh state again
   *
   */
  that.cancelWizard = function (arg){

    if(arg =='CLOSE_SUBPAGE') that.closeSubpage();
    that.initFields();
  }

  /**
   * Open current/cliked date picker and close 
   * any other open already
   *
   */
  that.openDatePicker = function ($event, type) {

    $event.preventDefault();
    $event.stopPropagation();
    closeAllOpenedDatepickers();
    that[type + 'Opened'] = true;
  };

  /**
   * When outside click on datepicker then close that
   *
   */
  that.formClicked=function(type){
    that[type + 'Opened'] = false;
  }

  /**
   * To close existing pickers before opening a new one
   *
   */
  var closeAllOpenedDatepickers = function (){

    var keyMap=_.map(that,function(val,key){
      if(_.includes(key, 'Opened')) return key;
      else return null;
    }).filter(function(val){ if(val) return true; return false;});
    _.each(keyMap,function(type){ that[type]=false;})
  }

  /**
   * To check and verfiy the ece return date if
   * that week is still in progress
   *
   */
   that.dateChanged=function(type){
      that[type + 'Opened'] = false;
   }
  that.check6DayCondition = function (nextPage){

    var today       = moment(that.fields.today);
    if(that.fields.ecereturn_date){

      var after6Days  = moment(that.fields.ecereturn_date).add(6, 'days');
      /*----------------------------------*/
      /* check for ecereturn date +6 days */
      /*----------------------------------*/
      if(today < after6Days){
        that.show6DaysWarning().then(function (choice){

          if(choice){
            that.fields.current_page = nextPage;
            return
          }  
        })
      }
    }
    if(that.back_btn_activated_at) deActivateBack(2);
    that.fields.current_page = nextPage;
  }

  /**
   * Show an warning if ecereturn week has not
   * finished yet
   *
   */
  that.show6DaysWarning = function (){

    var choice = '';
    var warning_text = 'You are trying to submit your ECE Return before the return week is over. Only proceed if your ECE Return contains complete information.';
    return dialog.showOkCancelDialog("Are you sure ?",warning_text , "Yes", "No").then(function (confirmed) {
      choice = true;
    }, function (cancelled){
      choice = false;
    }).then(function (){
      return choice;
    });   
  }

  /**
   * To initialise and fetch required details for
   * wait time page in the process
   *
   */
  that.initWaitTimePage = function (){
    
    that.loading = true;
    that.fields.current_page = 3;

    if(that.is_edit_mode) return initWaitTimePageSelections();

    formlyAdapter.getList('ecewaittimes').then(function(eceWaitTimes){

      that.fields.ece_wait_times = eceWaitTimes;        

      /*categories global as on 21/06/17*/
      // var params = {
      //   query: JSON.stringify({
      //     facility: that.fields.facility._id
      //   }),
      // } 

      return formlyAdapter.getList('category')
    }).then(function (ageCategories){
      
      that.fields.filtered_age_categories = getRelevantAgeCategories(JSON.parse(JSON.stringify(ageCategories)));

      var params = {
        query: JSON.stringify({
          Facility: that.fields.facility._id,
          AgeCategory : {$in :that.fields.filtered_age_categories}
        }),
        populate: 'AgeCategory'
      }
      return formlyAdapter.getList('childrenwaitingstatusreport', params)

    }).then(function (statusReportData){

      that.fields.status_report_data = sortStatusReport(statusReportData);

      initWaitTimePageSelections();
    });
  }

  function initWaitTimePageSelections(){

    var tmp = angular.copy(that.fields.ece_wait_times_selected);
    that.fields.ece_wait_times_selected.a0_12  = '';
    that.fields.ece_wait_times_selected.a12_24 = '';
    that.fields.ece_wait_times_selected.a24_36 = '';
    that.fields.ece_wait_times_selected.a36_48 = '';
    that.fields.ece_wait_times_selected.a48_60 = '';
    $timeout(function() {

      if(that.is_edit_mode || that.back_btn_activated_at){

        that.fields.ece_wait_times_selected.a0_12  = tmp.a0_12;
        that.fields.ece_wait_times_selected.a12_24 = tmp.a12_24;
        that.fields.ece_wait_times_selected.a24_36 = tmp.a24_36;
        that.fields.ece_wait_times_selected.a36_48 = tmp.a36_48;
        that.fields.ece_wait_times_selected.a48_60 = tmp.a48_60;
      } else{

        that.fields.ece_wait_times_selected.a0_12  = that.fields.status_report_data[0] ? that.fields.status_report_data[0].wait_time  :'';
        that.fields.ece_wait_times_selected.a12_24 = that.fields.status_report_data[1] ? that.fields.status_report_data[1].wait_time :'';
        that.fields.ece_wait_times_selected.a24_36 = that.fields.status_report_data[2] ? that.fields.status_report_data[2].wait_time :'';
        that.fields.ece_wait_times_selected.a36_48 = that.fields.status_report_data[3] ? that.fields.status_report_data[3].wait_time :'';
        that.fields.ece_wait_times_selected.a48_60 = that.fields.status_report_data[4] ? that.fields.status_report_data[4].wait_time :'';
      }

      if(that.back_btn_activated_at) deActivateBack(3);
      that.loading = false;
    }, 500);
  }

  function getRelevantAgeCategories (allCategories){

    var needed = [
      {from: 0 , to: 12, found: false},
      {from: 12 , to: 24, found: false},
      {from: 24 , to: 36, found: false},
      {from: 36 , to: 48, found: false},
      {from: 48 , to: 60, found: false}
    ];

    var needed_len = needed.length;
    var filtered_categories = [];

    allCategories.forEach(function (cat){

      needed.forEach(function (item, index, object){
        
        if(cat.fromMonth == item.from && cat.toMonth == item.to && !item.found){

          var idx = that.findObjInArr(needed, 'from', item.from);
          filtered_categories[idx] = cat._id  ;
          item.found = true;
        }
      });
    });

    return filtered_categories;
  }
  function sortStatusReport (statusReportData){

    var asc_keys = [0,12,24,36,48];
    var sorted = [];
    var i = 0;
    asc_keys.forEach(function (key, idx){
      
      statusReportData.forEach(function (data){

        if(data.AgeCategory.fromMonth == key) {

          var index = asc_keys.indexOf(data.AgeCategory.fromMonth);
          sorted[index] = data; 
          i++;
          return;
        }
      });
    }); 

    for (var i = 0; i < asc_keys.length; i++) {

      if(!sorted[i]) sorted[i] = '';
    }

    return sorted;
  }

  that.getReadableRoleCode = function (rawName){

    var o = {

      EducationalRoleCode: 'Educational Role Code',
      EducationalRoleCode2: 'Home Based Educator Staff Role Code',
      ManagementRoleCode: 'Management Role Code',
      SupportStaffRoleCode: 'Support Staff Role Code',
      SpecialStaffRoleCode: 'Special Staff Role Code'
    }
    return o[rawName];
  }

  /**
   * To round off values when given in decimals
   *
   */
  that.roundOff = function(val) {

    return Math.round(val);
  }

  that.checkEmptyOrDecimal = function (val){

    if(!val) val=1;
    return parseInt(val);
  }

  that.initLanguagePage = function (){
    
    that.loading = true;
    that.fields.current_page = 4;
    formlyAdapter.getList('languagecode').then(function (allLanguages){

      that.fields.all_languages = allLanguages;
    }).then(function (){ 
      
      $timeout(function() {

        that.fields.center_languages = Auth.getCurrentUser().facility.LanguageOfTeaching;
        initLanguagePageSelections();
      }, 400);
    });
  }

  function initLanguagePageSelections(){

    $timeout(function() {

      if(!that.is_edit_mode && !that.back_btn_activated_at){

        that.fields.center_languages.forEach(function (item, index){
          
          that.fields['center_language_'+(index+1)].Percentage = item.Percentage;
          that.fields['center_language_'+(index+1)].Id = item.LanguageOfTeaching;
        });

        if(that.back_btn_activated_at) deActivateBack(4);
        that.loading = false;
      } else{

        var tmp = [];
        that.fields.center_languages.forEach(function (item, index){

          var o = {
            Percentage: that.fields['center_language_'+(index+1)].Percentage,
            Id: that.fields['center_language_'+(index+1)].Id,
          };  
          tmp.push(o);        
          that.fields['center_language_'+(index+1)].Percentage = '';
          that.fields['center_language_'+(index+1)].Id = '';
        });
        $timeout(function() {

          that.fields.center_languages.forEach(function (item, index){
            
            that.fields['center_language_'+(index+1)].Percentage = tmp[index].Percentage;
            that.fields['center_language_'+(index+1)].Id = tmp[index].Id;
          });          

          if(that.back_btn_activated_at) deActivateBack(4);
          that.loading = false;
        }, 300);
      }
    }, 400);
  }

  that.resetThisField = function (val, index){

    if(!val) that.fields['center_language_'+index].Percentage=null;
    else  that.fields['center_language_'+index].Percentage=1;
  }

  that.multiRoleCheck = function (facility_staff){

    var records_to_insert = {};
    facility_staff.forEach(function (staff, index){

      if(Object.keys(staff.StaffRoleCode).length > 1){
        var multiples = that.getMultiEntries(staff);
        records_to_insert[index] = multiples;
      }
    });

    var total_duplicates = 0;
    Object.keys(records_to_insert).forEach(function (key, idx){


      var front_half = facility_staff.slice(0, (parseInt(key)+total_duplicates));
      var second_half = facility_staff.slice(parseInt(key)+total_duplicates+1, facility_staff.length);

      total_duplicates += records_to_insert[key].length-1;

      var final_output = front_half.concat(records_to_insert[key]).concat(second_half);
      facility_staff = final_output;
    });
    return facility_staff;
  },

  that.getMultiEntries = function (staff){

    var role_keys       = Object.keys(staff.StaffRoleCode);
    var staff_role_codes = staff.StaffRoleCode;
    var multi = [];
    var val 
    role_keys.forEach(function (key){

      if(staff.StaffRoleCode[key]){

        var o = angular.copy(staff);
        o.StaffRoleCode = {};
        o.StaffRoleCode[key] = staff_role_codes[key];
        multi.push(o);
      }
    })
    return multi;
  }

  that.removeStaffWithoutRole = function (facility_staff){

    var refined = [];
    facility_staff.forEach(function (staff, index){
      
      if('StaffRoleCode' in staff){
        refined.push(staff);
      }
    });
    return refined;
  }

  // that.fillRoles = function (facility_staff){

  //   facility_staff.forEach(function (staff, index){
      
  //     staff.StaffRoleCode.code = staff.StaffRoleCode.EducationalRoleCode || staff.StaffRoleCode.EducationalRoleCode2  
  //     || staff.StaffRoleCode.SpecialStaffRoleCode || staff.StaffRoleCode.SupportStaffRoleCode
  //     || staff.StaffRoleCode.ManagementRoleCode;


  //     staff.StaffRoleCode.role_key = Object.keys(staff.StaffRoleCode)[0];
  //     staff.StaffRoleCode.details  = that.getRoleDetailsById(staff.StaffRoleCode.code);
  //   });
  //   return facility_staff;
  // }

  that.fillRolesData = function (facility_staff){

    facility_staff.forEach(function (staff, index){
      Object.keys(staff.StaffRoleCode).forEach(function (each_role, idx){
        // if(!staff.StaffRoleCode.details) staff.StaffRoleCode.details = {};
        staff.StaffRoleCode[each_role]  = that.getRoleDetailsById(staff.StaffRoleCode[each_role]);
      }); 
    });
    return facility_staff;
  }

  that.initStaffPage = function (){
    
    that.loading = true;
    that.fields.current_page = 5;
    if(that.is_edit_mode || that.back_btn_activated_at) {

      deActivateBack(5);
      that.loading = false;
      return;
    }
    var params = {
      query: JSON.stringify({
        facility:that.fields.facility._id,
      }),
    }
    formlyAdapter.getList('staff', params).then(function (staffMembers){
      
     // Patch for SMS-728
     var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
      //console.log(ece_return_plus_seven.toString())
      staffMembers=staffMembers.filter(function(s){
         if(s && s.Finance && s.Finance.EmploymentStartDate &&  s.Finance.EmploymentEndDate){
           if(moment(s.Finance.EmploymentEndDate).isBefore(that.fields.ecereturn_date) || moment(s.Finance.EmploymentEndDate).isBefore(that.fields.ecereturnweekstart_date)){
            return false;
           }/*else if(moment(s.Finance.EmploymentStartDate).isAfter(that.fields.ecereturnweekend_date) || moment(s.Finance.EmploymentStartDate).isAfter(that.fields.ecereturn_date)){
            return false;
           }*/else if(moment(s.Finance.EmploymentStartDate).isAfter(ece_return_plus_seven)){
              return false;
           }
         }else if(s && s.Finance && s.Finance.EmploymentStartDate){
          if(moment(s.Finance.EmploymentStartDate).isAfter(ece_return_plus_seven)){
              return false;
           }
         }else if(s && s.Finance &&  s.Finance.EmploymentEndDate){
          if(moment(s.Finance.EmploymentEndDate).isBefore(that.fields.ecereturn_date) || moment(s.Finance.EmploymentEndDate).isBefore(that.fields.ecereturnweekstart_date)){
            return false;
           }
         }
        return true;
        
      })
      that.fields.facility_staff = staffMembers;
      that.fields.facility_staff_backup = staffMembers;
      return formlyAdapter.getList('staffrolecode');
    }).then(function (staff_role_codes){ 


      that.fields.facility_staff_role_codes = JSON.parse(JSON.stringify(staff_role_codes));

      var s_roles = staff_role_codes;

      s_roles.forEach(function (role, index){
        if(role.Code=='HBC' ||role.Code=='ECET' ||role.Code=='HBE' ||role.Code=='PE'){

          that.fields.facility_staff_role_codes_EDU.push(role);
        } else if(role.Code=='SNRMS' ){
          
          that.fields.facility_staff_role_codes_MGMT.push(role);
        } else if(role.Code=='SUPS' ){
          
          that.fields.facility_staff_role_codes_SUPS.push(role);
        } else if(role.Code=='SPEC' ){
          
          that.fields.facility_staff_role_codes_SPEC.push(role);
        }
      });

      /* NEW LOGIC */
      // that.fields.staff = angular.copy(that.fields.facility_staff);
      // that.fields.staff = that.removeStaffWithoutRole(that.fields.staff);
      // that.fields.staff = that.fillRolesData(that.fields.staff);
      // that.fields.staff = that.roleBasedFiltering(JSON.parse(JSON.stringify(that.fields.staff)))
      /* NEW LOGIC ENDS*/

      that.loading = false;
      /* OLD LOGIC*/
      
      that.fields.facility_staff = that.removeStaffWithoutRole(that.fields.facility_staff);
      // that.fields.facility_staff = that.multiRoleCheck(that.fields.facility_staff);
      // that.fields.facility_staff = that.fillRoles(that.fields.facility_staff);
      that.fields.facility_staff = that.fillRolesData(that.fields.facility_staff);
      that.fields.facility_staff = that.roleBasedFiltering(JSON.parse(JSON.stringify(that.fields.facility_staff)))

      $timeout(function() {
        that.fields.staff = angular.copy(that.fields.facility_staff);
        that.loading = false;
      }, 400);
       /*OLD LOGIC ENDS */
    });
  } 

  that.getRolesListByKey = function(roleKey){

    var arr = [];
    if(roleKey=='EducationalRoleCode') arr = that.fields.facility_staff_role_codes_EDU;
    else if(roleKey=='EducationalRoleCode2') arr = that.fields.facility_staff_role_codes_EDU;
    else if(roleKey=='ManagementRoleCode') arr = that.fields.facility_staff_role_codes_MGMT;
    else if(roleKey=='SupportStaffRoleCode') arr = that.fields.facility_staff_role_codes_SUPS;
    else if(roleKey=='SpecialStaffRoleCode') arr = that.fields.facility_staff_role_codes_SPEC;

    return arr;
  }

  that.confirmDeleteStaff = function (){

    var choice = '';
    var warning_text = 'You want to delete this staff.';
    return dialog.showOkCancelDialog("Are you sure ?",warning_text , "Yes", "No").then(function (confirmed) {
      choice = true;
    }, function (cancelled){
      choice = false;
    }).then(function (){

      return choice;
    });   
  }

  that.deleteStaff = function (staff_idx){

    that.confirmDeleteStaff().then(function (choice){

      if(!choice) return;
      that.fields.staff.splice(staff_idx,1);
    })
  }

  that.getAddStaffModalHTML = function (){

    return '<div class data-ng-include="\'components/ecereturn/add-staff-modal.html\'"> </div>';
  }

  that.addStaff = function (){

    var parentElem    = angular.element($document[0].querySelector('.modal-demo'));
    var modalInstance = $modal.open({

      template: that.getAddStaffModalHTML(),
      controller: addStaffModalCtrl,
      controllerAs:'vm',
      size: 'md',
      appendTo: parentElem,
      resolve: {
        facility_staff: function () {
          return that.fields.facility_staff_backup;
        },
        staff: function () {
          return that.fields.staff;
        },
        findObjInArr: function () {
          return that.findObjInArr;
        },
      }
    });

    modalInstance.result.then(function (new_staff_index) {
      that.fields.staff.push(that.fields.facility_staff_backup[new_staff_index]);
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  }
  var addStaffModalCtrl = function ($scope, $modalInstance, facility_staff, staff, findObjInArr, formlyAdapter){

    var that = this;
    that.new_staff_index = '';
    that.remaining_staff = angular.copy(facility_staff);

    staff.forEach(function (staffMember){

      var idx = findObjInArr(that.remaining_staff, '_id', staffMember._id);
      that.remaining_staff.splice(idx,1);
    });

    that.addStaff = function (){

      var idx = that.new_staff_index;
      idx = findObjInArr(facility_staff, '_id', that.remaining_staff[idx]._id);
      $modalInstance.close(idx);
    }

    that.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };
  that.roleBasedFiltering = function (facility_staff){

    facility_staff.forEach(function(staff, index){

      var o = {
        emp_start_date  : staff.Finance? (staff.Finance.EmploymentStartDate || null) : null,
        emp_end_date    : staff.Finance? (staff.Finance.EmploymentEndDate || null) : null,
      }
      var roles_count = 0;
      var valid_roles_count = 0;
      Object.keys(staff.StaffRoleCode).forEach(function (one_role_key){

        roles_count++;
        var role = staff.StaffRoleCode[one_role_key];
        var non_teaching_codes = {'SNRMS':null, 'SUPS':null, 'SPEC':null};

        /*-------------------------*/
        /* Educational role check  */
        /*-------------------------*/
        if(!that.fields.ecereturn_date_last_year) that.fields.ecereturn_date_last_year = moment(that.fields.ecereturn_date).subtract(1, 'years').toString();

        var EducationalRoleCheck   =  one_role_key == 'EducationalRoleCode' && 
          role &&
          ( role.Code == 'PE'   ||
            role.Code == 'ECET' ||
            role.Code == 'HBC' 
          // ) &&
          // o.emp_start_date &&
          ) ||
          (
            o.emp_end_date &&
            that.isDateInRange (that.fields.ecereturn_date_last_year, that.fields.ecereturn_date, o.emp_end_date)
          )
          // that.fields.ecereturn_date_last_year &&
          // that.isDateInRange (that.fields.ecereturn_date_last_year, that.fields.ecereturn_date, o.emp_start_date);

        var non_teaching_HBE_and_working =  role && (role.Code == 'HBE' ||
            role.Code in non_teaching_codes
          ) &&
          o.emp_start_date &&
          (
            o.emp_end_date ? 
            that.isDateInRange(o.emp_start_date, o.emp_end_date, that.fields.ecereturn_date) : 
            new Date(o.emp_start_date) <= that.fields.ecereturn_date
          );

        /*--------------------------*/
        /* Educational role 2 check */
        /*--------------------------*/
        var EducationalRole2Check   =  one_role_key == 'EducationalRoleCode2' && non_teaching_HBE_and_working;

        /*-----------------------*/
        /* Management role check */
        /*-----------------------*/
        var ManagementRoleCheck   =  one_role_key == 'ManagementRoleCode' && non_teaching_HBE_and_working;

        /*--------------------------*/
        /* Support staff role check */
        /*--------------------------*/
        var SupportStaffRoleCheck   =  one_role_key == 'SupportStaffRoleCode' && non_teaching_HBE_and_working;

        /*--------------------------*/
        /* Special staff role check */
        /*--------------------------*/
        var SpecialStaffRoleCheck   =  one_role_key == 'SpecialStaffRoleCode' && non_teaching_HBE_and_working;

        if( 
          EducationalRoleCheck  ||
          EducationalRole2Check ||
          ManagementRoleCheck   ||
          SupportStaffRoleCheck ||
          SpecialStaffRoleCheck
        ){
          staff.StaffRoleCode[one_role_key].is_valid = 'true';
          valid_roles_count++;
        } else{

          if(staff.StaffRoleCode[one_role_key]) staff.StaffRoleCode[one_role_key].is_valid = 'false';
          else   delete staff.StaffRoleCode[one_role_key];
        }
      });
      staff.roles_count = roles_count;
      staff.valid_roles_count = valid_roles_count;
    });
    var filter = [];
    facility_staff.forEach(function(item, index, object){

      if(item.valid_roles_count){
        filter.push(item);
      }
    });

    return filter;
  }

  that.openSubPage = function (staffIndex){

    that.open_subpage = true;
    that.loading = true;
    that.subpage_staff_index = staffIndex;
    that.subpage_staff = that.fields.staff[staffIndex];
    that.subpage_staff_bckp=JSON.parse(JSON.stringify(that.fields.staff[staffIndex]));
    if(! ('extra_details' in that.subpage_staff)){

      that.subpage_staff.extra_details = {};
      that.initStaffExtras();
      
    } else{
      that.subpage_staff.extra_details.StaffRoleCode = [];
      that.subpage_staff.extra_details.head_clicks++;

      $timeout(function() {
        that.subpage_staff.extra_details.StaffRoleCode = angular.copy(that.subpage_staff.StaffRoleCode);
        that.initRoleCodes();
        that.loading = false;
      }, 300);
    }

    that.started_watcher = $scope.$watch(function (scope) { 
      return ( that.subpage_staff.extra_details.started ); }, function(){ that['startedOpened']=false;
    });
    that.end_watcher = $scope.$watch(function (scope) { 
      return ( that.subpage_staff.extra_details.left ); }, function(){ that['endOpened']=false;
    });
    if(that.subpage_staff.StaffRoleCode.EducationalRoleCode2 && that.subpage_staff.StaffRoleCode.EducationalRoleCode2.Code=='HBC'){
      if(that.subpage_staff && that.subpage_staff.extra_details){
          that.started_watcher1= $scope.$watch(function (scope) { 
          return ( that.subpage_staff.extra_details.started1 ); }, function(){ that['started1Opened']=false;
        });
        that.end_watcher1 = $scope.$watch(function (scope) { 
          return ( that.subpage_staff.extra_details.left1 ); }, function(){ that['end1Opened']=false;
        });
      }
        
    }
    
  }

  that.initRoleCodes = function (){
    
    if(that.subpage_staff.extra_details.StaffRoleCode){
    
      that.subpage_staff.extra_details.role_codes = [];
      Object.keys(that.subpage_staff.extra_details.StaffRoleCode).forEach(function (key){

        if(that.subpage_staff.StaffRoleCode[key])
        that.subpage_staff.extra_details.role_codes.push(that.subpage_staff.StaffRoleCode[key].Code);
      });
    }
  }

  that.ifRolesContain = function (arr_of_values){

    // console.log('is called')
    if(!that.subpage_staff || !that.subpage_staff.extra_details || !that.subpage_staff.extra_details.role_codes) return false;

    var flag = false;
    arr_of_values.forEach(function (onevalue){
      if(that.subpage_staff.extra_details.role_codes.indexOf(onevalue) >=0) flag = true;
    });
    return flag;
  }

  that.checkRoleEligibility = function (role, matches_arr){

    var flag = false;

    if(!role || !role.Code) return flag;

    if( matches_arr.indexOf(role.Code) >=0 ) flag= true;

    return flag;
  }

  that.subPageBack = function (){

    var subpage_staff_index = that.subpage_staff_index;
    that.closeSubpage();
    if(that.fields.staff[subpage_staff_index].extra_details.head_clicks == 1)
    delete that.fields.staff[subpage_staff_index].extra_details;
  }

  function getMinAttendanceStart (date){

    date = moment(new Date(date)).format("DD-MM-YYYY");
    var obj = that.fields.attendances_min_max_data[date];
    return obj.min;
  }

  function getMaxAttendanceEnd (date){

    date = moment(new Date(date)).format("DD-MM-YYYY");
    var obj = that.fields.attendances_min_max_data[date];
    return obj.max;
  }

  that.attendanceCheck = function (staff){
    var is_valid = true;
    if(staff){
        if(staff.extra_details.ece_return_week){
          staff.extra_details.ece_return_week.forEach(function (each_day){

      var each_day_hours        = each_day.hours;
      var min_attendance_start  = getMinAttendanceStart(each_day.date);
      var max_attendance_end    = getMaxAttendanceEnd(each_day.date);

      console.log('each_day.Date',each_day.date)
      console.log('min_attendance_start',min_attendance_start)
      console.log('max_attendance_end',max_attendance_end)

      if(min_attendance_start && max_attendance_end && is_valid){

        min_attendance_start  = moment().hours(min_attendance_start.split(':')[0]).minutes(min_attendance_start.split(':')[1]).seconds(0);
        max_attendance_end    = moment().hours(max_attendance_end.split(':')[0]).minutes(max_attendance_end.split(':')[1]).seconds(0);

        each_day_hours.forEach(function (each_hour){

          var hour_start  = moment().hours(each_hour.start_time.split(':')[0]).minutes(each_hour.start_time.split(':')[1]).seconds(0);
          var hour_end    = moment().hours(each_hour.end_time.split(':')[0]).minutes(each_hour.end_time.split(':')[1]).seconds(0);

          hour_start.format('HH:mm');
          hour_end.format('HH:mm');

          if(
            /*!(min_attendance_start >= hour_start &&
            min_attendance_start < hour_end)
            &&
            !(max_attendance_end >= hour_start &&
            max_attendance_end < hour_end)*/
           !(min_attendance_start <= hour_start &&
            hour_start < max_attendance_end)
            &&
            !(max_attendance_end > hour_start &&
            max_attendance_end <= hour_end) 

          ){
            is_valid = false;
            console.log('*******')
            console.log('hour_start',hour_start.toString());
            console.log('hour_end',hour_end.toString());
            console.log('*******')
          }
        });
      }else if(each_day_hours.length){
        is_valid = false;
      }
    });
    }
    }else{
      console.log("that.subpage_staff.extra_details.ece_return_week",that.subpage_staff.extra_details.ece_return_week);
    if(that.subpage_staff.extra_details.ece_return_week){
          that.subpage_staff.extra_details.ece_return_week.forEach(function (each_day){

      var each_day_hours        = each_day.hours;
      var min_attendance_start  = getMinAttendanceStart(each_day.date);
      var max_attendance_end    = getMaxAttendanceEnd(each_day.date);

      console.log('each_day.Date',each_day.date)
      console.log('min_attendance_start',min_attendance_start)
      console.log('max_attendance_end',max_attendance_end)

      if(min_attendance_start && max_attendance_end && is_valid){

        min_attendance_start  = moment().hours(min_attendance_start.split(':')[0]).minutes(min_attendance_start.split(':')[1]).seconds(0);
        max_attendance_end    = moment().hours(max_attendance_end.split(':')[0]).minutes(max_attendance_end.split(':')[1]).seconds(0);

        each_day_hours.forEach(function (each_hour){

          var hour_start  = moment().hours(each_hour.start_time.split(':')[0]).minutes(each_hour.start_time.split(':')[1]).seconds(0);
          var hour_end    = moment().hours(each_hour.end_time.split(':')[0]).minutes(each_hour.end_time.split(':')[1]).seconds(0);

          hour_start.format('HH:mm');
          hour_end.format('HH:mm');

          if(
            /*!(min_attendance_start >= hour_start &&
            min_attendance_start < hour_end)
            &&
            !(max_attendance_end >= hour_start &&
            max_attendance_end < hour_end)*/
           !(min_attendance_start <= hour_start &&
            hour_start < max_attendance_end)
            &&
            !(max_attendance_end > hour_start &&
            max_attendance_end <= hour_end) 

          ){
            is_valid = false;
            console.log('*******')
            console.log('hour_start',hour_start.toString());
            console.log('hour_end',hour_end.toString());
            console.log('*******')
          }
        });
      }else if(each_day_hours.length){
        is_valid = false;
      }
    });
    }
    }
    
    
    return is_valid;
  }

  that.showContactHours=function(){
    if(that.subpage_staff && that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode.EducationalRoleCode && that.subpage_staff.StaffRoleCode.EducationalRoleCode2){
       return (that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code !="ECET" &&  that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code !="HBC" && that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code !="PE") && (that.subpage_staff.StaffRoleCode.EducationalRoleCode2.Code!="HBC")
    }else if(that.subpage_staff && that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode.EducationalRoleCode){
        return  (that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code !="ECET" &&  that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code !="HBC" && that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code !="PE")
    }else if(that.subpage_staff && that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode.EducationalRoleCode2){
      return that.subpage_staff.StaffRoleCode.EducationalRoleCode2.Code!="HBC";
    }
    return true;

  }
 
  that.validateStartEndDates=function(val){
    var flag=true;
        if(val =='left'){
          if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left){
             if(that.subpage_staff.extra_details.started && moment(that.subpage_staff.extra_details.left).isBefore(that.subpage_staff.extra_details.started)){
                flag = false;
             }
             
          }
        }else if(val=="left1"){
            if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left1){
               if(that.subpage_staff.extra_details.started1 && moment(that.subpage_staff.extra_details.left1).isBefore(that.subpage_staff.extra_details.started1)){
                      flag = false;
                   }
                  
             }
        }else{
          if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left){
             if(that.subpage_staff.extra_details.started && moment(that.subpage_staff.extra_details.left).isBefore(that.subpage_staff.extra_details.started)){
                flag = false;
             }
             
          }
         

        if(Auth.getCurrentUser().facility.CentreType=="Home Based"){
            if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left1){
               if(that.subpage_staff.extra_details.started1 && moment(that.subpage_staff.extra_details.left1).isBefore(that.subpage_staff.extra_details.started1)){
                      flag = false;
                   }
                  
             }
           }
       } 
     return flag;

  }
  that.validateContactHours=function(){
    var contactHrsFlag=false;
    
    if(that.subpage_staff && that.subpage_staff.StaffRoleCode){
      if((that.subpage_staff.StaffRoleCode.EducationalRoleCode2 && that.subpage_staff.StaffRoleCode.EducationalRoleCode2.Code!="HBE") || (that.subpage_staff.StaffRoleCode.EducationalRoleCode && that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code!="HBE") ){
      contactHrsFlag=true;
    }
      if(that.subpage_staff.StaffRoleCode.EducationalRoleCode && that.subpage_staff.StaffRoleCode.EducationalRoleCode.Code!="HBE"){
          if(that.subpage_staff && that.subpage_staff.extra_details.ece_return_week && that.subpage_staff.extra_details.ece_return_week.length){
            that.subpage_staff.extra_details.ece_return_week.forEach(function (oneday){
                   if(oneday.hours.length){
                     contactHrsFlag=false;
                   }
            });
        }
      }
      if(that.subpage_staff.StaffRoleCode.EducationalRoleCode2 && that.subpage_staff.StaffRoleCode.EducationalRoleCode2.Code!="HBE"){
        if(that.subpage_staff && that.subpage_staff.extra_details.ece_return_week && that.subpage_staff.extra_details.ece_return_week.length){
          that.subpage_staff.extra_details.ece_return_week.forEach(function (oneday){
                 if(oneday.hours.length){
                   contactHrsFlag=false;
                 }
          });
      }
      }
      
        
    }
    return contactHrsFlag;
  }

  that.validateStartLeftDates=function(val){
    // check employmentStart & Left dates
    
    var staffCheckFlag=true;
     
    if(val=='left'){
      if(typeof(that.subpage_staff.extra_details.left)=='Invalid Date'){
        that.subpage_staff.extra_details.left=null;
      }

      if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left){
            
             if(moment(that.subpage_staff.extra_details.left).isBefore(that.fields.ecereturn_date) || moment(that.subpage_staff.extra_details.left).isBefore(that.fields.ecereturnweekstart_date)){
               
               staffCheckFlag = false;
             }
          }
    }else if(val=='left1'){
      if(typeof(that.subpage_staff.extra_details.left1)=='Invalid Date'){
        that.subpage_staff.extra_details.left1=null;
      }
      if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left1){
              
               if(moment(that.subpage_staff.extra_details.left1).isBefore(that.fields.ecereturn_date) || moment(that.subpage_staff.extra_details.left1).isBefore(that.fields.ecereturnweekstart_date)){
                 staffCheckFlag = false;
               }
         }
    }else if(val =='started'){
      var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
      if(typeof(that.subpage_staff.extra_details.started)=='Invalid Date'){
        that.subpage_staff.extra_details.started=null;
      }
        if(that.subpage_staff && that.subpage_staff.extra_details && that.subpage_staff.extra_details.started){
          

          if(moment(that.subpage_staff.extra_details.started).isAfter(ece_return_plus_seven)){
                 staffCheckFlag = false;
             }
        }
    }else if(val =='started1'){
      var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
      if(typeof(that.subpage_staff.extra_details.started1)=='Invalid Date'){
        that.subpage_staff.extra_details.started1=null;
      }
       if(that.subpage_staff && that.subpage_staff.extra_details && that.subpage_staff.extra_details.started1){
         
          if(moment(that.subpage_staff.extra_details.started1).isAfter(ece_return_plus_seven)){
                 staffCheckFlag = false;
             }
        }
    }else{
      
        if(that.subpage_staff && that.subpage_staff.extra_details && that.subpage_staff.extra_details.started  &&  that.subpage_staff.extra_details.left){
           var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
           if(typeof(that.subpage_staff.extra_details.started)=='Invalid Date' || typeof(that.subpage_staff.extra_details.left)=='Invalid Date'){
             that.subpage_staff.extra_details.started=null;
              that.subpage_staff.extra_details.left=null;
            }
             if(moment(that.subpage_staff.extra_details.left).isBefore(that.fields.ecereturn_date) || moment(that.subpage_staff.extra_details.left).isBefore(that.fields.ecereturnweekstart_date)){
              staffCheckFlag = false;
             }else if(moment(that.subpage_staff.extra_details.statred).isAfter(ece_return_plus_seven)){
                 staffCheckFlag = false;
             }
        }else if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left){
             if(typeof(that.subpage_staff.extra_details.left)=='Invalid Date'){
              that.subpage_staff.extra_details.left=null;
            }
             if(moment(that.subpage_staff.extra_details.left).isBefore(that.fields.ecereturn_date) || moment(that.subpage_staff.extra_details.left).isBefore(that.fields.ecereturnweekstart_date)){
               staffCheckFlag = false;
             }
        }else if(that.subpage_staff && that.subpage_staff.extra_details && that.subpage_staff.extra_details.started){
          var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
          if(typeof(that.subpage_staff.extra_details.started)=='Invalid Date' ){
              that.subpage_staff.extra_details.started=null;
           }
          if(moment(that.subpage_staff.extra_details.started).isAfter(ece_return_plus_seven)){
                 staffCheckFlag = false;
             }
        }
        if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
         
          if(that.subpage_staff && that.subpage_staff.extra_details && that.subpage_staff.extra_details.started1  &&  that.subpage_staff.extra_details.left1){
             var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
              if(typeof(that.subpage_staff.extra_details.started1)=='Invalid Date' ||  typeof(that.subpage_staff.extra_details.left1)=='Invalid Date'){
                that.subpage_staff.extra_details.started1=null;
                that.subpage_staff.extra_details.left1=null;
                
              }
             if(moment(that.subpage_staff.extra_details.left1).isBefore(that.fields.ecereturn_date) || moment(that.subpage_staff.extra_details.left1).isBefore(that.fields.ecereturnweekstart_date)){
                staffCheckFlag = false;
               }else if(moment(that.subpage_staff.extra_details.statred1).isAfter(ece_return_plus_seven)){
                   staffCheckFlag = false;
               }
          }else if(that.subpage_staff && that.subpage_staff.extra_details &&  that.subpage_staff.extra_details.left1){
              
               if(typeof(that.subpage_staff.extra_details.left1)=='Invalid Date'){
                       that.subpage_staff.extra_details.left1=null;
                
              }
               if(moment(that.subpage_staff.extra_details.left1).isBefore(that.fields.ecereturn_date) || moment(that.subpage_staff.extra_details.left1).isBefore(that.fields.ecereturnweekstart_date)){
                 staffCheckFlag = false;
               }
          }else if(that.subpage_staff && that.subpage_staff.extra_details && that.subpage_staff.extra_details.started1){
             var ece_return_plus_seven=moment(that.fields.ecereturn_date).add(7,'days');
              if(typeof(that.subpage_staff.extra_details.started1)=='Invalid Date' ){
                that.subpage_staff.extra_details.started1=null;
               } 

            if(moment(that.subpage_staff.extra_details.started1).isAfter(ece_return_plus_seven)){
                   staffCheckFlag = false;
               }
          }
        }
    }
    
    return staffCheckFlag;
  }

  that.closeSubpage = function (event){

    var is_valid = that.attendanceCheck();
    
    if(event && !is_valid){
      that.subpage_staff.extra_details.validContactHours=false;
      console.log('is_valid',is_valid);
      var msg = "You have recorded child attendance during the ECE return week that falls outside of Staff Contact Hours for the same week. Please go back and amend either the incorrect child attendance data or the staff hours and then submit your ECE Return";
      dialog.showOkDialog("Error", msg);
      return;
    }else if(event && is_valid){
      that.subpage_staff.extra_details.validContactHours=true;  
    }
    
    that.started_watcher();
    that.end_watcher();
    that.subpage_staff_index = null;
    that.subpage_staff = null;
    that.open_subpage = false;

  }

  that.initStaffExtras  = function(){

    console.log('staff', that.subpage_staff)
    that.subpage_staff.extra_details.validContactHours=true;
    that.initEthnicCodes().then(function (codes){

      that.subpage_staff.extra_details.head_clicks = 1;
      that.fields.ethnic_codes                     = codes;
      that.subpage_staff.extra_details.started     = that.subpage_staff.Finance ? that.subpage_staff.Finance.EmploymentStartDate:'';
      that.subpage_staff.extra_details.left        = that.subpage_staff.Finance? that.subpage_staff.Finance.EmploymentEndDate:'';
      that.subpage_staff.extra_details.started1     = that.subpage_staff.Finance ? that.subpage_staff.Finance.EmploymentStartDate:'';
      that.subpage_staff.extra_details.left1        = that.subpage_staff.Finance? that.subpage_staff.Finance.EmploymentEndDate:'';

      $timeout(function() {
        if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
            if(that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode['EducationalRoleCode'] && that.subpage_staff.StaffRoleCode['EducationalRoleCode'].Code=="HBE"){
              that.educatorText="This person is a Homebased Educator engaged in the care and education of children";
              that.educatorText1="This person is a Homebased Coordinator engaged in the selection,supervision & support of caregivers,the placement of children and the monitoring of the education and care programme";
              that.personText1="A person in this role working 25 hours per week or more is considered full-time";
              that.personText="A person in this role working 25 hours per week or more is considered full-time";
            }else if(that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode['EducationalRoleCode'] && that.subpage_staff.StaffRoleCode['EducationalRoleCode'].Code=="HBC"){
              that.educatorText1="This person is a Homebased Educator engaged in the care and education of children";
              that.educatorText="This person is a Homebased Coordinator engaged in the selection,supervision & support of caregivers,the placement of children and the monitoring of the education and care programme";   
            }else{
              if(that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode['EducationalRoleCode2'] && that.subpage_staff.StaffRoleCode['EducationalRoleCode2'].Code=="HBE"){
                   that.educatorText1="This person is a Homebased Educator engaged in the care and education of children";
                   that.educatorText="This person is a Homebased Coordinator engaged in the selection,supervision & support of caregivers,the placement of children and the monitoring of the education and care programme";   
          
              }else{
                that.educatorText="This person is a Homebased Educator engaged in the care and education of children";
                that.educatorText1="This person is a Homebased Coordinator engaged in the selection,supervision & support of caregivers,the placement of children and the monitoring of the education and care programme";
                that.personText1="A person in this role working 25 hours per week or more is considered full-time";
                that.personText="A person in this role working 25 hours per week or more is considered full-time";
             
              }
            }

            if(that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode['EducationalRoleCode2']){
               if(that.subpage_staff.StaffRoleCode['EducationalRoleCode2'].Code=="HBE"){
                  that.educatorText1="This person is a Homebased Educator engaged in the care and education of children";
                that.personText1="A person in this role working 25 hours per week or more is considered full-time";
               }else if(that.subpage_staff.StaffRoleCode['EducationalRoleCode2'].Code=="HBC"){
                 that.educatorText1="This person is a Homebased Coordinator engaged in the selection,supervision & support of caregivers,the placement of children and the monitoring of the education and care programme";
               }else{
                if(that.subpage_staff.StaffRoleCode && that.subpage_staff.StaffRoleCode['EducationalRoleCode'] && that.subpage_staff.StaffRoleCode['EducationalRoleCode'].Code=="HBE" ){
                  that.educatorText1="This person is a Homebased Coordinator engaged in the selection,supervision & support of caregivers,the placement of children and the monitoring of the education and care programme";
                }else{
                  that.educatorText1="This person is a Homebased Educator engaged in the care and education of children";
                that.personText1="A person in this role working 25 hours per week or more is considered full-time";
               }
            }  
        }
      }
      
        that.subpage_staff.extra_details.ethnicity1  = that.subpage_staff.EthnicGroup1Code || '';
        that.subpage_staff.extra_details.ethnicity2  = that.subpage_staff.EthnicGroup2Code || '';
        that.subpage_staff.extra_details.ethnicity3  = that.subpage_staff.EthnicGroup3Code || '';
        that.subpage_staff.extra_details.ethnicity4  = that.subpage_staff.EthnicGroup1Code || '';
        that.subpage_staff.extra_details.ethnicity5  = that.subpage_staff.EthnicGroup2Code || '';
        that.subpage_staff.extra_details.ethnicity6  = that.subpage_staff.EthnicGroup3Code || '';

        that.subpage_staff.extra_details.StaffRoleCode = angular.copy(that.subpage_staff.StaffRoleCode);

        that.subpage_staff.ECEQualificationsDetails.IsRegistered = that.subpage_staff.ECEQualificationsDetails? ( that.subpage_staff.ECEQualificationsDetails.IsRegistered? that.subpage_staff.ECEQualificationsDetails.IsRegistered.toString():'' ):'';

        if(!that.subpage_staff.Finance) that.subpage_staff.Finance = {};

        that.subpage_staff.Finance.IsPaid = that.subpage_staff.Finance?( that.subpage_staff.Finance.IsPaid? that.subpage_staff.Finance.IsPaid.toString():'' ):'';
        that.subpage_staff.Finance.IsFullTime = that.subpage_staff.Finance ? (that.subpage_staff.Finance.IsFullTime?that.subpage_staff.Finance.IsFullTime.toString(): '' ):'';
        that.subpage_staff.Finance.IsPermanent = that.subpage_staff.Finance ? ( that.subpage_staff.Finance.IsPermanent ? that.subpage_staff.Finance.IsPermanent.toString():'' ):'';

        if(
          !that.subpage_staff.ECEQualificationsDetails && 
          !that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode 
        ){

          that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode = [''];
        }else if(
          that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode 
          && !that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode.length
        ){

          that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode = [''];
        } else if(
          that.subpage_staff.ECEQualificationsDetails && 
          !that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode 
        ){


          that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode = [''];
        } else if(
          that.subpage_staff.ECEQualificationsDetails && 
          ('HighestPlaycentreQualificationCode' in that.subpage_staff.ECEQualificationsDetails) &&
          !(that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode instanceof Array)
        ){

          that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode=[that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode];
        }

        if(that.subpage_staff.ECEQualificationsDetails && that.subpage_staff.ECEQualificationsDetails.HighestQualificationCode){
          that.subpage_staff.extra_details.HighestQualificationCode= that.subpage_staff.ECEQualificationsDetails.HighestQualificationCode;
          that.subpage_staff.extra_details.HighestQualificationCode1= that.subpage_staff.ECEQualificationsDetails.HighestQualificationCode;
        }


       $timeout(function() {
        
          that.subpage_staff.extra_details.HighestPlaycentreQualificationCode = that.subpage_staff.ECEQualificationsDetails.HighestPlaycentreQualificationCode[0].toString();
        
          /*init staff isPaid, IsRegistered etc per role basis*/
          if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
              var roleCodeData=["EducationalRoleCode","EducationalRoleCode2","ManagementRoleCode","SupportStaffRoleCode","SpecialStaffRoleCode"];
          }else{
            var roleCodeData=["EducationalRoleCode","ManagementRoleCode","SupportStaffRoleCode","SpecialStaffRoleCode"];     
          }
         // Object.keys(that.subpage_staff.StaffRoleCode).forEach(function (role_key){
           roleCodeData.forEach(function (role_key){
            
            if(that.subpage_staff.StaffRoleCode[role_key]) {
                if(role_key =='EducationalRoleCode' || role_key =='EducationalRoleCode2'){
                  that.subpage_staff.StaffRoleCode[role_key].IsRegistered = that.subpage_staff.ECEQualificationsDetails.IsRegistered.toString();
                  if(that.subpage_staff.StaffRoleCode[role_key]._id){
                    that.subpage_staff.StaffRoleCode[role_key].is_valid=true;
                  }         
                }
            

            that.subpage_staff.StaffRoleCode[role_key].IsPaid = that.subpage_staff.Finance.IsPaid.toString();
            that.subpage_staff.StaffRoleCode[role_key].IsPermanent = that.subpage_staff.Finance.IsPermanent.toString();
            that.subpage_staff.StaffRoleCode[role_key].IsFullTime = that.subpage_staff.Finance.IsFullTime.toString();
            }else{
                that.subpage_staff.StaffRoleCode[role_key]=null;
            }

            
            
          });
          
          if(that.subpage_staff.StaffRoleCode){

            if(that.subpage_staff.StaffRoleCode.ManagementRoleCode && that.subpage_staff.StaffRoleCode.ManagementRoleCode.Code=='SNRMS')
            that.subpage_staff.extra_details.this_person_has_a_senior_management_staff_role = true; 

            if(that.subpage_staff.StaffRoleCode.SupportStaffRoleCode && that.subpage_staff.StaffRoleCode.SupportStaffRoleCode.Code=='SUPS')
            that.subpage_staff.extra_details.this_person_has_a_support_staff_role = true; 

            if(that.subpage_staff.StaffRoleCode.SpecialStaffRoleCode && that.subpage_staff.StaffRoleCode.SpecialStaffRoleCode.Code=='SPEC')
            that.subpage_staff.extra_details.this_person_has_a_specialist_staff_role = true; 

          }

          that.loading = false;
        }, 500);

        that.initRoleCodes();
      }, 500);

      return that.initHighestQualification();
    }).then(function (educator_qualification_codes){
      
      that.fields.educator_qualification_codes = educator_qualification_codes;
    }).then(function(){

      that.subpage_staff.extra_details.ece_return_week = that.initEceWeekDays(that.fields.ecereturn_date, that.subpage_staff);
      return that.initEceWeekDayValues(that.subpage_staff.extra_details.ece_return_week);
    }).then(function (daysWithValues){
      
      that.subpage_staff.extra_details.ece_return_week = daysWithValues;
      return that.initHighestPlayCentreQualification();
    }).then(function (playcentre_qualification_codes){
      
      that.fields.playcentre_qualification_codes = playcentre_qualification_codes;
    }).then(function (){

      /*update attendances for the week*/
      var ece_return_week = that.subpage_staff.extra_details.ece_return_week;
      console.log('that.subpage_staff',that.subpage_staff.extra_details.ece_return_week);

      var week_start  = new Date(ece_return_week[0].date);
      var week_end    = new Date(ece_return_week[ece_return_week.length-1].date);
      
      week_start.setHours(0,0,0);
      week_end.setHours(23,59,59);
      var params = {
        query: JSON.stringify({
          Date: {$gte:week_start,$lte:week_end}
        }),
        sort:'+Date'
      }

      formlyAdapter.getList('attendance', params)
      .then(function (attendances_for_week){

        console.log('attendances_for_week',_.pluck(attendances_for_week,'Date'))
        var day_1_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[0].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        var day_2_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[1].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        var day_3_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[2].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        var day_4_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[3].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        var day_5_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[4].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        var day_6_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[5].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        var day_7_att = _.filter(attendances_for_week, function (each_attendance_entry){

          var date = moment(each_attendance_entry.Date);
          var day_date = moment(new Date(ece_return_week[6].date));
          if(day_date.isSame(date,'day')) return each_attendance_entry;
        });
        console.log('day_1_att',day_1_att)
        console.log('day_2_att',day_2_att)
        console.log('day_3_att',day_3_att)
        console.log('day_4_att',day_4_att)
        console.log('day_5_att',day_5_att)
        console.log('day_6_att',day_6_att)
        console.log('day_7_att',day_7_att)
        var day_1_min_max = {min:'',max:''};
        var day_2_min_max = {min:'',max:''};
        var day_3_min_max = {min:'',max:''};
        var day_4_min_max = {min:'',max:''};
        var day_5_min_max = {min:'',max:''};
        var day_6_min_max = {min:'',max:''};
        var day_7_min_max = {min:'',max:''};

        if(day_1_att.length){

          var tmp_start = _.sortBy(day_1_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_1_att, 'AttendanceTimeEnd');
          day_1_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_1_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        
        if(day_2_att.length){

          var tmp_start = _.sortBy(day_2_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_2_att, 'AttendanceTimeEnd');
          day_2_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_2_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        
        if(day_3_att.length){

          var tmp_start = _.sortBy(day_3_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_3_att, 'AttendanceTimeEnd');
          day_3_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_3_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        
        if(day_4_att.length){

          var tmp_start = _.sortBy(day_4_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_4_att, 'AttendanceTimeEnd');
          day_4_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_4_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        
        if(day_5_att.length){

          var tmp_start = _.sortBy(day_5_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_5_att, 'AttendanceTimeEnd');
          day_5_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_5_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        
        if(day_6_att.length){

          var tmp_start = _.sortBy(day_6_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_6_att, 'AttendanceTimeEnd');
          day_6_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_6_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        
        if(day_7_att.length){

          var tmp_start = _.sortBy(day_7_att, 'AttendanceTimeStart');
          var tmp_end = _.sortBy(day_7_att, 'AttendanceTimeEnd');
          day_7_min_max.min = moment(tmp_start[0].AttendanceTimeStart).format('HH:mm')
          day_7_min_max.max = moment(tmp_end[tmp_end.length-1].AttendanceTimeEnd).format('HH:mm')
        }        

        that.fields.attendances_min_max_data = {};
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[0].date)).format('DD-MM-YYYY')]= day_1_min_max;
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[1].date)).format('DD-MM-YYYY')]= day_2_min_max;
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[2].date)).format('DD-MM-YYYY')]= day_3_min_max;
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[3].date)).format('DD-MM-YYYY')]= day_4_min_max;
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[4].date)).format('DD-MM-YYYY')]= day_5_min_max;
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[5].date)).format('DD-MM-YYYY')]= day_6_min_max;
        that.fields.attendances_min_max_data[moment(new Date(ece_return_week[6].date)).format('DD-MM-YYYY')]= day_7_min_max;

        console.log('that.fields.attendances_min_max_data',that.fields.attendances_min_max_data)
      });
    });
  }

  that.rolesIsPaidEtcCheck = function(staff_role_codes){

    var is_valid = true;
    if(staff_role_codes){

      Object.keys(staff_role_codes).forEach(function (role_key, index){

        if(role_key == 'EducationalRoleCode' || role_key == 'EducationalRoleCode2'){

          if(
            staff_role_codes[role_key] 
            && 
            (
              !staff_role_codes[role_key].IsFullTime 
              || !staff_role_codes[role_key].IsPermanent 
              || (!staff_role_codes[role_key].IsPaid && staff_role_codes[role_key].Code!="HBE")
            )
          ){
            is_valid = false;
          }

          if(
            (role_key == 'EducationalRoleCode' || role_key == 'EducationalRoleCode2')
            && staff_role_codes[role_key] 
            && !staff_role_codes[role_key].IsRegistered 
          ){

            is_valid = false;
          }
        }
      });
    }
    return is_valid;
  }

  that.otherRoleIspaidCheck = function (identifiers_arr, role_keys, subpage_staff_data){

    var is_valid = true;

    if(identifiers_arr && identifiers_arr.length && subpage_staff_data){

      var staff_role_codes  = subpage_staff_data.StaffRoleCode;

      identifiers_arr.forEach(function(identifier, index){

        var flag = getIdentifierName(identifier);
        if(
          subpage_staff_data.extra_details[flag] &&
          staff_role_codes[role_keys[index]] &&
          (
            !staff_role_codes[role_keys[index]].IsFullTime
            || !staff_role_codes[role_keys[index]].IsPermanent
            || !staff_role_codes[role_keys[index]].IsPaid
          )
        ){
          is_valid = false;
        }
        
      });
    }
    return is_valid;
  }

  function getIdentifierName(key){
    return 'this_person_has_a_'+key+'_staff_role';
  }

  that.activateRoleIfNeeded = function(role_key,val){
   if(!val) {
      
        if(role_key=='EducationalRoleCode2'){
          that.subpage_staff.extra_details['HighestQualificationCode1']=null;
          that.subpage_staff.extra_details['started1']=null;
          that.subpage_staff.extra_details['left1']=null;
          that.subpage_staff.extra_details['ethnicity4']=null;
          that.subpage_staff.extra_details['ethnicity5']=null;
          that.subpage_staff.extra_details['ethnicity6']=null;
          if(that.subpage_staff.StaffRoleCode[role_key].Code!='HBE'){
              if(that.subpage_staff.extra_details['ece_return_week'] && that.subpage_staff.extra_details['ece_return_week'].length){
                that.subpage_staff.extra_details['ece_return_week'].forEach(function(eachDay){
                  eachDay.hours=[];
                })
              }
          }
        }else if(role_key=='EducationalRoleCode'){
          that.subpage_staff.extra_details['HighestQualificationCode']=null;
          that.subpage_staff.extra_details['started']=null;
          that.subpage_staff.extra_details['left']=null;
          that.subpage_staff.extra_details['ethnicity1']=null;
          that.subpage_staff.extra_details['ethnicity2']=null;
          that.subpage_staff.extra_details['ethnicity3']=null;
           if(that.subpage_staff.StaffRoleCode[role_key].Code!='HBE'){
              if(that.subpage_staff.extra_details['ece_return_week'] && that.subpage_staff.extra_details['ece_return_week'].length){
                that.subpage_staff.extra_details['ece_return_week'].forEach(function(eachDay){
                  eachDay.hours=[];
                })
              }
          }
        }
      that.subpage_staff.StaffRoleCode[role_key]=null;
      console.log(that.subpage_staff.extra_details);
      return; 
    }
    if(!role_key) return;

    if(!(role_key in that.subpage_staff.StaffRoleCode) || !(that.subpage_staff.StaffRoleCode[role_key] && that.subpage_staff.StaffRoleCode[role_key].Code)){
       that.subpage_staff.StaffRoleCode[role_key] = getRoleKeyData(role_key);  
    }

  }

  function getRoleKeyData(role_key){

    var data = {
      "is_valid":true
    };
    
    if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
      if(role_key=="EducationalRoleCode"){
        if(that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode){
          that.subpage_staff.extra_details['HighestQualificationCode']= that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode;
         }
        
        that.subpage_staff.extra_details['started']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentStartDate:'';
        that.subpage_staff.extra_details['left']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentEndDate:'';
        that.subpage_staff.extra_details['ethnicity1']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity2']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity3']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        if(that.subpage_staff.StaffRoleCode["EducationalRoleCode2"] && that.subpage_staff.StaffRoleCode["EducationalRoleCode2"].Code=="HBE"){
            data["Code"]="HBC";
            data["Label"]="Home Based Co-ordinator";
        }else{

        if(!that.subpage_staff.StaffRoleCode["EducationalRoleCode2"]){
          data["Code"]=(that.subpage_staff_bckp.StaffRoleCode[role_key]) ? that.subpage_staff_bckp.StaffRoleCode[role_key].Code:"HBC";
          data["Label"]=(that.subpage_staff_bckp.StaffRoleCode[role_key] && that.subpage_staff_bckp.StaffRoleCode[role_key].Code=="HBE") ? "Home Based Educator":"Home Based Co-ordinator" ;
        }else{
          data["Code"]="HBE";
          data["Label"]="Home Based Educator";
        }
          
        }
        data["IsRegistered"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered) ? that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered.toString():''
        data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
        data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
        data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
        
        
      }else if(role_key=="EducationalRoleCode2"){
        if(that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode){
          that.subpage_staff.extra_details['HighestQualificationCode1']= that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode;
         }
        that.subpage_staff.extra_details['started1']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentStartDate:'';
        that.subpage_staff.extra_details['left1']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentEndDate:'';
        that.subpage_staff.extra_details['ethnicity4']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity5']=that.subpage_staff_bckp.EthnicGroup2Code || '';;
        that.subpage_staff.extra_details['ethnicity6']=that.subpage_staff_bckp.EthnicGroup2Code || '';;
        if(that.subpage_staff.StaffRoleCode["EducationalRoleCode"] && that.subpage_staff.StaffRoleCode["EducationalRoleCode"].Code=="HBE"){
            data["Code"]="HBC";
            data["Label"]="Home Based Co-ordinator";
        }else{
          if(!that.subpage_staff.StaffRoleCode["EducationalRoleCode"]){
            data["Code"]=(that.subpage_staff_bckp.StaffRoleCode["EducationalRoleCode"] && that.subpage_staff_bckp.StaffRoleCode["EducationalRoleCode"].Code=="HBE") ? "HBC":"HBE";
            data["Label"]=(that.subpage_staff.StaffRoleCode[role_key] && that.subpage_staff.StaffRoleCode[role_key].Code=="HBE") ? "Home Based Educator":"Home Based Co-ordinator" ;
          }else{
            data["Code"]="HBE";
            data["Label"]="Home Based Educator";
          }
        
        }
        data["IsRegistered"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered) ? that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered.toString():''
        data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
        data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
        data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
        
        
      }

    }else if(Auth.getCurrentUser().facility.CenterType=="Playcentre"){
      if(role_key=="EducationalRoleCode"){
        data["Code"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.StaffRoleCode['EducationalRoleCode']) ? that.subpage_staff_bckp.StaffRoleCode['EducationalRoleCode'].Code : "PE";
        data["Label"]="Playcentre Educator";
        data["IsRegistered"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered) ? that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered.toString():''
        data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
        data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
        data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
        if(that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode){
          that.subpage_staff.extra_details['HighestQualificationCode']= that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode;
         }
        
        that.subpage_staff.extra_details['started']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentStartDate:'';
        that.subpage_staff.extra_details['left']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentEndDate:'';
        that.subpage_staff.extra_details['ethnicity1']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity2']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity3']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        
      }
    }else if(Auth.getCurrentUser().facility.CenterType=="Centre based"){
        data["Code"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.StaffRoleCode['EducationalRoleCode']) ? that.subpage_staff_bckp.StaffRoleCode['EducationalRoleCode'].Code: "ECET";
        data["Label"]="ECET / ECE Teacher";
        if(that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode){
          that.subpage_staff.extra_details['HighestQualificationCode']= that.subpage_staff_bckp.ECEQualificationsDetails.HighestQualificationCode;
         }
        
        that.subpage_staff.extra_details['started']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentStartDate:'';
        that.subpage_staff.extra_details['left']=that.subpage_staff_bckp.Finance ? that.subpage_staff_bckp.Finance.EmploymentEndDate:'';
        that.subpage_staff.extra_details['ethnicity1']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity2']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        that.subpage_staff.extra_details['ethnicity3']=that.subpage_staff_bckp.EthnicGroup1Code || '';
        data["IsRegistered"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.ECEQualificationsDetails && that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered) ? that.subpage_staff_bckp.ECEQualificationsDetails.IsRegistered.toString():''
        data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
        data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
        data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
        
    }

    if(role_key=='ManagementRoleCode'){

      data["Code"]="SNRMS";
      data["Label"]="Senior Management Staff";
      data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
      data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
      data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
         
    } else if(role_key=='SupportStaffRoleCode'){
      
      data["Code"]="SUPS";
      data["Label"]="Support Staff";
      data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
      data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
      data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
       
    } else if(role_key=='SpecialStaffRoleCode'){

      data["Code"]="SPEC";
      data["Label"]="Specialist Staff";
      data["IsPaid"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPaid) ? that.subpage_staff_bckp.Finance.IsPaid.toString():'';
      data["IsPermanent"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsPermanent) ? that.subpage_staff_bckp.Finance.IsPermanent.toString():'';
      data["IsFullTime"]=(that.subpage_staff_bckp && that.subpage_staff_bckp.Finance && that.subpage_staff_bckp.Finance.IsFullTime) ? that.subpage_staff_bckp.Finance.IsFullTime.toString():'';
       
    }
    return  data;
  }

  that.initEthnicCodes = function (){

    return formlyAdapter.getList('ethniccode');
  }

  that.initHighestQualification = function (){


    var params = {
      sort:'+Code'
    }
    return formlyAdapter.getList('educatorqualificationcode', params);
  }

  that.initHighestPlayCentreQualification = function (){

    var params = {
      sort:'+Code'
    }
    return formlyAdapter.getList('playcentrequalificationcode', params);
  }

  that.getRoleDetailsById = function (role_id){

    var role_details = null;
    that.fields.facility_staff_role_codes.forEach(function (role){
      if(role._id == role_id) role_details = role;
    });
    return role_details;
  }

  that.initEceWeekDays = function (ecereturn_date, staff){

    var days = [];
    for (var i = 0; i < 7; i++) {
      
      var o = {};
      var date_details = that.getDayName(ecereturn_date, i);
      o.day = date_details.day;
      o.date = date_details.date;
      o.total_hours = 0;
      o.hours = [];
      days.push(o);
    }
    return days;
  }

  that.initEceWeekDayValues = function (ece_return_week){

    var ecereturnweek_start = moment(that.fields.ecereturn_date).hours(0).minutes(0).seconds(0).milliseconds(0);
    var ecereturnweek_end = moment(ecereturnweek_start).add(6,'days').endOf('day');

    var params = {
      query: JSON.stringify({
        facility:that.fields.facility._id,
        Date:{$gte:ecereturnweek_start, $lte:ecereturnweek_end},
        IsContactHours:true,
      }),
      sort: 'Date'
    }

    var rosterReport = [];
    return formlyAdapter.getList('roster', params).then(function (data){

      rosterReport = data;
      ece_return_week.forEach(function (oneday, idx){
        
        var index =  that.findDateInArr(rosterReport, 'Date', oneday.date, true);
        if(index>=0 && index != null) ece_return_week[idx].hoursreport_index = index;
      });
      return getContactHourDuties();
    }).then(function (contact_hour_dutylist_ids){
      
      ece_return_week = that.fillRosterHourValues(ece_return_week, rosterReport, contact_hour_dutylist_ids);
      ece_return_week = that.fillTimingOptionValues(ece_return_week);
      return ece_return_week;
    });


    // return formlyAdapter.getList('contacthoursreport', params).then(function (contacthoursreport){
      
    //   ece_return_week.forEach(function (oneday, idx){

    //     var index =  that.findDateInArr(contacthoursreport, 'Date', oneday.date);
    //     if(index>=0 && index != null) ece_return_week[idx].contacthoursreport_index = index;
    //   });
    //   ece_return_week = that.fillContactHourValues(ece_return_week, contacthoursreport);
    //   return ece_return_week;
    // });
  }

  function getContactHourDuties(){

    var params = {
      query: JSON.stringify({
        IsContactHours: true
      })
    }
    var dutylist_ids = [];
    return formlyAdapter.getList('dutylist', params).then(function (result){
      
      result.forEach(function (row){
        dutylist_ids.push(row._id);
      });
      return dutylist_ids;
    });
  }

  that.updateEndTime = function (indexWeek, indexHours){

    var week_day    = that.subpage_staff.extra_details.ece_return_week[indexWeek];
    var interval    = week_day.interval_in_minutes;
    var start_time  = week_day.hours[indexHours].start_time;
    start_time      = start_time.split(':');
    var tmp_date    = moment().hours(start_time[0]).minutes(start_time[1]);

    tmp_date.add(interval ,'m');
    week_day.hours[indexHours].end_time = tmp_date.format('HH')+':'+tmp_date.format('mm');
  }

  that.addNewHours = function (indexWeek){
    
    var week_day  = that.subpage_staff.extra_details.ece_return_week[indexWeek];
    var interval  = week_day.interval_in_minutes;
    var time_opts = week_day.timing_dropdown_opts;
    var o         = {};
    
    time_opts.forEach(function(opt){

      var idx = that.findObjInArr(week_day.hours, 'start_time', opt);
      if( !('start_time' in o)  && idx ==null )o.start_time = opt;
    });
    var start_time  = o.start_time.split(':');
    var tmp_date  = moment().hours(start_time[0]).minutes(start_time[1]);
    tmp_date.add(interval ,'m');
    o.end_time = tmp_date.format('HH')+':'+tmp_date.format('mm');
    week_day.hours.push(o);
  }

  that.deleteHours = function (indexWeek, indexHours){
    
    var week_day   = that.subpage_staff.extra_details.ece_return_week[indexWeek];
    week_day.hours.splice(indexHours,1);
  }

  that.isThisTimeOptDisabled = function(indexWeek, opt) {

    var flag = false;
    var week_day   = that.subpage_staff.extra_details.ece_return_week[indexWeek];
    if(week_day.hours){

      var idx = that.findObjInArr(week_day.hours, 'start_time', opt);
      if(idx != null) flag = true;
    }
    return flag;
  }

  that.whenNoMoreHoursAvailable = function (indexWeek){

    var flag = false;
    var week_day   = that.subpage_staff.extra_details.ece_return_week[indexWeek];

    if(week_day && week_day.hours && week_day.timing_dropdown_opts){
      if( week_day.hours.length == week_day.timing_dropdown_opts.length) flag = true;
    }
    return flag;
  }
  that.fillTimingOptionValues = function(ece_return_week){

    ece_return_week.forEach(function (oneday, idx){

      var start_time = angular.copy(oneday.start_time);
      var end_time = angular.copy(oneday.end_time);
      end_time = end_time.split(':');
      var interval = angular.copy(oneday.interval_in_minutes);
      oneday.timing_dropdown_opts = [];

      var tmp_end_date = moment().hours(end_time[0]).minutes(end_time[1]);

      var flag = true;

      var i = 0;
      while(flag){

        oneday.timing_dropdown_opts.push(start_time);
        start_time = start_time.split(':');
        var tmp_date = moment().hours(start_time[0]).minutes(start_time[1]);
        tmp_date.add(interval ,'m');


        start_time = tmp_date.format('HH')+':'+tmp_date.format('mm');

        if( tmp_date.isAfter( tmp_end_date) ) {
          flag = false;
          oneday.timing_dropdown_opts.splice(i,1);
        }
        i++;
      }
    });
    return ece_return_week;
  }

  that.fillRosterHourValues = function (ece_return_week, rosterReport, contact_hour_dutylist_ids){

    ece_return_week.forEach(function (day_of_week, idx){

      if( !('hoursreport_index' in day_of_week) ) return;

      var roster_for_day = rosterReport[day_of_week.hoursreport_index];

      /*check if staff member is present in any hour in this report*/
      var hours_for_day = roster_for_day.Hours;
      var splice_indexes = [];
      hours_for_day.forEach(function (item, index, object){

        var educator_list_this_hour = item.Educators;
        var duty_list_this_hour     = item.EducatorDutyList;
        
        if(!educator_list_this_hour.length && splice_indexes.indexOf(item.StartTime)<0 ) {
          splice_indexes.push(item.StartTime);
          return;
        }

        if( that.findObjInArr(educator_list_this_hour, 'Educators', that.subpage_staff._id) == null &&
          splice_indexes.indexOf(item.StartTime)<0 ){ 
          
          splice_indexes.push(item.StartTime);
          return;
        }

        /* remove other staff duties */
        var cp_educator_list_this_hour = angular.copy(educator_list_this_hour);
        cp_educator_list_this_hour.forEach(function (edu, e_index, o){

          if(edu.Educators != that.subpage_staff._id ){ 

            var this_idx = that.findObjInArr(educator_list_this_hour, 'Educators', edu.Educators);
            educator_list_this_hour.splice(this_idx,1); 
            duty_list_this_hour.splice(this_idx, 1); 
          }
        });

        /* if duty not in contact hour do not count it*/
        var is_duty_valid = false;
        duty_list_this_hour.forEach(function (duty){

          if( contact_hour_dutylist_ids.indexOf(duty.EducatorDutyList) >=0 ) is_duty_valid = true;
        });

        if(!is_duty_valid && splice_indexes.indexOf(item.StartTime)<0){ 
          
          splice_indexes.push(item.StartTime);
          return;
        }
      });

      splice_indexes.forEach(function (val){

        var that_index = that.findObjInArr(hours_for_day, 'StartTime', val)
        hours_for_day.splice(that_index, 1); 
      });

      /* if no hours that day do not include at all in ece week day*/
      if(!hours_for_day.length){
        delete ece_return_week[idx].hoursreport_index;
      }

    });
    /*fill hours for which hour_indexes exist*/
    ece_return_week = that.fillHoursWithValues(ece_return_week, rosterReport);
    return ece_return_week;
  }

  that.fillHoursWithValues = function (ece_return_week, rosterReport){

    ece_return_week.forEach(function (day, idx){

      if( !('hoursreport_index' in day)) {
        day = that.fillHoursWithValuesWithDefaults(day);
        return;
      }
      /*fill values from roster*/
      var roster_for_day = rosterReport[day.hoursreport_index];
      day.start_time = roster_for_day.StartTime;
      day.end_time = roster_for_day.EndTime;
      day.interval_in_minutes = getDiffInMinutes (roster_for_day.Hours[0].EndTime, roster_for_day.Hours[0].StartTime)
      day.hours = getHoursForDay(roster_for_day.Hours);
    });
    return ece_return_week;
  }

  function getHoursForDay (oneday_roster_hours){

    var hrs = [];
    oneday_roster_hours.forEach(function (one_hour){
      var o = {
        start_time: one_hour.StartTime,
        end_time: one_hour.EndTime,
      }
      hrs.push(o);
    });
    return hrs;
  }

  function getDiffInMinutes (later_time, early_time){

    var lt = {
      h:later_time.split(':')[0],
      m:later_time.split(':')[1],
    };
    var et = {
      h:early_time.split(':')[0],
      m:early_time.split(':')[1],
    };
    var later_date = new Date();
    later_date.setHours(lt.h);
    later_date.setMinutes(lt.m);

    var early_date = new Date();
    early_date.setHours(et.h);
    early_date.setMinutes(et.m);

    var diff = moment(later_date).diff(moment(early_date),'minutes');
    return diff;
  }

  that.fillHoursWithValuesWithDefaults = function (ece_return_week_day){
    var defaults = {
      start_time:'08:00',
      end_time:'16:00',
      interval_in_minutes:'60',
    }
    /*if(that.serviceschedule){
      if(that.serviceschedule[ece_return_week_day.day].Scheduled){
        defaults.start_time=that.serviceschedule[ece_return_week_day.day].StartTime;
        defaults.end_time=that.serviceschedule[ece_return_week_day.day].EndTime;  
      }
      
    }*/
  
    ece_return_week_day.start_time          = defaults.start_time;
    ece_return_week_day.end_time            = defaults.end_time;
    ece_return_week_day.interval_in_minutes = defaults.interval_in_minutes;
    return ece_return_week_day;
  }

  // that.fillContactHourValues = function (ece_return_week, contacthoursreport){

  //   ece_return_week.forEach(function (item, index){

  //     var contacthours_data = contacthoursreport[item.contacthoursreport_index]?contacthoursreport[item.contacthoursreport_index].Matrix:null;
  //     if(contacthours_data){

  //       var staff_object_index = that.findObjInArr(contacthours_data, 'Staff', that.subpage_staff._id);
  //       if(staff_object_index != null){
  //         var staff_object = contacthours_data[staff_object_index];
  //         ece_return_week[index].total_hours = staff_object.total_hours; 
  //       }
  //     }
  //     ece_return_week.forEach(function (oneday){
  //       if(!oneday.total_hours) oneday.total_hours = 0;
  //     });
  //   });
  //   return ece_return_week;
  // }

  /**
   * To get full day name by date e.g. `Monday` and so on.
   *
   */
  that.getDayName = function (date, daysToAdd) {

    var date = {
      date: moment(date).add(daysToAdd,'days').toString(),
      day: moment(date).add(daysToAdd,'days').format('dddd')
    }
    return  date;
  }

  /**
   * To find object index in array of objects
   * based on certain key value pair
   * specifically modified to match date Object value
   *
   */
  that.findDateInArr = function (arr, key, val, onlyMatchDatePart){

    var index_found  = null;
    arr.forEach(function (item, index, object){
    
      var item_key = new Date(item[key]).toISOString();
      var value = new Date(val).toISOString();

      if( !onlyMatchDatePart && (item_key == value) ){

        index_found = index;
      } else if(onlyMatchDatePart){

        var same = {
          year: moment(item_key).isSame(value, 'year'),
          month: moment(item_key).isSame(value, 'month'),
          day: moment(item_key).isSame(value, 'day'),
        }
        if( same.year && same.month && same.day ) index_found = index;
      }
    });
    return index_found;
  }

  /**
   * To find object index in array of objects
   * based on certain key value pair
   *
   */
  that.findObjInArr = function (arr, key, val){

    var index_found  = null;
    arr.forEach(function (item, index, object){
    
      if( item[key].toString() == val.toString() ){
       index_found = index;
      }
    });
    return index_found;
  }

  that.isDateInRange = function (startDate, endDate, date){

    var startDate = new Date(startDate)
    , endDate   = new Date(endDate)
    , date  = new Date(date);

    if( date >= startDate && date <= endDate)
      return true;
    else
      return false;
  }

  that.isFinalSubmissionDisabled = function(staff_list){

    var flag = false;
    staff_list.forEach(function (staff){
      if(!staff.extra_details) flag = true;
      if(staff.extra_details && !staff.extra_details.validContactHours) flag = true;
    });
    if(!staff_list.length) flag = true;
    return flag;
  }

  that.updateStaffRoleObj = function(key){

    var new_obj_id = that.subpage_staff.extra_details.StaffRoleCode[key]._id;
    that.subpage_staff.extra_details.StaffRoleCode[key] = findStaffRoleCodeObjById(new_obj_id);
    that.subpage_staff.StaffRoleCode[key] = findStaffRoleCodeObjById(new_obj_id);
    that.initRoleCodes();
  }

  that.finalSubmissionCheck = function (staff_list){
    var is_valid=true;
    staff_list.forEach(function (staff){
      is_valid=that.attendanceCheck(staff);
    });
    if(!is_valid){
      var msg = "You have recorded child attendance during the ECE return week that falls outside of Staff Contact Hours for the same week. Please go back and amend either the incorrect child attendance data or the staff hours and then submit your ECE Return";
      dialog.showOkDialog("Error", msg);
      return;
    }
    that.open_final_warning_page = true;
  }

  that.activateFinalSubmission = function (){
    
    createECEReturnEvent();
    that.open_subpage             = false;
    that.open_final_warning_page  = false;
    that.open_final_response_page = true;
  }

  that.cancelSubmission = function (){
    that.open_final_warning_page = false;    
  }

  that.finishSubmission = function (){
    $state.go("main.home");
  }

  that.editSubmission = function (){
    that.open_final_response_page = false;
    that.is_edit_mode = true;
    that.fields.current_page = 1;
  }

  function findStaffRoleCodeObjById(id){
    
    var code = null;
    var all_codes = angular.copy(that.fields.facility_staff_role_codes);
    all_codes.forEach(function (onecode){
      if(onecode._id == id){

        code = onecode;
        code.is_valid = 'true';
      } 
    });
    return code;
  }

  function getEthnicCodeById(id){
    
    var code = null;
    that.fields.ethnic_codes.forEach(function (onecode){
      if(onecode._id == id) code = onecode.Code;
    });
    return code;
  }

  function getLanguageCodeById(id){
    
    var code = null;
    that.fields.all_languages.forEach(function (onecode){
      if(onecode._id == id) code = onecode.Code;
    });
    return code;
  }

  function getHighestQualificationCodeById(id){
    
    var code = null;
    that.fields.educator_qualification_codes.forEach(function (onecode){
      if(onecode._id == id) code = onecode.Code;
    });
    return code;
  }

  function getHighestPlaycentreQualificationCodeById(id){
    
    var code = null;
    that.fields.playcentre_qualification_codes.forEach(function (onecode){
      if(onecode._id == id) code = onecode.Code;
    });
    return code;
  }
  function getHBCXml(key,staffMember){
     var list='';
     if(key=='EducationalRoleCode'){
      if(staffMember.StaffRoleCode.EducationalRoleCode){
          list+='<EducationalStaffRole>';
          list+= printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.EducationalRoleCode?staffMember.StaffRoleCode.EducationalRoleCode.Code:null):null);
          if(staffMember.ECEQualificationsDetails && staffMember.extra_details.HighestQualificationCode ){
              list+= printOrNil('HighestQualificationCode', staffMember.ECEQualificationsDetails?(staffMember.extra_details.HighestQualificationCode? getHighestQualificationCodeById(staffMember.extra_details.HighestQualificationCode) : null):null);
            }else{
               list+= printOrNil('HighestQualificationCode',null);
            }

          list+= printOrNil ('IsRegistered', staffMember.StaffRoleCode.EducationalRoleCode.IsRegistered);
          if(staffMember.ECEQualificationsDetails && staffMember.ECEQualificationsDetails.HighestPlaycentreQualificationCode && (staffMember.StaffRoleCode.EducationalRoleCode.Code == 'PE')  ){
            list+= printOrNil('HighestPlaycentreQualificationCode', getHighestPlaycentreQualificationCodeById(staffMember.extra_details.HighestPlaycentreQualificationCode));
          }
          list+= printOrNil('StartDate', staffMember.extra_details.started ? moment(staffMember.extra_details.started).format("YYYY-MM-DD") : null);
          list+= printOrNil('EndDate', staffMember.extra_details.left? moment(staffMember.extra_details.left).format("YYYY-MM-DD") : null);
          list+='<EthnicGroupCodes>';
            list+=printOrNil('EthnicGroup1Code',staffMember.extra_details.ethnicity1?getEthnicCodeById(staffMember.extra_details.ethnicity1) :null);
            if(staffMember.extra_details && staffMember.extra_details.ethnicity2){
              list+=printOrNil('EthnicGroup2Code',staffMember.extra_details.ethnicity2?getEthnicCodeById(staffMember.extra_details.ethnicity2): null);
            }
            if(staffMember.extra_details && staffMember.extra_details.ethnicity3){
              list+=printOrNil('EthnicGroup3Code',staffMember.extra_details.ethnicity3?getEthnicCodeById(staffMember.extra_details.ethnicity3): null);
            }
          list+='</EthnicGroupCodes>';
           if(staffMember.StaffRoleCode.EducationalRoleCode && staffMember.StaffRoleCode.EducationalRoleCode.Code!="HBE"){
             list+=printOrNil('IsPaid',staffMember.StaffRoleCode.EducationalRoleCode.IsPaid);  
           }
          list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.EducationalRoleCode.IsPermanent);
          list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.EducationalRoleCode.IsFullTime);
           var does_weekly_hours_has_any_length = 0;
            staffMember.extra_details.ece_return_week.forEach(function (oneday){
              does_weekly_hours_has_any_length += parseInt(oneday.hours.length);
            });
            /*if everthing is valid but there is no weekly data do not include this section*/
            if(does_weekly_hours_has_any_length){

              list +='<ContactHoursDetailList>'+
                '<ContactHoursDetail>';
                staffMember.extra_details.ece_return_week.forEach(function (oneday){

                  var hours_data = oneday.hours;
                  if(hours_data.length){
                                      
                    list+=printOrNil('WeekdayCode', oneday.day[0]+oneday.day[1]);
                    hours_data.forEach(function (each_hour_data){
                      var startTime  = moment().hours(each_hour_data.start_time.split(':')[0]).minutes(each_hour_data.start_time.split(':')[1]).seconds(0);
                      var endTime = moment().hours(each_hour_data.end_time.split(':')[0]).minutes(each_hour_data.end_time.split(':')[1]).seconds(0);
                      list+=printOrNil('StartTime', startTime.format('HH:mm:ss'));
                      list+=printOrNil('EndTime', endTime.format('HH:mm:ss'));
                    });
                  }
                });
                list+='</ContactHoursDetail>'+
              '</ContactHoursDetailList>';
            }
         
        list +='</EducationalStaffRole>';
      } else{
        list+=printOrNil('EducationalStaffRole', null);
      }
     }else{
      if(staffMember.StaffRoleCode.EducationalRoleCode2){
          list+='<EducationalStaffRole>';
          list+= printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.EducationalRoleCode2?staffMember.StaffRoleCode.EducationalRoleCode2.Code:null):null);
          if(staffMember.ECEQualificationsDetails && staffMember.extra_details.HighestQualificationCode1 ){
              list+= printOrNil('HighestQualificationCode', staffMember.ECEQualificationsDetails?(staffMember.extra_details.HighestQualificationCode? getHighestQualificationCodeById(staffMember.extra_details.HighestQualificationCode1) : null):null);
            }else{
               list+= printOrNil('HighestQualificationCode',null);
            }

          list+= printOrNil ('IsRegistered', staffMember.StaffRoleCode.EducationalRoleCode2.IsRegistered);
          if(staffMember.ECEQualificationsDetails && staffMember.ECEQualificationsDetails.HighestPlaycentreQualificationCode && (staffMember.StaffRoleCode.EducationalRoleCode2.Code == 'PE')  ){
            list+= printOrNil('HighestPlaycentreQualificationCode', getHighestPlaycentreQualificationCodeById(staffMember.extra_details.HighestPlaycentreQualificationCode));
          }
          list+= printOrNil('StartDate', staffMember.extra_details.started1 ? moment(staffMember.extra_details.started1).format("YYYY-MM-DD") : null);
          list+= printOrNil('EndDate', staffMember.extra_details.left1? moment(staffMember.extra_details.left1).format("YYYY-MM-DD") : null);
          list+='<EthnicGroupCodes>';
            list+=printOrNil('EthnicGroup1Code',staffMember.extra_details.ethnicity4?getEthnicCodeById(staffMember.extra_details.ethnicity4) :null);
            if(staffMember.extra_details && staffMember.extra_details.ethnicity5){
              list+=printOrNil('EthnicGroup2Code',staffMember.extra_details.ethnicity2?getEthnicCodeById(staffMember.extra_details.ethnicity5): null);
            }
            if(staffMember.extra_details && staffMember.extra_details.ethnicity6){
              list+=printOrNil('EthnicGroup3Code',staffMember.extra_details.ethnicity6?getEthnicCodeById(staffMember.extra_details.ethnicity6): null);
            }
          list+='</EthnicGroupCodes>';
           if(staffMember.StaffRoleCode.EducationalRoleCode2 && staffMember.StaffRoleCode.EducationalRoleCode2.Code!="HBE"){
             list+=printOrNil('IsPaid',staffMember.StaffRoleCode.EducationalRoleCode2.IsPaid);  
           }
          list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.EducationalRoleCode2.IsPermanent);
          list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.EducationalRoleCode2.IsFullTime);
           var does_weekly_hours_has_any_length = 0;
            staffMember.extra_details.ece_return_week.forEach(function (oneday){
              does_weekly_hours_has_any_length += parseInt(oneday.hours.length);
            });
            /*if everthing is valid but there is no weekly data do not include this section*/
            if(does_weekly_hours_has_any_length){

              list +='<ContactHoursDetailList>'+
                '<ContactHoursDetail>';
                staffMember.extra_details.ece_return_week.forEach(function (oneday){

                  var hours_data = oneday.hours;
                  if(hours_data.length){
                                      
                    list+=printOrNil('WeekdayCode', oneday.day[0]+oneday.day[1]);
                    hours_data.forEach(function (each_hour_data){
                      var startTime  = moment().hours(each_hour_data.start_time.split(':')[0]).minutes(each_hour_data.start_time.split(':')[1]).seconds(0);
                      var endTime = moment().hours(each_hour_data.end_time.split(':')[0]).minutes(each_hour_data.end_time.split(':')[1]).seconds(0);
                      list+=printOrNil('StartTime', startTime.format('HH:mm:ss'));
                      list+=printOrNil('EndTime', endTime.format('HH:mm:ss'));
                    });
                  }
                });
                list+='</ContactHoursDetail>'+
              '</ContactHoursDetailList>';
            }
         
        list +='</EducationalStaffRole>';
      } else{
        list+=printOrNil('EducationalStaffRole', null);
      }
     }
     return list;  
  }
  function getHBEXml(key,staffMember){
       var list='';
      if(key=='EducationalRoleCode'){
        if(staffMember.StaffRoleCode.EducationalRoleCode){
         list+='<HomeBasedEducatorStaffRole>';
            list+= printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.EducationalRoleCode?staffMember.StaffRoleCode.EducationalRoleCode.Code:null):null);

            if(staffMember.ECEQualificationsDetails && staffMember.extra_details.HighestQualificationCode ){

                list+= printOrNil('HighestQualificationCode', staffMember.ECEQualificationsDetails?(staffMember.extra_details.HighestQualificationCode? getHighestQualificationCodeById(staffMember.extra_details.HighestQualificationCode) : null):null);
              }else{
                 list+= printOrNil('HighestQualificationCode',null);
              }
          
            list+= printOrNil ('IsRegistered', staffMember.StaffRoleCode.EducationalRoleCode.IsRegistered);
           /*** newly added as per changes for EducationalRoleCode2 **/
            //list+= printOrNil('StartDate', staffMember.extra_details.started1 ? moment(staffMember.extra_details.started1).format("YYYY-MM-DD") : null);
            //list+= printOrNil('EndDate', staffMember.extra_details.left1? moment(staffMember.extra_details.left1).format("YYYY-MM-DD") : null);
            list+='<EthnicGroupCodes>';
              list+=printOrNil('EthnicGroup1Code',staffMember.extra_details.ethnicity1?getEthnicCodeById(staffMember.extra_details.ethnicity1) :null);
              if(staffMember.extra_details && staffMember.extra_details.ethnicity2){
                list+=printOrNil('EthnicGroup2Code',staffMember.extra_details.ethnicity2?getEthnicCodeById(staffMember.extra_details.ethnicity2): null);
              }
              if(staffMember.extra_details && staffMember.extra_details.ethnicity3){
                list+=printOrNil('EthnicGroup3Code',staffMember.extra_details.ethnicity3?getEthnicCodeById(staffMember.extra_details.ethnicity3): null);
              }
            list+='</EthnicGroupCodes>';
             /*** newly added as per changes for EducationalRoleCode2 **/

            
            if(staffMember.StaffRoleCode.EducationalRoleCode && staffMember.StaffRoleCode.EducationalRoleCode.Code!="HBE"){
              list+=printOrNil('IsPaid',staffMember.StaffRoleCode.EducationalRoleCode.IsPaid);  
            }
            
            list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.EducationalRoleCode.IsPermanent);
            list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.EducationalRoleCode.IsFullTime);
          list += '</HomeBasedEducatorStaffRole>';          
        } else if((!staffMember.StaffRoleCode || !staffMember.StaffRoleCode.EducationalRoleCode) ){

          list+=printOrNil('HomeBasedEducatorStaffRole', null);
        }
      }else{
       if(staffMember.StaffRoleCode.EducationalRoleCode2){
            list+='<HomeBasedEducatorStaffRole>';
            list+= printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.EducationalRoleCode2?staffMember.StaffRoleCode.EducationalRoleCode2.Code:null):null);

            if(staffMember.ECEQualificationsDetails && staffMember.extra_details.HighestQualificationCode1 ){

                list+= printOrNil('HighestQualificationCode', staffMember.ECEQualificationsDetails?(staffMember.extra_details.HighestQualificationCode1? getHighestQualificationCodeById(staffMember.extra_details.HighestQualificationCode1) : null):null);
              }else{
                 list+= printOrNil('HighestQualificationCode',null);
              }
          
            list+= printOrNil ('IsRegistered', staffMember.StaffRoleCode.EducationalRoleCode2.IsRegistered);
           /*** newly added as per changes for EducationalRoleCode2 **/
            //list+= printOrNil('StartDate', staffMember.extra_details.started1 ? moment(staffMember.extra_details.started1).format("YYYY-MM-DD") : null);
            //list+= printOrNil('EndDate', staffMember.extra_details.left1? moment(staffMember.extra_details.left1).format("YYYY-MM-DD") : null);
            list+='<EthnicGroupCodes>';
              list+=printOrNil('EthnicGroup1Code',staffMember.extra_details.ethnicity4?getEthnicCodeById(staffMember.extra_details.ethnicity4) :null);
              if(staffMember.extra_details && staffMember.extra_details.ethnicity5){
                list+=printOrNil('EthnicGroup2Code',staffMember.extra_details.ethnicity5?getEthnicCodeById(staffMember.extra_details.ethnicity6): null);
              }
              if(staffMember.extra_details && staffMember.extra_details.ethnicity6){
                list+=printOrNil('EthnicGroup3Code',staffMember.extra_details.ethnicity6?getEthnicCodeById(staffMember.extra_details.ethnicity6): null);
              }
            list+='</EthnicGroupCodes>';
             /*** newly added as per changes for EducationalRoleCode2 **/

            
            if(staffMember.StaffRoleCode.EducationalRoleCode2 && staffMember.StaffRoleCode.EducationalRoleCode2.Code!="HBE"){
              list+=printOrNil('IsPaid',staffMember.StaffRoleCode.EducationalRoleCode2.IsPaid);  
            }
            
            list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.EducationalRoleCode2.IsPermanent);
            list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.EducationalRoleCode2.IsFullTime);
          list += '</HomeBasedEducatorStaffRole>';          
        } else if((!staffMember.StaffRoleCode || !staffMember.StaffRoleCode.EducationalRoleCode2) ){

          list+=printOrNil('HomeBasedEducatorStaffRole', null);
        }
      }
        
    return list;    
  }
  function computeStaffInformationList(){

    var list = '';

    that.fields.staff.forEach(function (staffMember){ 
      list+='<StaffInformation>';

        list+=printOrNil("GenderCode",staffMember.Gender? staffMember.Gender.split('-')[0] :'U');
        list+='<StaffRoles>';
          
          if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
            if(staffMember.StaffRoleCode && staffMember.StaffRoleCode.EducationalRoleCode &&  staffMember.StaffRoleCode.EducationalRoleCode2){
                if(staffMember.StaffRoleCode.EducationalRoleCode.Code=='HBC' && staffMember.StaffRoleCode.EducationalRoleCode2.Code=='HBE'){
                    list+=getHBCXml('EducationalRoleCode',staffMember);
                    list+=getHBEXml('EducationalRoleCode2',staffMember) 
                }else if(staffMember.StaffRoleCode.EducationalRoleCode.Code=='HBE' && staffMember.StaffRoleCode.EducationalRoleCode2.Code=='HBC'){
                  list+=getHBCXml('EducationalRoleCode2',staffMember);
                  list+=getHBEXml('EducationalRoleCode',staffMember) 
                }
             }else if(staffMember.StaffRoleCode && staffMember.StaffRoleCode.EducationalRoleCode &&  !staffMember.StaffRoleCode.EducationalRoleCode2){
                
                if(staffMember.StaffRoleCode.EducationalRoleCode.Code=='HBC'){
                   list+=getHBCXml('EducationalRoleCode',staffMember);
                }else{ 
                  list+=getHBEXml('EducationalRoleCode',staffMember) 
                }
             }else if(staffMember.StaffRoleCode && staffMember.StaffRoleCode.EducationalRoleCode2 &&  !staffMember.StaffRoleCode.EducationalRoleCode){
                if(staffMember.StaffRoleCode.EducationalRoleCode2.Code=='HBC'){
                   list+=getHBCXml('EducationalRoleCode2',staffMember);
                }else{
                  list+=getHBEXml('EducationalRoleCode2',staffMember) 
                }
             }
             
          }else{
              if( staffMember.StaffRoleCode && staffMember.StaffRoleCode.EducationalRoleCode ){
              list+='<EducationalStaffRole>';

                list+= printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.EducationalRoleCode?staffMember.StaffRoleCode.EducationalRoleCode.Code:null):null);

                
                if(staffMember.ECEQualificationsDetails && staffMember.extra_details.HighestQualificationCode ){

                    list+= printOrNil('HighestQualificationCode', staffMember.ECEQualificationsDetails?(staffMember.extra_details.HighestQualificationCode? getHighestQualificationCodeById(staffMember.extra_details.HighestQualificationCode) : null):null);
                  }else{
                     list+= printOrNil('HighestQualificationCode',null);
                  }

                /*if ( staffMember.StaffRoleCode.EducationalRoleCode.Code && staffMember.StaffRoleCode.EducationalRoleCode.Code != 'ECET' && staffMember.StaffRoleCode.EducationalRoleCode.Code != 'HBC' && staffMember.StaffRoleCode.EducationalRoleCode.Code != 'HBE') {

                  list+= printOrNil('HighestQualificationCode',null);
                } else{

                  // if(staffMember.ECEQualificationsDetails && staffMember.ECEQualificationsDetails.HighestQualificationCode && (staffMember.StaffRoleCode.EducationalRoleCode.Code == 'ECET' || staffMember.StaffRoleCode.EducationalRoleCode.Code == 'HBC' || staffMember.StaffRoleCode.EducationalRoleCode.Code == 'HBE' )){
                  if(staffMember.ECEQualificationsDetails && staffMember.extra_details.HighestQualificationCode && (staffMember.StaffRoleCode.EducationalRoleCode.Code == 'ECET' || staffMember.StaffRoleCode.EducationalRoleCode.Code == 'HBC' || staffMember.StaffRoleCode.EducationalRoleCode.Code == 'HBE' )){

                    list+= printOrNil('HighestQualificationCode', staffMember.ECEQualificationsDetails?(staffMember.extra_details.HighestQualificationCode? getHighestQualificationCodeById(staffMember.extra_details.HighestQualificationCode) : null):null);
                  }
                }*/

                list+= printOrNil ('IsRegistered', staffMember.StaffRoleCode.EducationalRoleCode.IsRegistered);
                
                if(staffMember.ECEQualificationsDetails && staffMember.ECEQualificationsDetails.HighestPlaycentreQualificationCode && (staffMember.StaffRoleCode.EducationalRoleCode.Code == 'PE')  ){

                  list+= printOrNil('HighestPlaycentreQualificationCode', getHighestPlaycentreQualificationCodeById(staffMember.extra_details.HighestPlaycentreQualificationCode));
                  // staffMember.ECEQualificationsDetails.HighestPlaycentreQualificationCode.forEach(function(one_qualification){
                  //   list+= printOrNil('HighestPlaycentreQualificationCode', getHighestPlaycentreQualificationCodeById(one_qualification));
                  // });
                }

                list+= printOrNil('StartDate', staffMember.extra_details.started ? moment(staffMember.extra_details.started).format("YYYY-MM-DD") : null);
                list+= printOrNil('EndDate', staffMember.extra_details.left? moment(staffMember.extra_details.left).format("YYYY-MM-DD") : null);
                list+='<EthnicGroupCodes>';
                  list+=printOrNil('EthnicGroup1Code',staffMember.extra_details.ethnicity1?getEthnicCodeById(staffMember.extra_details.ethnicity1) :null);
                  if(staffMember.extra_details && staffMember.extra_details.ethnicity2){
                    list+=printOrNil('EthnicGroup2Code',staffMember.extra_details.ethnicity2?getEthnicCodeById(staffMember.extra_details.ethnicity2): null);
                  }
                  if(staffMember.extra_details && staffMember.extra_details.ethnicity3){
                    list+=printOrNil('EthnicGroup3Code',staffMember.extra_details.ethnicity3?getEthnicCodeById(staffMember.extra_details.ethnicity3): null);
                  }
                list+='</EthnicGroupCodes>';
                 if(staffMember.StaffRoleCode.EducationalRoleCode && staffMember.StaffRoleCode.EducationalRoleCode.Code!="HBE"){
                   list+=printOrNil('IsPaid',staffMember.StaffRoleCode.EducationalRoleCode.IsPaid);  
                 }
                //list+=printOrNil('IsPaid',staffMember.StaffRoleCode.EducationalRoleCode.IsPaid);
                list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.EducationalRoleCode.IsPermanent);
                list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.EducationalRoleCode.IsFullTime);
                
                //if(staffMember.StaffRoleCode.EducationalRoleCode.Code == 'ECET' || staffMember.StaffRoleCode.EducationalRoleCode.Code == 'HBC'){

                  var does_weekly_hours_has_any_length = 0;
                  staffMember.extra_details.ece_return_week.forEach(function (oneday){
                    does_weekly_hours_has_any_length += parseInt(oneday.hours.length);
                  });
                  /*if everthing is valid but there is no weekly data do not include this section*/
                  if(does_weekly_hours_has_any_length){

                    list +='<ContactHoursDetailList>'+
                      '<ContactHoursDetail>';
                      staffMember.extra_details.ece_return_week.forEach(function (oneday){

                        var hours_data = oneday.hours;
                        if(hours_data.length){
                                            
                          list+=printOrNil('WeekdayCode', oneday.day[0]+oneday.day[1]);
                          hours_data.forEach(function (each_hour_data){
                            var startTime  = moment().hours(each_hour_data.start_time.split(':')[0]).minutes(each_hour_data.start_time.split(':')[1]).seconds(0);
                            var endTime = moment().hours(each_hour_data.end_time.split(':')[0]).minutes(each_hour_data.end_time.split(':')[1]).seconds(0);
                            list+=printOrNil('StartTime', startTime.format('HH:mm:ss'));
                            list+=printOrNil('EndTime', endTime.format('HH:mm:ss'));
                          });
                        }
                      });
                      list+='</ContactHoursDetail>'+
                    '</ContactHoursDetailList>';
                  }
                //}
              list +='</EducationalStaffRole>';
            } else{
              
              list+=printOrNil('EducationalStaffRole', null);
            }

          }
          
          if( staffMember.StaffRoleCode && staffMember.StaffRoleCode.ManagementRoleCode 
            && staffMember.StaffRoleCode.ManagementRoleCode.Code=='SNRMS'
            && staffMember.extra_details.this_person_has_a_senior_management_staff_role
            ){

            list+='<ManagementStaffRole>';
              list+=printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.ManagementRoleCode ? staffMember.StaffRoleCode.ManagementRoleCode.Code : null):null);
              list+=printOrNil('IsPaid', staffMember.StaffRoleCode.ManagementRoleCode.IsPaid);
              list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.ManagementRoleCode.IsPermanent);
              list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.ManagementRoleCode.IsFullTime);
            list+='</ManagementStaffRole>';
          } else{
            
            list+=printOrNil('ManagementStaffRole', null);
          }
          if( staffMember.StaffRoleCode && staffMember.StaffRoleCode.SupportStaffRoleCode 
            && staffMember.StaffRoleCode.SupportStaffRoleCode.Code=='SUPS'
            && staffMember.extra_details.this_person_has_a_support_staff_role
          ){
            list+='<SupportStaffRole>';
              list+=printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.SupportStaffRoleCode ? staffMember.StaffRoleCode.SupportStaffRoleCode.Code : null):null);
              list+=printOrNil('IsPaid',staffMember.StaffRoleCode.SupportStaffRoleCode.IsPaid);
              list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.SupportStaffRoleCode.IsPermanent);
              list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.SupportStaffRoleCode.IsFullTime);
            list+='</SupportStaffRole>';
          } else{
            
            list+=printOrNil('SupportStaffRole', null);
          }
          if( staffMember.StaffRoleCode && staffMember.StaffRoleCode.SpecialStaffRoleCode
            && staffMember.StaffRoleCode.SpecialStaffRoleCode.Code=='SPEC'
            && staffMember.extra_details.this_person_has_a_specialist_staff_role
          ){
            list+='<SpecialistStaffRole>';
              list+=printOrNil('StaffRoleCode', staffMember.StaffRoleCode?(staffMember.StaffRoleCode.SpecialStaffRoleCode ? staffMember.StaffRoleCode.SpecialStaffRoleCode.Code : null):null);
              list+=printOrNil('IsPaid',staffMember.StaffRoleCode.SpecialStaffRoleCode.IsPaid);
              list+=printOrNil('IsPermanent',staffMember.StaffRoleCode.SpecialStaffRoleCode.IsPermanent);
              list+=printOrNil('IsFullTime',staffMember.StaffRoleCode.SpecialStaffRoleCode.IsFullTime);
            list+='</SpecialistStaffRole>';
          } else{
            
            list+=printOrNil('SpecialistStaffRole', null);
          }
        list+='</StaffRoles>'+
      '</StaffInformation>';

    });

    return list;
  }

  
  function computeServiceDetails(){
    var str="";
    if(that.fields.ece_wait_times_selected && Object.keys(that.fields.ece_wait_times_selected).length){
        str+=printOrNil("UnderOneYearOldWaitTimeCode",that.fields.ece_wait_times_selected.a0_12);
        str+=printOrNil("OneYearOldWaitTimeCode",that.fields.ece_wait_times_selected.a12_24);
        str+=printOrNil("TwoYearOldWaitTimeCode",that.fields.ece_wait_times_selected.a24_36);
        str+=printOrNil("ThreeYearOldWaitTimeCode",that.fields.ece_wait_times_selected.a36_48);
        str+=printOrNil("FourYearOldWaitTimeCode",that.fields.ece_wait_times_selected.a48_60);
    }

    str+='<ServiceLanguageList>';
    if(that.fields.center_language_1 && that.fields.center_language_1.Id){
        str+='<ServiceLanguage>';
        str+=printOrNil("LanguageCode", that.fields.center_language_1.Id ? getLanguageCodeById(that.fields.center_language_1.Id): null);
         str+=printOrNil("UsagePercentage",that.fields.center_language_1.Percentage);
        str+='</ServiceLanguage>';
    }
    if(that.fields.center_language_2 && that.fields.center_language_2.Id){
        str+='<ServiceLanguage>';
        str+=printOrNil("LanguageCode",that.fields.center_language_2.Id?getLanguageCodeById(that.fields.center_language_2.Id): null);
         str+=printOrNil("UsagePercentage",that.fields.center_language_2.Percentage);
        str+='</ServiceLanguage>';
    }
    if(that.fields.center_language_3 && that.fields.center_language_3.Id){
        str+='<ServiceLanguage>';
        str+=printOrNil("LanguageCode",that.fields.center_language_3.Id?getLanguageCodeById(that.fields.center_language_3.Id):null );
         str+=printOrNil("UsagePercentage",that.fields.center_language_3.Percentage);
        str+='</ServiceLanguage>';
    }
    if(that.fields.center_language_4 && that.fields.center_language_4.Id){
        str+='<ServiceLanguage>';
        str+=printOrNil("LanguageCode",that.fields.center_language_4.Id?getLanguageCodeById(that.fields.center_language_4.Id):null);
         str+=printOrNil("UsagePercentage",that.fields.center_language_4.Percentage);
        str+='</ServiceLanguage>';
    }
    if(that.fields.center_language_5 && that.fields.center_language_5.Id){
        str+='<ServiceLanguage>';
        str+=printOrNil("LanguageCode",that.fields.center_language_5.Id?getLanguageCodeById(that.fields.center_language_5.Id):null);
         str+=printOrNil("UsagePercentage",that.fields.center_language_5.Percentage);
        str+='</ServiceLanguage>';
    }
    str+='</ServiceLanguageList>';
    return str;
  }

  /** function added to submit the ecereturn Eli Event */
  function printOrNil(tag, val) {

      if ( val == null || val === 0 || parseInt(val, 10) < 0 ) {
        return '<'+tag+' i:nil="true" />';
      } else {
        return "<"+tag+">"+val+"</"+tag+">";
      }
    }

  function randomString() {

    var length = 24;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
  }

  function createECEReturnEvent() {

      that.loading = true;
      var values = {};
       
      values.EcereturnDate = moment(that.fields.ecereturn_date).format("YYYY-MM-DD"); // to do add the date of ece week selected
      values.ServiceDetails = computeServiceDetails();
      values.StaffInformationList = computeStaffInformationList();

      console.log('values', values)

      var eliObj = {
        Values: values,
        EventType : "EceReturn",
        EceReturnYear:that.fields.ecereturn_year  ? that.fields.ecereturn_year : new Date(that.fields.ecereturn_date).getFullYear() ,
        JsonData:that.fields,
        EventDateTime: new Date(),
        SaveDate: new Date(),
      };

      eliObj.EceReturnEntityId = that.is_edit_mode ? that.ece_db_data[0].EceReturnEntityId : randomString();

      return formlyAdapter.saveObject('eliEvent', eliObj, null).then(function(d) {

        that.showAll = false;
        var evt = d.data;

        var entity_id = null;
        if(that.is_edit_mode){
        
          entity_id = that.ece_db_data[0].EceReturnEntityId;
        } else{
          
          entity_id = evt.EceReturnEntityId;
          that.ece_db_data = [evt];
        }
        // var entity_id = that.is_edit_mode ? that.ece_db_data[0]._id : evt._id;
        console.log('entity_id', entity_id)
        var obj = _.extend({_id: evt._id, EceReturnEntityId: entity_id, EventDateTime:evt.EventDateTime, SaveDate:evt.SaveDate}, evt.Values);
        //note:- do not uncomment this code as we can not submit events to MOE yet 
         ELI.ecereturn(obj).then(function(d) {
           growlService.growl('EceReturn Submitted!', 'success', 4000);
           /*var xml = vkbeautify.xml(d.body);
           var Data="<hr/><h3>Request</h3><textarea style='width:100%' rows='10' disabled>"+xml+"</textarea>";
           dialog.showOkDialog("Submitted Xml", Data);*/
          that.loading = false;
         }, function(err) {
           growlService.growl('EceReturn Error:'+JSON.stringify(err), 'warning');
           that.loading = false;  
         })
      }, function (err){
          growlService.growl('EceReturn Error:'+JSON.stringify(err), 'warning');
          that.loading = false;  
      });
    };
});