'use strict';

angular.module('sms.forms')
  .controller('CustomCtrl', function (
    formlyData, formlyUtils, $scope, $compile, 
    formlyAdapter, $util, $timeout, $modal, $log, $document,
    $templateRequest, $sce, Auth, moment

    ) {

    this.formlyData = formlyData;
    var self = this;
    this.enrolmentEnabled = formlyUtils.enrolmentEnabled;
    this.threeOrOlder = formlyUtils.threeOrOlder;
    this.isShowInactiveFee = false;

     this.checkIfAttendanceMarked = function (model, day){
      return formlyUtils.checkIfAttendanceMarked(null, day, true);
    }

    

    this.enrolmentEnabled = function (){
      return formlyUtils.enrolmentEnabled(null, null, $scope);
    }

    this.checkIfNewBookingScheduleExist = function(model){
      return !formlyUtils.enrolmentEnabled(model, model, $scope);
    }
    this.checkIfSameBookingDate=function(model,day){
      
      if(formlyUtils.sameBookingDate()){ 
        if(model[day+"Session"]=="Select Session" || typeof(model[day+"Session"])=='undefined'){ 
            model[day+"Session"]='Specific Timings';
          }
         return true;
        }
       
        return false;      
    }
    this.enrolmentBtnEnabled = function(model, subval, key, index) {
      return formlyUtils.enrolmentEnabled(model, model, $scope);
    }

    this.hasLast = function() {
      return formlyData.getLast();
    }

    this.reenroll = function() {
      formlyData.getData()['ChildStatus']='Enrolled';
      formlyData.getData()['Enrolments'].push({});
    }

    this.copyData = function(fromField, toField, useLastAsSrc) {
      var data = useLastAsSrc ? formlyData.getLast() : formlyData.getData()
      if ( data ) {
        formlyData.getData()[toField] = angular.copy(data[fromField]);
      }
    }
    this.copyChild = function(fromField, toField, useLastAsSrc) {
      var data = formlyData.getChild();
      if ( data ) {
        formlyData.getData()[toField] = angular.copy(data[fromField]);
      }
    }
    this.financeAccordian=function(event){ 
     if($(event.target).hasClass('glyphicon-plus')){
        $(event.target).removeClass('glyphicon-plus');
        $(event.target).addClass('glyphicon-minus');
        $(event.target).parents('.panel-primary').find('.panel-body').show();
      }else{ 
          if($(event.target).hasClass('dynamicAccordian')){
              $(event.target).addClass('glyphicon-plus');
              $(event.target).removeClass('glyphicon-minus');
               $(event.target).parents('.panel-primary').find('.panel-body').hide();
          }else{
            $(event.target).parents('.panel.panel-primary').find('.panel-heading').append($compile('<div  style="float:right;cursor:pointer;" ng-click="customCtrl.financeAccordian($event)" dropdown> <span style="color:#fff; padding-top:10px;" class="dynamicAccordian glyphicon glyphicon-plus"></span></div>')($scope));
              $(event.target).parents('.panel-body').hide();
              $(event.target).remove();
          }
              
         
         
         
          
      }
    }

    this.isDisabled = function(model, field, idx) {
      return formlyUtils.isDisabled(null, model, null, field, '', null, true)
    }

    this.clearFields = function(model, arr, parent, fields) {
      var self=this;
      //      if ( parent && formlyUtils.isDisabled(null, null, null, parent, fields, null, true) ) return;
      var daystartname,dayendname;
      _.each(arr, function(name) {
        
        /* Case for attendance check*/
        daystartname = name.split('Start')[0];
        dayendname = name.split('End')[0];
        if(self.checkIfAttendanceMarked(model, daystartname)) return;
        if(self.checkIfAttendanceMarked(model, dayendname)) return;
         model[daystartname+"Session"]="";
        model[name] = '';
      })
    }

    var _sessionPromise = null;
    this.sessions = [];
    var that = this;
    this.getSessions = function() {
      if ( _sessionPromise == null ) {

        _sessionPromise = formlyAdapter.getList("session", null, true).then(function (d) {
          that.sessions = d;
           var selectSessionOption = {
            End: '',
            Name: 'Select Session',
            Start: '',
          };
          
          var commonSessionOption = {
                              End: '',
                              Name: 'Specific Timings',
                              Start: '',
                            };
          that.sessions.unshift(selectSessionOption);                            
          that.sessions.push(commonSessionOption);
        });
      }
            return _sessionPromise;
    };

    // init our sessions;
    this.getSessions();

    this.copySession = function(session, field, model,event) {

        $(event.target).parent().parent().prev().text(session.Name);
        var d = field;
        //var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        //_.each(days, function(d) {
          model[d+"Session"]=session.Name;
          model[d+"Start"] = session.Start;
          model[d+"End"] = session.End;
        //});
      //}
    }

     var isLastBSTime = function (data,model) {
        var  bs, bsLast;
        var data=formlyData.getData();
       var endDatePassed = false;
        if (data.Enrolments && data.Enrolments.length) {
            var end = data.Enrolments[data.Enrolments.length - 1].EnrolmentSection.EnrolmentEndDate;
            endDatePassed = end && moment().isAfter(end, 'day');
          }
        _.each(data.Enrolments, function (enrol, enIdx) {
          _.each(enrol.BookingSchedule, function (bookingsched, bsIdx) {
                bsLast = bsIdx;
                bs=bookingsched;
          });
         
        });
        if(typeof(bs)=='undefined') return null;
        var LasBsTimes=(bs && bs.Times && bs.Times.length) ? bs.Times[bs.Times.length-1]: null;
        return (LasBsTimes && LasBsTimes.$$hashKey == model.$$hashKey) && !endDatePassed;
      }
     
    this.getSessionValue=function(day,model){
      var returnvalue="Select Session";
      if(model[day+"Session"]){
        return model[day+"Session"]
      }
      if(isLastBSTime(formlyData.getData(),model)){
          /*if(model[day+"Start"]!='' && model[day+"End"]!=''){
            returnvalue="Specific Timings";
            model[day+"Session"]="Specific Timings";
          }*/
      }else{
          if(model[day+"Start"]!='' && model[day+"End"]!=''){
            returnvalue="Specific Timings";
            model[day+"Session"]="Specific Timings";
          }
      }
      return returnvalue;

    }

    /** 
     * To find an object based on specific key value pair in 
     * an array of objects
     *
     */
    function findObjInarr (arr, key, val){

      var idx = null;
      arr.forEach(function(item, index, object){
        if(item[key]== val) idx = index;
      });
      return idx;
    }

    this.getChildFeeRecords = function() {

      var self = this;
      $scope.current = self;
      var formly_data = formlyData.getData();
      if(formlyData.getData()._id){
          var p = {
          query: JSON.stringify({
            _id:formlyData.getData()._id
          }),
        }
        $scope.currentObj = self;

        formlyAdapter.getList('child',p).then(function(childObj){ 

          if(childObj && childObj[0].Fees && (childObj[0].Fees).length > 0){

            var p = {
              query: JSON.stringify({
                _id:formly_data.facility._id
              }),
              populate:'FeesStructure.FeesType'
            }
            formlyAdapter.getList('facility', p).then(function(facility_details){
              
              facility_details  = facility_details[0];
              var grid_data_tmp = childObj[0].Fees;
              var grid_data     = [];
              var facility_fee_structures = facility_details.FeesStructure;

              grid_data_tmp.forEach(function (each_fee_row){
                
                var fee_structure_id = each_fee_row.FeesStructure;
                var facility_fee_structure_index = findObjInarr(facility_fee_structures, '_id', fee_structure_id);

                if(facility_fee_structure_index >=0){
                  var o = {
                    EffectiveStartDate : moment(each_fee_row.EffectiveStartDate).format('MMMM Do, YYYY'),
                    IsDisable : each_fee_row.IsDisable||false,
                    Notes : each_fee_row.Notes||'', 
                    Quantity : each_fee_row.Qty||'', 
                    Discount : each_fee_row.Discount||'', 
                  }
                  o.FeesName = facility_fee_structures[facility_fee_structure_index].FeesType.Name;
                  o.FeesCode = facility_fee_structures[facility_fee_structure_index].FeesType.Code;
                  o.FeeDescription = facility_fee_structures[facility_fee_structure_index].Description;
                  o.Fee = facility_fee_structures[facility_fee_structure_index].Fee;
                  o.EffectiveEndDate = each_fee_row.EffectiveEndDate ? moment(each_fee_row.EffectiveEndDate).format('MMMM Do, YYYY') : ''; 
                  if(o.IsDisable && self.isShowInactiveFee){

                    grid_data.push(o);
                  } else if(!o.IsDisable){
                    
                    grid_data.push(o);
                  }
                }
                $scope.currentObj.gridOptions = { 
                  enableSelectAll: false,
                  multiSelect:false,
                  data: grid_data,
                  onRegisterApi: function( gridApi ) { 
                    $scope.gridApi = gridApi;
                    $scope.gridApi.selection.on.rowSelectionChanged($scope,function(row){

                      var RowIndex = $scope.currentObj.gridOptions.data.indexOf(row.entity);
                      self.editFeeRecord(RowIndex);
                    });
                  }
                };  
              }); /*end forEach*/
              $timeout(function() {
                $scope.currentObj.showFeeGrid = true;
              }, 500);
            });
          }
        }); 
      }
    }

    this.editFeeRecord = function (row_index){

      console.log('row_index',row_index);
      var facility = Auth.getCurrentUser().facility;
      var fee_structure_params = {
        query: JSON.stringify({
          _id: facility._id
        }),
        populate:'FeesStructure.FeesType'
      }

      var parentElem    = angular.element($document[0].querySelector('.modal-demo'));
      var modalInstance = $modal.open({

        template: this.getEditFeeModalHTML(),
        controller: editFeeModalCtrl,
        controllerAs:'vm',
        size: 'md',
        appendTo: parentElem,
        resolve: {
          fee_structure: function () {

            return formlyAdapter.getList('facility', fee_structure_params).then(function (facility_details){
              return facility_details[0].FeesStructure;
            });
          },
          row_index: function (){
            return row_index;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
      
        $log.info('Modal close at: ' + new Date());
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    this.getEditFeeModalHTML = function (){

      var modal_html = '<div class data-ng-include="\'partials/child/edit-fee.html\'"> </div>';
      return modal_html;       
    }

    this.getAddFeeModalHTML = function (){

      var modal_html = '<div class data-ng-include="\'partials/child/add-new-fee.html\'"> </div>';
      return modal_html;       
    }
    
    this.addNewFee = function (){


      var facility = Auth.getCurrentUser().facility;
      var fee_structure_params = {
        query: JSON.stringify({
          _id: facility._id
        }),
        populate:'FeesStructure.FeesType'
      }

      var parentElem    = angular.element($document[0].querySelector('.modal-demo'));
      var modalInstance = $modal.open({

        template: this.getAddFeeModalHTML(),
        controller: addFeeModalCtrl,
        controllerAs:'vm',
        size: 'md',
        appendTo: parentElem,
        resolve: {
          fee_structure: function () {

            return formlyAdapter.getList('facility', fee_structure_params).then(function (facility_details){
              return facility_details[0].FeesStructure;
            });
          },
        }
      });

      modalInstance.result.then(function (selectedItem) {
      
        $log.info('Modal close at: ' + new Date());
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

  });
var addFeeModalCtrl = function ($scope, $modalInstance, fee_structure, formlyAdapter, formlyData){

  var that = this;

  that.fee_structure = fee_structure;
  that.unique_fee_structure_opts = getFeeStructure(fee_structure);
  that.filtered_fee_desc_opts    = [];

  that.date_format='dd-MM-yyyy';
  that.dateOptions={ format:'dd-MM-yyyy' }

  that.fields = {
    fee                  : '',
    qty                  : '',
    notes                : '',
    disable              : false,
    fee_desc             : '',
    fee_type             : '',
    discount             : '',
    effective_end_date   : '',
    effective_start_date :'',
  }

  that.addNew = function (isFormValid) {
    
    if(!isFormValid) return;
    var current_data = formlyData.getData();
    var o = {

      "EffectiveStartDate": that.fields.effective_start_date,
      "FeesStructure": JSON.parse(that.fields.fee_type).id,
      "Notes":that.fields.notes,
      "Fee":that.fields.fee,
      "Qty":that.fields.qty,
      "Discount":that.fields.discount,
      "EffectiveEndDate":that.fields.effective_end_date,
      "IsDisable":that.fields.disable,
    };
    // console.log(JSON.stringify(o))

    if(current_data.Fees && current_data.Fees.length) current_data.Fees.push(o);
    else current_data.Fees = [o];
    // console.log('that.fee_structure',JSON.stringify(that.fee_structure))
    formlyData.setData(current_data);
    console.log('current_data.Fees',JSON.stringify(current_data.Fees))

    console.log('gona add new row here')
    $modalInstance.close();
  };

  that.getFeeTypeId = function(fee_type, fee_desc){

    that.fee_structure.forEach(function (oneobj){
      console.log('oneobj', JSON.stringify(oneobj))
    });
  }

  that.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  that.openDatePicker = function ($event, type) {
    $event.preventDefault();
    $event.stopPropagation();
    closeAllOpenedDatepickers();
   
    that[type + 'Opened'] = true;
  };
  that.formClicked=function(type){
    that[type + 'Opened'] = false;
  }

  that.updateDescription = function (fee_type){

    that.fields.fee       = '';
    that.fields.fee_desc  = '';
    that.filtered_fee_desc_opts = getDescByCode(that.fee_structure, JSON.parse(fee_type).Code);
  }

  that.updateFeeAmt = function (fee_type, fee_desc){
    var fee_obj = {};
    that.fee_structure.forEach(function (structure){
      if(structure.FeesType.Code == JSON.parse(fee_type).Code && structure.Description == fee_desc) fee_obj = structure;
    });
    that.fields.fee = fee_obj.Fee||'N/A';
  }

  that.setEndDate = function (disable){

    if(disable) that.fields.effective_end_date = new Date();
    else  that.fields.effective_end_date = '';
  }

  $scope.$watch(function (scope) { return ( that.fields.effective_start_date ); }, function(){ that['startOpened']=false;});
  $scope.$watch(function (scope) { return ( that.fields.effective_end_date ); }, function(){ that['endOpened']=false;});

  var closeAllOpenedDatepickers=function(){
    var keyMap=_.map(that,function(val,key){
      if(_.includes(key, 'Opened')) return key;
      else return null;
    }).filter(function(val){ if(val) return true; return false;});
    _.each(keyMap,function(type){ that[type]=false;})
  }

}

var getFeeStructure = function (full_arr){

  var uniq = _.uniq(full_arr, function (obj){
    return obj.FeesType.Code;
  });
  var fee_structures = [];
  uniq.forEach(function(obj){
    var o = {
      Code : obj.FeesType.Code,
      Name : obj.FeesType.Name,
      id   : obj._id 
    }
    fee_structures.push(o);
  });
  return fee_structures;

}

var getDescByCode = function (full_arr, val){

  var filter = [];
  full_arr.forEach(function (obj){
    if(obj.FeesType.Code == val) filter.push(obj.Description);
  });
  return filter;
}

var editFeeModalCtrl = function ($scope, $modalInstance, fee_structure, formlyAdapter, formlyData, row_index){

  var that = this;
  that.editable_fees = formlyData.getData().Fees[row_index];
  that.fee_structure = fee_structure;
}
