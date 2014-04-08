/*global window:true, Observable, RSA*/
window.Clock = (function(Observable, RSA){
    'use strict';

    var Clock = {};

    var Model = Clock.Model = function(modulus, from, to){
	Observable.call(this);
	this.modulus = modulus;
	this.from = from;
	this.to = to;
	var callback = this.notify.bind(this);
	[this.modulus, this.from, this.to].forEach(function(observable){
	    observable.addObserver(callback);

	})
    };
    Model.prototype = new Observable();

    return Clock;
})(Observable, RSA);
