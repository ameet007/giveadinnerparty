angular.module('fngApp').controller('SMSBaseCtrl', [
  '$scope', '$rootScope', '$location', '$filter', '$modal', '$window',
  '$data', 'SchemasService', 'routingService', 'formGenerator', 'recordHandler','dialog', '$timeout',
  function ($scope, $rootScope, $location, $filter, $modal, $window,
            $data, SchemasService, routingService, formGenerator, recordHandler, dialog, $timeout) {

    var sharedStuff = $data;
    var ctrlState = {
      master: {},
      fngInvalidRequired: 'fng-invalid-required',
      allowLocationChange: true   // Set when the data arrives..
    };

    $scope.getChildLabels = function() {
      return [
        {name:'OfficialFamilyName', label:'Official Family Name'},
        {name:'OfficialFamilyName', label:'Official Family Name'},
      ]
    };

    $scope.handleClick = function(record) {
      record.PhysicalAddress1Line = record.Address1Line;
      record.PhysicalAddress2Line = record.Address2Line;
      //record.PhysicalSuburb = record.Suburb;
      record.PhysicalAddressCity = record.AddressCity;
      record.PhysicalAddressCountry = record.AddressCountry;
      record.PhysicalAddressPostCode = record.AddressPostCode;
      console.log(record);
      //alert(record);
    };

    $scope.getLabel = function(field) {
      return field.name;
    };

    $scope.getChildValues = function(record, name) {
      return record[name];
    };

    $scope.idArray = {};

    $scope.toggleId = function(id) {
      $scope.idArray[id] = !$scope.idArray[id];
    };

    $scope.all;
    $scope.selectAllRecords = function() {
      // iterate over recordList of all existing records, add each id to the idArray as keys

      $scope.all = !$scope.all;
      for(var k = 0; k < $scope.recordList.length; k++){
        $scope.idArray[$scope.recordList[k]._id] = !$scope.idArray[$scope.recordList[k]._id];

      }
    };

    $scope.removeEntries = function() {
          $scope.multiDelete($scope.idArray);
    };

    $scope.multiDelete = function (ids) {
      var selectedIds = 0;
      for(var id in ids){

        if(ids[id] == true){
          selectedIds++;
        }
      }
        var modalInstance = $modal.open({

          template: '<div class="modal-header">' +
          '   <h3>Delete Item</h3>' +
          '</div>' +
          '<div class="modal-body">' +
          '   <p>Are you sure you want to delete these '+ selectedIds +' records?</p>' +
          '</div>' +
          '<div class="modal-footer">' +
          '    <button class="btn btn-primary dlg-no" ng-click="cancel()">No</button>' +
          '    <button class="btn btn-warning dlg-yes" ng-click="yes()">Yes</button>' +
          '</div>',
          controller: 'SaveChangesModalCtrl',
          backdrop: 'static'
        });

        modalInstance.result.then(
            function (result) {

              if (result) {
                if (typeof $scope.dataEventFunctions.onBeforeDelete === 'function') {

                  $scope.dataEventFunctions.onBeforeDelete(ctrlState.master, function (err) {
                    if (err) {
                      $scope.showError(err);
                    } else {
                      for(var id in ids) {
                        recordHandler.deleteRecord($scope.modelName, id, $scope, ctrlState);
                        $scope.removeAfterDelete(id);
                      }
                    }
                  });
                } else {
                  for(var id in ids) {
                    recordHandler.deleteRecord($scope.modelName, id, $scope, ctrlState);
                    $scope.removeAfterDelete(id);
                  }
                }
              }
            }
        );
    };

    $scope.removeAfterDelete = function(idkey){

      $timeout(function() {
        $scope.recordList = _.filter($scope.recordList, function(record) {
          //need to return an array without the currently selected _id
          return !$scope.idArray[record._id];
        });
        $scope.idArray = [];
      });
    }

    $scope.setCEN = function(record){
      var id = record._id;
      if (id && !record.ChildEntityId && id != record.ChildEntityId){
        record.ChildEntityId = id;
        $timeout(function() {
          $scope.record = record;
          $scope.id = id;
          $scope.save();
        }, 100);
        return false;
      }
      return true;
    }

    $scope.dropDownOptions = [
      {text: 'Archive', callback: function(values) { console.log("Archive:"+values); }},
      {text: 'Delete', callback: $scope.removeEntries }
    ]; ;

    $data.dataEventFunctions.onBeforeCreate = function(data, cb) {
      validateRecord(data, null, cb);
    }

    $data.dataEventFunctions.onAfterCreate = function (data) {
      if ( $scope.setCEN(data) )
        dialog.showOkDialog("Record Saved!", "Record Created Successfully!");
    };

    $data.dataEventFunctions.onAfterUpdate = function (data) {
      if ( $scope.setCEN(data) )
      dialog.showOkDialog("Record Saved!", "Record Saved Successfully!");
    };

    $data.dataEventFunctions.onRecordChange = function(data, old) {
      //validateRecord(data, null, cb);
      alert("onAfterCreate");
    }

    $scope.$on("formInputDone", function (baseScope) {
      //alert(baseScope);
      var rec = baseScope.currentScope.record;
      var sch = baseScope.currentScope.formSchema;

      for(var i = 0; i < sch.length; i++){
       var schemaField = sch[i];
        if(schemaField.default){
          if ( !rec[schemaField.name] ) {
            rec[schemaField.name] = schemaField.default;
          }
        }
      }
    });

    $data.dataEventFunctions.onBeforeUpdate = function(data, old, cb) {
      validateRecord(data, old, cb);
    }

    function validateRecord(data, old, cb) {

      old = old ? recordHandler.convertToMongoModel($scope.formSchema, angular.copy(old), 0, $scope) : null;
      var valid = true;
      if ( old && typeof old.BDMFlag !== 'undefined' && old.BDMFlag != null && old.BDMFlag != '' ) {
        if ( old.BDMFlag == 'M' || old.BDMFlag != 'U' ) {
          // check if any values changed in any names, dob and Proof of Identity
          var checkFields = ['OfficialFamilyName', 'OfficialGiven1Name', 'OfficialGiven2Name',
            'OfficialGiven3Name', 'PreferredFamilyName', 'ProofOfIdentitySighted'];
          var dobval = '';

          if ( old.BDMFlag == 'M' ) {
            checkFields.push('ChildBirthDate');
            dobval = ', DOB';
          }

          _.each(checkFields, function(f) {
            valid = valid && old[f] == data[f]
          });
          if ( !valid ) {
            dialog.showOkDialog("Locked Fields Error",
              "You cannot change any Names"+dobval+" or Identity Sighted fields due to MOE Verification Value").then(function () {
                $scope.cancel();
                cb("Locked Fields Error");
              });
          }
        }
      }

      if (valid && !data.OfficialGiven1Name) {
        valid = false;
        dialog.showOkCancelDialog("First Name Field",
          "Official 1st Given Name is a mandatory field, are you sure you want to auto populate it with ~?", "Yes", "No").then(function () {
            //data.OfficialGiven1Name = '~';
            cb();
          },function(err) {
            cb("Please Populate Official 1st Given Name Field!");
          })
      }
      if ( valid ) cb();
    }

    $scope.ctrlState = ctrlState;

    angular.extend($scope, routingService.parsePathFunc()($location.$$path));

    $scope.modelNameDisplay = sharedStuff.modelNameDisplay || $filter('titleCase')($scope.modelName);

    $rootScope.$broadcast('fngFormLoadStart', $scope);

    formGenerator.decorateScope($scope, formGenerator, recordHandler, sharedStuff);
    recordHandler.decorateScope($scope, $modal, recordHandler, ctrlState);

    recordHandler.fillFormWithBackendSchema($scope, formGenerator, recordHandler, ctrlState, recordHandler.handleError($scope));

    // Tell the 'model controllers' that they can start fiddling with basescope
    for (var i = 0 ; i < sharedStuff.modelControllers.length ; i++) {
      if (sharedStuff.modelControllers[i].onBaseCtrlReady) {
        sharedStuff.modelControllers[i].onBaseCtrlReady($scope);
      }
    }

    $scope.customize = function(item){
      // We're looking to render dates properly. There has GOTTA be a better way.
      if(typeof item === 'string'){
        var test = new Date(item);
        // Tests for date validity (ie yup this is a date string)
        if(test.getTime()){
          return $filter('date')(test, 'd/M/yyyy');
        }
      }
      return item;
    }
  }
])
