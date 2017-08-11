'use strict';

angular.module('sms.forms')
  .filter('mapSubArray', function (formlyAdapter, formlyUtils) {
    var data = {}, serviceInvoked = false;

    function realFilter(input, ele) { // REAL FILTER LOGIC
      var str = '';
      _.each(input, function (kid) {
        str += formlyUtils.getLabel(kid, formlyAdapter.modelCacheLookup(ele).schema, true) + ", ";
      });
      return str;
    }

    function getParams(arr) {
      return {
        query: JSON.stringify({
          _id: {
            "$in": _.map(arr, function (d) {
              return d.Children;
            })
          }
        })
      }
    }

    var arrFilter = function (input, ele) { // FILTER WRAPPER TO COPE WITH ASYNCHRONICITY
      var params = getParams(input);
      if (!data[params.query]) {
        data[params.query] = "-";
        formlyAdapter.getList(ele, params, true).then(function (d) {
          if ( d && d.length && d.length > 0 )
            data[params.query] = realFilter(d, ele);
        });
        return "-"; // PLACEHOLDER WHILE LOADING, COULD BE EMPTY
      }
      else return data[params.query];
    }
    //arrFilter.$stateful = true;
    return arrFilter;
  })

  .filter('mapSubObject', function (formlyAdapter, formlyUtils) {

    return function (input, ele) {
      if (!input) {
        return '';
      } else if (ele) {
        return formlyUtils.getLabel(input, formlyAdapter.modelCacheLookup(ele).schema, true);
      } else {
        // bit of a hack to deref sub objects for list view.  Needs a better way to introspect schema
        if (input.desc) return input.desc;
        else if (input.Description) return input.Description;
        else if (input.name) return input.name;
        else if (input.FirstName && input.LastName) return input.FirstName + " " + input.LastName;
        else return input;
      }
    };
  })
  .filter('dateFilter', function ($filter) {

    return function (input) {
      if (!input) {
        return '';
      } else {
        return $filter('date')(input, 'dd-MMM-yyyy');//, h:mm:ss a');
      }
    };
  })
  .controller('SelectColumnsCtrl', function ($scope, $modalInstance, content) {

    $scope.rows = content;

    $scope.ok = function () {
      $modalInstance.close($scope.rows);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('FormlyCtrl', function ($rootScope, $scope, formlyAdapter, $timeout, $state, $http, Auth, $modalInstance,
                                      $stateParams, $cookies, $templateCache, dialog, $q, $location, growlService, formlyData,
                                      facilityService, uiGridConstants, $modal, NSI, $util, localStorageService,formlyapi) {

   
    var _scope = this;
    $rootScope.multicheckbox=true;
    var saveAndContinue=false;
    var childEnrolmentValidation=false;
    var childBookingReload=true;
    var type, id;
    var _preSaveHooks = {};
    var _original;

    var params = params && params.stateParams ? params.stateParams : $stateParams;
   
    var listener = $rootScope.$on('$stateChangeSuccess', function (event, next, toParams, fromState, fromParams) {
      params = _.extend($stateParams, toParams);
      if (next.name.indexOf("formly") > -1)
        init();
    });

    $scope.$on("$destroy", function () {
      listener();
    });
   /* $scope.uploadFile = function(file){
         var uploadUrl = "api/v1/importcsv";
         formlyapi.uploadCSVFile(file,_scope.vm.selectedSchema.name, uploadUrl);
      };*/
    
    _scope.getHeader = function () {
      var n = _scope.prettyName(_scope.vm.selectedSchema);
      
      return _scope.isNew ? "Create New " + n : (_scope.isList ? "View " + n + " Records" : "Edit " + n + " Record");
    }

    $scope.processCSVData=function(allText) {
    // split content based on new line
    var model=_scope.vm.selectedSchema.name;
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = {};
    lines['model']=model;
    lines['data']={};
    for ( var i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var tarr = {};
        for ( var j = 0; j < headers.length; j++) {
          if(data[j])
          tarr={Name:data[j]};
          else 
            tarr=null
          //tarr.push(data[j]);
        }
        if(tarr)
        lines['data'][i]=tarr;
      }
    }
    return lines;
  };

    var _gridApi;

    _scope.deleteSelectedRows = function () {
      if (!_gridApi) {
        growlService.growl('Grid Not Defined!', 'danger');
        return;
      }
      var rows = _gridApi.selection.getSelectedRows();
      var rowsTxt = rows.length == 1 ? "1 Record" : rows.length + " Records";
      dialog.showOkCancelDialog("Confirm Delete", "Are you sure you wish to delete " + rowsTxt + "?", "Yes", "No").then(function () {
        var promises = [];
        var success = 0;
        _.each(rows, function (row) {
          var id = row._id;
           var description="";
         if(_scope.vm.selectedSchema.name=="holiday"){
          if(_scope.absenceReasonMap){
            description=description+_scope.absenceReasonMap[row.ClosureReasonCode].Description;
         }
         description=(row.Name && row.Name!='') ? description+"/"+row.Name: description;

         }else if(_scope.vm.selectedSchema.name=="temporaryClosure"){
             if(_scope.absenceReasonMap){
                description=description+_scope.absenceReasonMap[row.ClosureReasonCode].Description;
             }
             description=(typeof(row.Description)!='undefined')? description+"/"+row.Description:description;
         }
          var date=(_scope.vm.selectedSchema.name=="temporaryClosure") ? row.ClosureStartDate:(typeof(row.Date)!='undefined') ? row.Date: new Date();
          
          var p = formlyAdapter.deleteObject(_scope.vm.selectedSchema.name, id,date,description).then(function (d) {
            success++;
            return true;
          }, function (err) {
            dialog.showOkDialog("Error", "An Error Occurred. The Record was not Deleted.  <hr/><b>Details: " + (err.data ? err.data : err)) + "</b>";
            return false;
          });
          promises.push(p);
        });
        $q.all(promises).then(function () {
          if (success < promises.length) {
            growlService.growl("An error occurred.  " + success + " rows deleted!", 'danger');
          } else {
            growlService.growl(rowsTxt + ' deleted successfully!', 'success');
          }
          init();
        })
      });

    }

    _scope.canAddNewRecord = function() {
      if ( _scope.vm.selectedSchema.form.disableAdd ) return (!_scope.vm.objects || _scope.vm.objects.length == 0);
      else return true;
    }
    _scope.getParamsValues = function(arr) {
      return {
        query: JSON.stringify({
          _id: {
            "$in": _.map(arr, function (d) {
              if(d && d.Children){
                return d.Children;
              }else{
                return d;
              }
              
            })
          }
        })
      }
    }

     _scope.exportTableData = function () {
                    var data =  _scope.vm.objects;
                    var schema = {};
                    schema.fields = _scope.vm.gridOptions.columnDefs;
                    schema.name   = _scope.vm.selectedSchema.name;
                    schema.csvFileName =_scope.vm.selectedSchema.name;

                      if(_scope.vm.selectedSchema.form.referenceFields){
                                schema.referenceFields = _scope.vm.selectedSchema.form.referenceFields;
                      }

                      if(_scope.vm.selectedSchema.form.csvFileName){
                                schema.csvFileName = _scope.vm.selectedSchema.form.csvFileName;
                      }

                      if(_scope.vm.selectedSchema.form.parentHighestPlaycentreQualificationCodeField){
                                schema.parentHighestPlaycentreQualificationCodeField = _scope.vm.selectedSchema.form.parentHighestPlaycentreQualificationCodeField;
                      }

                      if(_scope.vm.selectedSchema.form.bindField && _scope.vm.selectedSchema.form.fieldBasedOnBothName){
                                schema.bindField = _scope.vm.selectedSchema.form.bindField;
                                schema.fieldBasedOnBothName = _scope.vm.selectedSchema.form.fieldBasedOnBothName;
                      }

                      if(_scope.vm.selectedSchema.form.fieldBasedStaffCode){
                        schema.fieldBasedStaffCode = _scope.vm.selectedSchema.form.fieldBasedStaffCode;
                        schema.staffCodeBasedFields = _scope.vm.selectedSchema.form.staffCodeBasedFields;
                        schema.staffCodeField = _scope.vm.selectedSchema.form.staffCodeField;
                        schema.staffLabelField = _scope.vm.selectedSchema.form.staffLabelField;
                      }
                      schema.fieldBasedOnAddress = _scope.vm.selectedSchema.form.fieldBasedOnAddress;
                      schema.addressBasedFields = _scope.vm.selectedSchema.form.addressBasedFields;
                      schema.addressBasedFieldsName = _scope.vm.selectedSchema.form.addressBasedFieldsName;

                      //if(_scope.vm.selectedSchema.form  && _scope.vm.selectedSchema.form.extraSortField){
                         data=_.each(data,function(obj){
                            if(_scope.vm.selectedSchema.form.multipleDataField){
                              schema.multipleDataField = _scope.vm.selectedSchema.form.multipleDataField;
                              schema.childrenBasedField = _scope.vm.selectedSchema.form.childrenBasedField;
                              schema.multipleChildsFieldName = _scope.vm.selectedSchema.form.multipleChildsFieldName;
                            }

                            if(obj[_scope.vm.selectedSchema.form.extraSortField] && obj[_scope.vm.selectedSchema.form.extraSortField][0]){
                              _.each(_scope.vm.selectedSchema.form.sortcheckField,function(field){
                                  obj[field] = obj[_scope.vm.selectedSchema.form.extraSortField][0][field];
                              });
                            }
                          });
                      //}

                    schema.records = data;
                    $http.post('/export', schema ).
                    success(function(data, status, headers, config) {
                      console.log('export here');
                     window.location = "/export?fileName="+schema.csvFileName;
                    }).
                    error(function(data, status, headers, config) {
                      console.log('ERROR: could not download file');
                    });
     }


    _scope.openColumns = function () {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'columnModal.html',
        controller: 'SelectColumnsCtrl',
        backdrop: true,
        keyboard: true,
        resolve: {
          content: function () {
            return _scope.vm.gridOptions.columnDefs;
          }
        }

      });
      modalInstance.result.then(function (content) {

        _scope.vm.gridOptions.columnDefs = content;


        var gridOptions = _scope.vm.gridOptions;
        _scope.vm.gridOptions = {};
        $timeout(function () {
          _scope.vm.gridOptions = gridOptions;
          _scope.vm.gridOptions.data = _scope.vm.objects;
          var obj = JSON.parse(localStorageService.get("columnDefaults") || "{}");
          obj[_scope.vm.selectedSchema.name] = angular.copy(content);
          localStorageService.set("columnDefaults", JSON.stringify(obj));
        }, 250);

        //init(true);
      });
    }

    function updateCacheOverrides() {
      var name = _scope.vm.selectedSchema.name;
      var d = $q.defer();
      //if (!$templateCache.get('partials/formly/' + name + '/header.html')) {
      $http.get('partials/formly/' + name + '/header.html').then(
        //success
        function (data) {
          d.resolve();
          //$templateCache.put('partials/formly/' + name + '/header.html', data);
        },
        //failure
        function () {
          $http.get('partials/formly/header.html').then(function (data) {
            d.reject();
            // $templateCache.put('partials/formly/' + name + '/header.html', data);
          });
        });
      // }
      return d.promise;
    }


    var saveAndExit = false, isModal = false, addNew = false;
    var openStaff=false;
    _scope.save = function (_saveAndExit, _isModal, _addNew) {

      saveAndExit = _saveAndExit;
      isModal = _isModal;
      addNew = _addNew;
      // todo invoke any pre-save hooks
      if (_preSaveHooks[_scope.vm.selectedSchema.name]) {
        return _preSaveHooks[_scope.vm.selectedSchema.name].call(this, formlyData.getData(), _original, _realSave);
      } else {
        return _realSave();
      }
    }

    function _realSave(msg) {
      
      if (msg && msg.length) {
        growlService.growl(msg, 'danger');
        return {error: true, msg: msg};
      } else {
        
        return formlyAdapter.saveObject(_scope.vm.selectedSchema.name, formlyData.getData(), id).then(function (d) {
          // todo invoke any post-save hooks
          growlService.growl(_scope.prettyName(_scope.vm.selectedSchema) + ' record was saved successfully!', 'success');
          // condition to skip listView
          if(openStaff){ 
               if(isModal){ 
               $modalInstance.close(d.data);
               var idx=0;
               formlyData.setLast(formlyData.getLast());
                 dialog.showFormlyDialog(null, null, null, null, 'staff', 'edit', d.data.staff, idx,'staffdialog').then(function (data) {
                    formlyapi.addObjectToCache('staff', data, idx - 0);
                    if($scope.options && $scope.options.templateOptions && $scope.options.templateOptions.options){
                        $scope.options.templateOptions.options.splice(idx, 1, formlyUtils.buildOptions([data], 'staff', true)[0]);
                        $scope.model[$scope.options.key] = $scope.options.templateOptions.options[idx].value;
                    }
                     formlyData.setData(formlyData.getLast());
                  });
           
               }else{
                _scope.editObject({entity: {_id: d.data.staff}});
               }
          }else if(_.has(_scope.vm.selectedSchema.form,'listview') &&  !_scope.vm.selectedSchema.form.listview){
             _scope.editObject({entity: {_id: d.data._id}});
          }else if (saveAndExit) {
            if (isModal) {
              
              formlyAdapter.getObject(_scope.vm.selectedSchema.name,d.data._id).then(function(obj){
                  formlyData.setData(obj);
                  $modalInstance.close(obj);
              })
            } else {
              $timeout(_scope.listObjects);
            }
          } else {
            if (addNew) {
              _scope.newObject();
            } else {
               saveAndContinue=true;
               if(_scope.vm.selectedSchema.form.hasImageupload){
                 saveAndContinue=false;
                 if(_scope.vm.selectedSchema.form.prettyName=="Centre"){
                    $rootScope.$broadcast('centreLogo',{data:formlyData.getData()});
                 }
               }
              _scope.editObject({entity: {_id: d.data._id}});
            }
            //formlyData.getData() = {};
            //$timeout(init);
            //var obj = addNew ? {} : d.data;
            //if ( !obj.facility ) {
            //  obj.facility = Auth.getCurrentUser().facility;
            //}
            //$timeout(function() {handleObject(obj)}, 10);
            return;
          }
          //
          //
          //dialog.showOkDialog("Saved Succesfully!", "Record was saved successfully!").then(_scope.listObjects);
        }, function (err) {
          var errMsg = err && err.msg ? err.msg : err;
          var dupe = "Duplicate Kids:";
          if (errMsg.indexOf(dupe) > -1) {
            var arr = errMsg.replace(dupe, '').split(",");
            return dialog.showThreeOptionDialog("Duplicate Children Detected", "How would you like to proceed?", "Save Anyways", "Cancel", "Review Duplicates").then(function (result) {
             if (result == 'ok') {
                formlyData.getData().DupeAllowed = true;
                _realSave();
              } else if (result == 'cancel') {
                // do nothing...
                return {error: true, msg: err};
              } else if (result == 'other') {
                // alert("other");
                return formlyAdapter.getObjects("child", arr).then(function (kids) {
                  return dialog.showDupesDialog(kids).then(function (d) {
                    //alert(d);
                    $timeout(function () {
                      _scope.editObject({entity: d});
                    });
                    return {error: true, msg: err};
                  });
                });
              }
            });
          } else {
               return dialog.showOkDialog("Error Saving Record", errMsg).then(function (d) {
                return {error: true, msg: err};
              })  
           
          }

        });
      }
    }

    var _currentCenter;

    _scope.getCenter = function () {
      return _scope.vm.currentCenter;
    };

    var _realCancel = function (modal) {
      if (modal) {
        formlyData.setData(formlyData.getLast());
        $modalInstance.dismiss('cancel');
      } else {
        if(_.has(_scope.vm.selectedSchema.form,'listview') &&  !_scope.vm.selectedSchema.form.listview){
            var data=formlyData.getData();
             _scope.editObject({entity: {_id: data._id}});
          }else{
              $timeout(_scope.listObjects);
          }
        
      }
    };

    var cleanup = function (obj) {
//      return obj;
      // remove all empty objects
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] && typeof obj[key] === 'object' && !obj[key].getTime) {
          if (_.isEmpty(obj[key]))
            delete obj[key];
          else obj[key] = cleanup(obj[key]);

        } else if (key == '__index' ) {
          delete obj[key];
        }
      }
      return obj;
    };

    var compare = function (obj1, obj2) {
      //if ( !_scope.isEdit ) return true;
      var o1 = cleanup(angular.copy(obj1));
      var o2 = cleanup(angular.copy(obj2));
      delete o1.facility;
      delete o2.facility;
      var s1 = JSON.stringify(o1), s2 = JSON.stringify(o2);
      //console.log(s1);
      //console.log(s2);
      return s1==s2;
    }

    _scope.dirtyRecord = function() {
      return compare(formlyData.getData(), _original || {}) ? "cleanRecord" : "dirtyRecord";
    }

    _scope.cancel = function (modal) {
      var msg = "Your work will be lost if not saved, are you sure you want to cancel?";
      var recordsSame = compare(formlyData.getData(), _original || {});
      if (!recordsSame) {
        dialog.showOkCancelDialog("Warning", msg, "Yes", "No").then(function () {
          _realCancel(modal);
        });
      } else {
        _realCancel(modal);
      }
    }


    _scope.delete = function () {
      dialog.showOkCancelDialog("Confirm Delete",
        "Are you sure you wish to delete this record?", "Yes", "No").then(function () {
       var data=formlyData.getData();
       var description="";
         if(_scope.vm.selectedSchema.name=="holiday"){
          if(_scope.absenceReasonMap){
            description=description+_scope.absenceReasonMap[data.ClosureReasonCode].Description;
         }
         description=(data.Name && data.Name!='')? description+"/"+data.Name:description ;

         }else if(_scope.vm.selectedSchema.name=="temporaryClosure"){
             if(_scope.absenceReasonMap){
        
                description=description+_scope.absenceReasonMap[data.ClosureReasonCode].Description;
             }
         description=(typeof(data.Description)!='undefined') ? description+"/"+data.Description:description;
         }
       var date=(_scope.vm.selectedSchema.name=="temporaryClosure") ? data.ClosureStartDate:(typeof(data.Date)!='undefined') ? data.Date: new Date();
       formlyAdapter.deleteObject(_scope.vm.selectedSchema.name, id,date,description).then(function (d) {
          // todo invoke any post-save hooks
          //alert("Deleted Succesfully!");
          //dialog.showOkDialog("Success", "Record Deleted!");
          growlService.growl('Record was deleted successfully!', 'success');
          $timeout(_scope.listObjects);
          //_scope.listObjects();
        }, function (err) {
          dialog.showOkDialog("Error", "An Error Occurred. The Record was not Deleted.  <hr/><b>Details: " + (err.data ? err.data : err)) + "</b>";
        });
      });
    }

    _scope.isHolidayEditable=function(row){
          var isHolidayEditable=false;
         if(Auth.getCurrentUser().role.type=='COMPANY_ADMIN_ROLE' && ['COMPANY_ADMIN_ROLE'].indexOf(row.entity.level) !== -1){
             isHolidayEditable=true;
            }else if(Auth.getCurrentUser().role.type=='REGION_ADMIN_ROLE' && ['REGION_ADMIN_ROLE'].indexOf(row.entity.level) !== -1){
            isHolidayEditable=true;
           }else if(Auth.getCurrentUser().role.type=='FACILITY_ADMIN_ROLE' && ['FACILITY_ADMIN_ROLE'].indexOf(row.entity.level) !== -1){
            isHolidayEditable=true;
          }else if(Auth.getCurrentUser().role.type=='SYSTEM_ADMIN_ROLE'){
            isHolidayEditable=true;
          }
        return isHolidayEditable;
    }


    var _reload = true;
    _scope.newObject = function () {

      $state.go(formlyStatePrefix + "formly.new", {"type": _scope.vm.selectedSchema.name}, {reload: _reload})
      //$location.path('main/formly/new/'+_scope.vm.selectedSchema.name);
    }
    _scope.listObjects = function () {
      $state.go(formlyStatePrefix + "formly.list", {"type": _scope.vm.selectedSchema.name}, {reload: _reload})
      //$location.path('main/formly/list/'+_scope.vm.selectedSchema.name);
    }
    _scope.editObject = function (row) {
       if(childEnrolmentValidation || childBookingReload) saveAndContinue=false;
        if(_scope.isNew || !saveAndContinue)
          $state.go(formlyStatePrefix + "formly.edit", {"type": type, "id": row.entity._id}, {reload: _reload});
      //$location.path('main/formly/edit/'+_scope.vm.selectedSchema.name+"/"+row.entity._id);
      
        if(_scope.vm.selectedSchema.name=='holiday'){
          if(_scope.isHolidayEditable(row) && !saveAndContinue){
           
              $state.go(formlyStatePrefix + "formly.edit", {"type": type, "id": row.entity._id}, {reload: _reload});
          }else{ 
              $state.reload();
              growlService.growl('Not authorised to edit!', 'danger');
            } 
              
        }else if(openStaff){
                  $state.go(formlyStatePrefix + "formly.edit", {"type": 'staff', "id": row.entity._id}, {reload: _reload});
        }else{
          if(!saveAndContinue)
           $state.go(formlyStatePrefix + "formly.edit", {"type": type, "id": row.entity._id}, {reload: _reload});
        
        }
          
      
       //$location.path('main/formly/edit/'+_scope.vm.selectedSchema.name+"/"+row.entity._id);

    }

    // pass thru for ui-grid de-reference
    $scope.editObject = _scope.editObject;

    var _allSchemas;

    function getSelectedSchema(type, skipAll) {
      var schemaFilter = function (s) {

        return s.name == type
      };


      if (type) {
        var o = _.filter(_scope.vm.schemas, schemaFilter)[0];
        // maybe a security violation... check rules
        if (o == null && !skipAll && _scope.isEdit && Auth.canEdit(type)) {
          o = _.filter(_allSchemas, schemaFilter)[0];
        }

        return o;
      } else {
        return _scope.vm.schemas[0];
      }
    }

    _scope.canDelete = function () {
      return getSelectedSchema(type, true) != null;
    }

    function setSelectedSchema(schema) {
      // _scope.vm.form=null;

      _scope.vm.selectedSchema = schema;
      //updateCacheOverrides().then(function (d) {
      //  setSchemaHeader(_scope.vm.selectedSchema.name+'/');
      //}, function (err) {
      //  setSchemaHeader('/');
      //});
      $timeout(function () {
        _scope.showForm = true;
      }, 300);
    }

    function setSchemaHeader(prefix) {
      //$timeout(function () {
      _scope.vm.schemaHeader = prefix + "header.html";
      // }, 10);
    }


    var initData = function () {

      formlyData.getData().facility = Auth.getCurrentUser().facility;
    }

    var handleObject = function (data) {
      var schema = getSelectedSchema(type);
        
        /*********************************
        *    Patch To                    * 
        *    Sort Entolements            *
        *    & Booking Schedue for Child *       
        *********************************/
        /*if(schema.form.sortSubDocument){
           data[schema.form.sortSubDocument]=_.sortBy(data[schema.form.sortSubDocument],'EnrolmentSection.EnrolmentStartDate').reverse();
          if(schema.form.sortchildTochildDoc){
            _.each(data[schema.form.sortSubDocument],function(obj,key){
                var sortedData=_.sortBy(obj[schema.form.sortchildTochildDoc],'EffectiveDate').reverse();
                data[schema.form.sortSubDocument][key][schema.form.sortchildTochildDoc]=sortedData;
                
            });
            
          } 
        }*/

       
      _original = {};
      $timeout(function () {
        _original = angular.copy(data);
         if(_original.ECEQualificationsDetails && _original.ECEQualificationsDetails.RegistrationValidity && new Date(_original.ECEQualificationsDetails.RegistrationValidity) < new Date()){
             data.ECEQualificationsDetails.IsRegistered = false;
          }else if(data.UploadCompanyLogo){
            _.each(data.UploadCompanyLogo,function(obj,k){
              if(obj.filename){
                data.UploadCompanyLogo[k].filename=JSON.parse(obj.filename);    
              }
              
            });
           
          }
        formlyData.setOriginal(_original);
        formlyData.setState(null);
        if ( !_scope.vm.currentCenter ) {
          facilityService.getCurrentCenter().then(function (c) {
            _scope.vm.currentCenter = c;
            finishHandleObject(data, schema);
          });
        } else {
          finishHandleObject(data, schema);
        }

      }, 0);
    };


    function finishHandleObject(data, schema) {
      data.facility = _scope.vm.currentCenter;

      if(schema && schema.name && schema.name=='child') formlyData.setChild(data);

      formlyData.setData(data);

      _scope.vm.data = formlyData.getData();
      $timeout(function () {
        setSelectedSchema(schema);
      }, 0);



      if(schema && schema.name && schema.name=='staff'){


        var o = {
          StaffRoleCode:{
            EducationalRoleCode  : null,
            ManagementRoleCode   : null,
            SupportStaffRoleCode : null,
            SpecialStaffRoleCode : null
          },
          ECEQualificationsDetails:{
            HighestQualificationCode:null
          }
        }

        var f_data = Auth.getCurrentUser().facility;
        
        if(f_data.CenterType == 'Home Based') o['StaffRoleCode']['EducationalRoleCode2'] = null;
        if(f_data.CenterType == 'Playcentre') o['ECEQualificationsDetails']['HighestPlaycentreQualificationCode'] = null;

        var staff_codes = data.StaffRoleCode;

        Object.keys(staff_codes).forEach(function (one_key){
          o['StaffRoleCode'][one_key] = staff_codes[one_key];
        });

        var old = angular.copy(formlyData.getData());

        old.StaffRoleCode = o.StaffRoleCode;

        if(old.ECEQualificationsDetails){

          if(!old.ECEQualificationsDetails.HighestQualificationCode)
          old.ECEQualificationsDetails.HighestQualificationCode = o.ECEQualificationsDetails.HighestQualificationCode;

          if(f_data.CenterType == 'Playcentre' && !old.ECEQualificationsDetails.HighestPlaycentreQualificationCode)
          old.ECEQualificationsDetails.HighestQualificationCode = o.ECEQualificationsDetails.HighestQualificationCode;
        } else{
          old.ECEQualificationsDetails = o.ECEQualificationsDetails;          
        }
        formlyData.setData(old);
      }

    }


