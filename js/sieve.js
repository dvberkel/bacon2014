/*global Observable, window:true*/
window.Sieve = (function (Observable) {
    'use strict';
    var Sieve = {};

    var Number = Sieve.Number = function (n) {
        Observable.call(this);
        this.n = n;
        this.ds = [];
    };
    Number.prototype = new Observable();
    Number.prototype.value = function () {
        return this.n;
    };
    Number.prototype.divisors = function () {
        return this.ds.slice(0);
    };
    Number.prototype.addDivisor = function (d) {
        this.ds.push(d);
        this.notify();
    };

    var Model = Sieve.Model = function () {
        Observable.call(this);
    };
    Model.prototype = new Observable();

    return Sieve;
})(Observable);
