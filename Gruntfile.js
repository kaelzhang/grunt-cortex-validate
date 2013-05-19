/*
 * grunt-cortex-validator
 * https://github.com/kaelzhang/grunt-cortex-validator
 *
 * Copyright (c) 2013 Kael
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // jshint: {
        //     all: [
        //         'Gruntfile.js',
        //         'tasks/*.js',
        //         '<%= nodeunit.tests %>',
        //     ],
        //     options: require('./.jshintrc.js')
        // },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['test/**/build'],
        },

        // Configuration to be run (and then tested).
        cortex_validate: {
            normal: {
                options: {
                    pkg: 'test/normal/fixtures/package.json',
                    // npmServer: 'http://registery.npm.dp',
                    exportFile: 'test/normal/build/exactDependencies.json',
                },
            }
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'cortex_validate']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [ /* 'jshint', */ 'test']);

};
