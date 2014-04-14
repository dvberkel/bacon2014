/*global Reveal, Raphael, RSA, document, setTimeout*/
(function (Reveal, Raphael, RSA) {
    'use strict';

    var power = new RSA.Number('5');

    var p = new RSA.Number('37');
    var q = new RSA.Number('53');
    var product = new RSA.Product(p, q);
    var difference = new RSA.Difference(q, p);
    var modulo = new RSA.Modulus(q, p);
    var powerMod = new RSA.PowerMod(q, power, p);
    var phi = new RSA.Phi(p, q);

    Reveal.addEventListener('poc', function () {
        var input = document.getElementById('entry');
        var pSpan = document.getElementById('p');
        var qSpan = document.getElementById('q');
        var powerSpan = document.getElementById('power');
        var productSpan = document.getElementById('product');
        var differenceSpan = document.getElementById('difference');
        var moduloSpan = document.getElementById('modulo');
        var powerModSpan = document.getElementById('powermod');
        var phiSpan = document.getElementById('phi');

        new RSA.EditableNumberView(input, p);
        new RSA.NumberView(pSpan, p);
        new RSA.NumberView(qSpan, q);
        new RSA.NumberView(powerSpan, power);
        new RSA.NumberView(productSpan, product);
        new RSA.NumberView(differenceSpan, difference);
        new RSA.NumberView(moduloSpan, modulo);
        new RSA.NumberView(powerModSpan, powerMod);
        new RSA.NumberView(phiSpan, phi);

        setTimeout(function () {
            p.set(3);
        }, 2000);
    });

    var paper;
    Reveal.addEventListener('poc-svg', function () {
        var container = document.getElementById('clock');
        if (!paper) {
            paper = new Raphael(container, 640, 640);

            var c = paper.circle(320, 320, 310);
            c.attr({ 'stroke': 'black', 'stroke-width': 5, 'fill': 'white' });

            var n = 35;
            var angle = 360 / n;
            for (var index = 0; index < n; index++) {
                var mark = paper.rect(-15, 0, 30, 5);
                mark.transform('t320,320r' + (angle * index - 90) + 't280,0');
                mark.attr({ 'stroke': 'black', 'fill': 'black' });
                if (index === 0) {
                    mark.attr({ 'stroke': 'red', 'fill': 'red' });
                }
            }


        }
    });

})(Reveal, Raphael, RSA);
