/*global BigNumber, Observable, window:true, document*/
window.RSA = (function (BigNumber, Observable) {
    'use strict';

    var RSA = {};

    var rsaNumber = RSA.Number = function (number) {
        Observable.call(this);
        this.set(number || '1');
    };
    rsaNumber.prototype = new Observable();
    rsaNumber.prototype.set = function (number) {
        this.setSource(new BigNumber(number));
    };
    rsaNumber.prototype.setSource = function (bigNumber, ancestors) {
        if (!ancestors) {
            ancestors = [ this.observableId ];
        }
        this.source = bigNumber;
        this.notify(ancestors);
    };

    var derivedNumber = function (calculation) {
        var DerivedNumber = function () {
            var callback = this.calculate.bind(this);
            this.input = [];
            for (var index = 0; index < arguments.length; index++) {
                var input = arguments[index];
                input.addObserver(callback);
                this.input.push(input);
            }
            this.calculate();
        };
        DerivedNumber.prototype = new RSA.Number();
        DerivedNumber.prototype.calculate = calculation;
        return DerivedNumber;
    };

    var egcd = function (a, b) {
        var s0 = new BigNumber('1');
        var t0 = new BigNumber('0');
        var s1 = new BigNumber('0');
        var t1 = new BigNumber('1');
        while (!b.isZero()) {
            var r = a.modulo(b);
            var q = a.minus(r).div(b);
            var s = s0.minus(q.times(s1));
            var t = t0.minus(q.times(t1));
            a = b;
            s0 = s1;
            t0 = t1;
            b = r;
            s1 = s;
            t1 = t;
        }
        return { gcd: a, first: s0, second: t0 };
    };

    RSA.Product = derivedNumber(function () {
        this.setSource(this.input[0].source.times(this.input[1].source));
    });
    RSA.Sum = derivedNumber(function () {
        this.setSource(this.input[0].source.plus(this.input[1].source));
    });
    RSA.Difference = derivedNumber(function () {
        this.setSource(this.input[0].source.minus(this.input[1].source));
    });
    RSA.Modulus = derivedNumber(function () {
        this.setSource(this.input[0].source.modulo(this.input[1].source));
    });
    RSA.PowerMod = (function () {
        var zero = new BigNumber('0');
        var two = new BigNumber('2');
        var quotient2 = function (source) { return source.dividedBy(two).floor(); };
        return derivedNumber(function () {
            var result = new BigNumber('1');
            var square = this.input[0].source;
            var q = quotient2(this.input[1].source);
            var r = this.input[1].source.modulo(two);
            var modulus = this.input[2].source;
            while (! q.equals(zero)) {
                if (! r.equals(zero)) {
                    result = result.times(square).modulo(modulus);
                }
                square = square.times(square);
                r = q.modulo(two);
                q = quotient2(q);
            }
            if (! r.equals(zero)) {
                result = result.times(square).modulo(modulus);
            }
            this.setSource(result);
        });
    })();
    RSA.Phi = (function () {
        var one = new BigNumber('1');
        return derivedNumber(function () {
            var pMinus1 = this.input[0].source.minus(one);
            var qMinus1 = this.input[1].source.minus(one);
            var phi = pMinus1.times(qMinus1);
            this.setSource(phi);
        });
    })();
    RSA.Gcd = (function () {
        return derivedNumber(function () {
            this.setSource(egcd(this.input[0].source, this.input[1].source).gcd);
        });
    })();
    RSA.RelativePrimeTo = (function () {
        var one = new BigNumber('1');
        return derivedNumber(function () {
            var n = this.input[0].source;
            var candidate = new BigNumber('2');
            var gcd = egcd(candidate, n).gcd;
            while (!gcd.equals(one)) {
                candidate = candidate.plus(one);
                gcd = egcd(candidate, n).gcd;
            }
            this.setSource(candidate);
        });
    })();
    RSA.Inverse = (function () {
        return derivedNumber(function () {
            var n = this.input[0].source;
            var modulus = this.input[1].source;
            var result = egcd(n, modulus);
            if (result.first.isNegative()) {
                result.first = result.first.plus(modulus);
            }
            this.setSource(result.first);
        });
    })();

    var NumberView = RSA.NumberView = function (parent, model) {
        this.parent = parent;
        this.model = model;
        this.model.addObserver(this.update.bind(this));
        this.update();
    };
    NumberView.prototype.update = function () {
        var container = this.container();
        container.textContent = this.model.source.toString();
    };
    NumberView.prototype.container = function () {
        return this.parent;
    };

    var EditableView = RSA.EditableView = function (parent, model) {
        Observable.call(this);
        this.parent = parent;
        this.model = model;
        this.model.addObserver(this.update.bind(this));
        this.parent.addEventListener('keydown', this.onEnter.bind(this));
        this.parent.addEventListener('blur', this.onBlur.bind(this));
        this.update();
    };
    EditableView.prototype = new Observable();
    EditableView.prototype.update = function () {
        var container = this.container();
        container.value = this.model.source.toString();
    };
    EditableView.prototype.container = function () {
        return this.parent;
    };
    EditableView.prototype.onEnter = function (event) {
        if (event.keyCode === 13) {
            this.control();
        }
    };
    EditableView.prototype.onBlur = function () {
        this.control();
    };
    EditableView.prototype.control = function () {
        var container = this.container();
        var oldSource = this.model.source;
        try {
            this.model.set(container.value);
            this.notify();
        } catch (_) {
            this.model.setSource(oldSource);
        }
    };

    var EditableNumberView = RSA.EditableNumberView = function (parent, model) {
        this.parent = parent;
        this.model = model;
        this.editing = false;
        this.clear();
        this.update();
    };
    EditableNumberView.prototype.clear = function () {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }

    };
    EditableNumberView.prototype.update = function () {
        var children = this.children();
        children.number.style.display = this.editing ? 'none': 'inline';
        children.input.style.display = this.editing ? 'inline': 'none';
    };
    EditableNumberView.prototype.children = function () {
        if (!this._children) {
            var number = this.createNumber();
            this.parent.appendChild(number);
            var input = this.createInput();
            this.parent.appendChild(input);
            this._children = {
                'number': number,
                'input': input
            };
        }
        return this._children;
    };
    EditableNumberView.prototype.createNumber = function () {
        var number = document.createElement('span');
        number.addEventListener('click', this.toggle.bind(this));
        new NumberView(number, this.model);
        return number;
    };
    EditableNumberView.prototype.createInput = function () {
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        new EditableView(input, this.model).addObserver(this.toggle.bind(this));
        return input;
    };
    EditableNumberView.prototype.toggle = function () {
        this.editing = !this.editing;
        this.update();
    };

    return RSA;
})(BigNumber, Observable);
