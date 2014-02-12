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
    });
});
