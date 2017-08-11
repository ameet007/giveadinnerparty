'use strict';

angular.module('sms.util')
  .filter('to_trusted', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }])
  .controller('DialogCtrl', ['$scope', '$modalInstance', 'params', function($scope, $modalInstance, params) {
    $scope.params = params;

    $scope.ok = function () {
      $modalInstance.close('ok');
    };

    $scope.other = function () {
      $modalInstance.dismiss('other');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.select = function (item) {
      $modalInstance.close(item);
    };

    $scope.print = function() {
      var printContents = document.getElementById('dialogBody').innerHTML;
      var popupWin = window.open('', '_blank', 'width=600,height=400');
      popupWin.document.open();
      popupWin.document.write('<html style="margin:10px; !important"><head><link rel="stylesheet" type="text/css" href="style.css" />' +
        '<link href="vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">' +
        '<link href="vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">' +
        '<link href="vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css" rel="stylesheet">' +
        '<link href="vendors/bower_components/angular-loading-bar/src/loading-bar.css" rel="stylesheet">' +
        '<link rel="stylesheet" type="text/css" href="vendors/bower_components/angular-ui-grid/ui-grid.min.css">' +
        '<link rel="stylesheet" href="components/formly/formly.css">' +
        '<link rel="stylesheet" href="css/legacyapp.css">' +
        '<link href="css/app.min.css" rel="stylesheet" id="app-level">' +
        '<link href="css/demo.css" rel="stylesheet">' +
        '<link href="css/fixed_table_rc.css" rel="stylesheet">' +
        '</head><body onload="setTimeout(function() {window.print()}, 1000);" >' + printContents + '</body></html>');
      popupWin.document.close();
    }

  }])
  .factory('dialog', ['$modal', '$q', function($modal, $q) {
    return {
      showOkDialog: function (title, msg, showPrint) {
        var d = $q.defer();
        var modalInstance = $modal.open({
          templateUrl: 'components/popup/dialog.html',
          controller: 'DialogCtrl',
          windowClass: 'dialogpopup',
          resolve: {
            params: function () {
              return {
                title: title,
                msg: msg,
                showPrint: showPrint
              }
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          d.resolve(selectedItem);
        }, function (item) {
          if ( item == "cancel" ) d.reject();
          d.resolve(item);
        });
        return d.promise;
      },
      showOkCancelDialog: function (title, msg, oktxt, canceltxt,backdrop) {
        var d = $q.defer();
       var backDrop=true;
        if(typeof backdrop!='undefined'){
            backDrop=backdrop;
        }
        var modalInstance = $modal.open({
          backdrop:backDrop,
          templateUrl: 'components/popup/okcanceldialog.html',
          controller: 'DialogCtrl',
          windowClass: 'dialogpopup',
          resolve: {
            params: function () {
              return {
                title: title,
                msg: msg,
                oktxt: oktxt || 'Ok',
                canceltxt: canceltxt || 'Cancel'
              }
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          d.resolve(selectedItem);
        }, function (item) {
          d.reject(item);
        });
        return d.promise;
      },

      showDupesDialog: function (dupes) {
        var d = $q.defer();
        var modalInstance = $modal.open({
          templateUrl: 'components/popup/dupesdialog.html',
          controller: 'DialogCtrl',
          windowClass: 'dialogpopup',
          resolve: {
            params: function () {
              return {
                dupes: dupes
              }
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          d.resolve(selectedItem);
        }, function (err) {
          d.reject(err);
        });
        return d.promise;
      },

      showThreeOptionDialog: function (title, msg, oktxt, canceltxt, othertxt) {
        var d = $q.defer();
        var modalInstance = $modal.open({
          templateUrl: 'components/popup/threeoptiondialog.html',
          controller: 'DialogCtrl',
          windowClass: 'dialogpopup',
          resolve: {
            params: function () {
              return {
                title: title,
                msg: msg,
                oktxt: oktxt || 'Ok',
                othertxt: othertxt || 'Maybe',
                canceltxt: canceltxt || 'Cancel'
              }
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          d.resolve(selectedItem);
        }, function (other) {
          d.resolve(other);
        });
        return d.promise;
      },

      showFormlyDialog: function (title, msg, oktxt, canceltxt, type, action, id,idx,customclass) {
        var d = $q.defer();
        var customClass='';
        var backdrop=true;
        if(typeof customclass !='undefined'){
            customClass=customclass;
            backdrop='static';
        }
        action = action || 'add';
        console.log(type);
        var modalInstance = $modal.open({
          backdrop: backdrop,
          templateUrl: 'components/formly/formlyDialog.html',
          controller: 'FormlyCtrl as formsCtrl',
          windowClass: 'dialogpopup '+customClass,
          resolve: {
            $stateParams: function () {
              return {
                type:type,
                action: action,
                id: id
              }
            }
          }
        });
        modalInstance.result.then(function (selectedItem) {
            d.resolve(selectedItem);
        }, function () {
          d.reject();
        });
        return d.promise;
      },
    }

  }]);
