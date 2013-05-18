#!/usr/bin/env node


var npm = require('npm');

function npmw(){};

var ENUM_SETTING_MAP = {
    'registry': 'REGISTRY_URL'
};


npmw.SETTINGS = {};

// wrap the npm
npmw.__proto__ = npm;

npmw.load = function(options, callback) {
    if (arguments.length === 1 && typeof options === "function"){
        callback = options; 
        options = {};
    }

    callback = callback || function() {};
    options = options || {};

    var key;
    var setting_key;

    // Overrides the default config with CORTEX_NPM_CONFIG
    for(key in ENUM_SETTING_MAP) {
        setting_key = ENUM_SETTING_MAP[key];

        if( setting_key in npmw.SETTINGS ){
            options[key] = npmw.SETTINGS[setting_key];
        }
    }

    npm.load.call(this, options, callback);
};


module.exports = npmw;
