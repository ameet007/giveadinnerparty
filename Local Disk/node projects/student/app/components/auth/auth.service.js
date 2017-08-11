'use strict';

angular.module('sms.auth',
  [
    'ngCookies'
  ])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        } else {
          $location.path('/login');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {

          // remove any stale tokens
          $cookies.remove('token');
          $location.path('/login');

          //$state.go('login', {}, {reload:true});
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .factory('Auth', function Auth($location, $timeout, $rootScope, $http, User, $cookies, $q, $window, dialog) {
    var currentUser = {};
    if($cookies.get('token')) {
      currentUser = User.get();//.then(function() {
      //console.log(currentUser);
      $timeout(function() {
        $rootScope.$broadcast("loginSuccess", currentUser);
      }, 1000);
      //})

    }

    // todo move into config
    var apiVersion = 1;

    var timeoutMS = 24 * 60 * 60 * 1000;


    var isUpdatingSession = false;

    function setSessionTimeoutWarnings() {

        // setInterval(function(){
        //   if ( !$cookies.get('token') ) return;
        //   var currentDate = new Date();
        //   var seesionOutTime =  new Date($cookies.get('sessionouttime'));
        //   var alertPopup = {};
        //   var seesionExpiry = new Date(seesionOutTime);
        //   var diffMs = (seesionExpiry - currentDate); // milliseconds between now & session expiry
        //   var diffDays = Math.round(diffMs / 86400000); // days
        //   var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
        //   var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        //   //console.log(diffMins);
        //   if(diffMins == 5){
        //     dialog.showOkDialog("Warning", "Your session will expire in Five minutes. Please save your work or it will be lost");
        //   }else if(diffMins == 2){
        //     dialog.showOkDialog("Warning", "Your session will expire in Two minutes. Please save your work or it will be lost");
        //   }else if(diffMins == 1){
        //     dialog.showOkDialog("Warning", "Your session will expire in One minutes. Please save your work or it will be lost");
        //   }else if(diffMins < 1){
        //     obj.logout();
        //     $window.location.href ='/';
        //   }
        //
        //
        // }, 60000);
        // Min interval
    }

    setSessionTimeoutWarnings();

    var obj = {

      updateSessionTimeout: function() {
        return;
        // if ( isUpdatingSession ) return;
        // isUpdatingSession = true;
        //
        // $http.get('/serversessionupdates').success(function(resp) {
        //   var expireDate = new Date();
        //   expireDate.setTime(expireDate.getTime() + timeoutMS);
        //   var params = {'expires': expireDate};
        //
        //   isUpdatingSession = false;
        //   var momentOfTime;
        //   momentOfTime = new Date(resp.cookie.expires); // just for example, can be any other time
        //   //var myTimeSpan = 60*60000; // 1 minutes in milliseconds
        //   console.log("New expiration:"+momentOfTime);
        //   momentOfTime.setTime(momentOfTime.getTime());
        //   $cookies.put('sessionouttime', momentOfTime.toISOString(), params);
        //   $cookies.put('token', $cookies.get('token'), params);
        //
        //
        // }).error(function(error) {
        //   console.log(error);
        // });
      },

      loginError: function(deferred, cb) {
        var that = this;
        return function (err) {
          that.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this)
      },

      loginSuccess : function(deferred, cb, remember) {
        var that = this;
        return function(data) {
          if ( data.token ) {


            //if ( remember ) {
              var expireDate = new Date();
              expireDate.setTime(expireDate.getTime() + timeoutMS);
              var params = {'expires': expireDate};
            //}
            // Setting a cookie
            $cookies.put('token', data.token, params);

            currentUser = User.get();
            $timeout(function() {
              $rootScope.$broadcast("loginSuccess", currentUser);
            }, 1000);

            deferred.resolve(data);
          }
          return cb();
        }
      },
      getAlerts: function() {
        var deferred = $q.defer();

        $http.get('/api/v'+apiVersion+'/sys/alerts').success(function(data) {
          deferred.resolve(data);
        }).error(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getAbsenceAlerts: function() {
        var deferred = $q.defer();

        $http.get('/api/v'+apiVersion+'/sys/absencealerts').success(function(data) {
          deferred.resolve(data);
        }).error(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      loginWithKey: function(params, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/token', params).
          success(this.loginSuccess(deferred, cb)).
          error(this.loginError(deferred, cb));

        return deferred.promise;
      },
      requestPassword: function(params, callback) {
        return $http.post('/data/requestPassword', params)
      },
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
         $http.post('/auth/local', {
          email: user.email,
          password: user.password,
          remember: user.remember
        }).
          success(this.loginSuccess(deferred, cb, user.remember)).
          error(this.loginError(deferred, cb));
        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookies.remove('token');
        $cookies.remove('sessionouttime');
        currentUser = {};
        $timeout(function() {
          $rootScope.$broadcast("logoutSuccess", null);
        });

      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookies.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },


      checkRole: function(str) {
        if ( !currentUser || !currentUser.role ) return false;
        var role = currentUser.role.type;
        if ( role == 'SYSTEM_ADMIN_ROLE' ) return true;
        if ( role == 'COMPANY_ADMIN_ROLE' && str != 'SYSTEM_ADMIN_ROLE' ) return true;
        if ( role == 'REGION_ADMIN_ROLE' && (str != 'SYSTEM_ADMIN_ROLE' && str != 'COMPANY_ADMIN_ROLE' )) return true;
        if ( role == 'FACILITY_ADMIN_ROLE' && str == 'FACILITY_ADMIN_ROLE' ) return true;
        return false;
      },

      canEdit: function(type) {

        if ( !currentUser || !currentUser.role ) return false;
        var role = currentUser.role.type;

        if ( role == 'SYSTEM_ADMIN_ROLE' ) return true;
        if ( role == 'COMPANY_ADMIN_ROLE' && type == 'company' ) return true;
        if ( role == 'REGION_ADMIN_ROLE' && type == 'region' ) return true;
        if ( role == 'FACILITY_ADMIN_ROLE' && type == 'facility' ) return true;
        return false;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookies.get('token');
      }
    };

    return obj;
  });
