'use strict';

angular.module("sms.roster")
  .controller('contactHoursReportCtrl', function ($timeout,$scope,$stateParams,dialog,$cookies,$q,Auth,formlyAdapter,fchUtils) {

    var that = this;
    that.today=new Date();
    that.isloading = true;

    /*----------------------*/
    /* get matrix for today */
    /*----------------------*/
    that.initMatrix = function (){

      that.isloading = true;
      var day_start = new Date(that.today);
      var day_end   = new Date(that.today);
      day_start.setHours(0,0,0,0);
      day_end.setHours(23,59,59,999);


      var params = {
        query: JSON.stringify({
          Date: {"$gte": day_start, "$lte": day_end}, Facility:Auth.getCurrentUser().facility._id
        }),
        //populate:'Matrix.Staff'

      }

      formlyAdapter.getList('contacthoursreport', params).then(function(data) {

        if(data.length){
          
          var result = data[0];
          // manipulate Staff list in matrix
          if(result && result.Matrix && result.Matrix.length){
            console.log(that.stafflistMap)
            result.Matrix.forEach(function(d){
              d.Staff=that.stafflistMap[d.Staff];
              return d;
            })
          }
          that.contacthoursreport = result;
          that.percentage_of_qualified_teachers = (result.total_qualified_teacher_hours * 100)/ (result.total_qualified_teacher_hours+ result.total_nonqualified_teacher_hours)
        } else{
          
          that.contacthoursreport = null;
        }
        $timeout(function() {

          that.isloading = false;
        }, 500);
      });
    }

    that.toHourFormat = function (minutes=0){
      var str = '';
      if(minutes < 60) str = '00:'+ ((minutes%60)< 10 ? '0'+minutes%60: minutes%60 );
      else str = (parseInt(minutes/60) < 10? '0'+parseInt(minutes/60) : parseInt(minutes/60)) +':'+  ((minutes%60)< 10 ? '0'+minutes%60: minutes%60 );
      return str;
    }

    var closeAllOpenedDatepickers=function(){
      var keyMap=_.map(that,function(val,key){
        if(_.includes(key, 'Opened')){
          return key;
        }else{
          return null;
        }
      }).filter(function(val){
        if(val){
          return true;
        }
        return false;
      });
      _.each(keyMap,function(type){
        that[type]=false;
      })
    }

    that.open = function ($event, type) {
      $event.preventDefault();
      $event.stopPropagation();
      closeAllOpenedDatepickers();
      that[type + 'Opened'] = true;
    };

    var f1 = $scope.$watch(function (scope) {
      return ( that.today );
    }, function() {
    that['todayOpened']=false;
     
    });
   

    $scope.$on('destroy', function () {
      f1();
     
    })

  that.dateFilter=function(){
     init();
  }
    $timeout(init(),300);

  function init(){
    var day=that.today;
    formlyAdapter.getList('staff',{query:JSON.stringify({facility:Auth.getCurrentUser().facility._id})}).then(function(stafflist){
    that.staffList=stafflist;
    that.stafflistMap={};
      _.each(stafflist,function(obj){
          that.stafflistMap[obj._id]=obj;
      })



      formlyAdapter.getList('holiday').then(function(holidayList){
      if(holidayList && holidayList.length){

          _.each(holidayList,function(holiDay){
              if(holiDay){
                var holidayDay=new Date(holiDay.Date).getDate();
                var holidayMonth=new Date(holiDay.Date).getMonth()+1;
                var holidayYear=new Date(holiDay.Date).getYear();
                var todayDay=new Date(day).getDate();
                var todayMonth=new Date(day).getMonth()+1;
                var todayYear=new Date(day).getYear();
               
                if(holiDay.ReoccurYearly && holidayDay==todayDay && holidayMonth==todayMonth){
                    holiday=holiDay;
                    if(holiDay.canMarkAttendance){
                     that.holidayMatrix=1;
                    }else{
                      that.holidayMatrix=0;
                    }
                    return false;
                }else if(holidayDay==todayDay && holidayMonth==todayMonth && holidayYear==todayYear){ 

                  holiday=holiDay;

                  if(holiDay.canMarkAttendance){
                   that.holidayMatrix=1;
                  }else{
                    that.holidayMatrix=0;
                  } 
                  

                  return false;
                }else{
                  that.holiday=null;
                  that.holidayMatrix=null;
                }
                
              }
          })
          
        }
      formlyAdapter.getList('temporaryClosure').then(function(temporaryClosureList){

        if(temporaryClosureList && temporaryClosureList.length){
         
          _.each(temporaryClosureList,function(data){
            
              var firstClosure = data;
             var closureDay=new Date(firstClosure.ClosureStartDate).getDate();
              var closureMonth=new Date(firstClosure.ClosureStartDate).getMonth()+1;
              var closureYear=new Date(firstClosure.ClosureStartDate).getYear();
              var todayDay=new Date(day).getDate();
              var todayMonth=new Date(day).getMonth()+1;
              var todayYear=new Date(day).getYear();
              
            if(firstClosure && firstClosure.ClosureReasonCode && (closureDay==todayDay && closureMonth==todayMonth && closureYear==todayYear) ){
              var clousureData=(data.ClosureReasonCode._id) ? data.ClosureReasonCode._id:data.ClosureReasonCode;
              
              if(that.absenceReasonMap[clousureData].IsFunded){

                that.tempClousureMatrix=1;
              }else{
                that.tempClousureMatrix=0;
              }
              return false;
            }else{
              that.firstClosure=null;
              that.tempClousureMatrix=null;
            }
          });
        }

        /*Service closure logic*/
        that.isloading = true;
        formlyAdapter.getList('centrestatus').then(function(centerstatusData){
    
          formlyAdapter.getList('licenseconfiguration').then(function(licenseConfiguration){

             if(centerstatusData && licenseConfiguration){

                if(centerstatusData[licenseConfiguration.Status]=="Funded"){
                  that.serviceCloseMatrix=1;
                }else{
                  that.serviceCloseMatrix=0;
                }
            }else{
              that.serviceCloseMatrix=0;
            }     

            formlyAdapter.getList('eceserviceschedule').then(function(eceServiceschedule){

              that.eceServiceschedule = fchUtils.getEffectiveServiceSchedule(eceServiceschedule,that.today);
              if(that.eceServiceschedule){
              
                that.serviceCloseMatrix=fchUtils.checkServiceSchedule(that.eceServiceschedule,that.today);

                if(that.serviceCloseMatrix) that.initMatrix();
                else that.contacthoursreport= null,that.percentage_of_qualified_teachers=null;
                $timeout(function() {
        
                  that.isloading = false;
                }, 500);
              }          
            })
          });
        });   
      })
    })
   
    });
    
    

  }

});