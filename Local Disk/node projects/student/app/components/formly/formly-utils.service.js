'use strict';

angular.module('sms.forms')
  .factory('formlyUtils', function formlyUtils(
    formlyapi, 
    $filter,
    Auth, 
    formlyData, 
    moment, 
    $util, 
    $state
  ) {


    /**

     Maps from Mongoose Types:

     String - text input, textarea, select or radio
     Number - number
     Date - datepicker
     Buffer - ?
     Boolean - Checkbox
     Mixed - ? sub panel with sub object.
     Objectid - ? Ref.. todo
     Array - list of refs OR list of nested subobjects
     */

    

    function makeHumanReadable(key) {
      var words = key.match(/[A-Za-z0-9][a-z0-9]*/g);

      if (words == null) return key;
      var m = words.map(capitalize);
      var m2 = [], last = '';
      _.each(m, function (word) {
        if (word.length > 1) {
          if (last != '') {
            m2.push(last);
            last = '';
          }
          m2.push(word);
        }
        else last += word;
      })
      if (last != '') m2.push(last);

      return m2.join(" ");
    }

    function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    }

    function buildInputOptions(attr, paths, tree, parentKey, subOptions) {
      var subSchema = modelLookup[attr.options.ref];
      if (subSchema || paths) {
        var type = 'repeatSection';
        if (attr.options.form && attr.options.form.inputType == 'checkbox') {
          type = 'repeatSectionCheckbox';
          if (subOptions && subOptions.type == 'refselect') {
            subOptions.type = 'multiCheckbox';
            subOptions.controller = "FormlyRefCtrl";
            subOptions.templateOptions.extras.isRequired = true;
          }
        }
        var _subFields = subOptions ? [subOptions] : _convert(tree, paths, attr ? attr.path : subSchema.name, parentKey, type)
        
        return {
          type: type,
          key: attr.options.ref,
          templateOptions: {
            btnText: 'Add New ' + makeHumanReadable(attr.path),
            fields: _subFields,
            fullPath: parentKey,
            name: makeHumanReadable(attr.path),

          }
        };
      }

      return {};
    }

    function findSubObj(key, pkey, usePaths) {
      var _path, _obj;
      if (usePaths) {

        if (rootPaths[pkey]) return rootPaths[pkey];
        else {
          _path = pkey.split(".");
          _obj = rootPaths;
          var objSet = false;
          for (var idx = 0; idx < _path.length; idx++) {
            if (_obj[_path[idx]]) {
              _obj = _obj[_path[idx]];
              objSet = true;
              if (_obj && _obj.schema && _obj.schema.paths) _obj = _obj.schema.paths;
            }
          }
          if (_obj && objSet) return _obj;
        }
      }


      if (rootTree[key]) return rootTree[key];
      else if (pkey && pkey.indexOf(".") == -1 && rootTree[pkey] && rootTree[pkey][key]) return rootTree[pkey][key]
      else {
        var path = pkey.split(".");
        _obj = rootTree;
        for (var idx = 0; idx < path.length; idx++) {
          if (_obj[path[idx]])
            _obj = _obj[path[idx]];
          else if (_obj instanceof Array && _obj.length === 1) {
            _obj = _obj[0][path[idx]]
          }
        }
        return _obj;
      }
    }

    function buildSubPathObject(subPaths, key, pKey) {
      var obj = {}

      var subObj = findSubObj(key, pKey);

      if (subObj) {
        for (var subkey in subObj) {
          var lookup = key + "." + subkey;
          var lookupObj = rootPaths[lookup] || rootPaths[pKey + "." + lookup];
          if (lookupObj) {
            obj[subkey] = lookupObj;
          }

        }
      }

      return obj;
    }

    function _getOptions(clsName) {
      return [{label: clsName, name: clsName}];
    }

    var getLabel = function (row, baseSchema, shortList) {
      var s = '';
      var decr = 3;
      _.each(getAttrList(baseSchema, shortList), function (attr) {

        if (attr.length && Array.isArray(attr)) { // embedded ref
         
          if (s != '') s += " / ";
          var base = row[attr[0].substr(0, attr[0].indexOf('.'))];

          _.each(attr, function (subkey) {
            
            s += base[subkey.substr(subkey.indexOf('.') + 1)] + " , ";
          });
          s = s.substr(0, s.length - decr);
          decr = 2;
        } else {
          //if ( typeof(row[attr]) != 'undefined')
          s += row[attr] + " / ";
        }

      })
      if (s.lastIndexOf(" / ") == s.length - 3) s = s.substr(0, s.length - decr);

      return s;
    }

    var getAttrList = function (schema, shortList) {
      var hasShortList = _.filter(schema.tree, function (r, k) {
          return (schema.paths[k] && (schema.paths[k].options.shortList));
        }).length > 0;


      var list = _.filter(_.map(schema.tree, function (r, k) {
        if(r.hasOwnProperty('refList') && !r.refList){ return null; }
        if (schema.paths[k] && ((shortList && hasShortList && schema.paths[k].options.shortList)
          || (!hasShortList && schema.paths[k].options.list))) {
          
          if (r.ref) {
            return _.map(getAttrList(modelLookup[r.ref].schema, shortList), function (el) {
              return k + "." + el
            });
          } else {
            return k;
          }
        }
        else return null;
      }), function (d) {
        return d
      });

      if (!list || list.length == 0)
        return _.map(schema.tree, function (v, k) {
          return k;
        });
      else return list;
    }


    function _buildOptions(data, refType, required) {

      var baseSchema = modelLookup[refType].schema;
      
      var getName = function (row) {
        // todo use schema to lookup 'id' prop ref and deref properly
        return row._id;
      }


      var m = _.map(data, function (d) {
        return {name: getLabel(d, baseSchema, true), value: getName(d), Order: d.Order};
      });

      m = _.sortBy(m, function (o) {
        if (o.Order)
          return "" + o.Order
        else
          return o.name.toUpperCase();
      });

      if( refType == 'staffrolecode' || refType=='educatorqualificationcode' || refType=='playcentrequalificationcode') 
      m.splice(0, 0, {name:'', value:null});
      else if (!required) m.splice(0, 0, {name: '[No Value]', value: null});
      
      return m;
    }

    function buildField(key, clsName, parentKey, paths, tree, parentType) {
      // console.log("converting "+clsName+" -> "+parentKey+ " - "+ key);
      var pKey = parentKey ? parentKey + '.' + key : key;

      var attr = paths[key];
      if (!attr || !attr.path) {
        attr = paths[pKey] || rootPaths[pKey];
        if (!attr) attr = paths[clsName + "." + key];
      }

      var typeOf = attr ? attr.instance : null;
      typeOf = attr && attr.caster && attr.caster.instance && (!typeOf || typeOf == 'Array') ? attr.caster.instance : typeOf;
      typeOf = typeOf ? typeOf.toLowerCase() : typeOf;

      if (!typeOf && attr && attr.schema)
        typeOf = 'array';

      if (!typeOf)
        typeOf = 'mixed';


      var isRequired = attr && attr.options && attr.options.required;
      var typeOptions = {};
      switch (typeOf) {
        case 'array' : {
          var _tree = tree[key].type ? tree[key].type[0].tree : tree[key][0].tree
          typeOptions = buildInputOptions(attr, attr.schema.paths, _tree, pKey);
          break;
        }
        case 'objectid' : {
          var type = parentType == 'repeatSectionCheckbox' ? 'refcbselect' : 'refselect'
          typeOptions = {
            type: 'refselect',
            templateOptions: {
              options: [],
              valueProp: 'value',
              labelProp: 'name',
              extras: {
                type: attr.options.ref, allowAdd: attr.options.form && attr.options.form.allowAdd,
                filter: attr.options.form && attr.options.form.refFilter,
                isRequired: isRequired,
                allowEditForRole: attr.options.form && attr.options.form.allowEditForRole
              }
            }
          };
          
        
          // force a precache for ref lookups NOW
          var refType = attr.options.ref;
          formlyapi.getList(refType, null, true).then(function (data) {
          });

          // see if array of ids or single ref:
          if (attr.instance == 'Array' || (attr.options && attr.options.type && attr.options.type instanceof Array)) {
           
            typeOptions = buildInputOptions(attr, null, null, null,
              decorateTypeOptions(typeOptions, key, attr, clsName));
          }

          break;
        }
        case 'mixed': {

          typeOptions = {
            type: 'nested',
            templateOptions: {
              label: makeHumanReadable(key)
            },
            data: {
              fields: _convert(tree[key] || findSubObj(key, pKey, false), findSubObj(key, pKey, true), key, pKey)
            }
          };
          break;
        }
        case 'boolean': {
          typeOptions = {
            type: 'checkbox'
          };
          break;
        }
        case 'number': {
          typeOptions = {
            type: 'numberinput',
            templateOptions: {type: 'number'}
          };


          if (attr.options.min || attr.options.max) {
            var min = attr.options.min, max = attr.options.max;
            var msgText = "Value must be " + min + " - " + max + "!";
            typeOptions.validators = {
              numberRange: {
                expression: function ($viewValue, $modelValue, scope) {
                  var value = $modelValue || $viewValue;
                  if (typeof(value) == 'undefined') return true;
                  if (typeof(min) != 'undefined' && typeof(max) != 'undefined') return value >= min && value <= max;
                  else if (typeof(min) != 'undefined') return value >= min;
                  else return value <= max;
                },
                message: "'" + msgText + "'"
              },

            }
          }

          var roundToDecimals = function (value, roundTo) {
            return value ? $filter('number')(parseFloat((value)), roundTo) : value;
          }

          if (attr.options.form && attr.options.form.decimalPlaces) {
            if (!typeOptions.validators) typeOptions.validators = {};
            var roundTo = attr.options.form.decimalPlaces;
            typeOptions.validators.twoDecimals =
            {
              expression: function ($viewValue, $modelValue, scope) {
                var value = $modelValue || $viewValue;
                return (value == 0) || (!value || value == '' || value === parseFloat(roundToDecimals(value, roundTo)));
              },
              message: "'Please limit value to " + roundTo + " decimal places'"
            };
          }

          if (attr.options.form && attr.options.form.step) {
            typeOptions.templateOptions.step = "" + attr.options.form.step + "";
          } else {
            typeOptions.templateOptions.step = "1";
          }

          break;
        }
        case 'date': {
          var isTime = attr.options && attr.options.form && attr.options.form.type == 'time';
          if (isTime) {
            typeOptions = {
              type: 'input',
              templateOptions: {
                type: "time",
              }
            };

          } else {

            typeOptions = {
              type: 'datepicker',
              templateOptions: {
                type: "text",
                datepickerPopup: "dd-MMMM-yyyy"
              }
            };
          }

          break;
        }
        case 'string': {
          var options = null;
          var labels = null;
          if (attr.options && attr.options.form && attr.options.form.type == "select" && attr.options.form.options) {
            options = attr.options.form.options;
            if (attr.options.form.labels) labels = attr.options.form.labels;
          } else if (attr.options && attr.options.enum) {
            options = attr.options.enum;
          }else if(attr.options && attr.options.form && attr.options.form.type == "text"){
              typeOptions = {type: 'textarea'}
              break;
          }
         
          if (options) {
            labels = labels || options;
            var totalOptions = options.length;
            //var type = 'radio';
            //if (totalOptions > 5) {
            type = 'select';
            //}
            typeOptions = {
              type: type,
              templateOptions: {
                options: options.map(function (option, idx) {
                  return {
                    name: labels[idx] || option,
                    value: option
                  };
                })
              }
            };
            if (attr.options && attr.options.form && attr.options.form.lastBooking) { 
                var msgText = "Please select a session!";
                typeOptions.validators = {
                  checkbookingSession: {
                    expression: function ($viewValue, $modelValue, scope) {
                       var returnflag=true;
                       if(isLast(scope)){
                            if(scope.model[attr.path]){
                              if(!scope.model[attr.options.form.lastBooking+'Session']){
                                scope.model[attr.options.form.lastBooking+'Session'] = "Specific Timings";
                              }
                            }
                            
                            if(scope && scope.model && scope.model[attr.options.form.lastBooking+'Session']){
                               returnflag=true;
                            }else{
                              if($viewValue!=''){
                                 returnflag=false;
                               }
                              
                            }
                        }
                       
                     return returnflag;
                    },
                    message: "'" + msgText + "'"
                  },

                }
              }
            break;
          } else if (attr.options && attr.options.form && attr.options.form.type == 'image-upload') {
            typeOptions = {type: 'imageupload'}
            break;
          }
          // else fall thru to default
        }
        default:
          var type = (attr.maxlength && attr.maxlength > 80 ) ? 'textarea' : 'input';
          typeOptions = {type: type};
      }

      typeOptions = decorateTypeOptions(typeOptions, key, attr, clsName);
      
      
      if (!typeOptions.className) {
        if (typeOptions.type != 'repeatSection' && typeOf != 'array' && typeOf != 'mixed')
          typeOptions.className = "col-xs-6";
        else
          typeOptions.className = "col-xs-12";
      }


      
      // if it's always hidden, don't even bother adding it to the form.
      if (typeOptions.hideExpression === 'true') return null;
      else return typeOptions;
    }

    function deref(field, data) {
      var obj = data, found = false;
      _.each(field.split("."), function (lookup) {
        obj = obj ? obj[lookup] : null;
        found = true;
      })
      return found ? obj : null;
    }

    function isLocked() {

    }

    var regex = /[^\]](\.{1})/;
    var enrolMap = {};
    var enrolRegex = /[0-9]/g;

    function buildPath(scope) {
      var p;
      var nested = false, last = null, key = null, idx;

      var _parent = scope
      while (_parent) {
        if (_parent && _parent.options && _parent.options.key) {
          var k = _parent.options.key;
          if (k != last) {
            var dot = p && p.indexOf('[') == 0 ? '' : '.';
            p = p ? k + dot + p : k;
            last = k;
          }

          nested = _parent.$parent.options.type == 'repeatSection';
          if (nested) {
            idx = _parent.element.__index;

          }
        }

        var twoP = _parent.$parent ? _parent.$parent.$parent : null;

        if (nested) {
          var m = p.match(regex);
          //var idx = _parent.model.__index;
          if (m && m.length && m.length > 1) {
            p = p.replace(m[1], '[' + idx + '].');
          } else {
            p = '[' + idx + '].' + p;
          }
          nested = false;
        }

        _parent = _parent.$parent;
      }

      return p;
    }


    function buildLastPath(path) {
      var data = formlyData.getData();
      var p = "";
      _.each(path.replace(/\[.+?\]/g, '').split('.'), function (key) {
        var idx = data[key] ? data[key].length : -1;
        if (idx && idx != -1) {
          data = data[key][idx - 1];
        }
        p = p + key + ((typeof(idx) != 'undefined' && idx != -1) ? '[' + (idx - 1) + '].' : '.');
      });
      if (p != "") p = p.substring(0, p.length - 1);
      return p;
    }

    function checkLeapYearBetweenThreeYears(year){
      return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    function threeOrOlder(viewValue, modelValue, scope) {
      var record = formlyData.getData();
      var bs=null;
       if(record.Enrolments && record.Enrolments.length){
        var enrol=record.Enrolments[record.Enrolments.length-1];
        if(enrol.BookingSchedule && enrol.BookingSchedule.length){
              bs=enrol.BookingSchedule[enrol.BookingSchedule.length-1];
        }
      }
      if(bs){
        var bookingEffDate=moment(bs.EffectiveDate);
        var childBirthdate=moment(record.ChildBirthDate);
        var isLeapYear = false;
        var m = moment(record.ChildBirthDate);
        var birthyear = parseInt(m.format("YYYY"));
        var daysToMatch=365*3;
        var birthYearDiff = bookingEffDate.diff(childBirthdate,'day');
        for(var i=0;i<3;i++){
              if(checkLeapYearBetweenThreeYears(birthyear)){
                isLeapYear = true;
              }
              birthyear++;
        } 
        if(isLeapYear){
           daysToMatch=daysToMatch+1;
        }
       
        if(birthYearDiff >= daysToMatch){
          scope.model.isThreeOrOld=true;
          return true;
        }else{
          scope.model.isThreeOrOld=false;
          return false;
        }
      }else{
        scope.model.isThreeOrOld=false;
        return false;
      }
      
    }

    
    /*function threeOrOlder(viewValue, modelValue, scope) {
      var record = formlyData.getData();
      var bs=null;
       if(record.Enrolments && record.Enrolments.length){
        var enrol=record.Enrolments[record.Enrolments.length-1];
        if(enrol.BookingSchedule && enrol.BookingSchedule.length){
              bs=enrol.BookingSchedule[enrol.BookingSchedule.length-1];
        }
      }
      if(bs){
        var bookingEffDate=moment(bs.EffectiveDate);
        var childBirthdate=moment(record.ChildBirthDate);
        return bookingEffDate.diff(childBirthdate,'day')/365 >=3  
      }else{
        return false;
      }
      //return $util.getAge(new Date(record.ChildBirthDate)) >= 3;

    }*/

    function licenseEnabled(viewValue,modelValue, scope){
        var path = buildPath(scope);
        var last = buildLastPath(path);
        
        if (path.indexOf('Status') > -1) {
         return path.replace(/Status.*/, '') != last.replace(/Status.*/, '');
        }else if(path.indexOf('SessionType') > -1){
            return path.replace(/SessionType.*/, '') != last.replace(/SessionType.*/, '');
        } else {
          return path != last;
        }
        
    }

    function checkIfAttendanceMarked(scope, day, ifEffectiveDate){

      var record = formlyData.getData();
      var attData=formlyData.getchildAttendance();
      var bookingSchedule=null;
      var effDate = null; // new Date();
       if(record.Enrolments && record.Enrolments.length){
        var enrol=record.Enrolments[record.Enrolments.length-1];
        if(enrol.BookingSchedule && enrol.BookingSchedule.length){
              bookingSchedule=enrol.BookingSchedule[enrol.BookingSchedule.length-1];
              var date= new Date(bookingSchedule.EffectiveDate).getDate();
              var month =new Date(bookingSchedule.EffectiveDate).getMonth()+1;
              if (date < 10) { date = '0' + date; }
              if (month < 10) { month = '0' + month; }
              var year=new Date(bookingSchedule.EffectiveDate).getFullYear();
              var dateString=date+"-"+month+"-"+year;
              var pattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
              if(bookingSchedule.EffectiveDate && pattern.test(dateString)){
                effDate=bookingSchedule.EffectiveDate;
             }
        }
      }

      var AttestationDate = ifEffectiveDate ? effDate: scope.model.AttestationDate;
      if(attData && attData.length){

          var att=attData.filter(function(a){
           
            if(
                AttestationDate
                &&
                (
                  moment(a.Date).isAfter(moment(AttestationDate),'day') 
                  ||
                  moment(a.Date).isSame(moment(AttestationDate),'day') 
                )
              && 
              moment(a.Date).format('dddd').toLowerCase() == day.toLowerCase() 
            ){
              return true;
            }
          });
    
          if(att && att.length){
            return true;
          }
      }
      
      
      return false;
    }

    function checkBookingTimes(bookingSchedule){
        var days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
       var dayFlag=false;
        _.each(days,function(day){
           if(bookingSchedule.Times && bookingSchedule.Times.length && bookingSchedule.Times[bookingSchedule.Times.length-1][day+"Start"] !='' && bookingSchedule.Times[bookingSchedule.Times.length-1][day+"End"]!=''){
            dayFlag=true;
           }
        });
        return dayFlag;
    }

     function checkAttendance(scope){
      //console.log(scope.model)
      //var record = formlyData.getData();
      var bookingSchedule=scope.model;
      /* if(record.Enrolments && record.Enrolments.length){
        var enrol=record.Enrolments[record.Enrolments.length-1];
        if(enrol.BookingSchedule && enrol.BookingSchedule.length){
              bookingSchedule=enrol.BookingSchedule[enrol.BookingSchedule.length-1];
        }
      }*/
      
      var attData=formlyData.getchildAttendance();
      if(bookingSchedule && attData && attData.length){
        var effDate= null; 
          var date= new Date(bookingSchedule.EffectiveDate).getDate();
          var month =new Date(bookingSchedule.EffectiveDate).getMonth()+1;
          if (date < 10) { date = '0' + date; }
          if (month < 10) { month = '0' + month; }
          var year=new Date(bookingSchedule.EffectiveDate).getFullYear();
          var dateString=date+"-"+month+"-"+year;
          var pattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
          if(bookingSchedule.EffectiveDate && pattern.test(dateString) && checkBookingTimes(bookingSchedule)){
             effDate=bookingSchedule.EffectiveDate;
          }
         
         var att=attData.filter(function(a){ 
          if(effDate && moment(a.Date).isAfter(moment(effDate),'day') || moment(a.Date).isSame(moment(effDate),'day')){
            return true;
          }
        });
      
        if(att && att.length){

               return true;
        }
      }
      return false;  
    }

    function checkExpiryDate(scope,fieldSection) {
      var currentDate = moment().format("YYYY-MM-DD");
      if(fieldSection == 'police' && scope && scope.model && scope.model.ExpiryDateOfPoliceCheck){
        var expiryDate = moment(scope.model.ExpiryDateOfPoliceCheck).format("YYYY-MM-DD");
        if(moment().isAfter(expiryDate,'day')){
          scope.model.PoliceCheck = false;
        }
      }else if(fieldSection == 'firstaid' && scope && scope.model && scope.model.ExpiryDateOfFirstAidCertificate){
        var firstAidExpiryDate = moment(scope.model.ExpiryDateOfFirstAidCertificate).format("YYYY-MM-DD");
        if(moment().isAfter(firstAidExpiryDate,'day')){
          scope.model.FirstAidCertificate = false;
        }
      }else if(fieldSection == 'cyf' && scope && scope.model && scope.model.ExpiryDateOfCyfCheck){
        var cyfExpiryDate = moment(scope.model.ExpiryDateOfCyfCheck).format("YYYY-MM-DD");
        if(moment().isAfter(cyfExpiryDate,'day')){
          scope.model.CyfCheck = false;
        }
      }
    }


    function isParentView() {
     
      if(Auth.getCurrentUser().role.type=='PARENT_ROLE' || Auth.getCurrentUser().role.type=='STAFF_PARENT_ROLE')    
       {
        return true;
       }else{
        return false;
       }

    }

    
    var currentFilterDay = [];
    var currentDisabledDay=[];
    function isNotSpecificTimings(day, action, scope) {
       var element = angular.element('#'+scope.id);
       var selectedSessionType = element.prev().find('button').text();
      if(selectedSessionType && selectedSessionType == 'Specific Timings' || selectedSessionType =="Select Session"){
          if(currentFilterDay.indexOf(day)==-1){ currentFilterDay.push(day);}
            var index = currentDisabledDay.indexOf(day);
            if(index!=-1) currentDisabledDay.splice(index, 1);
            return false;
       }else if(currentFilterDay.indexOf(day)!=-1 && scope.options.key==day+"End"){
        
        if(scope.options.key==day+"End" && currentDisabledDay.indexOf(day)!=-1 ){
            var index = currentDisabledDay.indexOf(day);
            if(index!=-1) currentDisabledDay.splice(index, 1);
              return true;
         }else{ 
          return false;  
         }
        
       }else{
            var index = currentFilterDay.indexOf(day);
            if(index!=-1) currentFilterDay.splice(index, 1);
           
            if(currentDisabledDay.indexOf(day)==-1 &&  scope.options.key!=day+"End" && selectedSessionType!="Select Session"){ 
              currentDisabledDay.push(day);
            }
           
      
          
       }
       return true;
    }

    function isSystemAdmin(){

      /*SYSTEM_ADMIN_ROLE*/
      var role_name = Auth.getCurrentUser().role.type;
      if(role_name == 'SYSTEM_ADMIN_ROLE') return true;
      else return false;
    }

    function enrolmentEnabled(viewValue, modelValue, scope) {
      if(formlyData.getOriginal() && formlyData.getOriginal().length ){
        var enrolled = formlyData.getOriginal().ChildStatus == 'Enrolled';
      }else{
          var enrolled = true;
      }
      
      var endDatePassed = false;
      if (formlyData.getOriginal() && formlyData.getOriginal().Enrolments && formlyData.getOriginal().Enrolments.length) {
        var end = formlyData.getOriginal().Enrolments[formlyData.getOriginal().Enrolments.length - 1].EnrolmentSection.EnrolmentEndDate;
        endDatePassed = end && moment().isAfter(end, 'day');
      }

      var isEnrolState = formlyData.getState() == "ENROL"
      if (scope && (enrolled && !endDatePassed) || isEnrolState) {
        var path = buildPath(scope);
        var last = buildLastPath(path);
        
        
        if (path.indexOf('Times') > -1) {
         
          return path.replace(/Times.*/, '') == last.replace(/Times.*/, '');
        } else {
         
          return path == last;
        }
      } else {

        return enrolled && !endDatePassed;
      }
    }
    
    function sameBookingDate(){
      var flag=false; 
      var data=formlyData.getData();
       var bookingSchedule=data && data.Enrolments && data.Enrolments.length && data.Enrolments[data.Enrolments.length-1].BookingSchedule && data.Enrolments[data.Enrolments.length-1].BookingSchedule.length ? data.Enrolments[data.Enrolments.length-1].BookingSchedule[data.Enrolments[data.Enrolments.length-1].BookingSchedule.length-1]: null;
       var allBookings=data && data.Enrolments && data.Enrolments.length && data.Enrolments[data.Enrolments.length-1].BookingSchedule ? data.Enrolments[data.Enrolments.length-1].BookingSchedule:null;
       if(allBookings){
        _.each(allBookings,function(b){
           if(b.$$hashKey!=bookingSchedule.$$hashKey && moment(b.EffectiveDate).isSame(moment(bookingSchedule.EffectiveDate),'day')){
              flag=true;
           }
        })
       }
      return flag;
    }  
  
    function enrolmentBtnEnabled(model, modelVal, key, index) {
      var isEnrolState = formlyData.getState() == "ENROL";

      var isLastBS = function (data, model) {
        var en, enLast, bs, bsLast;

        _.each(data.Enrolments, function (enrol, enIdx) {
          _.each(enrol.BookingSchedule, function (bookingsched, bsIdx) {
            if (bookingsched.$$hashKey == model.$$hashKey) {
              en = enIdx;
              bs = bsIdx;
            }

            bsLast = bsIdx;
          });
          enLast = enIdx;
        });
        return en == enLast && bs == bsLast;
      }

      if (isEnrolState || enrolmentEnabled(null, null, null)) {
        if (key == 'BookingSchedule') {
          return formlyData.getData().Enrolments.length - 1 == model.__index;
        } else if (key == 'Times') {
          return isLastBS(formlyData.getData(), model);
        } else if (!key && model) {
          // it's a custom button we are hiding
          var path = buildPath(model);
          var last = buildLastPath(path);
          //console.log("Path:", path, "Last:", last);
          if (path.indexOf('Times') > -1) {
            return path.replace(/Times.*/, '') == last.replace(/Times.*/, '');
          } else {
            return path == last;
          }
        }
      }
      return false;
    }
    function isLast(scope){
      var data=formlyData.getData();
       var endDatePassed = false;
        if (data.Enrolments && data.Enrolments.length) {
            var end = data.Enrolments[data.Enrolments.length - 1].EnrolmentSection.EnrolmentEndDate;
            endDatePassed = end && moment().isAfter(end, 'day');
          }
        var isLastBSTime = function (data,model) {
        var  bs, bsLast;
         _.each(data.Enrolments, function (enrol, enIdx) {
          _.each(enrol.BookingSchedule, function (bookingsched, bsIdx) {
                bsLast = bsIdx;
                bs=bookingsched;
          });
         
        });
        if(typeof(bs)=='undefined') return null;
        var LasBsTimes=(bs && bs.Times && bs.Times.length) ? bs.Times[bs.Times.length-1]: null;
        return (LasBsTimes && LasBsTimes.$$hashKey == model.$$hashKey);
      }
      return isLastBSTime(formlyData.getData(),scope.model) && !endDatePassed;
     
       
    }
    function taxBtnEnabled(model, modelVal, key, index) {
      var flag=true;
      var lastTaxEffectiveEndDate=null;
       _.each(model.Tax,function(tax,taxIdx){
          lastTaxEffectiveEndDate=tax.EffectiveEndDate;
       })
      if(lastTaxEffectiveEndDate){
        flag=true;
       }
      return flag;
    }

    function taxEnabled(viewValue, modelValue, scope){
        var path = buildPath(scope);
        var last = buildLastPath(path);
        if (path.indexOf('TaxName') > -1) {
         return path.replace(/TaxName.*/, '') == last.replace(/TaxName.*/, '');
        } else {
          return path == last;
        }
        
    }

    function _isDisabled(viewValue, modelValue, scope, parentfield, targetfield, isDelBtn, isClearBtn, idx) {
      var field = parentfield;
      var disable = false;
      if (parentfield && targetfield) {
        var orig = deref(parentfield, formlyData.getOriginal());
        var curr = deref(parentfield, formlyData.getData());


        if (orig && orig.length) {
          orig = orig[0];
        }
        if (curr && curr.length) curr = curr[0];

        var origField = orig ? deref(targetfield, orig) : null;
        var currField = curr ? deref(targetfield, curr) : null;

        // console.log(parentfield, targetfield, origField, currField, scope.index);
        disable = (origField && currField);
//          var origJson = JSON.stringify(orig);
//          var currJson = JSON.stringify(curr);
      } else if (isDelBtn && idx != null) {
        disable = modelValue[idx]._id;
        // console.log("del btn", parentfield, idx);
        //var orig = deref(parentfield, formlyData.getOriginal());
        //if ( orig && orig.length && orig.length > 0 ) {
        //  disable = idx < orig.length;
        //}
      } else if (isClearBtn) {
        //console.log("clear", parentField)
        disable = modelValue._id;
      }

      return disable;
    }

    function __eval(expr) {
      try {
        return eval(expr);
      } catch (e) {
        console.error('error evaluating '+expr, e);
      }
    }

    function decorateTypeOptions(typeOptions, key, attr, clsName) {
      
      var label = attr && attr.options && attr.options.form && attr.options.form.label ? attr.options.form.label : makeHumanReadable(key);
      typeOptions.key = key;
      typeOptions.templateOptions = typeOptions.templateOptions || {}
      typeOptions.templateOptions.label = label;// makeHumanReadable(key);
      typeOptions.templateOptions.tab = attr && attr.options && attr.options.form && attr.options.form.tab ? attr.options.form.tab : makeHumanReadable(clsName);

      if (!typeOptions.templateOptions.extras) typeOptions.templateOptions.extras = {};

      if (typeOptions.type == 'nested') {
        var t = null;
        for (var k in rootTree[key]) {
          t = t || rootTree[key][k].form && rootTree[key][k].form.tab;
          if (t) break;
        }

        if (t) typeOptions.templateOptions.tab = t;
      }

      if (attr && attr.options && attr.options.required) {
        typeOptions.templateOptions.required = true;
        typeOptions.validation = {
          messages: {
            required: '"This field is required"'
          }
        };

      }

      var getRoot = function (scope) {
        var m = scope.model, p = scope.$parent;
        while (p.$parent) {
          m = p.model || m;
          p = p.$parent;
        }
        return m;
      }

      var get

      if (attr && attr.options && (attr.options.readonly || (attr.options.form && attr.options.form.readonly))) {
        typeOptions.templateOptions.disabled = true;
        //typeOptions.expressionProperties =
        //{
        //  "templateOptions.disabled": "true"
        //};
      } else {

        var isDisabled = function (parentField, targetField, viewValue, modelValue, scope) {
          return _isDisabled(viewValue, modelValue, scope, parentField, targetField);
        }

        typeOptions.expressionProperties = typeOptions.expressionProperties || {};
        if(attr && attr.options && attr.options.form && attr.options.form.tabindex){

          typeOptions.expressionProperties['templateOptions.tabindex']=function(){
              return attr.options.form.tabindex;    
          }
        }
        
        if (attr && attr.options && attr.options.form && attr.options.form.disabledExpression) {
          typeOptions.expressionProperties["templateOptions.disabled"] = function (viewValue, modelValue, scope) {
            var expr = attr.options.form.disabledExpression;
            try {
              return eval(expr);
            } catch (e) {
              console.error('error evaluating '+expr, e);
            }
          }
        } else {
          //typeOptions.expressionProperties["templateOptions.disabled"] = function ($viewValue, $modelValue, scope) {
          //  return isDisabled($viewValue, $modelValue, scope);
          //}

        }

      }
      if (attr && attr.options && attr.options.form && attr.options.form.focus) {
        typeOptions.templateOptions.focus = true;
      }
      if (attr && attr.options && attr.options.form && attr.options.form.defaultValue) {
        typeOptions.defaultValue = __eval(attr.options.form.defaultValue);
      }
      if(attr && attr.options && attr.options.form && attr.options.form.requiredWhen){
      
        typeOptions.expressionProperties["templateOptions.required"] = function (viewValue, modelValue, scope) {
            var expr = attr.options.form.requiredWhen;
            try {
              return eval(expr);
            } catch (e) {
              console.error('error evaluating '+expr, e);
            }
          }
        typeOptions.validation = {
          messages: {
            required: '"This field is required"'
          }
        };  
      }

      if (attr && attr.options && attr.options.form && attr.options.form.copyLastRow) {
        typeOptions.templateOptions.extras.copyLastRow = true;
      }

      if (attr && attr.options && attr.options.form && attr.options.form.addRowDisabled) {
        typeOptions.templateOptions.extras.addRowDisabled = attr.options.form.addRowDisabled;
      }

      if (attr && attr.options && attr.options.form && attr.options.form.hideDeleteBtn) {
        typeOptions.templateOptions.extras.hideDeleteBtn = attr.options.form.hideDeleteBtn;
      }

      if (attr && attr.options && attr.options.form && attr.options.form.hideAddBtn) {
        typeOptions.templateOptions.extras.hideAddBtn = attr.options.form.hideAddBtn;
      }

      if (attr && attr.options && attr.options.form && attr.options.form.disableAllButLast) {
        typeOptions.templateOptions.extras.disableAllButLast = true;
      }

      if (attr && attr.options && attr.options.form && attr.options.form.watcher) {
        var watchExpr = attr.options.form.watcher;
        typeOptions.watcher = {
          listener: function (field, newValue, oldValue, scope, stopWatching) {
            try {
              if(attr.options.form.registeredWatcher){
                  if(eval(watchExpr)){
                    scope.model.RegistrationValidity=null;
                  }
              }else if(attr.options.form.registeredDateWatcher){
                  if(eval(watchExpr)){
                    scope.model.IsRegistered=false;
                  }
              }else{
                eval(watchExpr);  
              }
              
            } catch (e) {
              console.error(e, watchExpr);
            }
          }
        }
      }

      if (attr && attr.options && attr.options.form && attr.options.form.hidden) {
        typeOptions.hideExpression = 'true';
        //typeOptions.hidden = true;
      } else if (attr && attr.options && attr.options.form && attr.options.form.hideWhen) {
        var w = attr.options.form.hideWhen;
        typeOptions.hideExpression = function ($viewValue, $modelValue, scope) {

          var getLookup = function (obj, type, field) {
            var o = formlyapi.cacheLookup(type, obj);
            return (o ? o[field] : null)
          }

          var expr = w;
          try {
            return eval(expr);
          } catch (e) {
            console.error('error evaluating '+expr, e);
          }

        }

      }

      if (attr && attr.options && attr.options.form && attr.options.form.customHTML) {
        typeOptions.templateOptions.extras.customHTML = attr.options.form.customHTML;
      }
      /*if (attr && attr.options && attr.options.form && attr.options.form.directive && attr.options.form.directive === 'textarea') {
        typeOptions.templateOptions.type = 'textarea'
      }*/
      if (attr && attr.options && attr.options.form && attr.options.form.directive && attr.options.form.directive === 'email-field') {
        typeOptions.templateOptions.type = 'email'
      }

      if (attr && attr.options && attr.options.form && attr.options.form.password) {
        typeOptions.templateOptions.type = 'password'
      }

      if (attr && attr.options && attr.options.form && attr.options.form.className) {
        typeOptions.className = attr.options.form.className
      }
      if(attr && attr.options && attr.options.form && attr.options.form.event){
         typeOptions.templateOptions[attr.options.form.event.event]=attr.options.form.event.eventcall;
      }

      return typeOptions;
    }

    var _convert = function (tree, paths, clsName, parentKey, parentType) {
      var arr = [];

      // use the tree to iterate to avoid nested paths,
      // but do the lookup in the paths
      for (var key in tree) {
        // skip over the id and version internal for our form.
        if (key == '__v' || key == '_id' || key == 'id') continue;

        var ele = buildField(key, clsName, parentKey, paths, tree, parentType);
        if (ele) arr.push(ele);
      }

      return arr;
    }


    var modelLookup;
    var rootPaths, rootTree, rootNested;

    var _convertFromMongooseSchema = function (raw, modelMap) {
      modelLookup = modelMap;

      rootPaths = raw.schema.paths;
      rootTree = raw.schema.tree;
      rootNested = raw.schema.nested;

      var formly = [];
      if (raw.schema) {
        formly = _convert(raw.schema.tree, raw.schema.paths, raw.name, '');
      }

      return formly;
    };


    function _flattenObjectForMongoose(obj, tree, nestedList, pKey) {
      var obj2 = {};

      for (var key in obj) {
        var k = pKey ? pKey + "." + key : key;
        if (nestedList[k]) {

          var tree2 = nestedList[k] ? tree[key] : tree[key].type[0].tree;

          var nested = _flattenObjectForMongoose(obj[key], tree2, nestedList, k);
          for (var nestedKey in nested) {
            obj2[nestedKey] = nested[nestedKey];
          }
        } else if (tree[key] && tree[key].type && tree[key].type.length && tree[key].type.length > 0) {
          var isMixed = tree[key].type[0] != null;
          // array of mixed or refs
          var arr = [];
          _.each(obj[key], function (o2) {
            if (isMixed) {
              var nested = _flattenObjectForMongoose(o2, tree[key].type[0].tree, nestedList, '');
              var subObj = {};
              for (var nestedKey in nested) {
                if (nested[nestedKey] != null)
                  subObj[nestedKey] = nested[nestedKey];
              }
              arr.push(subObj);
            } else if (o2[key] != null) {
              if (tree[key].type instanceof Array && tree[key].ref) {
                arr.push({_id: o2[key]});
              } else {
                arr.push(o2[key]);
              }
            } else if (tree[key].form && tree[key].form.inputType == 'checkbox') {
              arr.push(o2);
            } else if (o2 && tree[key].type instanceof Array && tree[key].ref) {
              arr.push(o2);
            }
          });
          obj2[k] = arr;
        } else {
          //if ( obj[key] != null )
          obj2[k] = obj[key];
        }
      }

      return obj2;
    }

    function _inflateObjectFromMongoose(obj, schema, nestedList, pKey, isEdit) {
      var tree = schema.tree || schema;
      var obj2 = {};

      for (var key in obj) {
        var k = pKey ? pKey + "." + key : key;
        if (nestedList[k]) {

          var tree2 = nestedList[k] ? schema : tree[key].type[0].tree;

          var nested = _inflateObjectFromMongoose(obj[key], tree2, nestedList, k, isEdit);

          for (var nestedKey in nested) {
            var s = nestedKey.split(".");
            var o = obj2;

            for (var i = 0; i < s.length; i++) {
              if (i == s.length - 1) {
                o[s[i]] = nested[nestedKey];
              } else {
                o[s[i]] = o[s[i]] || {};
                o = o[s[i]];
              }
            }

            //if (s.length > 1) obj2[s[0]] = {};
            //
            //obj2[nestedKey] = nested[nestedKey];
          }
        } else if (tree[key] && tree[key].type && tree[key].type.length && tree[key].type.length > 0) {
          var isMixed = tree[key].type[0] != null;
          // array of mixed or refs
          var arr = [];
          _.each(obj[key], function (o2) {
            if (isMixed) {
              var nested = _inflateObjectFromMongoose(o2, tree[key].type[0], tree[key].type[0].nested, '', isEdit);
              var subObj = {};
              for (var nestedKey in nested) {
                subObj[nestedKey] = checkAndConvertValue(nested[nestedKey], nestedKey, tree[key].type[0], isEdit);
              }
              arr.push(subObj);
            } else if (tree[key].form && tree[key].form.inputType == 'checkbox') {
              arr.push(o2);
            } else {
              var _sub = {};
              _sub[key] = checkAndConvertValue(o2, key, tree[key].type[0], isEdit);
              arr.push(_sub);
            }
          });
          obj2[k] = arr;
        } else {
          obj2[k] = checkAndConvertValue(obj[key], key, schema, isEdit);
        }
      }

      return obj2;
    }

    function checkAndConvertValue(obj, key, schema, isEdit) {
      // Deref populated references
      if (isEdit && schema && schema.paths && schema.paths[key] && schema.paths[key].instance == "ObjectID" && obj && obj._id)
        return obj._id;

      // convert dates
      if (schema && schema.paths && schema.paths[key] && schema.paths[key].instance == "Date" && obj != null) {
        return new Date(obj);
      }

      return obj;
    }
   
    return {
      convertFromMongoose: _convertFromMongooseSchema,
      flattenForMongoose: _flattenObjectForMongoose,
      inflateFromMongoose: _inflateObjectFromMongoose,
      buildOptions: _buildOptions,
      isDisabled: _isDisabled,
      enrolmentEnabled: enrolmentEnabled,
      threeOrOlder: threeOrOlder,
      enrolmentBtnEnabled: enrolmentBtnEnabled,
      getLabel: getLabel,
      licenseEnabled:licenseEnabled,
      taxBtnEnabled:taxBtnEnabled,
      taxEnabled:taxEnabled,
      checkIfAttendanceMarked:checkIfAttendanceMarked,
      isParentView:isParentView,
      sameBookingDate:sameBookingDate,
      isSystemAdmin:isSystemAdmin,
    }

  });
