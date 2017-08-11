'use strict';

angular.module('sms.forms')
  .controller('FormlyRefCtrl', function($scope, dialog,formlyAdapter, formlyData, formlyUtils, formlyapi,Auth, $timeout) {

    function init() {
      // todo embed server side call to get available options.
      var refType = $scope.options.templateOptions.extras.type;
      var filter = $scope.options.templateOptions.extras.filter;
      var isRequired = $scope.options.templateOptions.extras.isRequired;
      //console.log("Request Options for type:"+refType);
      formlyapi.getList(refType, null, true).then(function (data) {
         
        if ( filter ) {
          //console.log("for filtered type:"+refType+", got list:"+data);
          if($scope.options.key=="EducationalRoleCode" || $scope.options.key=="EducationalRoleCode2"){
            
            if(Auth.getCurrentUser().facility.CenterType=="Home Based"){
               filter='ref.Code=="HBE" || ref.Code=="HBC"';
            }else if(Auth.getCurrentUser().facility.CenterType=="Playcentre"){
               filter='ref.Code=="PE"';
            }else if(Auth.getCurrentUser().facility.CenterType=="Centre based"){
                filter='ref.Code=="ECET"';
            }
          }

          data = _.filter(data, function(ref) {
            return eval(filter);
          })
          
           
        }
        //console.log("GotOptions for type:"+refType+", with filter:"+filter+", got list:"+data);
        $timeout(function() {
          $scope.options.templateOptions.options = formlyUtils.buildOptions(data, refType, isRequired);
          
        }, 300);
      })

    }

    $scope.checkEditAccess=function(roles,canAdd,key){
      var userRole=Auth.getCurrentUser().role.type;
      if(['Address2Line','AddressCity'].indexOf(key)==-1 && canAdd){
        return true;
      }else if(canAdd && roles && roles.length ){
        if(roles.indexOf(userRole)!=-1){
          return true;
        }  
      }
      
      return false;
    }

    $scope.checkStaffRole=function(){
       var data=formlyData.getData();
      
       formlyAdapter.getList('staffrolecode',{query:JSON.stringify({Code:'PE'})}).then(function(obj){
          if(obj && obj.length){
            var val=obj[0]._id;
            var flag=false;
            if(data.StaffRoleCode){
                if(data.StaffRoleCode.EducationalRoleCode==val || data.StaffRoleCode.EducationalRoleCode2==val || data.StaffRoleCode.ManagementRoleCode==val || data.StaffRoleCode.SupportStaffRoleCode==val || data.StaffRoleCode.SpecialStaffRoleCode==val){
                   flag=true;
                }
            }
            data.ECEQualificationsDetails.isSelectedPlaycenter=flag;
          }
       });
     
        
      
       
    }

    init();
   // console.log($scope.options);
    

    $scope.canAdd = function () {
      return true;
    }

    $scope.canEdit = function () {
      return true;
    }

    $scope.edit = function (type, objId) {
      //console.log(objId);
      formlyData.setLast(formlyData.getData());
      var idx = 0;
      _.each($scope.options.templateOptions.options, function (opt, index) {
        if (opt.value == objId) idx = index;
      });

      var subtract = ($scope.options.templateOptions.required ? 0 : 1);

      dialog.showFormlyDialog(null, null, null, null, type, 'edit', objId, idx).then(function (data) {

        formlyapi.addObjectToCache(type, data, idx - subtract);
        $scope.options.templateOptions.options.splice(idx, 1, formlyUtils.buildOptions([data], type, true)[0]);
        $scope.model[$scope.options.key] = $scope.options.templateOptions.options[idx].value;
      });

    }

    $scope.addNew = function (type) {
      formlyData.setLast(formlyData.getData());
      dialog.showFormlyDialog(null, null, null, null, type).then(function (data) {
        formlyapi.addObjectToCache(type, data);
        var start = $scope.options.templateOptions.required ? 0 : 1;
        $scope.options.templateOptions.options.splice(start, 0, formlyUtils.buildOptions([data], type, true)[0]);
        $scope.model[$scope.options.key] = $scope.options.templateOptions.options[start].value;
        //formlyData.setLast(null);
        formlyData.setData(formlyData.getLast());
      }, function (err) {
        formlyData.setLast(null);
      });
    }



  });