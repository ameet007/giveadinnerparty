'use strict';

angular.module('sms.forms')
  .controller('ChildCtrl', function($timeout, moment, formlyData) {

    var $scope = this;

    function endDatePassed(data,checkenrol) {
      var data=formlyData.getData();
      var hasEnrolment = data && data.Enrolments && data.Enrolments.length;
       if ( hasEnrolment ) { 
        var l = data.Enrolments.length;
        var start = data.Enrolments[l-1] && data.Enrolments[l-1].EnrolmentSection ? data.Enrolments[l-1].EnrolmentSection.EnrolmentStartDate : null;
        var end = data.Enrolments[l-1] && data.Enrolments[l-1].EnrolmentSection ? data.Enrolments[l-1].EnrolmentSection.EnrolmentEndDate : null;
        
        if ( start && end && moment().isAfter(end, 'day') ) {
          return true;
        }else{
          return false;
        }
      }
      if(checkenrol && !hasEnrolment){
        return false;
      }
      return true;
    }

    $scope.endDatePassed=endDatePassed;
    $scope.enrolmentText = function(data) {
      var hasEnrolment;
      var isEnrolled;
      var enrolmentEndDatePassed;
       var data=formlyData.getData();
        if(data){
          var hasEnrolment = data.Enrolments && data.Enrolments.length;
          var isEnrolled = data.ChildStatus == "Enrolled";
          var enrolmentEndDatePassed = endDatePassed(data);
        }
      
      if ( !hasEnrolment ) {
        return "Add New Enrolment";
      } else {//if ( !isEnrolled|| hasEnrolment ) {
          return "Re-Enrol Child";  
      }
      //return "";
    }

    $scope.endDateIsCorrect=function(data){
      var hasEnrolment = data && data.Enrolments && data.Enrolments.length;
       if ( hasEnrolment ) { 
        var l = data.Enrolments.length;
        var start = data.Enrolments[l-1] && data.Enrolments[l-1].EnrolmentSection ? data.Enrolments[l-1].EnrolmentSection.EnrolmentStartDate : null;
        var end = data.Enrolments[l-1] && data.Enrolments[l-1].EnrolmentSection ? data.Enrolments[l-1].EnrolmentSection.EnrolmentEndDate : null;
        var attData=formlyData.getchildAttendance();
        var lastAtt=attData && attData.length ? attData[attData.length-1] : null;
        return lastAtt && end && moment(end).isBefore(lastAtt.Date, 'day');
        
      }
      return false;
      
    }

    $scope.canAddEnrolment = function(d) {
      var data=formlyData.getData();
      var isEnrolled;
      var hasEnrolment;
       var enrolmentEndDatePassed;
      if(data){
        isEnrolled = data.ChildStatus == "Enrolled";
        enrolmentEndDatePassed = endDatePassed(data);
        hasEnrolment = data.Enrolments && data.Enrolments.length;
      }

       if(isEnrolled && enrolmentEndDatePassed){
         return true;
      }else if(enrolmentEndDatePassed && hasEnrolment){
        return false;
      }else if(hasEnrolment && !enrolmentEndDatePassed){
        return false;
      }else{
        return isEnrolled || !hasEnrolment;  
      }
      

    }
    // todo add stuff
    /*$scope.canAddEnrolment = function(d) {
      var data;
      var isEnrolled;
      var hasEnrolment;
       var enrolmentEndDatePassed;
      if(data){
        isEnrolled = data.ChildStatus == "Enrolled";
        enrolmentEndDatePassed = endDatePassed(data);
        hasEnrolment = data.Enrolments && data.Enrolments.length;
      }
      if(enrolmentEndDatePassed){
        return false;
      }else{
        return !isEnrolled || !hasEnrolment;  
      }
      

    }*/

    $scope.isEnrolled = function(data) {
      return data.ChildStatus == "Enrolled";
    }

    $scope.addEnrolment = function(data, formsCtrl) {
     
      if(!data){
        data=formlyData.getData();
      }
       data.ChildStatus = "Enrolled";
      formlyData.setState("ENROL");
     
      $timeout(function() {
        data.Enrolments = data.Enrolments || [];
        data.Enrolments.push({});
       

        var tabs = formsCtrl.getTabs(formsCtrl.vm.selectedSchema.tabs);
        _.each(tabs, function(tab) {
          var isActive = tab.title == "Enrolments";
          //tab.showTab = isActive;
          tab.active = isActive;
        })

      }, 100);
      return true;
    }


  });
