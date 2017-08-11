'use strict';

angular.module('sms.nsi')
  .controller('NsiCtrl', function($rootScope, NSI, popup, dialog, $util, formlyAdapter) {

    var $scope = this;

    $rootScope.$on('formInputDone', function(evt, args) {
//      console.log(args);
    });

    $scope.nsiclean = true;



    $scope.canSearchNSN = function(record) {
      var enrolled = record.ChildStatus === 'Enrolled';
      var lessThan6 = $util.getAge(new Date(record.ChildBirthDate)) < 6;
      return enrolled && lessThan6;
    };

    $scope.canUpdateNSI = function(record) {
      return record.NationalStudentNumber != null && record.NationalStudentNumber != '';
    }

    $scope.nsiUpdate = function(record, save) {
      $scope.loading=true;
      $scope.updating=true;
      var msg = "Contact the E.Admin Contact Centre on 0800 323 323 to update fields over the phone";
      // Note ideally we should save first (for validation) see below.
      NSI.update(formlyAdapter.buildRecord(record)).then(function(d){
        $scope.loading = false;
        $scope.updating = false;
        if(d.NSN) {
          // We really should save at this point - the user won't always remember
          // TODO How can we abort on validation errors? This is not a promise interface.
          record.BDMFlag = $util.getVerification(formlyAdapter.cacheLookup('identificationsighted', record.ProofOfIdentitySighted).Value);
          save();
          dialog.showOkDialog("NSI Update", "Record Updated Successfully!");
        } else {
          var Errormessage=(d.error && d.error.MessageList && d.error.MessageList.length) ? d.error.MessageList[d.error.MessageList.length-1].MessageDescription: '';
          var messageCode=(d.error && d.error.MessageList && d.error.MessageList.length) ? d.error.MessageList[d.error.MessageList.length-1].MessageCode: '';
          if(messageCode=='934'){
            Errormessage="You are attempting to change the Birth Date AND name details of this student. If you wish to continue with this update, please contact the Ministry on 0800 ECE ECE (0800 323 323).";
          }
          dialog.showOkDialog("NSI Error", Errormessage);
        }
      }, function(err) {
        $scope.loading=false;
        $scope.updating=false;
        dialog.showOkDialog("NSI Error", "An Error Occurred Updating the Record: "+err);
      });
    }

    $scope.nsiSearch = function(record, save) {
      var msg = null;
      if ( record.ProofOfIdentitySighted == null ) {
        msg = "Cannot Search NSI until Proof of Identity Sighted is set!";
      } else if ( record.ChildStatus != 'Enrolled' ) {
        msg = "Cannot Search NSI unless Child Status is set to Enrolled!";
      } else if ( $util.getAge(new Date(record.ChildBirthDate)) >= 6 ) {
        msg = "Cannot Search NSI unless Child is less than 6 years of age!";
      }

      if ( msg != null ) {
        dialog.showOkDialog("NSI Error", msg);
        return;
      }


      $scope.loading=true;
      var params={};
      if(record.OfficialFamilyName) {
        params['FamilyName']=$util.convertToPlain(record.OfficialFamilyName);
      }
      if(record.OfficialGiven1Name) {
          params['Given1Name']=$util.convertToPlain($util.getOfficialGiven1Name(record));
      }else{
        params['Given1Name']='~';
      }
      if(record.OfficialGiven2Name) {
        params['Given2Name']= $util.convertToPlain(record.OfficialGiven2Name);
      }
      if(record.OfficialGiven3Name) {
        params['Given3Name']=$util.convertToPlain(record.OfficialGiven3Name);
      }
      if(record.ChildBirthDate) {
        params['BirthDate']=$util.formatDate(record.ChildBirthDate);
      }
      if(record.GenderCode) {
        params['Gender']=$util.formatGender(record.GenderCode);
      }

      //return false;
      NSI.search(params).then(handleSearchResults(record, save), function(err) {
        $scope.loading = false;
        var msg = err || "The Search has timed out, please refine your criteria and try again.";
        dialog.showOkDialog("NSI Error", msg);
      });
    };


    function handleSearchResults(record, save) {
      return function(data) {
        data.record = record;
        $scope.loading = false;
         popup.nsiSearchResults(data).then(function (nsi) {
          if (nsi) {
            nsi.id = record._id;
            if (nsi.nsn) {

              record.NationalStudentNumber = Number(nsi.nsn);

              // parse date like this: 20150120103208
              record.DateNSNCreated = $util.parseDateUTC(nsi.created);
              record.BDMFlag = nsi.bdm || $util.getVerification(formlyAdapter.cacheLookup('identificationsighted', record.ProofOfIdentitySighted).Value);

              save().then(function(data) {
                if ( data && data.error ) {
                  record.NationalStudentNumber = null;
                  record.DateNSNCreated = null;
                  record.BDMFlag = null;
                } else {
                  var msg = nsi.add ? "NSN Number has been created and added to this student record!" :
                    "NSN Number has been assigned to this student record!";
                  dialog.showOkDialog("NSN Number", msg);

                }
              });
            }
          }
        });
      
      }
    }



  });
