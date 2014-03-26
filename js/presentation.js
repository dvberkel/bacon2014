/*global Reveal, RSA, Sieve, document*/
(function (Reveal, RSA, Sieve) {
    'use strict';

    var p = new RSA.Number('3');
    var q = new RSA.Number('5');
    var N = new RSA.Product(p, q);

    var model = new Sieve.Model(20);

    Reveal.addEventListener('pq', function () {
        var pInput = document.getElementById('p_input');
        var qInput = document.getElementById('q_input');

        new RSA.EditableNumberView(pInput, p);
        new RSA.EditableNumberView(qInput, q);
    });

    Reveal.addEventListener('sieve', function () {
        var container = document.getElementById('prime-sieve');

        new Sieve.ControlView(container, model);
    });

    Reveal.addEventListener('n', function () {
        var nView = document.getElementById('n_view');

        new RSA.EditableNumberView(nView, N);
    });

    Reveal.addEventListener('factor', function () {
	var s = new RSA.Number(37);
	var t = new RSA.Number(53);
	var factor = new RSA.Product(s, t);

        var factorView = document.getElementById('factor_view');

        new RSA.NumberView(factorView, factor);
    });
})(Reveal, RSA, Sieve);
