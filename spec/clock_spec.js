describe('Clock', function(){
    it('should be defined', function(){
	expect(Clock).toBeDefined();
    });

    describe('Model', function(){
	var modulus;
	var from;
	var to;

	beforeEach(function(){
	    modulus = new RSA.Number(12);
	    from = new RSA.Number(11);
	    to = new RSA.Number(2);
	});

	it('should be defined', function(){
	    expect(Clock.Model).toBeDefined();
	});



	it('should be constructed with modulus, from and to', function(){
	    expect(new Clock.Model(modulus, from, to)).toBeDefined();
	});

	it('should be observable', function(){
	    var clock = new Clock.Model(modulus, from, to);

	    expect(clock instanceof Observable).toBeTruthy();
	});

	it('should notify of changes in arguments', function(){
	    var timesCalled = 0;
	    var clock = new Clock.Model(modulus, from, to);
	    clock.addObserver(function(){ timesCalled++ });

	    modulus.set("15");
	    from.set("12");
	    to.set("3");

	    expect(timesCalled).toBe(3);
	})
    });
});
