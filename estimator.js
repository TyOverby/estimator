var _ = require('lodash');
var util = require('./util');
var st = require('string-table');

function Estimator(values) {
    this.values = values;

    // The baysean probabilities that a value belongs to a distribution.
    // probs[k][i] where k is the distribution index and i is the value index.
    this.probs = util.array2d(3, values.length);
    // The weights of a value to a distribution.
    this.weights = util.array2d(3, values.length);

    var lowest = _.min(values);
    var highest = _.max(values);
    var mean = util.sampleMean(values);
    var median = _.sortBy(values, _.identity)[Math.floor(values.length / 2)];

    this.means = [
        median,
        lowest, //mean + 10,//(highest + mean) / 2,
        highest //mean - 10//(lowest + mean) / 2
    ];

    this.vars = [1, 1, 1];

    this.iteration = 0;
    this.iterdata = [];
}

Estimator.prototype.MStep = function() {
    // k for each sample
    for (var k = 0; k < 3; k++) {
        // i for each element
        for (var i = 0; i < this.values.length; i++) {
            this.weights[k][i] = (1 / Math.sqrt(this.vars[k] * 2 * Math.PI)) *
                Math.pow(Math.E, -0.5 *
                Math.pow(this.values[i] - this.means[k], 2) / this.vars[k]);
        }
    }

    for (var k = 0; k < 3; k++) {
        for (var i = 0; i < this.values.length; i++) {
            var k2 = (k + 1) % 3;
            var k3 = (k + 2) % 3;
            this.probs[k][i] = (this.weights[k][i] * (1 / 3)) /
                ((this.weights[k][i] * (1 / 3)) +
                (this.weights[k2][i] * (1 / 3)) +
                (this.weights[k3][i] * (1 / 3)));
        }
    }
};

Estimator.prototype.EStep = function() {
    for (var k = 0; k < 3; k++) {
        var numerator = 0;
        var denominator = util.sum(this.probs[k]);

        for (var i = 0; i < this.values.length; i++) {
            numerator += this.values[i] * this.probs[k][i];
            /*if (this.probs[k][i] > 0.5) {
                count++;
                sum += this.values[i];
            }*/
        }
        this.means[k] = numerator / denominator; //sum / count;
    }
};

Estimator.prototype.loglike = function() {
    var TAO = 1 / 3;
    var total = 0;
    for (var i = 0; i < this.values.length; i++) {
        var predicate = Math.log(TAO) - (1 / 2) * Math.log(2 * Math.PI);
        var otherSum = 0;
        for (var k = 0; k < 3; k++) {
            var z = this.probs[k][i] > 0.5 ? 1 : 0;
            otherSum += z * (Math.pow(this.values[i] - this.means[k], 2) / 2);
        }
        total += predicate - otherSum;
    }
    return total;
};

Estimator.prototype.collectIter = function() {
    this.iterdata.push({
        iteration: this.iteration,
        mu_1: this.means[0],
        mu_2: this.means[1],
        mu_3: this.means[2],
        LogLihood: this.loglike()
    });
};

Estimator.prototype.step = function() {
    this.MStep();
    this.EStep();
    this.iteration++;
};

Estimator.prototype.print = function() {
    var str = '';

    var baseFormatting = {
        typeFormatters: {
            number: function(value, header) {
                return {
                    value: value.toExponential(4),
                    format: {
                        alignment: 'right'
                    }
                };
            }
        },
        formatters: {
            iteration: function(value, header) {
                return value.toFixed(0);
            },
            i: function(value, header) {
                return value.toFixed(0);
            },
            x_i: _.identity,
            mu_1: _.identity,
            mu_2: _.identity,
            mu_3: _.identity
        },
        headerSeparator: ' ',
        columnSeparator: ' ',
        outerBorder: ' ',
        innerBorder: ' '
    };
    str += (st.create(this.iterdata, baseFormatting));

    var that = this;
    var final_info = _.range(0, this.values.length).map(function(index) {
        return {
            i: index,
            x_i: that.values[index],
            'P(cls 1 | x_i)': that.probs[0][index],
            'P(cls 2 | x_i)': that.probs[1][index],
            'P(cls 3 | x_i)': that.probs[2][index]
        };
    });

   str += ('\n\n\n');
   str += (st.create(final_info, baseFormatting));

   return str;
};


Estimator.prototype.runAll = function() {
    var loglik = this.loglike();
    do {
        loglik = this.loglike();
        this.collectIter();
        this.step();
    } while (Math.abs(this.loglike() - loglik) > 0.01);
    this.collectIter();

    console.log(this.print());
};

exports.Estimator = Estimator;
