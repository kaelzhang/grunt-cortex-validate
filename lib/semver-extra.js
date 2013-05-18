
var semver = require('semver');


var member;

for(member in semver){
    exports[member] = semver[member];
}


exports.