'use strict';

angular.module("sms.facility")
  .controller('materialadminCtrl', function ($timeout, $state, growlService, $http) {
  //Welcome Message
  //growlService.growl('Welcome back Mallinda!', 'inverse')


  // Detact Mobile Browser
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    angular.element('html').addClass('ismobile');
  }

  // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
  this.sidebarToggle = {
    left: false,
    right: false
  }

  // By default template has a boxed layout
  this.layoutType = localStorage.getItem('ma-layout-status');

  // For Mainmenu Active Class
  this.$state = $state;

  //Close sidebar on click
  this.sidebarStat = function (event) {
    if (!angular.element(event.target).parent().hasClass('active')) {
      this.sidebarToggle.left = false;
    }
  }

  //Listview Search (Check listview pages)
  this.listviewSearchStat = false;

  this.lvSearch = function () {
    this.listviewSearchStat = true;
  }

  //Listview menu toggle in small screens
  this.lvMenuStat = false;

  //Blog
  this.wallCommenting = [];

  this.wallImage = false;
  this.wallVideo = false;
  this.wallLink = false;


  this.callFiller  = function (){

    console.log('callFiller here');
    var _version = 1;
    var _url = '/api/v' + _version;

    $http.get(_url+'/onetimefillerece').success(function(data) {
    // $http.get(_url+'/onetimefillerenrolment').success(function(data) {

      console.log(data);
    }).error(function(error) {

      console.log(error);
    });
  }
  
})