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

var Validator   = require('../lib/validator');
var semver      = require('../lib/semver-extra');
var npmw        = require('../lib/npmw');
var lang        = require('../lib/lang');


var ERROR_MESSAGE = {
    MODULE_VERSION_EXISTS   : 'Module "{name}" with version "{version}" all ready exists, please update `version` in package.json',
    INVALID_VERSION         : 'Invalid module version "{version}", you should use an exact value',
    MODULE_DEPS_UNEXISTED   : 'Dependency "{name}@{version}" is not existed'
};


module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('cortex_validator', 'Validate module version and normalize semver', function() {

        var task_done = this.async();

        function fail(template, data){
            grunt.fail.fatal( lang.template(template, data) );
        };

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
        });

        // npmw must be configured before use
        if(options.npmServer){
            npmw.SETTINGS.REGISTRY_URL = options.npmServer;
        }

        var validator = new Validator(npmw);
        var pkg = grunt.file.readJSON(options.pkg || 'package.json');

        var name = pkg.name;
        var version = pkg.version;

        if(!semver.isExactVersion(version)){
            fail(ERROR_MESSAGE.INVALID_VERSION, {
                version: version
            });
            return;
        }

        var series = [];

        series.push(function(done) {

            // check if the current module version is available
            validator.exists(name, version, function(error, data) {
                done();

                if(error){
                    if(error.code !== 'E404'){
                        grunt.log.warn('NPM server error, skip checking name and version: ' + error);
                    }

                }else{
                    if(!lang.isEmptyObject(data)){
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
                validator.exists(dep, cortex_dependencies[dep], function(error, data) { // console.log('deps', error, data);
                    done();

                    var latest;

                    if(error && error.code !== 'E404'){
                        return grunt.log.warn( lang.template('NPM server error, skip checking dependency "{name}@{version}"', {
                            name: dep,
                            version: dep_version
                        }) );

                    }else if(data){
                        latest = Object.keys(data).sort(semver.rcompare)[0];

                        if(latest){
                            exact_dependencies[dep] = latest;
                        }
                    }

                    if(!latest){
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

            if(export_file){
                grunt.file.write(export_file, JSON.stringify(exact_dependencies, null, 4));
            }

            task_done();
        });

    });

};
