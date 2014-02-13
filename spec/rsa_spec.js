describe('RSA', function(){
    it('should be defined', function(){
	expect(RSA).toBeDefined();
    });

    describe('Observerable', function(){
	it('should be defined', function(){
	    expect(RSA.Observable).toBeDefined();
	});

	it('should create observalbes', function(){
	    expect(new RSA.Observable()).toBeDefined();
	});

	it('should register observers', function(){
	    var observable = new RSA.Observable();

	    observable.addObserver(function(){});
	});

	it('should notify observers', function(){
	    var isCalled = false;
	    var observable = new RSA.Observable();
	    observable.addObserver(function(){ isCalled = true; });

	    observable.notify();

	    expect(isCalled).toBeTruthy();
	});

    });

    describe('Number', function(){
	it('should be defined', function(){
	    expect(RSA.Number).toBeDefined();
	});

	it('should create numbers', function(){
	    var n = new RSA.Number('0');

	    expect(n).toBeDefined();
	});

	it('should wrap BigNumber', function(){
	    var n = new RSA.Number('1');

	    expect(n.source).toBeDefined();
	    expect(n.source instanceof BigNumber).toBeTruthy();
	});

	it('should be Observable', function(){
	    var n = new RSA.Number('2');

	    expect(n instanceof RSA.Observable).toBeTruthy();
	});

	it('should notify when source is set', function(){
	    var isCalled = false;
	    var n = new RSA.Number('3');
	    n.addObserver(function(){ isCalled = true; });

	    n.set('4');

	    expect(isCalled).toBeTruthy();
	});

	describe('Algebraic Derivatives', function(){
	    var derivatives = [
		RSA.Product,
		RSA.Sum,
		RSA.Difference
	    ];
	    var m, n;

	    beforeEach(function(){
		m = new RSA.Number('2');
		n = new RSA.Number('3');
	    });

	    it('should be defined', function(){
		derivatives.forEach(function(derivative){
		    expect(derivative).toBeDefined();
		});
	    });

	    it('should be Number', function(){
		derivatives.forEach(function(derivative){
		    var derived = new derivative(m,n);
		    expect(derived instanceof RSA.Number).toBeTruthy();
		});
	    });

	    it('should notify when input changes', function(){
		derivatives.forEach(function(derivative){
		    var isCalled = false;
		    var derived = new derivative(m,n);
		    derived.addObserver(function(){ isCalled = true; });

		    n.set('5');

		    expect(isCalled).toBeTruthy();
		});
	    });

	    describe('Product', function(){
		it('should calculate product', function(){
		    var product = new RSA.Product(m, n);
		    var result = BigNumber('6');

		    expect(product.source.equals(result)).toBeTruthy();
		});
	    });

	    describe('Sum', function(){
		it('should calculate sum', function(){
		    var sum = new RSA.Sum(m, n);
		    var result = BigNumber('5');

		    expect(sum.source.equals(result)).toBeTruthy();
		});
	    });

	    describe('Difference', function(){
		it('should calculate difference', function(){
		    var difference = new RSA.Difference(m, n);
		    var result = BigNumber('-1');

		    expect(difference.source.equals(result)).toBeTruthy();
		});
	    });
	});
    });
});
