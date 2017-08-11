'use strict';

angular.module("sms.facility")
  .controller('SideMenuCtrl', function ($location, $window, Auth, formlyAdapter, $timeout, $rootScope, $scope, facilityService) {

    var vm = this;


    function init() {
      vm.prettyName = formlyAdapter.prettyName;

      vm.isCollapsed = true;
      vm.isLoggedIn = Auth.isLoggedIn;
      vm.isAdmin = Auth.isAdmin;
      vm.checkRole = Auth.checkRole;
      vm.getCurrentUser = Auth.getCurrentUser;
      vm.uploadedLogo=null;
      vm.uploadedFileType=null;
      vm.getModels = function () {
        return vm.models;
      };



      vm.currentUser = Auth.getCurrentUser();
      formlyAdapter.getModels().then(function (data) {
        $timeout(function () {
          vm.models = _.sortBy(_.filter(data, function (s) {
            return s.hasAccess;
          }), 'form.sortOrder');
          if (f) f();
        });
        formlyAdapter.getList('helpguide').then(function(helpguide){
          vm.helpguidLink=(helpguide && helpguide.length) ? helpguide[0].link:'#';
          var prefix = 'http://';
          if (vm.helpguidLink.substr(0, prefix.length) !== prefix)
          {
              vm.helpguidLink = prefix + vm.helpguidLink;
          }
        })
        formlyAdapter.getList('faq').then(function(faq){
          vm.faqLink=(faq && faq.length) ? faq[0].link:'#';
          var prefix = 'http://';
          if (vm.faqLink.substr(0, prefix.length) !== prefix)
          {
              vm.faqLink = prefix + vm.faqLink;
          }
        })
        formlyAdapter.getList('logticket').then(function(logticket){
          vm.logticketLink=(logticket && logticket.length) ? logticket[0].link:'#';
          var prefix = 'http://';
          if (vm.logticketLink.substr(0, prefix.length) !== prefix)
          {
              vm.logticketLink = prefix + vm.logticketLink;
          }
        })
        facilityService.getFacilities().then(function (data) {
          vm.centerList = data;
          facilityService.getCurrentCenter().then(function(c) {
            vm.currentCenter = c;
            if(c.UploadCompanyLogo && c.UploadCompanyLogo.length ){
              var logotoBeUsed=c.UploadCompanyLogo[c.UploadCompanyLogo.length-1];
               var fileData=JSON.parse(logotoBeUsed.filename);
               vm.uploadedLogo=fileData.base64;
               vm.uploadedFileType=fileData.filetype;
            }
          });
        });
        facilityService.getLicensing().then(function (data) {
          vm.licensingconfiguration = (data && data.length)? data[0] : null;
          
        });

      });

    }

    $scope.$on('centreLogo',function(evnt,args){
      var data=args.data;
       if(data.UploadCompanyLogo && data.UploadCompanyLogo.length ){
              var logotoBeUsed=data.UploadCompanyLogo[data.UploadCompanyLogo.length-1];
               var fileData=JSON.parse(logotoBeUsed.filename);
               vm.uploadedLogo=fileData.base64;
               vm.uploadedFileType=fileData.filetype;
            }
    })

    var f = $rootScope.$on("loginSuccess", init);
    $scope.$on("destroy", f);

    vm.logout = function () {
      Auth.logout();
      //init();
      $window.location.href ='/';
      //$location.path('/login');
    };

    vm.isActive = function (route) {
      return route === $location.path();
    };

    init();

  })

