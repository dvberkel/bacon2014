var RSA = (function(Reveal, BigNumber){
    var RSA = {};

    var Observable = RSA.Observable = function(){
	this.observers = [];
    };
    Observable.prototype.addObserver = function(callback){
	this.observers.push(callback);
    };
    Observable.prototype.notify = function(){
	this.observers.forEach(function(callback){
	    callback.call(this, this);
	});
    }

    var Model = RSA.BigNumber = function(number){
	Observable.call(this);
	this.set(number || '1');
    };
    Model.prototype = new Observable();
    Model.prototype.set = function(number) {
	this.source = BigNumber(number);
	this.notify();
    }

    var View = RSA.BigNumberView = function(parent, model){
	this.parent = parent;
	this.model = model;
	this.model.addObserver(this.update.bind(this));
	this.update();
    };
    View.prototype.update = function(){
	var container = this.container();
	container.textContent = this.model.source.toString();
    }
    View.prototype.container = function(){
	return this.parent;
    }

    var n = new RSA.BigNumber('51');

    Reveal.addEventListener('poc', function(){
	var span = document.getElementById('number');
	new RSA.BigNumberView(span, n);
	setTimeout(function(){
	    n.set(37);
	}, 2000);
    });

    return RSA;
})(Reveal, BigNumber);
