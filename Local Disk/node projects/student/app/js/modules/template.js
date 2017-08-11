materialAdmin

    // =========================================================================
    // LAYOUT
    // =========================================================================
    
    .directive('changeLayout', function(){
        
        return {
            restrict: 'A',
            scope: {
                changeLayout: '='
            },
            
            link: function(scope, element, attr) {
                
                //Default State
                if(scope.changeLayout === '1') {
                    element.prop('checked', true);
                }
                
                //Change State
                element.on('change', function(){
                    if(element.is(':checked')) {
                        localStorage.setItem('ma-layout-status', 1);
                        scope.$apply(function(){
                            scope.changeLayout = '1';
                        })
                    }
                    else {
                        localStorage.setItem('ma-layout-status', 0);
                        scope.$apply(function(){
                            scope.changeLayout = '0';
                        })
                    }
                })
            }
        }
    })



    // =========================================================================
    // MAINMENU COLLAPSE
    // =========================================================================

    .directive('toggleSidebar', function(){

        return {
            restrict: 'A',
            scope: {
                modelLeft: '=',
                modelRight: '='
            },
            
            link: function(scope, element, attr) {
                element.on('click', function(){
 
                    if (element.data('target') === 'mainmenu') {
                        if (scope.modelLeft === false) {
                            scope.$apply(function(){
                                scope.modelLeft = true;
                            })
                        }
                        else {
                            scope.$apply(function(){
                                scope.modelLeft = false;
                            })
                        }
                    }
                    
                    if (element.data('target') === 'chat') {
                        if (scope.modelRight === false) {
                            scope.$apply(function(){
                                scope.modelRight = true;
                            })
                        }
                        else {
                            scope.$apply(function(){
                                scope.modelRight = false;
                            })
                        }
                        
                    }
                })
            }
        }
    
    })
    

    
    // =========================================================================
    // SUBMENU TOGGLE
    // =========================================================================

    .directive('toggleSubmenu', function(){

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.click(function(){
                    element.parent().toggleClass('toggled');
                    element.parent().find('ul').stop(true, false).slideToggle(200);
                })
            }
        }
    })


    // =========================================================================
    // STOP PROPAGATION
    // =========================================================================
    
    .directive('stopPropagate', function(){
        return {
            restrict: 'C',
            link: function(scope, element) {
                element.on('click', function(event){
                    event.stopPropagation();
                });
            }
        }
    })

    .directive('aPrevent', function(){
        return {
            restrict: 'C',
            link: function(scope, element) {
                element.on('click', function(event){
                    event.preventDefault();
                });
            }
        }
    })


    // =========================================================================
    // PRINT
    // =========================================================================
    
    .directive('print', function(){
        return {
            restrict: 'A',
            link: function(scope, element){
                element.click(function(){
                    window.print();
                })   
            }
        }
    })
    .directive('weeklydatePicker',function(){
        return {
            restrict: 'A',
            link: function(scope, element){
                
               /* element.click(function(){
                    element.find('ul tr.week-active').removeClass('week-active');
                    element.find('ul tr').find('.dp-selected.dp-active').find('span').parents('tr').addClass('week-active');
              
                });
              scope.$on('weekselected', function () {
                    element.find('ul tr.week-active').removeClass('week-active');
                    element.find('ul tr').find('.dp-selected.dp-active').find('span').parents('tr').addClass('week-active');
                });
               */
            }
        }
    })

    // =========================================================================
    // fix table header and column
    // =========================================================================

    .directive('fixedHeader', function($timeout){
        return {
            restrict: 'A',
            link: function(scope, element,attrs){
                if(attrs.fixedHeader=='daily'){
                        element.on('click','.testAlert',function(){
                                var child=$(this).attr('childId');
                                scope.dailyfch.openAlert(child);
                            })
                        scope.$on('dataloaded', function () {
                                $timeout(function(){
                                var timeHeaders=scope.timeHeaders;
                                 var columnCount=timeHeaders.length+10;
                                 var columnModal=[];
                                 for(var i=0; i< columnCount; i++){
                                    columnModal[i]={ width: 50, align: 'center' };
                                 }
                                element.fxdHdrCol({
                                        fixedCols:  1,
                                        width:     "100%",
                                        height:    400,
                                        colModal: columnModal
                                    });

                            
                            })
                         })
                }else if(attrs.fixedHeader=='monthly'){
                    var columnModal=[];
                                 for(var i=0; i< 7; i++){
                                    columnModal[i]={ width: 50, align: 'center' };
                                 }
                    element.fxdHdrCol({
                                        fixedCols:  0,
                                        width:     "100%",
                                        height:    400,
                                        colModal:columnModal
                                    });
                }else if(attrs.fixedHeader=='weekly'){

                    scope.$on('dataloaded', function () {
                                $timeout(function(){
                                var timeHeaders=scope.getWeeklydateRange();
                                 var columnCount=timeHeaders.length+9;
                                 var columnModal=[];
                                 for(var i=0; i< columnCount; i++){
                                    columnModal[i]={ width: 67, align: 'center' };
                                 }
                                element.fxdHdrCol({
                                        fixedCols:  0,
                                        width:     "100%",
                                        height:    400,
                                        colModal: columnModal
                                    });

                            
                            })
                         })
                }else if(attrs.fixedHeader=='recordHours'){
                      scope.$on('dataloaded', function () {
                                $timeout(function(){
                                var parentheaders=scope.ParentHeaders;
                                var educatorHeaders=scope.EducatorHeaders;
                                var headers=scope.timeHeaders;
                                 var columnCount=parentheaders.length+educatorHeaders.length+headers.length;
                                 var columnModal=[];
                                 for(var i=0; i< columnCount; i++){
                                    columnModal[i]={ width: 67, align: 'center' };
                                 }
                                element.fxdHdrCol({
                                        fixedCols: 6,
                                        width:     "100%",
                                        height:    400,
                                        colModal: columnModal
                                    });

                            
                            })
                         })
                }
                
                
                
            }
        }
    }).directive('importcsv',function (dialog,$http,formlyapi,$state,growlService){
        return {
            restrict:'A',
            link:function(scope,element,attributes){
                element.bind('change',function(e){
                 var file=e.target.files[0];
                 if(file){
                          var _validFileExtensions = ["csv"];   
                           var fileExt=file.name.split(".").pop();
                          if (_validFileExtensions.indexOf(fileExt.toLowerCase()) < 0) {
                                    dialog.showOkDialog(file.name + " is not a valid csv File "+fileExt);
                                    e.target.value='';
                                }else{
                                        var fileReader=new FileReader();
                                              fileReader.readAsText(file);
                                              fileReader.onload=function(ev){
                                               var contentData=scope.processCSVData(ev.target.result);
                                                var model=contentData['model'];
                                                var data=contentData['data'];

                                                dialog.showOkCancelDialog("Confirm Import",
                                                        "Are you sure you wish to Upload these records?", "Yes", "No").then(function () {
                                                            formlyapi.uploadCSVFile(data,model).then(function(data){
                                                              growlService.growl(model + ' record was saved successfully!', 'success');
                                                                e.target.value="";
                                                              $state.reload();
                                                            },function(err){
                                                                e.target.value="";
                                                                 growlService.growl('Error in saving '+model + ' record!', 'danger');
                                                                 console.log(err) 
                                                            })
                                                      },function(){
                                                        e.target.value="";
                                                      });
                                            }
                          }
                            
                 }else{
                        dialog.showOkDialog("Error Loading File", '');
                        e.target.value='';
                 }
                      
                })
            }
        }
    })

    // =========================================================================
    // apply date format to date field
    // =========================================================================

    .directive('dateFormatFilter', function ($filter,$parse) {
    return {
        restrict:'A',
        require:'ngModel',
        link:function (scope, elm, attrs, ctrl) {
            var dateFormat = attrs['dateFormatFilter'] || 'dd-MM-yyyy';
            elm.mask('00-00-0000');
            elm.on('keyup',function(e){
                var date = e.target.value;
                var datevalues
                  if (date.match(/^\d{2}$/) !== null) {
                     e.target.value = date + '-';
                  } else if (date.match(/^\d{2}\-\d{2}$/) !== null) {
                     e.target.value = date + '-';
                 }
             })

            ctrl.$formatters.push(function (modelValue) {
                return $filter('date')(modelValue, dateFormat);
            });
            ctrl.$parsers.unshift(function (modelValue) {
               return new Date(moment(modelValue, dateFormat.toUpperCase()).toString());
            });
        }
    };
})



    
    

   