/*global Reveal, RSA, document*/
(function (Reveal, RSA, Sieve) {
    'use strict';

    var p = new RSA.Number('3');
    var q = new RSA.Number('5');

    Reveal.addEventListener('pq', function () {
        var pInput = document.getElementById('p_input');
        var qInput = document.getElementById('q_input');

        new RSA.EditableNumberView(pInput, p);
        new RSA.EditableNumberView(qInput, q);
    });

    Reveal.addEventListener('sieve', function () {
	var model = new Sieve.Model(20);
        var container = document.getElementById('prime-sieve');

	new Sieve.View(container, model);
    });
})(Reveal, RSA, Sieve);
