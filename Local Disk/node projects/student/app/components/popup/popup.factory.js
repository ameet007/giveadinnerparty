'use strict';

// wrapper class to assist with dialog/popup creation.
angular.module('sms.util')
  .factory('popup', function($modal, $q) {

    var _showPopup = function(template, ctrl, winCls, resolve) {
      var d = $q.defer();
      var props = {
        templateUrl: template,
        controller: ctrl,
        windowClass: winCls
      };
      if ( resolve ) props.resolve = resolve;

      var modalInstance = $modal.open(props);

      modalInstance.result.then(function (selectedItem) {
        d.resolve(selectedItem);
      }, function (err) {
        d.resolve(null);
      });

      return d.promise;
    };

    return {
      nsiSearchResults: function(data) {
        return _showPopup('../components/nsi/search-results.html', 'NsiSearchCtrl', 'nsipopover',
          {
            data: function() { return data; }
          }
        );
      },
      nsiAdd: function(data) {
        return _showPopup('../components/nsi/add.html', 'NsiAddCtrl', 'nsipopover',
          {
            data: function () {
              return data;
            }
          }
        );
      },
      addNewRecord: function(type) {

        return _showPopup('../partials/base-edit.html', 'AddNewRecordCtrl', 'nsipopover',
        //return _showPopup('components/data/addNewRecord.html', 'AddNewRecordCtrl', 'nsipopover',
          {
            type: function () {
              return type;
            }
          }
        );
      }
    }
  });
