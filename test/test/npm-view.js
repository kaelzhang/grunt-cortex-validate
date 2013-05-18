
var Validator = require('../../lib/validator');

var validator = new Validator();

console.log('semver', 'null')

validator.exists('semver', 'null', function() {
    console.log(arguments);
});