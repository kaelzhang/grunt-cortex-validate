#!/usr/bin/env node

/*
 * grunt-cortex-validator
 * https://github.com/kaelzhang/grunt-cortex-validator
 *
 * Copyright (c) 2013 Kael
 * Licensed under the MIT license.
 */

'use strict';


var Validator = require('../lib/validator');
var semver = require('semver');
var npmw = require('../lib/npmw');
var lang = require('../');

var ERROR_MESSAGE = {
    MODULE_VERSION_EXISTS: 'Module "{name}" with version "{version}" all ready exists, please update '
};


function 


module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('cortex_validator', 'Validate module version and normalize semver', function() {

        var done = this.async();

        function fail(template, data){
            grunt.fail.fatal( lang.template(template, data) );
        };

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
        });

        // npmw must be configured before use
        npmw.SETTINGS.REGISTRY_URL = options.registeryURL;

        var validator = new Validator(npmw);
        var pkg = options.pkg;

        var name = pkg.name;
        var version = pkg.version;

        // check if the current module version is available
        validator.exists(name, version, function(exists) {
            if(exists){
                fail(ERROR_MESSAGE.MODULE_VERSION_EXISTS, {
                    name: name,
                    version: version
                });
            }
        });

        // check if each of the dependencies exists
        


        
    });

};
