var _ = require('lodash');
var Estimator = require('./estimator').Estimator;
var util = require('./util');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var chunks = [];

process.stdin.on('data', function(chunk) {
    chunks.push(chunk);
});

process.stdin.on('end', function() {
    var total = _(chunks).reduce(function(a, b) {
        return a + ' ' + b;
    });

    var numbers = util.trimMap(total);

    var e = new Estimator(numbers);
    e.runAll();
});


