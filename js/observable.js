/*global window:true*/
window.Observable = (function () {
    'use strict';

    var Observable = function () {
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

    return Observable;
})();
