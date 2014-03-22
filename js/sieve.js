/*global Observable, window:true*/
window.Sieve = (function (Observable) {
    'use strict';
    var Sieve = {};

    var SieveNumber = Sieve.Number = function (n) {
        Observable.call(this);
        this.n = n;
        this.ds = [];
    };
    SieveNumber.prototype = new Observable();
    SieveNumber.prototype.value = function () {
        return this.n;
    };
    SieveNumber.prototype.divisors = function () {
        return this.ds.slice(0);
    };
    SieveNumber.prototype.addDivisor = function (d) {
        this.ds.push(d);
        this.notify();
    };

    var numbers = function (n) {
        var result = [];
        for (var index = 1; index <= n; index++) {
            result.push(new SieveNumber(index));
            if (index === 1) {
                result[0].addDivisor(0);
            }
        }
        return result;
    };

    var Model = Sieve.Model = function (n) {
        Observable.call(this);
        this.currentIndex = 1;
        this.n = n;
        this.ns = numbers(n);
    };
    Model.prototype = new Observable();
    Model.prototype.numbers = function () {
        return this.ns.slice(0);
    };
    Model.prototype.finished = function () {
        return 2 * this.ns[this.currentIndex].value() > this.n;
    };
    Model.prototype.sieveStep = function () {
        var d = this.ns[this.currentIndex].value();
        var index = 2;
        while ((d * index - 1) < this.ns.length) {
            this.ns[d * index - 1].addDivisor(d);
            index++;
        }
        while (this.ns[++this.currentIndex].divisors().length > 0) {/* do nothing */}
    };
    Model.prototype.sieve = function () {
        while (!this.finished()) {
            this.sieveStep();
        }
    };

    var NumberView = Sieve.NumberView = function (parent, model) {
        this.parent = parent;
        this.model = model;
        this.model.addObserver(this.update.bind(this));
        this.update();
    };
    NumberView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.model.value();
        if (this.model.divisors().length > 0) {
            container.style['text-decoration'] = 'line-through';
        } else {
            container.style['text-decoration'] = 'none';
        }
    };
    NumberView.prototype.container = function () {
        return this.parent;
    };
    return Sieve;
})(Observable);
