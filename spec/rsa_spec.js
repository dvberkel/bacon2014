describe('RSA', function(){
    it('should be defined', function(){
	expect(RSA).toBeDefined();
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

	    expect(n instanceof Observable).toBeTruthy();
	});

	it('should notify when source is set', function(){
	    var isCalled = false;
	    var n = new RSA.Number('3');
	    n.addObserver(function(){ isCalled = true; });

	    n.set('4');

	    expect(isCalled).toBeTruthy();
	});

	it('should pass along ancestors', function(){
	    var chain = [];
	    var n = new RSA.Number('3');
	    n.addObserver(function(ancestors){ chain = ancestors; });

	    n.set('4');

	    expect(chain.length).toBe(1);
	    expect(chain[0]).toBe(n.observableId);
	});

	describe('Algebraic Derivatives', function(){
	    var derivatives = [
		RSA.Product,
		RSA.Sum,
		RSA.Difference,
		RSA.Modulus,
		RSA.PowerMod,
		RSA.Phi,
		RSA.Gcd,
		RSA.RelativePrimeTo,
		RSA.Inverse
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
	    	    var p = new RSA.Number('2');
	    	    var q= new RSA.Number('8');
	    	    var gcd = new RSA.Gcd(p, q);
	    	    var result = new RSA.Number('2').source;

	    	    expect(gcd.source.equals(result)).toBeTruthy();
	    	});
	    });

	    describe('RelativePrimeTo', function(){
	    	it('should calculate a number relative prime to input', function(){
	    	    var p = new RSA.Number('8');
	    	    var relativePrime = new RSA.RelativePrimeTo(p);
	    	    var result = new RSA.Number('3').source;

	    	    expect(relativePrime.source.equals(result)).toBeTruthy();
	    	});
	    });

	    describe('Inverse', function(){
	    	it('should calculate inverse modulo a number', function(){
	    	    var a = new RSA.Number('7');
	    	    var modulus = new RSA.Number('60');
		    var inverse = new RSA.Inverse(a, modulus);
	    	    var result = new RSA.Number('43').source;

	    	    expect(inverse.source.equals(result)).toBeTruthy();
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

	    it('should set value on enter', function(){
		var view = new RSA.EditableView(parent, n);
		parent.value = '7';

		view.onEnter({ 'keyCode': 13 });

		expect(n.source.toString()).toBe('7');
	    });

	    it('should set value on blur', function(){
		var view = new RSA.EditableView(parent, n);
		parent.value = '7';

		view.onBlur();

		expect(n.source.toString()).toBe('7');
	    });

	    it('should retain value on invalid input when enter is pressed', function(){
		var view = new RSA.EditableView(parent, n);
		parent.value = 'a';

		view.onEnter({ 'keyCode': 13 });

		expect(n.source.toString()).toBe('5');
		expect(parent.value).toBe('5');
	    });

	    it('should retain value on invalid input when blurred', function(){
		var view = new RSA.EditableView(parent, n);
		parent.value = 'a';

		view.onBlur();

		expect(n.source.toString()).toBe('5');
		expect(parent.value).toBe('5');
	    });

	    afterEach(function(){
		parent.parentNode.removeChild(parent);
	    });
	});

	describe('EditableNumber', function(){
	    var parent;
	    var n;

	    beforeEach(function(){
		parent = document.createElement('span');
		parent.textContent = 'original';
		parent.setAttribute('id', 'EditableNumber');
		var container = document.getElementById('test-container');
		container.appendChild(parent);
	    });

	    beforeEach(function(){
		n = new RSA.Number('5');
	    });

	    it('should create containers for subviews', function(){
		new RSA.EditableNumberView(parent, n);

		expect(parent.children.length).toBe(2);
		expect(parent.querySelector('span')).not.toBe(null);
		expect(parent.querySelector('input')).not.toBe(null);
	    });

	    it('subviews should have a representation of the model', function(){
		new RSA.EditableNumberView(parent, n);

		expect(parent.querySelector('span').textContent).toBe('5');
		expect(parent.querySelector('input').value).toBe('5');
	    });

	    it('it should clear the content', function(){
		new RSA.EditableNumberView(parent, n);

		expect(parent.textContent).not.toContain('original');
	    });

	    it('at first only span should be visible', function(){
		new RSA.EditableNumberView(parent, n);

		expect(parent.querySelector('span').style['display']).toBe('inline');
		expect(parent.querySelector('input').style['display']).toBe('none');
	    });

	    it('toggle should switch visibility', function(){
		var view = new RSA.EditableNumberView(parent, n);

		view.toggle();

		expect(parent.querySelector('span').style['display']).toBe('none');
		expect(parent.querySelector('input').style['display']).toBe('inline');
	    });

	    it('click on span should initiate toggle', function(){
		var view = new RSA.EditableNumberView(parent, n);
		var event = document.createEvent('HTMLEvents');
		event.initEvent('click', true, true);

		parent.querySelector('span').dispatchEvent(event);

		expect(parent.querySelector('span').style['display']).toBe('none');
		expect(parent.querySelector('input').style['display']).toBe('inline');
	    });

	    it('valid input should toggle as well when entered', function(){
		var view = new RSA.EditableNumberView(parent, n);
		var event = document.createEvent('HTMLEvents');
		event.initEvent('keydown', true, true);
		event.keyCode = 13;

		var input = parent.querySelector('input');
		input.value = '7';
		input.dispatchEvent(event);

		expect(parent.querySelector('span').style['display']).toBe('none');
		expect(parent.querySelector('input').style['display']).toBe('inline');
	    });

	    it('valid input should toggle as well when blurred', function(){
		var view = new RSA.EditableNumberView(parent, n);
		var event = document.createEvent('HTMLEvents');
		event.initEvent('blur', true, true);

		var input = parent.querySelector('input');
		input.value = '7';
		input.dispatchEvent(event);

		expect(parent.querySelector('span').style['display']).toBe('none');
		expect(parent.querySelector('input').style['display']).toBe('inline');
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
