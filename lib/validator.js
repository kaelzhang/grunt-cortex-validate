#!/usr/bin/env node

// 


function Constructor(npm){
    this.npm = npm;
};


Constructor.prototype = {
    exists: function(moduleName, version, callback){
        var npm = this.npm;

        //cb会接受到1个参数，boolean exist
        npm.load(function(){
            npm.commands.view([moduleName + "@" + version], true, function(error, data){

                if(!error && data[version]){
                    callback(true);
                }else{
                    callback(false);
                }
                
            });
            
        });
    }
}

module.exports = Constructor;
