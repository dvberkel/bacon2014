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
	it('should be defined', function(){
	    expect(Sieve.Model).toBeDefined();
	});

	it('should be observable', function(){
	    var model = new Sieve.Model(10);

	    expect(model instanceof Observable).toBeTruthy();
	});
    });
});
