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
});
