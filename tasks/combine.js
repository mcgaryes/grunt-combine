/*
 * grunt-combine
 * https://github.com/mcgaryes/grunt-combine
 *
 * Copyright (c) 2013 Eric McGary
 * Licensed under the MIT license.
 * 
 * @main grunt-combine
 */
module.exports = function(grunt) {

  "use strict";

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md
  
  // ==========================================================================
  // TASKS
  // ==========================================================================
  
  var _ = require("underscore");
  var fs = require('fs');

  var processedIndex = 0;
  var totalFiles, replacements, token, input, output, done;

  /**
   * Main task kick-off functionality 
   *
   * @for grunt-combine
   * @method registerMultiTask
   */
  grunt.registerMultiTask('combine', 'Combine files with token based search and replace functionality.', function() {

    // set out defaults
    done = this.async();
    token = this.data.token;
    input = this.data.input;
    output = this.data.output;
    replacements = this.data.replacements;
    totalFiles = replacements.length;

    // check to make sure that we have everything that we need before continuing
    if(_.isUndefined(input) || _.isUndefined(output)) {
      grunt.fail.warn('You must specify an input/output.');
    }

    // load the input file as text
    fs.readFile(input, 'utf8', function(e, data) {

      if(e) { grunt.fail.warn('There was an error processing the input file.'); }

      // run through each of the replacements and load the files if needed. Replace the 
      // replacement with the files contents if it happens to be a file
      grunt.log.writeln('Processing input file...');
      input = data;

      // now process all of out replacements
      processReplacements(replacements);
      
    });
  
    // complete the task
    setTimeout(function() {
      grunt.fail.warn('The task has timed out.');
    }, 10000);

  });

  /**
   * Processes all of the passed replacements
   *
   * @for grunt-combine
   * @method processReplacements
   */
  var processReplacements = function(replacements){

    _.each(replacements, function(replacement,index) {

        // determain whether or not this is a file reference or a string
        var suffix = replacement.slice(replacement.length - 3, replacement.length);
        if(suffix === ".js") {

          // read the file and reset replacement to what was loaded
          fs.readFile(replacement, 'utf8', function(e, data) {
            if(e) {
              grunt.fail.warn("There was an error processing the replacement '" + replacement + "' file.");
            }
            grunt.log.writeln("Processing replacement '" + replacement + "' file...");
            replacements[index] = data;
            processCompleteCallback();
          });

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
    processedIndex++;
    if(processedIndex === totalFiles) {
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
    grunt.log.writeln('Replacing tokens...');

    _.each(replacements,function(replacement,index){
      var position = input.search(token);
      var pre = input.substr(0, position);
      var post = input.substr(position + token.length, input.length);
      input = pre + replacement + post;
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
    grunt.log.writeln('Writing output file...');
    fs.writeFile(output, input, 'utf8', function (err) {
      if (err) {
        grunt.fail.warn("Could not write output '" + output + "' file.");
      }
      grunt.log.writeln('Completed.');
      done();
    });
  };

};