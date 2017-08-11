
materialAdmin
  .controller('LoginCtrl', function (Auth, $location, $window, $cookies, $http, $stateParams, $state) {

    this.user = {};
    this.errors = {};

    var that = this;

    this.login = 1;
    this.register = 0;
    this.forgot = 0;

    // first check for url params
    var q_username = $stateParams.u;
    var q_token = $stateParams.k;
    var q_go = $stateParams.go;
    var q_fac = $stateParams.f;

    if ( q_token && q_username ) {
      Auth.loginWithKey({
        u: q_username,
        f: q_fac,
        k: q_token,
        go: q_go
      })
        .then( function() {
          // Logged in, redirect to home
          $state.go('main', {}, {reload:true});
        })
        .catch( function(err) {
          that.errors.other = err.message;
          $state.go('login', {}, {reload:true});
        });
    }


    this.doLogin = function(form) {
      this.submitted = true;
      var params = {};
      if(form.$valid) {
        Auth.login({
          remember: that.user.remember,
          email: that.user.email,
          password: that.user.password
        })
          .then( function() {

            // Logged in, redirect to home
            $http.get('/sessiontimes').success(function(sessionouttime) {
              $cookies.put('sessionouttime', sessionouttime, params);
              $cookies.put('fchdate',new Date(),params);
            }).error(function(error) {
                console.log(error);
            });
            
            $state.go('main.home', {}, {reload:true});
          })
          .catch( function(err) {
            that.message = err.message;
            that.messageType = "error";
          });
      }
    };


    this.doEmailPassword = function(form) {
      this.submitted = true;

      if(form.$valid) {
        Auth.requestPassword({
            email: that.user.email2
          })
          .then( function(d) {
            if (d.data ) {
              if (d.data.status == "error" ) {
                that.messageType = "error";
              } else {
                that.messageType = "ok";
              }
              that.message = d.data.message;
            }
            //console.log(d);
            // Logged in, redirect to home
            //$state.go('main.home', {}, {reload:true});
          }, function(err) {
            console.log(err);
          })
      }
    };

    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
