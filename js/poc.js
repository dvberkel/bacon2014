/*global Reveal, RSA, document, setTimeout*/
(function (Reveal, RSA) {
    'use strict';

    var p = new RSA.Number('37');
    var q = new RSA.Number('51');
    var product = new RSA.Product(p, q);

    Reveal.addEventListener('poc', function () {
        var pSpan = document.getElementById('p');
        var qSpan = document.getElementById('q');
        var productSpan = document.getElementById('product');

        new RSA.NumberView(pSpan, p);
        new RSA.NumberView(qSpan, q);
        new RSA.NumberView(productSpan, product);

        setTimeout(function () {
            p.set(3);
        }, 2000);
    });
})(Reveal, RSA);
