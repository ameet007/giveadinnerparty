'use strict';

angular.module('sms.forms')
  .controller('FormlyDatePickerCtrl', function ($scope,formlyData,formlyUtils,$timeout,$document) {
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.convertValue = function(dtStr) {
      if ( dtStr.getTime ) return dtStr;
      else return Date.parseDate(dtStr);
    }
    $scope.dateChanged=function(model,options,key){
      $scope['opened']=false;
      if(key==="EffectiveDate"){
        var threeOrOlder=formlyUtils.threeOrOlder(null,null,$scope)
        model['TwentyHoursECEAttestation'].isThreeOrOld=threeOrOlder;
      }
    }
    
    $scope.updateIsRegistered=function(){
        var data=formlyData.getData();
        
        if(data){
          if(data.ECEQualificationsDetails && data.ECEQualificationsDetails.RegistrationValidity && new Date(data.ECEQualificationsDetails.RegistrationValidity) < new Date()){
              data.ECEQualificationsDetails.IsRegistered = false;
          }else{
            data.ECEQualificationsDetails.IsRegistered = true;
          }
        }
    }
      $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
      };

    $scope.toggleMin();
    
    $scope.formClicked=function(type){
      $scope[type] = false;
    }
    var closeAllOpenedDatepickers=function(opened){
      
      var keyMap=_.map($scope,function(val,key){
        
        if(_.includes(key, opened)){
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
        $scope[type]=false;
      })
    }
    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      closeAllOpenedDatepickers(opened);
      $scope[opened] = true; 
      
     };

    $scope.deleteDateVal = function(model, options, key) {
      if ( !options.templateOptions.disabled) {
        model[options.key] = null;
      }
    }

    $scope.endDateIsCorrect=function(model, options,key){
        var data=formlyData.getData();
        var hasEnrolment = data && data.Enrolments && data.Enrolments.length;
         if ( hasEnrolment && !model.enrolEndDateDisabled ) { 
          var l = data.Enrolments.length;
          var start = data.Enrolments[l-1] && data.Enrolments[l-1].EnrolmentSection ? data.Enrolments[l-1].EnrolmentSection.EnrolmentStartDate : null;
          var end = data.Enrolments[l-1] && data.Enrolments[l-1].EnrolmentSection ? data.Enrolments[l-1].EnrolmentSection.EnrolmentEndDate : null;
          var attData=formlyData.getchildAttendance();
          var lastAtt=attData && attData.length ? attData[attData.length-1] : null;
          return lastAtt && end && moment(end).isBefore(lastAtt.Date, 'day');
          
        }
        return false;
    
  }

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    if ( $scope.model[$scope.options.key] && !$scope.model[$scope.options.key].getTime ) {
      $scope.model[$scope.options.key] = new Date($scope.model[$scope.options.key]);
    }



  });