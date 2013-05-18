
var semver = require('semver');


var member;

for(member in semver){
    exports[member] = semver[member];
}


exports.isExactVersion = function(version) {
    return version.split('.').every(function(num) {
        return /^\d+$/.test(num);
    });

};