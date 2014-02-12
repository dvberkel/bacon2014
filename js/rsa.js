var RSA = (function(BigNumber){
    var RSA = {};

    var Observable = RSA.Observable = function(){
	this.observers = [];
    };
    Observable.prototype.addObserver = function(observer){
	this.observers.push(observer);
    };
    Observable.prototype.notify = function(){
	this.observers.forEach(function(observer){
	    observer.call(this, this);
	}.bind(this));
    };

    var rsaNumber = RSA.Number = function(number){
	Observable.call(this);
	this.set(number);
    };
    rsaNumber.prototype = new Observable();
    rsaNumber.prototype.set = function(number){
	this.setSource(new BigNumber(number));
    };
    rsaNumber.prototype.setSource = function(bigNumber){
	this.source = bigNumber;
	this.notify();
    };

    return RSA;
})(BigNumber);
