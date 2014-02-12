var RSA = (function(Reveal, BigNumber){
    var RSA = {};

    RSA.BigNumber = function(number){
	this.source = BigNumber(number);
    };

    var View = RSA.BigNumberView = function(parent, model){
	this.parent = parent;
	this.model = model;
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
    });

    return RSA;
})(Reveal, BigNumber);
