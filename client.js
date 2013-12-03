var Estimator = require('./estimator').Estimator;
var _ = require('lodash');
var util = require('./util');

function step(e, canvas, width){
    width = width - 100;

    var max = _.max(e.values);
    var min = _.min(e.values);
    var dist = max - min;

    var mean1 = ((e.means[0] - min) / dist) * width;
    var mean2 = ((e.means[1] - min) / dist) * width;
    var mean3 = ((e.means[2] - min) / dist) * width;
    canvas.fillStyle = 'red';
    canvas.fillRect(Math.floor(mean1), 0, 1, 100);

    canvas.fillStyle = 'green';
    canvas.fillRect(Math.floor(mean2), 0, 1, 100);

    canvas.fillStyle = 'blue';
    canvas.fillRect(Math.floor(mean3), 0, 1, 100);

    e.MStep();

    for (var i in _.range(e.values.length)) {
        var position = ((e.values[i] - min) / dist) * width;
        position = Math.floor(position);

        canvas.fillStyle = 'black';
        canvas.fillRect(position-5, 50, 10, 10);

        var red = Math.floor(e.probs[0][i] * 255);
        var green = Math.floor(e.probs[1][i] * 255);
        var blue = Math.floor(e.probs[2][i] * 255);
        console.log(red, green, blue);

        canvas.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        canvas.fillRect(position + 1-5, 50 + 1, 10 - 2, 10 - 2);
    }

    e.EStep();

}

window.onload = (function () {
    var canvas = document.querySelector('#canvas');
    var textbox = document.querySelector('#text');
    var setupBtn = document.querySelector('#setupBtn');
    var stepBtn = document.querySelector('#stepBtn');
    var resetBtn = document.querySelector('#resetBtn');

    canvas.width = document.body.clientWidth - 50;
    resetBtn.onclick = function() {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        stepBtn.disabled = true;
    };
    stepBtn.disabled = true;

    setupBtn.onclick = function() {
        var text = textbox.value;
        var numbers = util.trimMap(text);
        var estimator = new Estimator(numbers);

        stepBtn.onclick = function() {
            step(estimator, canvas.getContext('2d'), canvas.clientWidth);
        };
        stepBtn.disabled = false;
    };

});
