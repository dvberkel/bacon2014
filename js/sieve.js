/*global Observable, window:true, document*/
window.Sieve = (function (Observable) {
    'use strict';
    var Sieve = {};

    var SieveNumber = Sieve.Number = function (n) {
        Observable.call(this);
        this.n = n;
        this.ds = [];
    };
    SieveNumber.prototype = new Observable();
    SieveNumber.prototype.value = function () {
        return this.n;
    };
    SieveNumber.prototype.divisors = function () {
        return this.ds.slice(0);
    };
    SieveNumber.prototype.addDivisor = function (d) {
        this.ds.push(d);
        this.notify();
    };

    var numbers = function (n) {
        var result = [];
        for (var index = 1; index <= n; index++) {
            result.push(new SieveNumber(index));
            if (index === 1) {
                result[0].addDivisor(0);
            }
        }
        return result;
    };

    var Model = Sieve.Model = function (n) {
        Observable.call(this);
        this.currentIndex = 1;
        this.n = n;
        this.ns = numbers(n);
    };
    Model.prototype = new Observable();
    Model.prototype.numbers = function () {
        return this.ns.slice(0);
    };
    Model.prototype.finished = function () {
        return 2 * this.ns[this.currentIndex].value() > this.n;
    };
    Model.prototype.sieveStep = function () {
        if (this.finished()) { return; }
        var d = this.ns[this.currentIndex].value();
        var index = 2;
        while ((d * index - 1) < this.ns.length) {
            this.ns[d * index - 1].addDivisor(d);
            index++;
        }
        while (this.ns[++this.currentIndex].divisors().length > 0) {/* do nothing */}
        this.notify();
    };
    Model.prototype.sieve = function () {
        while (!this.finished()) {
            this.sieveStep();
        }
    };

    var NumberView = Sieve.NumberView = function (parent, model) {
        this.parent = parent;
        this.model = model;
        this.model.addObserver(this.update.bind(this));
        this.update();
    };
    NumberView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.model.value();
        if (this.model.divisors().length > 0) {
            container.style['text-decoration'] = 'line-through';
        } else {
            container.style['text-decoration'] = 'none';
        }
    };
    NumberView.prototype.container = function () {
        return this.parent;
    };

    var View = Sieve.View = function (parent, model) {
        this.parent = parent;
        this.model = model;
        this.model.addObserver(this.update.bind(this));
        this.clear();
        this.update();
    };
    View.prototype.clear = function () {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
    };
    View.prototype.update = function () {
        var children = this.children();
        children.forEach(function (child, index) {
            child.setAttribute('class', (index === this.model.currentIndex) ? 'current': '');
        }.bind(this));
    };
    View.prototype.children = function () {
        if (! this._children) {
            var numbers = this.model.numbers();
            var children = this._children = [];
            for (var index = 0; index < numbers.length; index++) {
                var container = document.createElement('span');
                new NumberView(container, numbers[index]);
                this.parent.appendChild(container);
                children.push(container);
            }
        }
        return this._children;
    };

    var Control = Sieve.ControlView = function (parent, model) {
        this.parent = parent;
        this.model = model;
        this.clear();
        this.update();
    };
    Control.prototype.clear = function () {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
    };
    Control.prototype.update = function () {
        var stepSpan = document.createElement('span');
        stepSpan.textContent = '>';
        stepSpan.addEventListener('click', this.model.sieveStep.bind(this.model));
        var allSpan = document.createElement('span');
        allSpan.textContent = '>>';
        allSpan.addEventListener('click', this.model.sieve.bind(this.model));
        var sieveSpan = document.createElement('span');
        new Sieve.View(sieveSpan, this.model);
        [stepSpan, allSpan, sieveSpan].forEach(function (span) {
            this.parent.appendChild(span);
        }.bind(this));
    };
    return Sieve;
})(Observable);
