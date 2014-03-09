/*global Reveal, RSA, document, setTimeout*/
(function (Reveal, RSA) {
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
        var pSpan = document.getElementById('p');
        var qSpan = document.getElementById('q');
        var powerSpan = document.getElementById('power');
        var productSpan = document.getElementById('product');
        var differenceSpan = document.getElementById('difference');
        var moduloSpan = document.getElementById('modulo');
        var powerModSpan = document.getElementById('powermod');
        var phiSpan = document.getElementById('phi');

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
})(Reveal, RSA);
