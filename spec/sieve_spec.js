describe('Sieve', function(){
    it('should be defined', function(){
	expect(Sieve).toBeDefined();
    });

    describe('Number', function(){
	var testValue = 12;
	var number;

	beforeEach(function(){
	    number = new Sieve.Number(testValue);
	});

	it('should be defined', function(){
	    expect(Sieve.Number).toBeDefined();
	});

	it('should be observable', function(){
	    var n = new Sieve.Number(2);

	    expect(n instanceof Observable).toBeTruthy();
	});

	it('should have a value', function(){
	    expect(number.value()).toBe(testValue)
	});

	it('should start with an empty list of divisors', function(){
	    expect(number.divisors().length).toBe(0);
	});

	it('should add divisors', function(){
	    number.addDivisor(2);

	    expect(number.divisors()).toContain(2);

	    number.addDivisor(3);

	    expect(number.divisors()).toContain(2);
	    expect(number.divisors()).toContain(3);
	});

	it('should notify when a divisor is added', function(){
	    var isCalled = false;
	    number.addObserver(function(){ isCalled = true; });

	    number.addDivisor(2);

	    expect(isCalled).toBeTruthy();
	});
    });


    describe('Model', function(){
	var n = 20;
	var model;

	beforeEach(function(){
	    model = new Sieve.Model(n);
	});

	it('should be defined', function(){
	    expect(Sieve.Model).toBeDefined();
	});

 	it('should be observable', function(){
	    var m = new Sieve.Model(10);

	    expect(m instanceof Observable).toBeTruthy();
	});

	it('should contain numbers', function(){
	    expect(model.numbers().length).toBe(n);
	});

	it('number on should contain the special divisor \'0\'', function(){
	    expect(model.numbers()[0].divisors()).toContain(0);
	});

	it('should start out not finished', function(){
	    expect(model.finished()).toBeFalsy();
	});

	it('sieveStep should mark multiples of first unrecognized prime', function(){
	    model.sieveStep();

	    var numbers = model.numbers();
	    [4, 6, 8, 10, 12, 14, 16, 18, 20].forEach(function(index){
		expect(numbers[index - 1].divisors()).toContain(2);
	    });
	});

	it('consequtive sieveStep should mark multiples of consequtive primes', function(){
	    model.sieveStep();
	    model.sieveStep();
	    model.sieveStep();

	    var numbers = model.numbers();
	    [4, 6, 8, 10, 12, 14, 16, 18, 20].forEach(function(index){
		expect(numbers[index - 1].divisors()).toContain(2);
	    });
	    [6, 9, 12, 15, 18].forEach(function(index){
		expect(numbers[index - 1].divisors()).toContain(3);
	    });
	    [10, 15, 20].forEach(function(index){
		expect(numbers[index - 1].divisors()).toContain(5);
	    });
	});

	it('should be finished if no candidates can have divisors', function(){
	    expect(model.finished()).toBeFalsy();
	    model.sieveStep();

	    expect(model.finished()).toBeFalsy();
	    model.sieveStep();

	    expect(model.finished()).toBeFalsy();
	    model.sieveStep();

	    expect(model.finished()).toBeFalsy();
	    model.sieveStep();

	    expect(model.finished()).toBeTruthy();
	});

	it('sieve should sieveStep until finished', function(){
	    model.sieve();
	    var numbers = model.numbers();
	    [
		{ divisor: 2, multiples: [4, 6, 8, 10, 12, 14, 16, 18, 20] },
		{ divisor: 3, multiples: [6, 9, 12, 15] },
		{ divisor: 5, multiples: [10, 15] },
		{ divisor: 7, multiples: [14] },
	    ].forEach(function(entry) {
		entry.multiples.forEach(function(index) {
		    expect(numbers[index - 1].divisors()).toContain(entry.divisor);
		});
	    });

	    [2, 3, 5, 7, 11, 13, 17, 19].forEach(function(prime) {
		expect(numbers[prime - 1].divisors().length).toBe(0);
	    });
n	});
    });

    describe('Views', function(){
	beforeEach(function(){
	    var container = document.createElement('div');
	    container.setAttribute('id', 'test-sieve-container');
	    var body = document.getElementsByTagName('body')[0];
	    body.appendChild(container);
	});

	describe('Setup', function(){
	    it('should have created a test container', function(){
		var testContainer = document.getElementById('test-sieve-container');

		expect(testContainer).toBeDefined();
	    });
	});

	describe('Number', function(){
	    var parent;

	    beforeEach(function(){
		parent = document.createElement('span');
		document.getElementById('test-sieve-container').appendChild(parent);
	    });

	    it('should be defined', function(){
		expect(Sieve.NumberView).toBeDefined();
	    });

	    it('should represent the model', function(){
		var n = new Sieve.Number(4);

		new Sieve.NumberView(parent, n);

		expect(parent.textContent).toBe('4');
	    });

	    it('should strike through if model has divisors', function(){
		var n = new Sieve.Number(4);
		n.addDivisor(2);

		new Sieve.NumberView(parent, n);

		expect(parent.style['text-decoration']).toBe('line-through');
	    });

	    it('should strike through when the model acquires divisors', function(){
		var n = new Sieve.Number(4);
		new Sieve.NumberView(parent, n);
		expect(parent.style['text-decoration']).toBe('none');

		n.addDivisor(2);

		expect(parent.style['text-decoration']).toBe('line-through');
	    });
	});

	describe('View', function(){
	    var n = 5;
	    var parent;
	    var model;

	    beforeEach(function(){
		parent = document.createElement('span');
		parent.textContent = 'original';
		document.getElementById('test-sieve-container').appendChild(parent);
	    });

	    beforeEach(function(){
		model = new Sieve.Model(n);
	    });

	    it('should be defined', function(){
		expect(Sieve.View).toBeDefined();
	    });

 	    it('should represent the model', function(){
		new Sieve.View(parent, model);

		expect(parent.children.length).toBe(n);
	    });

	    it('should represent the numbers', function(){
		new Sieve.View(parent, model);

		[1, 2, 3, 4, 5].forEach(function(p){
		    expect(parent.children[p-1].textContent).toBe('' + p);
		});
	    });

	    it('should mark the current index', function(){
		var view = new Sieve.View(parent, model);
		var currentIndex = model.currentIndex;

		view.children().forEach(function(container, index) {
		    var classAttribute = container.getAttribute('class');
		    console.log(container.getAttribute('class'));
		    if (index === currentIndex) {
			expect(classAttribute).toBe('current');
		    } else {
			expect(classAttribute).toBe('');
		    }
		});
	    });

	    it('should clear the content', function(){
		var view = new Sieve.View(parent, model);

		expect(parent.textContent).not.toContain('original');
	    });
	});

	afterEach(function(){
	    var container = document.getElementById('test-sieve-container');
	    container.parentNode.removeChild(container);
	});
    });
});
