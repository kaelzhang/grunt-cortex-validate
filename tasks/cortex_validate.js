#!/usr/bin/env node

/*
 * grunt-cortex-validator
 * https://github.com/kaelzhang/grunt-cortex-validator
 *
 * Copyright (c) 2013 Kael
 * Licensed under the MIT license.
 */

'use strict';

var async       = require('async');
var semver      = require('semver');
var npmw        = require('npmw');
var lang        = require('../lib/lang');


var ERROR_MESSAGE = {
    MODULE_VERSION_EXISTS   : 'Module "{name}" with version "{version}" all ready exists, please update `version` in package.json',
    INVALID_VERSION         : 'Invalid module version "{version}", you should use an exact value',
    MODULE_DEPS_UNEXISTED   : 'Dependency "{name}@{version}" is not existed',
    PACKAGE_NOT_SPECIFIED   : 'Option `pkg` must be specified'
};


module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('cortex_validate', 'Validate module version and normalize semver', function() {

        var task_done = this.async();

        function fail(template, data){
            grunt.fail.fatal( lang.template(template, data) );
        };

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            exportFile: 'package.json'
        });

        var npmw_options = {};

        // npmw must be configured before use
        if(options.registry){
            npmw_options.registry = options.registry;
        }

        // create npm wrapper
        var npm = npmw(npmw_options);

        var pkg = options.pkg;

        if(!pkg){
            fail(ERROR_MESSAGE.PACKAGE_NOT_SPECIFIED);
        }

        var name = pkg.name;
        var version = pkg.version;

        if(!semver.valid(version)){
            fail(ERROR_MESSAGE.INVALID_VERSION, {
                version: version
            });
            return;
        }

        var series = [];

        series.push(function(done) {

            // check if the current module version is available
            npm.exists(name, version, function(error, data) {
                done();

                if(error){
                    grunt.log.warn('NPM server error, skip checking name and version: ' + error);

                }else{
                    if(data.exists){
                        fail(ERROR_MESSAGE.MODULE_VERSION_EXISTS, {
                            name: name,
                            version: version
                        });
                    }
                }
            });
        });


        // check if each of the dependencies exists
        var cortex_dependencies = pkg.cortexDependencies;
        var exact_dependencies = {};

        lang.each(cortex_dependencies, function(dep, dep_version) {
            series.push(function(done) {
                npm.exists(dep, cortex_dependencies[dep], function(error, data) { // console.log('deps', error, data);
                    done();

                    if(error){
                        return grunt.log.warn( lang.template('NPM server error, skip checking dependency "{name}@{version}"', {
                            name: dep,
                            version: dep_version
                        }) );

                    }

                    if(data.exists){
                        exact_dependencies[dep] = data.latest;
                    
                    }else{
                        fail(ERROR_MESSAGE.MODULE_DEPS_UNEXISTED, {
                            name: dep,
                            version: dep_version 
                        });
                    }

                });
            });
        });

        async.parallel(series, function() {
            var export_file = options.exportFile;
            var data = {};

            if(export_file){

                // not override existed data of "package.json"
                if(grunt.file.exists()){
                    data = grunt.file.readJSON(export_file);
                }

                data.cortexExactDependencies = lang.mix(data.cortexExactDependencies || {}, exact_dependencies);

                grunt.file.write(export_file, JSON.stringify(data, null, 4));
            }

            task_done();
        });

    });

};
