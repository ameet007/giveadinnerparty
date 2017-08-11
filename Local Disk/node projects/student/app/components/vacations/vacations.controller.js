'use strict';

angular.module("sms.vacations", [])
  .controller('VacationsCtrl', function ($timeout,$stateParams, $rootScope, messageService, Auth, formlyAdapter, facilityService,
                                          $state, ngTableParams, tableService, $scope, growlService, moment) {
    var params = params && params.stateParams ? params.stateParams : $stateParams;

    var that = this;
    var _reload = true;
    that.stopDate = "";
    that.startDate = "";
    that.format="dd-MM-yyyy";
    that.today = new Date();
    $scope.vacation={};
    that.isEdit=false;
    that.vacationList =[];
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

    var filterTypes = [];
    var filterIdx = 0;

     var f1 = $scope.$watch(function (scope) {
      return ( that.selectedChild );
    }, initTable);
    var f2 = $scope.$watch(function (scope) {
      return ( that.startDate );
    }, function(){
      that['startOpened'] = false;
     initTable(); 
    });
    var f3 = $scope.$watch(function (scope) {
      return ( that.stopDate );
    }, function(){
      that['stopOpened'] = false;
     initTable(); 
    });
    var f4 = $scope.$watch(function (scope) { 
      return ( that.selectedReasonCode );
    }, initTable);

    

    $scope.$on('destroy', function () {
      f1();
      f2();
      f3();
      f4();
    })

    function initTable() {
      if (!that.selectedChild) return;
      that.tableEdit = new ngTableParams({
        count: 10,           // count per page
        page: 1
      }, {
        total: that.vacationList.length, // length of data
        getData: function ($defer, params) {
          $timeout(checkLoaded($defer), 100);
        }
      });
    }
    var getChildParams = function () {
      return that.selectedChild._id; 
    }
    var getReasonCodeParams=function(){
       return that.selectedReasonCode._id;
    }
    var getDateParams = function (_start, _end) {
      var dateQry = "";

      var start = _start || that.startDate, end = _end || that.stopDate;
      
     if(start != "" && end != ""){
        dateQry = {"$gte": timeFix(start, false), "$lte": timeFix(end, true)};
     }
      return dateQry;
    }
    var timeFix = function (date, setToMidnight) {
      var d = new Date(date.getTime());
      if (setToMidnight) d.setHours(23, 59, 59, 0);
      else d.setHours(0, 0, 0, 0);
      return d;
    }
   var buildVacationParams = function () {
    if($state.is('main.editvacation')){
      var p = {
        query: JSON.stringify({
          _id:$scope.id,
        })
      }
    }else{

var query = {};
if( getChildParams() ||  getReasonCodeParams() || getDateParams() != '' ){
 
  if( getChildParams() ){ query.child = getChildParams(); }
  if( getReasonCodeParams() ){ query.reasonCode = getReasonCodeParams(); }
  if( getDateParams() != ''){ query.startDate = getDateParams(); }
  if( getDateParams() != ''){ query.endDate = getDateParams(); }
           
}

      var p = {
        query: JSON.stringify(query)
      }
      p['sort']='+Date'
    }
      
      return p;
    };

    function getVacationData() {
      return formlyAdapter.getList('vacations',buildVacationParams());
    } 
    $scope.id=(params.id) ? params.id: '';
    if($scope.id){
      that.isEdit=true;
    
      $timeout(function(){
         getVacationData().then(function(data){
            $scope.vacation=data && data.length ? data[0] : {};

         });
      },200);
      
      
    }
    function centreChildVacation(v){
       var flag=false; 
        _.each(that.childlist,function(c){
            if(c._id==v.child){
              flag=true;
              return;
            }
        });
        return flag;
    }

    function filterVacationData(data){
        return data.filter(function(v){
          if(centreChildVacation(v)){
            return true;
          }else{
            return false;
          }
        });
    }

     function checkLoaded($defer) {
      return function () { 
        if (that.selectedChild) {
          getVacationData().then(function (data) {
             /*_.each(data, function(v,k) {
                
            });*/
            var vacations=filterVacationData(data);

            that.vacationList = vacations;
            var total = that.vacationList.length > 10 ? 10 : that.vacationList.length;
            that.tableEdit.total(total);
            $defer.resolve(that.vacationList);
          });
        }
        else $timeout(checkLoaded($defer), 100);
      }
    }

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var matchTimes = function(bookings) {
      var match = false;
      var day = days[that.today.getDay()];
      _.each(bookings.Times, function(t) {
        match = match || (t[day+"Start"] && t[day+"End"])
      })
      return match;
    }
    var checkBookingAndEnrolment = function(kid) {
      if (kid) {
        var en = null, bs = null;
        if(kid.ChildStatus!=='Enrolled'){ return false; }

        if ( kid.Enrolments && kid.Enrolments.length ) {
          en = kid.Enrolments[kid.Enrolments.length - 1].EnrolmentSection;
          bs = kid.Enrolments[kid.Enrolments.length - 1].BookingSchedule ? kid.Enrolments[kid.Enrolments.length - 1].BookingSchedule.length : null;
        }
       // console.log(!en || !bs || !matchTimes(kid.Enrolments[kid.Enrolments.length-1].BookingSchedule[bs-1]) );
       // if ( that.onlyBookedChildren && (!en || !bs || !matchTimes(kid.Enrolments[kid.Enrolments.length-1].BookingSchedule[bs-1]) )) return false;

        var start = en ? en.EnrolmentStartDate : null;
        var ef = bs && en ? kid.Enrolments[kid.Enrolments.length-1].BookingSchedule[bs-1].EffectiveDate : null;
        var end = en ? en.EnrolmentEndDate : null;
        var t = moment(that.today);
        if (that.onlyBookedChildren && (!start || !ef)) return false;
        if ( end && t.isAfter(end, 'day')) return false;
        return (t.isAfter(start, 'day') || t.isSame(start, 'day')) && (!that.onlyBookedChildren || (ef &&
          (t.isAfter(ef, 'day') || t.isSame(ef, 'day'))));
      } else
        return false;
    }
    
    $timeout(function () {
      formlyAdapter.getModels().then(function () {
        formlyAdapter.getList('child',{populate: 'Room,Educator'}).then(function (data) {
          $timeout(function () {
            that.onlyBookedChildren=true;
            that.childlist = data.filter(function(kid){
              return checkBookingAndEnrolment(kid);
            });
             //that.selectedChild = data && data.length ? data[0] : {};
             that.selectedChild = {};
              if($state.is('main.editvacation')){
                _.map(data,function(c){
                    if(c._id==$scope.vacation.child){
                        $scope.vacation.child=c;
                    }
                });
              }
          });
        });
        
        formlyAdapter.getList('absencereason').then(function (data) {
           $timeout(function () {
                that.absenceReasons = data.filter(function(obj){
                    if(obj.UseForChild){
                      return obj;
                    }
                });
                //that.selectedReasonCode=data && data.length ? data[0] : {};
                that.selectedReasonCode={};
                 if($state.is('main.editvacation')){
                _.map(data,function(r){
                    if(r._id==$scope.vacation.reasonCode){
                        $scope.vacation.reasonCode=r;
                    }
                });
              }
            });
          
        });

      formlyAdapter.getList("child").then(function (kid) {
         $timeout(function () {
                that.kids = kid;
            });     
                //data[k].childName = kid[0].OfficialGiven1Name +" "+ kid[0].OfficialFamilyName;
      });

      });

    }, 300);



    $scope.cancelVacation=function(value){
      if(value=='canceladd'){
        $state.go('main.vacations');
      }
    }
    $scope.editObject=function(row){
      $state.go("main.editvacation", {"id": row._id}, {reload: _reload});
    }
    $scope.saveVacation=function(nextValue){
      
      if($scope.checkErr($scope.vacation.startDate,$scope.vacation.endDate)){

          return formlyAdapter.saveObject('vacations', $scope.vacation, $scope.id).then(function (d) {
          
          growlService.growl('Vacations record saved successfully!', 'success');
          if(nextValue=='Continue'){
               $state.go("main.editvacation", {"id": d.data._id}, {reload: _reload});
          }else if(nextValue=='addNew'){
            $scope.vacation={};
              $state.go('main.addVacation');
          }else if(nextValue=='Exit'){
            $state.go('main.vacations');
          }
          
         }, function (err) { 
          var errMsg = err && err.msg ? err.msg : err;
             growlService.growl(errMsg, 'danger');

        });
      }
    }

    $scope.deleteRow = function (row, idx) {
      if (row._id) {
        formlyAdapter.deleteObject('vacations', row._id).then(function (d) {
          growlService.growl('Deleted Succesfully!', 'inverse');
          if ( idx == 0 ) {
            that.vacationList.shift();
          } else {
            that.vacationList.splice(idx, 1);
          }
          
        }, function (err) {
          //that.cancelEdit(row, idx);
          growlService.growl(err, 'danger');
        });

      }
    }

    $scope.checkErr = function(startDate,endDate) {
    var curDate = new Date();
     if(new Date(startDate) > new Date(endDate)){
      $timeout(function () {
            growlService.growl('End Date should be greater than start date','danger');
        });
    
      return false;
    }
    /*if(new Date(startDate) < new Date(curDate)){
      $timeout(function () {
            growlService.growl('Start date should be greater than today.','danger');
        });
     return false;
    }*/
    return true;
};




  });