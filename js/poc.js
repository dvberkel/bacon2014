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
	this.setSource(BigNumber(number));
    };
    Model.prototype.setSource = function(bigNumber){
	this.source = bigNumber;
	this.notify();
    }

    var Product = RSA.Product = function(a, b){
	RSA.BigNumber.call(this);
	this.a = a;
	this.b = b;
	this.a.addObserver(this.calculate.bind(this));
	this.b.addObserver(this.calculate.bind(this));
	this.calculate();
    };
    Product.prototype = new Model();
    Product.prototype.calculate = function(){
	this.setSource(this.a.source.times(this.b.source));
    }

    View = RSA.BigNumberView = function(parent, model){
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

    var m = new RSA.BigNumber('37');
    var n = new RSA.BigNumber('51');
    var product = new RSA.Product(m, n);

    Reveal.addEventListener('poc', function(){
	var span = document.getElementById('number');
	var mSpan = document.getElementById('m');
	var nSpan = document.getElementById('n');
	var productSpan = document.getElementById('product');

	new RSA.BigNumberView(span, n);
	new RSA.BigNumberView(mSpan, m);
	new RSA.BigNumberView(nSpan, n);
	new RSA.BigNumberView(productSpan, product);

	setTimeout(function(){
	    n.set(37);
	}, 2000);
    });

    return RSA;
})(Reveal, BigNumber);
