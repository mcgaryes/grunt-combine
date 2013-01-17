/*
 * grunt-combine
 * https://github.com/mcgaryes/grunt-combine
 * https://github.com/gruntjs/grunt/
 *
 * Copyright (c) 2013 Eric McGary
 * Licensed under the MIT license.
 * 
 * @main grunt-combine
 */
module.exports = function(grunt) {

  "use strict";
  
  var _ = require("underscore");
  var fs = require('fs');
  
  var starttime = (new Date()).getTime();
  var processed = 0;
  var tokens;
  var input;
  var output;
  var done;
  var timer;

  /**
   * Main task kick-off functionality 
   *
   * @for grunt-combine
   * @method registerMultiTask
   */
  grunt.registerMultiTask('combine', 'Combine files with token based search and replace functionality.', function() {

    // set out defaults
    done = this.async();
    input = this.data.input;
    output = this.data.output;
    tokens = this.data.tokens;

    // check to make sure that we have everything that we need before continuing
    if(_.isUndefined(input) || _.isUndefined(output)) {
      grunt.fail.warn('You must specify an input/output.');
    }

    // load the input file as text
    fs.readFile(input, 'utf8', function(e, data) {

      if(e) { 
        grunt.fail.warn('There was an error processing the input file.'); 
      }

      // run through each of the replacements and load the files if needed. Replace the 
      // replacement with the files contents if it happens to be a file
      grunt.log.writeln('Processing Input: ' + (input).cyan);
      input = data;

      // now process all of out replacements
      processed = 0;
      processTokens(tokens);
      
    });
  
    // complete the task
    timer = setTimeout(function() {
      grunt.fail.warn('The task has timed out.');
    }, 10000);

  });

  /**
   * Processes all of the passed replacements
   *
   * @for grunt-combine
   * @method processReplacements
   */
  var processTokens = function(){

    _.each(tokens, function(token,index) {

        // determain whether or not this is a file reference or a string
        if(token.file) {

          // read the file and reset replacement to what was loaded
          fs.readFile(token.file, 'utf8', function(e, data) {
            if(e) {
              grunt.fail.warn("There was an error processing the replacement '" + token.file + "' file.");
            }
            tokens[index].contents = data;
            processCompleteCallback();
          });

        } else if (token.string) {
          // we didn't need to load a file
          tokens[index].contents = token.string;
          processCompleteCallback();
        } else {
          processCompleteCallback();
        }

      }, this);
  };

  /**
   * Process completion callback. When all replacements have been processed the actual
   * combining of files takes place.
   *
   * @for grunt-combine
   * @method processCompleteCallback
   */
  var processCompleteCallback = function(){
    processed++;
    if(processed === tokens.length) {
      findAndReplaceTokens();
    }
  };

  /**
   * Looks for the specified token and replaces it with the next replacement 
   * in the replacements array.
   *
   * @for grunt-combine
   * @method findAndReplaceTokens
   */
  var findAndReplaceTokens = function(){

    // run through the document and replace anything we can in the input string
    _.each(tokens,function(token,index){
      if(token.contents !== undefined ){
        var position = input.search(token.token);
        var pre = input.substr(0, position);
        var post = input.substr(position + token.token.length, input.length);
        input = pre + token.contents + post;
      } else {
          grunt.log.writeln("Replacement failed for token '" + token.token + "'.");
      }
    });

    writeOutput();
  };

  /**
   * Writes the processed input file to the specified output name.
   *
   * @for grunt-combine
   * @method findAndReplaceTokens
   */
  var writeOutput = function(){
    // write the input string to the output file name
    grunt.log.writeln('Writing Output: ' + (output).cyan);
    fs.writeFile(output, input, 'utf8', function (err) {
      if (err) {
        clearTimeout(timer);
        grunt.fail.warn("Could not write output '" + output + "' file.");
      }
      var endtime = (new Date()).getTime();
      grunt.log.writeln('Combine task completed in ' + ((endtime - starttime) / 1000) + ' seconds');
      clearTimeout(timer);
      done();
    });
  };

};
