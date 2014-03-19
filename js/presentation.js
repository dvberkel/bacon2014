/*global Reveal, RSA, document*/
(function (Reveal, RSA) {
    'use strict';

    var p = new RSA.Number('3');
    var q = new RSA.Number('5');

    Reveal.addEventListener('pq', function () {
        var pInput = document.getElementById('p_input');
        var qInput = document.getElementById('q_input');

        new RSA.EditableNumberView(pInput, p);
        new RSA.EditableNumberView(qInput, q);
    });
})(Reveal, RSA);
