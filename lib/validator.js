#!/usr/bin/env node

// 

var npm = require('npm');


function Constructor(npmw){
    this.npm = npmw || npm;
};


Constructor.prototype = {
    exists: function(moduleName, version, callback){
        var npm = this.npm;

        //cb会接受到1个参数，boolean exist
        npm.load(function(){
            npm.commands.view([ moduleName + "@" + version ], true, callback);
        });
    }
}

module.exports = Constructor;
