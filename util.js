var _ = require('lodash');

function sampleMean(xs) {
    return _(xs).reduce(function(a, b) {return a + b;}) / xs.length;
}

function trimMap(total) {
    var numbers = _(total.split(/\s+/)).map(function(c) {
        return c.replace(/^\s+|\s+$/g, '');
    }).filter(function(c) {
        return c.length > 0;
    }).map(function(c) {
        return parseFloat(c);
    }).value();
    return numbers;
}

function array2d(x, y, f) {
    if (f == undefined) {
        f = function() {return 0;};
    }
    return _.map(_.range(0, x), function(i) {
        return _.map(_.range(0, y), function(k) {return f(i, k);});
    });
}

function sum(array) {
    return _.reduce(array, function(a, b) {return a + b;}, 0);
}

exports.sampleMean = sampleMean;
exports.trimMap = trimMap;
exports.array2d = array2d;
exports.sum = sum;
