/*global BigNumber, window:true*/
window.RSA = (function (BigNumber) {
    'use strict';

    var RSA = {};

    var Observable = RSA.Observable = function () {
        this.observers = [];
    };
    Observable.prototype.addObserver = function (observer) {
        this.observers.push(observer);
    };
    Observable.prototype.notify = function () {
        this.observers.forEach(function (observer) {
            observer.call(this, this);
        }.bind(this));
    };

    var rsaNumber = RSA.Number = function (number) {
        Observable.call(this);
        this.set(number || '1');
    };
    rsaNumber.prototype = new Observable();
    rsaNumber.prototype.set = function (number) {
        this.setSource(new BigNumber(number));
    };
    rsaNumber.prototype.setSource = function (bigNumber) {
        this.source = bigNumber;
        this.notify();
    };

    var derivedNumber = function (calculation) {
        var DerivedNumber = function () {
            var callback = this.calculate.bind(this);
            this.input = [];
            for (var index = 0; index < arguments.length; index++) {
                var input = arguments[index];
                input.addObserver(callback);
                this.input.push(input);
            }
            this.calculate();
        };
        DerivedNumber.prototype = new RSA.Number();
        DerivedNumber.prototype.calculate = calculation;
        return DerivedNumber;
    };

    RSA.Product = derivedNumber(function () {
        this.setSource(this.input[0].source.times(this.input[1].source));
    });
    RSA.Sum = derivedNumber(function () {
        this.setSource(this.input[0].source.plus(this.input[1].source));
    });
    RSA.Difference = derivedNumber(function () {
        this.setSource(this.input[0].source.minus(this.input[1].source));
    });
    RSA.Modulus = derivedNumber(function () {
        this.setSource(this.input[0].source.modulo(this.input[1].source));
    });
    RSA.PowerMod = (function () {
        var zero = new BigNumber('0');
        var two = new BigNumber('2');
        var quotient2 = function (source) { return source.dividedBy(two).floor(); };
        return derivedNumber(function () {
            var result = new BigNumber('1');
            var square = this.input[0].source;
            var q = quotient2(this.input[1].source);
            var r = this.input[1].source.modulo(two);
            var modulus = this.input[2].source;
            while (! q.equals(zero)) {
                if (! r.equals(zero)) {
                    result = result.times(square).modulo(modulus);
                }
                square = square.times(square);
                r = q.modulo(two);
                q = quotient2(q);
            }
            if (! r.equals(zero)) {
                result = result.times(square).modulo(modulus);
            }
            this.setSource(result);
        });
    })();

    var View = RSA.NumberView = function (parent, model) {
	this.parent = parent;
	this.model = model;
	this.model.addObserver(this.update.bind(this));
	this.update();
    };
    View.prototype.update = function () {
	var container = this.container();
	container.textContent = this.model.source.toString();
    };
    View.prototype.container = function () {
	return this.parent;
    };

    return RSA;
})(BigNumber);
