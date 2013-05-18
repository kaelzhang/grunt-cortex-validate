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
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: require('./.jshintrc.js')
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        cortex_validator: {
            normal: {
                options: {
                    pkg: grunt.file.readJSON('test/normal/fixtures/package.json'),
                    registeryURL: 'http://registery.npm.dp',
                },
            }
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'cortex_validator']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [ /* 'jshint', */ 'test']);

};
