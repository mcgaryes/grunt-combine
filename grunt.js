/*
 * grunt-combine
 */
module.exports = function(grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    combine: {
        single: {
            input: "test/inputs/input_a.txt",
            output: "test/outputs/output_a.txt",
            tokens: [{
                token: "<%!a%>",
                file: "test/files/fox.txt"
            }]
        },
        multiple: {
          input: ["test/inputs/input_b.txt","test/inputs/input_c.txt"],
          output: "test/outputs/",
          tokens: [{
           token: "<%!b%>",
           file: "test/files/fox.txt"
         },{
          token: "<%!c%>",
          string: "hairy walrus"
        }]
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['lint', 'combine:single', 'combine:multiple', 'test']);

};
