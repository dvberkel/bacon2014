describe('RSA', function(){
    it('should be defined', function(){
	expect(RSA).toBeDefined();
    });

    describe('Observerable', function(){
	it('should be defined', function(){
	    expect(RSA.Observable).toBeDefined();
	});

	it('should create observables', function(){
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
		RSA.Difference,
		RSA.Modulus,
		RSA.PowerMod,
		RSA.Phi,
		RSA.Gcd
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
		    var derived = new derivative(m,n,m);
		    expect(derived instanceof RSA.Number).toBeTruthy();
		});
	    });

	    it('should notify when input changes', function(){
		derivatives.forEach(function(derivative){
		    var isCalled = false;
		    var derived = new derivative(m,n,m);
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

	    describe('Modulus', function(){
		it('should calculate Modulus', function(){
		    var modulus = new RSA.Modulus(n, m);
		    var result = BigNumber('1');

		    expect(modulus.source.equals(result)).toBeTruthy();
		});
	    });

	    describe('PowerMod', function(){
		it('should calculate fast power modulus', function(){
		    var base = m;
		    var exponent = n;
		    var modulus = new RSA.Number('5');
		    var powerMod = new RSA.PowerMod(base, exponent, modulus);
		    var result = m.source.toPower(n.source).modulo(modulus.source);

		    expect(powerMod.source.equals(result)).toBeTruthy();
		});
	    });

	    describe('Phi', function(){
	    	it('should calculate Euler totient', function(){
	    	    var one = new BigNumber('1');
	    	    var p = new RSA.Number('5');
	    	    var q= new RSA.Number('7');
	    	    var phi = new RSA.Phi(p, q);
	    	    var result = p.source.minus(one).times(q.source.minus(one));

	    	    expect(phi.source.equals(result)).toBeTruthy();
	    	});
	    });

	    describe('Gcd', function(){
	    	it('should calculate greatest common divisor', function(){
	    	    var one = new BigNumber('1');
	    	    var p = new RSA.Number('5');
	    	    var q= new RSA.Number('7');
	    	    var phi = new RSA.Phi(p, q);
	    	    var result = p.source.minus(one).times(q.source.minus(one));

	    	    expect(phi.source.equals(result)).toBeTruthy();
	    	});
	    });
	});
    });

    describe('Views', function(){
	beforeEach(function(){
	    var container = document.createElement('div');
	    container.setAttribute('id', 'test-container');
	    var body = document.getElementsByTagName('body')[0];
	    body.appendChild(container);
	});

	describe('Setup', function(){
	    it('should have created a test container', function(){
		var testContainer = document.getElementById('test-container');

		expect(testContainer).toBeDefined();
	    });
	});

	describe('Number', function(){
	    var parent;
	    var n;

	    beforeEach(function(){
		parent = document.createElement('span');
		parent.setAttribute('id', 'Number');
		var container = document.getElementById('test-container');
		container.appendChild(parent);
	    });

	    beforeEach(function(){
		n = new RSA.Number('5');
	    });

	    it('should provide a view of its model', function(){
		new RSA.NumberView(parent, n);

		expect(parent.textContent).toBe('5');
	    });

	    it('should update when the model changes', function(){
		new RSA.NumberView(parent, n);

		n.set('7');

		expect(parent.textContent).toBe('7');
	    });

	    afterEach(function(){
		parent.parentNode.removeChild(parent);
	    });
	});

	describe('Editable', function(){
	    var parent;
	    var n;

	    beforeEach(function(){
		parent = document.createElement('input');
		parent.setAttribute('id', 'Editable');
		parent.setAttribute('type', 'text');
		var container = document.getElementById('test-container');
		container.appendChild(parent);
	    });

	    beforeEach(function(){
		n = new RSA.Number('5');
	    });

	    it('should provide a view of its model', function(){
		new RSA.EditableView(parent, n);

		expect(parent.value).toBe('5');
	    });

	    it('should update when the model changes', function(){
		new RSA.EditableView(parent, n);

		n.set('7');

		expect(parent.value).toBe('7');
	    });

	    afterEach(function(){
		parent.parentNode.removeChild(parent);
	    });
	});

	afterEach(function(){
	    var container = document.getElementById('test-container');
	    container.parentNode.removeChild(container);
	});
    });
});
