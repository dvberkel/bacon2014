/*global window:true*/
window.Observable = (function () {
    'use strict';

    var nextId = (function () {
        var id = 0;
        return function () {
            return id++;
        };
    })();

    var Observable = function () {
        this.observableId = nextId();
        this.observers = [];
    };
    Observable.prototype.addObserver = function (observer) {
        this.observers.push(observer);
    };
    Observable.prototype.notify = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        this.observers.forEach(function (observer) {
            observer.apply(this, args);
        }.bind(this));
    };

    return Observable;
})();
