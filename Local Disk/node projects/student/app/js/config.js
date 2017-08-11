materialAdmin
   .config(function ($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/main/home");
         $stateProvider
        
            //------------------------------
            // HOME
            //------------------------------
          .state('main', {
            url: '/main',
              templateUrl: 'views/main.html',
              abstract:true
          })
          .state('login', {
              url: '/login',
              templateUrl: 'views/login.html'
          })
            .state ('main.home', {
                url: '/home',
                templateUrl: 'views/home.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                insertBefore: '#app-level-js',
                                files: [
                                    'vendors/sparklines/jquery.sparkline.min.js',
                                    'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                    'vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                                ]
                            }
                        ])
                    }
                }
            })


          .state ('main.eli', {
          url: '/eli',
          templateUrl: 'views/eli.html',
            controller: 'ELICtrl as eli'
        }).state ('main.ecereturn', {
            url: '/ecereturn',
            templateUrl: 'components/ecereturn/ecereturn.html',
            controller: 'EcereturnCtrl as vm'
          })
          .state ('main.ecereturn-edit', {
            url: '/ecereturn/:ecereturnid',
            templateUrl: 'components/ecereturn/ecereturn.html',
            controller: 'EcereturnCtrl as vm'
          })
          .state ('main.ecereturn-history', {
            url: '/ecereturn-history',
            templateUrl: 'components/ecereturn/ecereturn.history.html',
            controller: 'EcereturnHistoryCtrl as vm'
          })
          .state ('main.waittimereport', {
            url: '/waittimereport',
            templateUrl: 'components/ecereturn/wait-status-report.html',
            controller: 'WaitTimeCtrl as vm'
          })
          .state ('main.rs7return', {
            url: '/rs7',
            templateUrl: 'components/rs7/rs7.html',
            controller: 'RS7Ctrl as rs7'
          })
          .state ('main.rs7history', {
            url: '/rs7history',
            templateUrl: 'components/rs7/rs7history.html',
            controller: 'RS7Ctrl as rs7'
          })

          .state ('main.centres', {
            url: '/centres',
            templateUrl: 'views/centres.html',
            controller: 'FacilityCtrl as centre'
        })

          .state ('main.regions', {
            url: '/regions',
            templateUrl: 'views/regions.html',
            controller: 'FacilityCtrl as centre'
        })
          .state ('main.organisations', {
              url: '/organisations',
              templateUrl: 'views/organizations.html',
              controller: 'FacilityCtrl as centre'
          })
          .state ('main.attendance', {
            url: '/attendance',
            templateUrl: 'components/attendance/attendance.html',
            controller: 'AttendanceCtrl as attendance',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/chosen/chosen.min.css'
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/bower_components/chosen/chosen.jquery.js',
                                'vendors/bower_components/angular-chosen-localytics/chosen.js',
                            ]
                        }
                    ])
                }
            }
        })
          .state ('main.addAttendance', {
            url: '/addAttendance',
            templateUrl: 'components/attendance/addAttendance.html',
            controller: 'AttendanceCtrl as attendance',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/chosen/chosen.min.css'
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/bower_components/chosen/chosen.jquery.js',
                                'vendors/bower_components/angular-chosen-localytics/chosen.js',
                            ]
                        }
                    ])
                }
            }
        })
          .state ('main.monthlyAttendance', {
            url: '/monthlyAttendance',
            templateUrl: 'components/attendance/monthly_attendance.html',
            controller: 'MonthlyAttendanceCtrl as monthlyattendance',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/chosen/chosen.min.css'
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/bower_components/chosen/chosen.jquery.js',
                                'vendors/bower_components/angular-chosen-localytics/chosen.js',
                            ]
                        }
                    ])
                }
            }
        })
          .state('main.vacations',{
            url: '/vacations',
            templateUrl: 'components/vacations/vacations.html',
            controller: 'VacationsCtrl as vacations',
            resolve: {
                
            }
          })
          .state('main.addVacation',{
            url: '/addvacations',
            templateUrl: 'components/vacations/addVacations.html',
            controller: 'VacationsCtrl as vacations',
            resolve: {
                
            }
          })
          .state('main.editvacation',{
            url: '/editvacation/:id',
            templateUrl: 'components/vacations/updateVacations.html',
            controller: 'VacationsCtrl as vacations',
            resolve: {
                
            }
          })
          .state('main.roster',{
              url: '/roster',
              templateUrl: 'components/roster/roster.html',
              controller: 'RosterCtrl as roster',
              resolve: {

              }
          })
          .state('main.weeklyRoster',{
              url: '/weeklyRoster',
              templateUrl: 'components/roster/weeklyRoster.html',
              controller: 'RosterCtrl as roster',
              resolve: {

              }
          })
          .state('main.createRoster',{
              url: '/createRoster',
              templateUrl: 'components/roster/createRoster.html',
              controller: 'RosterCtrl as roster',
              resolve: {

              }
          })

          .state('main.recordContactHours',{
              url: '/recordContactHours',
              templateUrl: 'components/roster/recordContactHours.html',
              controller: 'RosterCtrl as roster',
              resolve: {

              }
          })
          .state('main.contactHoursReport',{
              url: '/contactHoursReport',
              templateUrl: 'components/roster/contactHoursReport.html',
              controller: 'contactHoursReportCtrl as contactHours',
              resolve: {

              }
          })

          .state('main.dailyfch',{
            url:'/dailyfch?date',
            templateUrl:'components/fch/dailyfch.html',
            controller:'DailyFchCtrl as dailyfch',
            resolve:{

            }
          })
          .state('main.weeklyfch',{
            url:'/weeklyfch',
            templateUrl:'components/fch/weeklyfch.html',
            controller:'WeeklyFchCtrl as weeklyfch',
            resolve:{

            }
          }) 
          .state('main.monthlyfch',{
            url:'/monthlyfch',
            templateUrl:'components/fch/monthlyfch.html',
            controller:'MonthlyFchCtrl as monthlyfch',
            resolve:{

            }
          })
          .state('main.bookingOverview',{
            url:'/bookingOverview',
            templateUrl:'components/fch/bookingoverview.html',
            controller:'BookingOverviewCtrl as bookingoverview',
            resolve:{

            }
          })
          .state('main.fchcronlogs',{
            url:'/fchcronlogs',
            templateUrl:'components/fch/fchcronlogs.html',
            controller:'FchCronLogsCtrl as fchcronlog',
            resolve:{

            }
          })
          .state ('main.helpguide', {
                url: '/helpguide',
                templateUrl: 'components/facility/helpguide.html',
                controller:'FacilityCtrl as facCtrl',
           })
          .state ('main.faq', {
                url: '/faq',
                templateUrl: 'components/facility/faq.html',
                controller:'FacilityCtrl as facCtrl',
           })
          .state ('main.logticket', {
                url: '/logticket',
                templateUrl: 'components/facility/logticket.html',
                controller:'FacilityCtrl as facCtrl',
           })
          

            //------------------------------
            // TYPOGRAPHY
            //------------------------------
        
            .state ('typography', {
                url: '/typography',
                templateUrl: 'views/typography.html'
            })


            //------------------------------
            // WIDGETS
            //------------------------------
        
            .state ('widgets', {
                url: '/widgets',
                templateUrl: 'views/common.html'
            })

            .state ('widgets.widgets', {
                url: '/widgets',
                templateUrl: 'views/widgets.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelementplayer.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
                                    'vendors/bower_components/autosize/dist/autosize.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('widgets.widget-templates', {
                url: '/widget-templates',
                templateUrl: 'views/widget-templates.html',
            })


            //------------------------------
            // TABLES
            //------------------------------
        
            .state ('tables', {
                url: '/tables',
                templateUrl: 'views/common.html'
            })
            
            .state ('tables.tables', {
                url: '/tables',
                templateUrl: 'views/tables.html'
            })
            
            .state ('tables.data-table', {
                url: '/data-table',
                templateUrl: 'views/data-table.html'
            })

        
            //------------------------------
            // FORMS
            //------------------------------
            .state ('form', {
                url: '/form',
                templateUrl: 'views/common.html'
            })

            .state ('form.basic-form-elements', {
                url: '/basic-form-elements',
                templateUrl: 'views/form-elements.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/autosize/dist/autosize.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('form.form-components', {
                url: '/form-components',
                templateUrl: 'views/form-components.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/nouislider/jquery.nouislider.css',
                                    'vendors/farbtastic/farbtastic.css',
                                    'vendors/bower_components/summernote/dist/summernote.css',
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                    'vendors/bower_components/chosen/chosen.min.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/input-mask/input-mask.min.js',
                                    'vendors/bower_components/nouislider/jquery.nouislider.min.js',
                                    'vendors/bower_components/moment/min/moment.min.js',
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                    'vendors/bower_components/summernote/dist/summernote.min.js',
                                    'vendors/fileinput/fileinput.min.js',
                                    'vendors/bower_components/chosen/chosen.jquery.js',
                                    'vendors/bower_components/angular-chosen-localytics/chosen.js',
                                ]
                            }
                        ])
                    }
                }
            })
        
            .state ('form.form-examples', {
                url: '/form-examples',
                templateUrl: 'views/form-examples.html'
            })
        
            .state ('form.form-validations', {
                url: '/form-validations',
                templateUrl: 'views/form-validations.html'
            })
        
            
            //------------------------------
            // USER INTERFACE
            //------------------------------
        
            .state ('user-interface', {
                url: '/user-interface',
                templateUrl: 'views/common.html'
            })
        
            .state ('user-interface.ui-bootstrap', {
                url: '/ui-bootstrap',
                templateUrl: 'views/ui-bootstrap.html'
            })

            .state ('user-interface.colors', {
                url: '/colors',
                templateUrl: 'views/colors.html'
            })

            .state ('user-interface.animations', {
                url: '/animations',
                templateUrl: 'views/animations.html'
            })
        
            .state ('user-interface.box-shadow', {
                url: '/box-shadow',
                templateUrl: 'views/box-shadow.html'
            })
        
            .state ('user-interface.buttons', {
                url: '/buttons',
                templateUrl: 'views/buttons.html'
            })
        
            .state ('user-interface.icons', {
                url: '/icons',
                templateUrl: 'views/icons.html'
            })
        
            .state ('user-interface.alerts', {
                url: '/alerts',
                templateUrl: 'views/alerts.html'
            })
        
            .state ('user-interface.notifications-dialogs', {
                url: '/notifications-dialogs',
                templateUrl: 'views/notification-dialog.html'
            })
        
            .state ('user-interface.media', {
                url: '/media',
                templateUrl: 'views/media.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelementplayer.css',
                                    'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
                                    'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })
        
            .state ('user-interface.other-components', {
                url: '/other-components',
                templateUrl: 'views/other-components.html'
            })
            
        
            //------------------------------
            // CHARTS
            //------------------------------
            
            .state ('charts', {
                url: '/charts',
                templateUrl: 'views/common.html'
            })

            .state ('charts.flot-charts', {
                url: '/flot-charts',
                templateUrl: 'views/flot-charts.html',
            })

            .state ('charts.other-charts', {
                url: '/other-charts',
                templateUrl: 'views/other-charts.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/sparklines/jquery.sparkline.min.js',
                                    'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                ]
                            }
                        ])
                    }
                }
            })
        
        
            //------------------------------
            // CALENDAR
            //------------------------------
            
            .state ('calendar', {
                url: '/calendar',
                templateUrl: 'views/calendar.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/moment/min/moment.min.js',
                                    'vendors/bower_components/fullcalendar/dist/fullcalendar.min.js'
                                ]
                            }
                        ])
                    }
                }
            })
        
        
            //------------------------------
            // PHOTO GALLERY
            //------------------------------
            
             .state ('photo-gallery', {
                url: '/photo-gallery',
                templateUrl: 'views/common.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            //Default
        
            .state ('photo-gallery.photos', {
                url: '/photos',
                templateUrl: 'views/photos.html'
            })
        
            //Timeline
    
            .state ('photo-gallery.timeline', {
                url: '/timeline',
                templateUrl: 'views/photo-timeline.html'
            })
        
        
            //------------------------------
            // GENERIC CLASSES
            //------------------------------
            
            .state ('generic-classes', {
                url: '/generic-classes',
                templateUrl: 'views/generic-classes.html'
            })
        
            
            //------------------------------
            // PAGES
            //------------------------------
            
            .state ('pages', {
                url: '/pages',
                templateUrl: 'views/common.html'
            })
            
        
            //Profile
        
            .state ('pages.profile', {
                url: '/profile',
                templateUrl: 'views/profile.html'
            })
        
            .state ('pages.profile.profile-about', {
                url: '/profile-about',
                templateUrl: 'views/profile-about.html'
            })
        
            .state ('pages.profile.profile-timeline', {
                url: '/profile-timeline',
                templateUrl: 'views/profile-timeline.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('pages.profile.profile-photos', {
                url: '/profile-photos',
                templateUrl: 'views/profile-photos.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })
        
            .state ('pages.profile.profile-connections', {
                url: '/profile-connections',
                templateUrl: 'views/profile-connections.html'
            })
        
        
            //-------------------------------
        
            .state ('pages.listview', {
                url: '/listview',
                templateUrl: 'views/list-view.html'
            })
        
            .state ('pages.messages', {
                url: '/messages',
                templateUrl: 'views/messages.html'
            })
        
            .state ('pages.pricing-table', {
                url: '/pricing-table',
                templateUrl: 'views/pricing-table.html'
            })
        
            .state ('pages.contacts', {
                url: '/contacts',
                templateUrl: 'views/contacts.html'
            })
        
            .state ('pages.invoice', {
                url: '/invoice',
                templateUrl: 'views/invoice.html'
            })
                                
            .state ('pages.wall', {
                url: '/wall',
                templateUrl: 'views/wall.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/autosize/dist/autosize.min.js',
                                    'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
                                    'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js'
                                ]
                            }
                        ])
                    }
                }
            })
            
            //------------------------------
            // BREADCRUMB DEMO
            //------------------------------
            .state ('breadcrumb-demo', {
                url: '/breadcrumb-demo',
                templateUrl: 'views/breadcrumb-demo.html'
            })
    }).run(function(Auth,$state,$rootScope,dialog){
        var timeoutID;
        function setup() {
                this.addEventListener("mousemove", resetTimer, false);
                this.addEventListener("mousedown", resetTimer, false);
                this.addEventListener("keypress", resetTimer, false);
                this.addEventListener("DOMMouseScroll", resetTimer, false);
                this.addEventListener("mousewheel", resetTimer, false);
                this.addEventListener("touchmove", resetTimer, false);
                this.addEventListener("MSPointerMove", resetTimer, false);
               startTimer();
            }

        function startTimer() {
            // wait 2 seconds before calling goInactive
            var inactiveTime=60*60*1000;
            timeoutID = window.setTimeout(goInactive, inactiveTime);            
           
        }
         
        function resetTimer(e) {
           window.clearTimeout(timeoutID);
            goActive();
        }
        
        function goInactive() {
            Auth.logout();
            $state.reload();
        }
         
        function goActive() {
             startTimer();
        }
        function removeSetup(){
            window.clearTimeout(timeoutID);
            this.removeEventListener("mousemove", resetTimer, false);
            this.removeEventListener("mousedown", resetTimer, false);
            this.removeEventListener("keypress", resetTimer, false);
            this.removeEventListener("DOMMouseScroll", resetTimer, false);
            this.removeEventListener("mousewheel", resetTimer, false);
            this.removeEventListener("touchmove", resetTimer, false);
            this.removeEventListener("MSPointerMove", resetTimer, false);

        }
        
        $rootScope.$on("loginSuccess", setup);
        $rootScope.$on("logoutSuccess", removeSetup);

        
    });


