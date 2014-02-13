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
	this.set(number || '1');
    };
    rsaNumber.prototype = new Observable();
    rsaNumber.prototype.set = function(number){
	this.setSource(new BigNumber(number));
    };
    rsaNumber.prototype.setSource = function(bigNumber){
	this.source = bigNumber;
	this.notify();
    };

    var derivedNumber = function(calculation){
	var DerivedNumber = function(){
	    this.input = [];
	    for(var index = 0; index < arguments.length; index++){
		this.input.push(arguments[index]);
	    }
	    this.calculate();
	};
	DerivedNumber.prototype = new RSA.Number();
	DerivedNumber.prototype.calculate = calculation;
	return DerivedNumber;
    }

    var Product = RSA.Product = derivedNumber(function(){
	this.setSource(this.input[0].source.times(this.input[1].source));
    });
    var Sum = RSA.Sum = derivedNumber(function(){
	this.setSource(this.input[0].source.plus(this.input[1].source));
    });
    var Difference = RSA.Difference = derivedNumber(function(){
	this.setSource(this.input[0].source.minus(this.input[1].source));
    });

    return RSA;
})(BigNumber);
