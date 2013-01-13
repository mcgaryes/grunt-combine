"use strict";

var grunt = require('grunt');

exports['combine'] = {
    setUp: function (callback) {
      callback();
    },
    tearDown: function (callback) {
      // clean up
      callback();
    },
    test1: function (test) {
      test.done();
    }
};
