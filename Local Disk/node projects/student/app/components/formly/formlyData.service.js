'use strict';

/**
 * Shared data service for custom callout support
 */
angular.module('sms.forms')
  .factory('formlyData', function data() {

    var data, last, original, state,childAtt, child;

    return {
      getOriginal: function() {return original;},
      setOriginal: function(d) {original = d;},
      getchildAttendance: function() {return childAtt;},
      setchildAttendance: function(d) {childAtt = d;},

      getData: function() {return data;},
      setData: function(d) {data = d;},

      getChild: function() {return child;},
      setChild: function(d) {child = d;},

      getLast: function() {return last;},
      setLast: function(l) {last = l;},

      getState: function() {return state;},
      setState: function(l) {state = l;}

    }

  });
