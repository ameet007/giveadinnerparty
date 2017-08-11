'use strict';

angular.module("sms.facility")
  .controller('headerCtrl', function ($timeout, $rootScope, dialog, $http, $cookies, $window, messageService, Auth, formlyAdapter, $scope,
                                      growlService, facilityService,$modal) {

  var that = this;
  var f = $rootScope.$on("centerChange", handleUsr);
  $scope.$on("destroy", f);

    $scope.$on('$stateChangeStart', Auth.updateSessionTimeout);


  function handleUsr(evt, currentUser) {
    if (!currentUser.role) {
      //$timeout(function() {
      //    handleUsr(null, Auth.getCurrentUser());
      //}, 1000);
      return;
    }
    var center = that.getCurrentCenter();
    var reg = center.Region ? center.Region.name : "(No Region)";
    var comp = center.Company ? center.Company.name : "(No Organisation)";

    if (currentUser.role.index == 0) {
      that.headerTitle = "System Portal: "+center.name+" - "+reg+" - "+comp;// (" + currentUser.centerName + ")";
    } else if (currentUser.role.index == 1) {
      that.headerTitle = "Admin Portal: "+center.name;// (" + currentUser.centerName + ")";
    } else if (currentUser.role.index == 4) {
      that.headerTitle = comp+" Admin Portal:"+reg+" - "+center.name;// ("+currentUser.centerName+")";
    } else if (currentUser.role.index == 6) {
      that.headerTitle = reg+"  Admin Portal: "+center.name;// ("+currentUser.centerName+")";
    }

    that.currentUser = currentUser;
    //if (f) f();
  }


  var flatten = function(d) {

    var parseVaccinations = function(v) {

      var buildVaccinationMessage = function(vac) {
        return "Vaccination Missing for "+ vac.age+". Child is " + Math.round((vac.diff/(1000*60*60*24))) +" days overdue!";
      };

      var a = [];
      _.each(v, function(el) {
        if (el.alerts && el.alerts.vaccinations) {
          _.each(el.alerts.vaccinations, function (vac) {
            a.push({child: el.child, alert: {
              type: "Vaccination",
              href: '/#/main/formly/edit/child/'+el.child._id,
              message: buildVaccinationMessage(vac)}
            });
          })
        }
      });
      return a;
    };

     var parseAbsence = function(v) {

      var a = [];
      _.each(v, function(el) {
        if (el.alerts && el.alerts.absenceNotifications) {
          _.each(el.alerts, function (abs) {
            a.push({child: abs.child, alert: {
              type: "Absence",
              href: '/#/main/formly/edit/child/'+abs.child._id,
              message:abs.alert.message }
            });
          })
        }
      });
     
      return a;
    };

   var parseRs7Notification=function(r){
        var a=[];
        if(r.alerts){
            a.push({
                staff:{name:"RS7 Notification"},
                alert:{
                  type:'Rs7 Notification',
                  href:'/#/main/rs7',
                  message:r.alerts
                }
            });
        }
                
       return a;
   }

    var arr = [];

   if(d.rsNotifications){
      arr=arr.concat(parseRs7Notification(d.rsNotifications));
    }

 if (d.staffRegExpiryAlerts) {
        var s = [];
      _.each(d.staffRegExpiryAlerts, function (sA) {
        if(sA.alerts.isThreeMonthNotification){
          var message = 'Please note that practising certificate for '+sA.staff.name+' is expiring in 90 days. Staff\Educator and centre admin is reminded to take necessary measure and enter new expiry date received from Education Council.';
        }else{
          var message = 'Please note that practising certificate for '+sA.staff.name+' is now expired. The system has removed Staff\Educator from the list of a qualified teacher. Centre admin is reminded to take necessary measure while rostering as changes may impact on funding rates from MOE.';
        }
        //var message = "Staff Registration will be exipred on "+ sA.alerts.RegistrationValidity;
            s.push({staff:{name:sA.staff.name,img: "3.jpg"} , alert: {
              type: "staffRegExpiry",
              href: '/#/main/formly/edit/staff/'+sA.staff._id,
              message: message
            }
          });

        })
    arr = arr.concat(s);
  }


  if (d.childAgeAlerts && Auth.getCurrentUser().facility.TwentyHoursECEServices) {
        var c = [];
      _.each(d.childAgeAlerts, function (cA) {

        var message = cA.child.name+" will be eligible for 20 Hours Free ECE funding. Please get attestation from parents to claim 20 hours free ECE funding rate. Also please create new booking schedule with 20 Hours Free attestation details. You may also have to adjust fees to make sure no additional donation is charged from parents for 20 hours free ECE service.";
            c.push({staff:{name:cA.child.name,img: cA.child.img} , alert: {
              type: "childAgeAlerts",
              href: '/#/main/formly/edit/child/'+cA.child._id,
              message: message
            }
          });

        })
    arr = arr.concat(c);
  }
  if (d.childEnrolementEndDateAlerts) {
     var c = [];
      _.each(d.childEnrolementEndDateAlerts, function (cA) {
        var message = "The enrolement end date for child "+cA.child.name+" is expired. Please change the enrolment status or re-enroll the child.";    
            c.push({staff:{name:cA.child.name,img: cA.child.img} , alert: {
              type: "childEnrolementEndDateAlerts",
              href: '/#/main/formly/edit/child/'+cA.child._id,
              message: message
            }
          });

        })
    arr = arr.concat(c);
  }
   
    if (d.vaccinations) {
      arr = arr.concat(parseVaccinations(d.vaccinations));
    }

    if (d.confirmation) {
      arr = arr.concat({alert: {
        type: "ELI Confirm",
        href: '/#/main/eli',
        message: d.confirmation}});
    }
   if(d.absenceNotifications){
      var absArr=parseAbsence(d.absenceNotifications);
      absArr.forEach(function(val){
          arr.push(val);
      });
     
    }
    return arr;
  };

    var _currentCenter = null;
  $timeout(function () {
    facilityService.getFacilities().then(function(data) {
      _rawCenterList = data;
      that.centerList = parseData(data);
      facilityService.getCurrentCenter().then(function(c) {
        _currentCenter = c;
        handleUsr(null, Auth.getCurrentUser());
      });
      Auth.getAlerts().then(function(d) {
        that.alerts = d;
        that.alertsList = flatten(d);
        that.totalAlerts = that.alertsList.length;
      });

      Auth.getAbsenceAlerts().then(function(d) {
        that.absencealertsList=flatten(d);
        if(that.alertsList)
        that.totalAlerts = that.alertsList.length+that.absencealertsList.length;
        else
          that.totalAlerts =that.absencealertsList.length;
      })

    })
  }, 300);


  var _rawCenterList = [];
  var parseData = function(data) {
    var theval = { _Centers: [], Companies: {}};
    var companies = theval.Companies;
    _.each(data, function(obj) {
      if ( obj.Company && !companies[obj.Company.name] ) {
        companies[obj.Company.name] = {_Centers:[], Regions:{}};
      }

      if ( obj.Region && obj.Company && !companies[obj.Company.name].Regions[obj.Region.name] ){
        companies[obj.Company.name].Regions[obj.Region.name] = {_Centers:[]};
      }

      if ( obj.Company && !obj.Region ) {
        companies[obj.Company.name]._Centers.push(obj);
      } else if ( obj.Company && obj.Region ) {
        companies[obj.Company.name].Regions[obj.Region.name]._Centers.push(obj);
      } else if ( obj.Region && !obj.Company ) {
        ///error... should not be here.

      } else {
        theval._Centers.push(obj);
      }



    });

    return theval;

  }

  // Top Search
  this.openSearch = function () {
    angular.element('#header').addClass('search-toggled');
    //growlService.growl('Welcome back Mallinda Hollaway', 'inverse');
  }

  this.closeSearch = function () {
    angular.element('#header').removeClass('search-toggled');
  }

  this.doSearch = function () {
    var term = that.searchTerm;
    if ( term && term != '' ) {
      //console.log("do search for "+term);
      growlService.growl('Not Supported yet. Future Search support for '+term+' will ' +
        'search Child, Staff and Family Records', 'danger')

    }
    this.closeSearch();
  }

  this.checkRole = Auth.checkRole;

  this.getCurrentCenter = function() {
    return _currentCenter;
  }

  //=======display all childs name whose ece attestation is going to end==
 
$timeout(function () {
  var params={
        query: JSON.stringify({
                    IsEceAttestationNotifiedEmail:true,
                   facility:Auth.getCurrentUser().facility._id
                  })
 }

  formlyAdapter.getList('child',params).then(function (children) {
        
        var eceOldnotificationChilds=[];
         _.map(children,function(child){
             if((child && child.IsEceAttestationNotifiedEmail===true) && typeof(child.IsEceAttestationNotifiedPopup)!='undefined' && child.IsEceAttestationNotifiedPopup!=true){
                  eceOldnotificationChilds.push(child);
              }
          });
        
          var rows='';
              rows='<ul>';
               _.each(eceOldnotificationChilds, function(child){
                    var givenNmae = (child.OfficialGiven1Name)?child.OfficialGiven1Name:' ';
                    if(givenNmae == '~'){
                      givenNmae = '';
                    }
                    var officialNmae = (child.OfficialFamilyName)?child.OfficialFamilyName:' ';
                    rows+='<li>'+officialNmae+' '+givenNmae+'</li>';

                    child['IsEceAttestationNotifiedPopup'] = true;
                   
                    $http.post('/updateChildEceAttestationNotifiedStatus', child ).
                    success(function(data, status, headers, config) {
                      console.log('updateChildEceAttestationNotifiedStatus done');
                    }).
                    error(function(data, status, headers, config) {
                      console.log('ERROR: could not download file');
                    });
                });
               
              rows+='</ul>';

       if(eceOldnotificationChilds.length > 0){
          var modalInstance = $modal.open({

          template: '<div class="modal-header">' +
          '   <h3>Below are the Children whose ECE attestation needs to be end.</h3>' +
          '</div>' +
          '<div class="modal-body">' +
            rows+ 
          '</div>' +
          '<div class="modal-footer">' +
          '    <button class="btn btn-primary dlg-no" ng-click="cancel()">Ok</button>' +
          '</div>',
          controller: function($scope, $modalInstance) {
                    $scope.ok = function() {  
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
          backdrop: 'static'
        });
       }
            
  });
}, 300);

 
  //Clear Notification
  this.clearNotification = function ($event) {
    $event.preventDefault();

    var x = angular.element($event.target).closest('.listview');
    var y = x.find('.lv-item');
    var z = y.size();

    angular.element($event.target).parent().fadeOut();

    x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
    x.find('.grid-loading').fadeIn(1500);
    var w = 0;

    y.each(function () {
      var z = $(this);
      $timeout(function () {
        z.addClass('animated fadeOutRightBig').delay(1000).queue(function () {
          z.remove();
        });
      }, w += 150);
    })

    $timeout(function () {
      angular.element('#notifications').addClass('empty');
    }, (z * 150) + 200);

    this.totalAlerts = 0;
  }

  // Clear Local Storage
  this.clearLocalStorage = function () {

    //Get confirmation, if confirmed clear the localStorage
    swal({
      title: "Are you sure?",
      text: "All your saved localStorage values will be removed",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F44336",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    }, function () {
      localStorage.clear();
      swal("Done!", "localStorage is cleared", "success");
    });

  }
  this.reloadRoute = function () {
    $window.location.reload();
  }

  //Fullscreen View
  this.fullScreen = function () {
    //Launch
    function launchIntoFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }

    //Exit
    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }

    if (exitFullscreen()) {
      launchIntoFullscreen(document.documentElement);
    }
    else {
      launchIntoFullscreen(document.documentElement);
    }
  }


  //console.log(Auth.getCurrentUser());




});

