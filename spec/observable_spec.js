describe('Observerable', function(){
    it('should be defined', function(){
	expect(Observable).toBeDefined();
    });

    it('should create observables', function(){
	expect(new Observable()).toBeDefined();
    });

    it('should register observers', function(){
	var observable = new Observable();

	observable.addObserver(function(){});
    });

    it('should notify observers', function(){
	var isCalled = false;
	var observable = new Observable();
	observable.addObserver(function(){ isCalled = true; });

	observable.notify();

	expect(isCalled).toBeTruthy();
    });
});