/*  function checkStaffRole(dataStaffcode,peRoleId){
    _.each(dataStaffcode, function (code1) {
              //console.log(typeof code1.StaffRoleCode1+"---"+ typeof peRoleId);
              if(code1.StaffRoleCode1 != peRoleId){
                  return "yes";
              }else{
                return "no";
              }
    });  
  }*/



    function init(updateCols) {
      _scope.vm = {};

      _scope.checkRole = Auth.checkRole;

      var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
      };

      var buildSortOptions = function (opts) {

        opts = opts || paginationOptions.sort;
        if (!opts || opts.length == 0) {
          var sortArr = _.filter(_scope.vm.gridOptions.columnDefs, function (d) {
            return d.sort;
          });
          if (sortArr && sortArr.length) {
            return buildSortOptions(sortArr);
          } else {
            return "{}";
          }
        }
        var sortCol = opts[0];
        var dir = (sortCol.sort.direction != uiGridConstants.ASC ? '-' : '+');
        return dir + sortCol.field;
        //var sort = "{";
        //_.each(opts, function(sortCol) {
        //  sort = sort + "'"+sortCol.field+"':" + (sortCol.sort.direction == uiGridConstants.ASC ? 0 : 1);
        //  sort += ",";
        //});
        //sort = sort.substr(0,sort.length-1);
        //return sort + "}";
      };






      var repopulateList = function (preserveCols) {
        if (updateCols || !preserveCols)
          _scope.vm.gridOptions.columnDefs = buildColumnDefs(_scope.vm.selectedSchema);

        var params = getListPopulateParams(_scope.vm.selectedSchema);
        params.limit = paginationOptions.pageSize;
        params.skip = paginationOptions.pageSize * (paginationOptions.pageNumber - 1);
        params.sort = buildSortOptions();
        var adminObjss = getAdmins();

       
        formlyAdapter.getList(_scope.vm.selectedSchema.name, params).then(function (data) {
          _scope.vm.objects = data;
           if(_scope.vm.selectedSchema.name=='usereventlogs'){
              _scope.vm.objects=_scope.vm.objects.map(function(obj){
                    obj.Date=moment(obj.Date).format('DD-MM-YYYY h:m:s');
                    return obj;
               });
            }
          if(_scope.vm.selectedSchema.name=='holiday' && Auth.getCurrentUser().role.type=='SYSTEM_ADMIN_ROLE'){
             _scope.vm.objects=_scope.vm.objects.filter(function(obj){
                
                    _.each(adminObjss.data,function(adminuser){
                        if(adminuser._id==obj.createdBy){
                          obj.username=adminuser.username;
                        }
                    });
                  if(obj.level=='SYSTEM_ADMIN_ROLE'){
                      obj.level="System Admin";
                  }else if(obj.level=='COMPANY_ADMIN_ROLE'){
                    obj.level="Company Admin";
                  }else if(obj.level=='REGION_ADMIN_ROLE'){
                    obj.level="Region Admin";
                  }else if(obj.level=='FACILITY_ADMIN_ROLE'){
                    obj.level="Centre Admin";
                  }
                  return obj;
             });
          }

           //if(_scope.vm.selectedSchema.form  && _scope.vm.selectedSchema.form.extraSortField){
              _scope.vm.objects=_.each(_scope.vm.objects,function(obj){
                if(obj[_scope.vm.selectedSchema.form.extraSortField] && obj[_scope.vm.selectedSchema.form.extraSortField][0]){
                  _.each(_scope.vm.selectedSchema.form.sortcheckField,function(field){
                      obj[field] = obj[_scope.vm.selectedSchema.form.extraSortField][0][field];
                  });
                }

                if(_scope.vm.selectedSchema.form.multipleDataField){
                      if(obj && obj.Children && obj.Children[0]){
                          var params = _scope.getParamsValues(obj.Children);
                          formlyAdapter.getList(_scope.vm.selectedSchema.form.multipleDataField, params, true).then(function (child) {
                                var childrensName = '';
                                _.each(child,function(c){
                                    childrensName+=c.OfficialFamilyName+'/'+c.OfficialGiven1Name+',';
                                })
                                obj[_scope.vm.selectedSchema.form.childrenBasedField] = childrensName;
                          })
                      }else{
                         obj[_scope.vm.selectedSchema.form.childrenBasedField]=''; 
                      }
                }

                if(_scope.vm.selectedSchema.form.hasplaycentre){
                    if(obj[_scope.vm.selectedSchema.form.parentHighestPlaycentreQualificationCodeField]){
                      var params = _scope.getParamsValues(obj[_scope.vm.selectedSchema.form.parentHighestPlaycentreQualificationCodeField][_scope.vm.selectedSchema.form.multipleChildsFieldName]);
                      formlyAdapter.getList(_scope.vm.selectedSchema.form.multipleDataField, params, true).then(function (centre) {
                          var centresName = '';
                          _.each(centre,function(c){
                              centresName+=c.Code+'/'+c.Label+',';
                          })
                          obj[_scope.vm.selectedSchema.form.childrenBasedField] = centresName;
                       })
                    }else{
                      obj[_scope.vm.selectedSchema.form.childrenBasedField] = '';
                    }
                }
              });
          //}

          
          _scope.vm.gridOptions.data = _scope.vm.objects;
        });
      };



    var getAdmins = function () {
         var admins = [];
      var adminObj = {};
          formlyAdapter.getList('administrator').then(function(admin){
                   if(admin && admin.length){
                      _.each(admin,function(adminuser){
                          admins.push(adminuser);
                      });
            adminObj.data = admins;
                   }
         });
    return adminObj;
    };


      _scope.vm.gridOptions = {
        enableRowSelection: 0,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        multiSelect: true,
        paginationPageSizes: [10, 25, 50, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enableFiltering: true,
        isRowSelectable:function(row){
         if(_scope.vm.selectedSchema.name=='holiday'){
           return _scope.isHolidayEditable(row);
         }else{
          return true;
         }
         
        },
        onRegisterApi: function (gridApi) {
          _gridApi = gridApi;
          
          _gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns.length == 0) {
              paginationOptions.sort = null;
            } else {
              paginationOptions.sort = sortColumns;//[0].sort.direction;
            }
            repopulateList(true);
          });
          _gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;
            repopulateList(true);
          });
        },
        rowTemplate: "<div  ng-dblclick=\"grid.appScope.editObject(row)\" ng-disabled=\"1\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
      };
     
      var isNew = $state.is(formlyStatePrefix + "formly.new") || params.action == 'add';
      _scope.isEdit = ($state.is(formlyStatePrefix + "formly.edit") && !isNew) || params.action == 'edit';
      var isList = $state.is(formlyStatePrefix + "formly.list");

      _scope.isNew = isNew;
      _scope.isList = isList;
      _scope.isNewOrEdit = isNew || _scope.isEdit;

      _scope.prettyName = formlyAdapter.prettyName;

      if (!params.type) params = $state.params;

      type = params.type;
      id = params.id;


      // The model object that we reference
      formlyData.setData({});
      _scope.options = {};




      if(type=='staff' && isNew){

        var o = {
          StaffRoleCode:{
            EducationalRoleCode  : null,
            ManagementRoleCode   : null,
            SupportStaffRoleCode : null,
            SpecialStaffRoleCode : null
          },
          ECEQualificationsDetails:{
            HighestQualificationCode:null
          }
        }

        var f_data = Auth.getCurrentUser().facility;
        if(f_data.CenterType == 'Home Based') o['StaffRoleCode']['EducationalRoleCode2'] = null;
        if(f_data.CenterType == 'Playcentre') o['ECEQualificationsDetails']['HighestPlaycentreQualificationCode'] = null;

        formlyData.setData(o);
      } 

      formlyAdapter.getModels().then(function (data) {

        $timeout(function () {
          _allSchemas = data;

          _scope.vm.schemas = _.filter(data, function (s) {

            return s.hasAccess;
          }); 
          
          facilityService.getCurrentCenter().then(function (c) {
            
            _scope.vm.currentCenter = c;
          });

          if (!_scope.isEdit) {  
            //formlyData.getData() = {};

            setSelectedSchema(getSelectedSchema(type));
            //var pageSize = _scope.vm.selectedSchema.form.pageSize || 25;
            var pageSize = _scope.vm.selectedSchema && _scope.vm.selectedSchema.form && _scope.vm.selectedSchema.form.pageSize || 25;
            if (pageSize == -1) {
              pageSize = 1000;
              _scope.vm.gridOptions.paginationPageSizes.push(pageSize);
            }
            _scope.vm.gridOptions.paginationPageSize = pageSize;
            paginationOptions.pageSize = pageSize;

            for (var key in _scope.vm.form) {
              if (_scope.vm.form[key] && _scope.vm.form[key].resetModel) _scope.vm.form[key].resetModel();
            }

            if (!isList) {
              initData();
              _scope.vm.facility = formlyData.getData().facility;
            }

            //_.each(_scope.getTabs(_scope.vm.selectedSchema.tabs), function(t) {
            //  if (t.form.options && t.form.options.resetModel )
            //    t.model = {};
            //    $timeout(t.form.options.resetModel, 0);
            //})


          }
 
          if (isList) { 
            repopulateList();
          } else if (_scope.isEdit) { 
            if(type=='child'){
                var p = {
                        query: JSON.stringify({
                          Child: {"$in":[id]},
                        })
                      }
                      if ($state.is('main.addAttendance')) {
                        p['populate'] = 'Child';
                      }
                      p['sort']='+Date'
                   
            
              formlyAdapter.getList('attendance',p).then(function(att){
                formlyData.setchildAttendance(att);
              })
            }
            formlyAdapter.getObject(type, id, true).then(handleObject)
          }
        });
      });

      // todo move this out
      _preSaveHooks['parent']=function(data, old, cb){
          if(data.facility && data.facility.CenterType=='Playcentre' && !data.isStaffParent){
            
              dialog.showOkCancelDialog("Educator Confirmation",
                  data.FamilyNameSurname+" "+data.GivenName+" will be an educator?", "Yes", "No",'static').then(function () {
                  data.isStaffParent=true;
                  openStaff=true;  
                  formlyData.setData(data);
                  return cb();
               }, function (err) {
                
                  return cb();
               })
          }else{
            return cb();
          }
           
      }
      _preSaveHooks['temporaryClosure']=function(data, old, cb){
         var description='';
            if(_scope.absenceReasonMap){
                description=description+_scope.absenceReasonMap[data.ClosureReasonCode].Description;
             }
             description=(typeof(data.Description)!='undefined')? description+"/"+data.Description:description;
         
          formlyAdapter.saveObject('usereventlogs',{EventDate:data.ClosureStartDate,EventType:'Saved TemporaryClosure',EventDescription:description}).then(function(u){
                  return cb();
                })
           
      }
      _preSaveHooks['holiday']=function(data, old, cb){
        var description='';
            if(_scope.absenceReasonMap){
                description=description+_scope.absenceReasonMap[data.ClosureReasonCode].Description;
             }
             description=(typeof(data.Name)!='undefined')? description+"/"+data.Name:description;
         
          formlyAdapter.saveObject('usereventlogs',{EventDate:data.Date,EventType:'Saved Holiday',EventDescription:description}).then(function(u){
                  return cb();
                })
           
      }

      _preSaveHooks['child'] = function (data, old, cb) {
        old = old || null;
          var oldEn=(old && old.Enrolments && old.Enrolments.length) ? old.Enrolments[old.Enrolments.length-1]:null;
          var en=(data && data.Enrolments && data.Enrolments.length) ? data.Enrolments[data.Enrolments.length-1]:null;
          
           if(en &&  en._id &&  en._id.toString()==oldEn._id.toString()){
            if((oldEn && oldEn.EnrolmentSection['EnrolmentStartDate']==null && en.EnrolmentSection['EnrolmentStartDate']!=null) || (oldEn && oldEn.EnrolmentSection['EnrolmentStartDate']=='' && en.EnrolmentSection['EnrolmentStartDate']!='') || (!oldEn && en) ){
              if(!(moment(oldEn.EnrolmentSection['EnrolmentStartDate']).isSame(moment(en.EnrolmentSection['EnrolmentStartDate']),'day')) && !en.EnrolmentSection['enrolStartDateDisabled'])
                childEnrolmentValidation=true;
            }
            if((oldEn && oldEn.EnrolmentSection['EnrolmentEndDate']==null && en.EnrolmentSection['EnrolmentEndDate']!=null) || (oldEn && oldEn.EnrolmentSection['EnrolmentEndDate']=='' && en.EnrolmentSection['EnrolmentEndDate']!='') || (!oldEn && en) ){
              if(!(moment(oldEn.EnrolmentSection['EnrolmentEndDate']).isSame(moment(en.EnrolmentSection['EnrolmentEndDate']),'day')) && !en.EnrolmentSection['enrolEndDateDisabled'])
                childEnrolmentValidation=true;
            }
           }else if(en && (en.EnrolmentSection['EnrolmentEndDate']!=null || en.EnrolmentSection['EnrolmentEndDate']!='')){
              childEnrolmentValidation=true;
           }

         var valid = true;

         if(childEnrolmentValidation){
          dialog.showOkCancelDialog("Enrolment Confirmation","You cannot change the Enrolment start/end date after saving the data", "Yes", "No",'static').then(function () {
                 return cb();
                 }, function (err) {
                })
           }else{
              return cb();
            }

      }



      /*_preSaveHooks['child'] = function (data, old, cb) {
        old = old || null;


        var valid = true;

        if (old) {//} && typeof old.BDMFlag !== 'undefined' && old.BDMFlag != null && old.BDMFlag != '') {


          //if (old.BDMFlag == 'M' || old.BDMFlag != 'U') {
          // check if any values changed in any names, dob and Proof of Identity
          var checkFields = ['OfficialFamilyName', 'OfficialGiven1Name', 'OfficialGiven2Name',
            'OfficialGiven3Name', 'PreferredFamilyName', 'ProofOfIdentitySighted'];
          var dobval = '';

          // if (old.BDMFlag == 'M') {
          checkFields.push('ChildBirthDate');
          //   dobval = ', DOB';
          //}

          _.each(checkFields, function (f) {
            if (f == 'ChildBirthDate') {
              var d1 = old[f] && old[f].getTime ? old[f].getTime() : old[f];
              var d2 = data[f] && data[f].getTime ? data[f].getTime() : data[f];
              valid = valid && d1 == d2;
            } else {
              valid = valid && old[f] == data[f]
            }
          });
          if (!valid) {
            // run nsi update command, then show message...
            if (data.NationalStudentNumber) {
             return  nsiUpdate(data).then(function(d){
                   if (d && d.error) return;
                   else cb();
              })
              /*return cb().then(function (d) {
                if (d && d.error) return;
                else nsiUpdate(data);
              })*
            } else {
              return cb();
            }
            //
            //
            //var nsiMsg = "You have edited some MOE verified data fields. Please run NSI Update or contact the E.Admin Contact Centre on 0800 323 323 to update fields on phone";
            ////nsiMsg = "You cannot change any Names" + dobval + " or Identity Sighted fields due to MOE Verification Value";
            //dialog.showOkDialog("NSI Update Warning", nsiMsg).then(function () {
            //  //_scope.cancel();
            //  //return cb("Locked Fields Error");
            //  return cb();
            //});
          }
          //}
        }


        //if (valid && !data.OfficialGiven1Name) {
        //  valid = false;
        //  dialog.showOkCancelDialog("First Name Field",
        //    "Official 1st Given Name is a mandatory field, are you sure you want to auto populate it with ~?", "Yes", "No").then(function () {
        //    //data.OfficialGiven1Name = '~';
        //    return cb();
        //  }, function (err) {
        //    return cb("Please Populate Official 1st Given Name Field!");
        //  })
        //}

        if (valid) return cb();

      }*/

      _preSaveHooks['facility'] = function (data, old, cb) {
        
          if(data.UploadCompanyLogo){

            _.each(data.UploadCompanyLogo,function(obj,k){
              data.UploadCompanyLogo[k].filename=JSON.stringify(obj.filename);  
          });
           // data.UploadCompanyLogo[0].filename=JSON.stringify(data.UploadCompanyLogo[0].filename);
          }

          return cb();
      }


    }
    var nsiUpdate = function (record) {
      var msg = "Contact the E.Admin Contact Centre on 0800 323 323 to update fields over the phone";
      
      NSI.update(formlyAdapter.buildRecord(record)).then(function (d) {
       if (d.NSN) {
          // We really should save at this point - the user won't always remember
          // TODO How can we abort on validation errors? This is not a promise interface.
          record.BDMFlag = $util.getVerification(formlyAdapter.cacheLookup('identificationsighted', record.ProofOfIdentitySighted).Value);
          _realSave();
          dialog.showOkDialog("NSI Update", "Record Updated Successfully!");
        } else {
          //_realSave();
          var errorMessage=(d.error && d.error.MessageList && d.error.MessageList.length) ? d.error.MessageList[d.error.MessageList.length-1].MessageDescription : '';
          var messageCode=(d.error && d.error.MessageList && d.error.MessageList.length) ? d.error.MessageList[d.error.MessageList.length-1].MessageCode: '';
          if(messageCode=='934'){
            errorMessage="You are attempting to change the Birth Date AND name details of this student. If you wish to continue with this update, please contact the Ministry on 0800 ECE ECE (0800 323 323).";
          }
          dialog.showOkDialog("NSI Update Error", errorMessage);
        }
      }, function (err) {
        //_realSave();
        dialog.showOkDialog("NSI Update Error", "An Error Occurred Updating the Record: " + err);
      });
    };
    /*var nsiUpdate = function (record) {
      var msg = "Contact the E.Admin Contact Centre on 0800 323 323 to update fields over the phone";
      NSI.update(formlyAdapter.buildRecord(record)).then(function (d) {
        if (d.nsn) {
          // We really should save at this point - the user won't always remember
          // TODO How can we abort on validation errors? This is not a promise interface.
          record.BDMFlag = $util.getVerification(formlyAdapter.cacheLookup('identificationsighted', record.ProofOfIdentitySighted).Value);
          _realSave();
          dialog.showOkDialog("NSI Update", "Record Updated Successfully!");
        } else {
          //_realSave();
          dialog.showOkDialog("NSI Update Error", d.error.description + "  " + msg);
        }
      }, function (err) {
        //_realSave();
        dialog.showOkDialog("NSI Update Error", "An Error Occurred Updating the Record: " + err);
      });
    };*/


     _scope.checkChildDelete = function(val){

         if(Auth.getCurrentUser().role.type=='SYSTEM_ADMIN_ROLE')
         {
            return true;  
         }else if(Auth.getCurrentUser().role.type=='COMPANY_ADMIN_ROLE' || Auth.getCurrentUser().role.type=='REGION_ADMIN_ROLE' || Auth.getCurrentUser().role.type=='FACILITY_ADMIN_ROLE'){
          if(typeof(val)!='undefined' && val){
            return false;
          }
          var childData=formlyData.getData();
          if(childData && childData.Enrolments && childData.Enrolments.length){
            return false;
          }else{
            return true;
          }
         }else{
            return  false;
         }
     }

    _scope.getJson = function () {
      return JSON.stringify(formlyData.getData());
    };


    var getListPopulateParams = function (schema) {
      var arr = [];
      for (var key in schema.schema.paths) {
        var val = schema.schema.paths[key];
        if ((val.options.list || val.options.canList)) {
          if (val.instance == "ObjectID") {
            arr.push(key);
          }
        }
      }
      return {populate: arr.join(",")};
    };


    function buildColumnDefs(schema, prefix) {
      var obj = JSON.parse(localStorageService.get("columnDefaults") || "{}");
      var defaultMap = {};
      if (obj && obj[schema.name]) {
        _.each(obj[schema.name], function (m) {
          defaultMap[m.field] = m.visible;
        });
      }


      var arr = [];
      for (var key in schema.schema.paths) {
        var val = schema.schema.paths[key];
        if (val.options.list || val.options.canList) {
          //if (val.options.list || val.options.canList) {
          var label = val.options.form && val.options.form.label ? val.options.form.label : key;
          //if (val.options.list) {
          if (val.instance == "ObjectID" && !prefix) {
            arr.push({'field': key, 'displayName': label, 'cellFilter': 'mapSubObject:"' + val.options.ref + '"'});
          } else if (val.instance == "Date" && !prefix) {
            arr.push({'field': key, 'displayName': label, 'cellFilter': 'dateFilter'});
            //arr.push({'field': key, 'displayName':label, 'cellFilter' : 'date : dd-MM-yyyy'});
            //arr.push({'field': key, 'displayName':label, 'cellFilter' : 'date : MMM dd, yyyy h:mm:ss a'});
          } else if (val.instance == 'Array') {
                 arr.push({'field': key, 'displayName': label, 'cellFilter': 'mapSubArray:"' + val.options.ref + '"'});     
             } else {
            //if ( prefix ) {
            arr.push({'field': key, 'displayName': label});
          }
          //}
          var isColDefined = typeof(defaultMap[key]) != 'undefined';
          arr[arr.length - 1].visible = defaultMap[key] == true ||
          (val.options.list && (!isColDefined)) && (typeof(val.options.visible) =='undefined' || val.options.visible )
            ? true : false;

          if (val.options.sort)
            arr[arr.length - 1].sort = {direction: 'asc', priority: 0}

          if ( val.options.listFilterDefault ) {
            arr[arr.length - 1].filter = arr[arr.length - 1].filter || {};
            arr[arr.length - 1].filter.term = val.options.listFilterDefault;
            //var str = key+":"+val.options.listFilterDefault;
            //_scope.filterOptions.filterText += (_scope.filterOptions.filterText == '') ? str : "," + str;
          }
          if ( val.options.listFilterDropdown) {
            arr[arr.length - 1].filter = arr[arr.length - 1].filter || {};
            arr[arr.length - 1].filter.type = uiGridConstants.filter.SELECT;
            arr[arr.length - 1].filter.selectOptions = _.map(val.options.enum, function(el) {return {label:el,value:el}});
          }
        }
      }
      //console.log("arr:"+JSON.stringify(arr));
      return arr;
    }

    function getListAttrs(val) {
      var sch = _.filter(_scope.vm.schemas, function (s) {
        return s.name == val.path;
      })[0];


      return buildColumnDefs(sch, val.path);
    }

    var tabs = {};

    _scope.showTab = function (tab) {
      var hide = true;
      _.each(tab.form.fields, function (t) {
        hide = t.hidden && hide;
      });
      return !hide;
    }

    _scope.isInvalid = function (tab) {
      return _scope.vm.form && _scope.vm.form[tab.title] && _scope.vm.form[tab.title].$invalid;
    }


    _scope.getTabs = function (tabsArray) {

      if (!_scope.vm.selectedSchema) return [];
      
      if (tabs[_scope.vm.selectedSchema.name]) return tabs[_scope.vm.selectedSchema.name];
      
      var arr = [];
      var lookup = {};
      var isFirst = true;

      for (var key in tabsArray) {
        var fields = tabsArray[key];
        var obj = {
          title: key,
          active: isFirst,
          showTab: isFirst,
          form: {
            options: {},
            model: formlyData.getData(),
            fields: fields
          }
        }
        isFirst = false;
        arr.push(obj);
        //lookup[f.tab] = obj;
      }
      
      //
      //if ( arr.length ) {
      //  arr[0].showTab = true;
      //  arr[0].active = true;
      //}

      tabs[_scope.vm.selectedSchema.name] = arr;
//console.log(arr);
      return arr;
    }

    init();

  });
