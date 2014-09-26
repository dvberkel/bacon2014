/*global Reveal, RSA, Sieve, document*/
(function (Reveal, RSA, Sieve) {
    'use strict';

    var one = new RSA.Number('1');

    var p = new RSA.Number('3');
    var q = new RSA.Number('5');
    var N = new RSA.Product(p, q);
    var phiN = new RSA.Product(new RSA.Difference(p, one), new RSA.Difference(q, one));
    var e = new RSA.RelativePrimeTo(phiN);
    var d = new RSA.Inverse(e, phiN);

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
        var s = new RSA.Number('3491');
        var t = new RSA.Number('6397');
        var factor = new RSA.Product(s, t);

        var factorView = document.getElementById('factor_view');

        new RSA.NumberView(factorView, factor);
    });

    (function () {
        var left = new RSA.Number('3');
        var right = new RSA.Number('5');

        [
            function addition() {
                return new RSA.Modulus(new RSA.Sum(left, right), N);
            },
            function multiplication() {
                return new RSA.Modulus(new RSA.Product(left, right), N);
            },
            function exponentiation() {
                return new RSA.PowerMod(left, right, N);
            }
        ].forEach(function (callback) {
            Reveal.addEventListener(callback.name, function () {
                var result = callback();

                var prefix = callback.name;
                var leftView = document.getElementById(prefix + '_left');
                var rightView = document.getElementById(prefix + '_right');
                var resultView = document.getElementById(prefix + '_result');
                var modulusView = document.getElementById(prefix + '_modulus');

                new RSA.EditableNumberView(leftView, left);
                new RSA.EditableNumberView(rightView, right);
                new RSA.NumberView(resultView, result);
                new RSA.NumberView(modulusView, N);
            });
        });
    })();

    Reveal.addEventListener('additive-inverse', function () {
        var known = new RSA.Number('3');
        var target = new RSA.Number('5');
        var result = new RSA.Difference(target, known);
        var resultMod = new RSA.Modulus(new RSA.Sum(result, N), N);

        var knownView = document.getElementById('additive_inverse_known');
        var targetView = document.getElementById('additive_inverse_target');
        var modulusView = document.getElementById('additive_inverse_modulus');

        new RSA.EditableNumberView(knownView, known);
        new RSA.EditableNumberView(targetView, target);
        new RSA.NumberView(modulusView, N);

        var knownViewTry = document.getElementById('additive_inverse_known_try');
        var targetViewTry = document.getElementById('additive_inverse_target_try');
        var resultViewTry = document.getElementById('additive_inverse_result_try');
        var resultModViewTry = document.getElementById('additive_inverse_result_mod_try');
        var modulusViewTry = document.getElementById('additive_inverse_modulus_try');

        new RSA.EditableNumberView(knownViewTry, known);
        new RSA.EditableNumberView(targetViewTry, target);
        new RSA.NumberView(resultViewTry, result);
        new RSA.NumberView(resultModViewTry, resultMod);
        new RSA.NumberView(modulusViewTry, N);

    });

    Reveal.addEventListener('multiplicative-inverse', function () {
        var left = new RSA.Number('3');
        var right = new RSA.Number('5');
        var result = new RSA.Modulus(new RSA.Product(left, right), N);

        var prefix = 'multiplicative_inverse';
        var leftView = document.getElementById(prefix + '_left');
        var rightView = document.getElementById(prefix + '_right');
        var resultView = document.getElementById(prefix + '_result');
        var modulusView = document.getElementById(prefix + '_modulus');

        new RSA.EditableNumberView(leftView, left);
        new RSA.EditableNumberView(rightView, right);
        new RSA.NumberView(resultView, result);
        new RSA.NumberView(modulusView, N);
    });

    Reveal.addEventListener('gcd', function () {
        var left = new RSA.Number('3');
        var result = new RSA.Gcd(left, N);

        var leftView = document.getElementById('gcd_left');
        var rightView = document.getElementById('gcd_right');
        var resultView = document.getElementById('gcd_result');

        new RSA.EditableNumberView(leftView, left);
        new RSA.NumberView(rightView, N);
        new RSA.NumberView(resultView, result);
    });

    Reveal.addEventListener('phi', function () {
        var phiView = document.getElementById('phi_view');

        new RSA.NumberView(phiView, phiN);
    });

    Reveal.addEventListener('exponent', function () {
        var eView = document.getElementById('e_view');

        new RSA.NumberView(eView, e);
    });

    Reveal.addEventListener('inverse', function () {
        var dView = document.getElementById('d_view');

        new RSA.NumberView(dView, d);
    });

    Reveal.addEventListener('communication', function () {
        var M = new RSA.Number('3');
        var encryptResult = new RSA.PowerMod(M, e, N);
        var decryptResult = new RSA.PowerMod(encryptResult, d, N);

        var encryptMView = document.getElementById('encrypt_M');
        var encryptEView = document.getElementById('encrypt_e');
        var encryptResultView = document.getElementById('encrypt_result');
        var encryptModulusView = document.getElementById('encrypt_modulus');

        new RSA.EditableNumberView(encryptMView, M);
        new RSA.NumberView(encryptEView, e);
        new RSA.NumberView(encryptResultView, encryptResult);
        new RSA.NumberView(encryptModulusView, N);

        var decryptM1View = document.getElementById('decrypt_M1');
        var decryptM2View = document.getElementById('decrypt_M2');
        var decryptDView = document.getElementById('decrypt_d');
        var decryptResultView = document.getElementById('decrypt_result');
        var decryptModulusView = document.getElementById('decrypt_modulus');

        new RSA.EditableNumberView(decryptM1View, encryptResult);
        new RSA.EditableNumberView(decryptM2View, encryptResult);
        new RSA.NumberView(decryptDView, d);
        new RSA.NumberView(decryptResultView, decryptResult);
        new RSA.NumberView(decryptModulusView, N);
    });
})(Reveal, RSA, Sieve);
