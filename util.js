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

exports.sampleMean = sampleMean;
exports.trimMap = trimMap;
