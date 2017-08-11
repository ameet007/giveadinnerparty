'use strict';

angular.module('sms.nsi')
    .controller('NsiSearchCtrl', function ($scope, NSI, data, $modalInstance, $util, dialog, popup, formlyAdapter) {

      $scope.isError = false;
      $scope.student = [];
      var canAdd = true;

      function init() {
       if (formlyAdapter.cacheLookup('identificationsighted', data.record.ProofOfIdentitySighted).Value === 'Unsighted') {
          canAdd = false;
        }

        if (data.error) {
           $scope.isError = true;
           $scope.error = data.error.MessageList[data.error.MessageList.length-1];
           
        } else {
          // The NSI service returns a single result as an object, not an array
          
          //var student = data.result.student_list.student;
          var student= data.Students;
          if (angular.isArray(student)) {
            $scope.student = student;
          } else {
            $scope.student = [student];
          }
          $scope.definiteMatch=false;
          $scope.student.forEach(function (row) {

            row.dob = $util.parseDateUTC(new Date(row.BirthDate.trim()));
            
            if(row.MatchScore==="100"){
              $scope.definiteMatch=true;
            }
            row.created_date = $util.parseDateUTC(new Date(row.CreatedDate.trim()));
            if (!row.name_list) row.name_list = {name: []};
            if(!angular.isArray(row.name_list.name)){
              row.name_list.name = [row.name_list.name];
            }
            row.name_list.name.splice(0, 0, {
              surname: row.FamilyName,
              forename1: row.Given1Name,
              forename2: row.Given2Name,
              forename3: row.Given3Name,
              name_dob_verification: row.NameBirthDateVerification

            });
          });
        }
      }

      init();

      var _sixYears = 6 * 365 * 24 * 60 * 60 * 1000;
      $scope.checkDOB = function (row) {
           return $util.getAge(new Date(row.BirthDate)) < 6;
      };

      /// return true if no DOD set
      $scope.checkDOD = function (row) {
        return !(row.DeathDate != null && row.DeathDate != '');
      };

      $scope.filteredResults = (function () {
         return $scope.student.filter($scope.checkDOB).filter(function(item){
          //return item.match_indicator === '0';
          return true;
        });
      })();
      
      $scope.data = data;

      $scope.select = function (row) {
        
        if (!$scope.checkDOD(row) || (row.RecordStatus!='' && row.RecordStatus=='I')) {
          dialog.showOkDialog("Error", "The selected record cannot be used.  Please contact the MOE on 0800 ECE ECE");
        } else {
          $modalInstance.close({bdm: row.NameBirthDateVerification, nsn: Number(row.NSN), created: $util.parseDateUTC(new Date(row.CreatedDate.trim()))});
        }
      };

      $scope.add = function () {
        
        if(!canAdd) {
          dialog.showOkDialog("Please Verify Identity", "Before creating a new NSI record, the identity of the learner must be verified. If you have not sighted the approved methods of verification please contact the E.Admin Contact Centre on 0800 ECE ECE (0800 323 323) to progress the allocation of an Unverified NSN.").then(function () {
            $modalInstance.dismiss();
          });
        }else if($scope.definiteMatch){
            var msg ="An exact match has been found for this record. If this is not the record you want, please contact the Ministry on 0800 ECE ECE (0800 323 323) to create a new NSN";
            dialog.showOkDialog("Definite Match", msg);
        }else {
          popup.nsiAdd(formlyAdapter.buildRecord(data.record)).then(function (nsiadd) {
            if ( nsiadd ) {
              nsiadd.add = true;
              $modalInstance.close(nsiadd);
            }
          });
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };

      $scope.enableAdd = function(){
        var ret = false;
        if($scope.isError){
          // Allow adds when the "too many results" is shown
          if($scope.error.MessageCode === '784'){
            ret = true;
          }

          // Allow adds when the "no results" is shown
          if($scope.error.MessageCode === '785'){
            ret = true;
          }

        } else {
          ret = true;
        }
        return ret;
      }

      $scope.getMatchIndicatorText = function(match) {
        /**
         0 = Main record
         1 = Merged record
         2 = Alternative name record
         3 = Alternative name for a merged record.
         */

        var n = Number(match);
        var text = '';
        if ( n === 0 ) text = 'Main record';
        else if ( n === 1 ) text = 'Merged record';
        else if ( n === 2 ) text = 'Alternative name record';
        else if ( n === 3 ) text = 'Alternative name for a merged record';

        return match + ' (' + text + ')'

      }
    });
