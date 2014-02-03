var some = require('lodash.some')
	, trait, expect;

try {
	trait = require('../index.js');
	expect = require('expect.js');
	require('./sauce.js');
} catch (err) {
	trait = require('./trait');
	expect = window.expect;
}

var ERR_CONFLICT = 'Remaining conflicting property: ';
var ERR_REQUIRED = 'Missing required property: ';

function Data (value, enumerable, configurable, writable) {
	return ({
		value: value,
		enumerable: enumerable !== false,
		configurable: configurable !== false,
		writable: writable !== false
	});
};
function Method (method, enumerable, configurable, writable) {
	return ({
		value: method,
		enumerable: enumerable !== false,
		configurable: configurable !== false,
		writable: writable !== false
	});
};
function Accessor (get, set, enumerable, configurable) {
	return ({
		get: get,
		set: set,
		enumerable: enumerable !== false,
		configurable: configurable !== false
	});
};
function Required (name) {
	function required() { throw new Error(ERR_REQUIRED + name) }

	return ({
		get: required,
		set: required,
		required: true
	});
};
function Conflict (name) {
	function conflict() { throw new Error(ERR_CONFLICT + name) }

	return ({
		get: conflict,
		set: conflict,
		conflict: true
	});
};

function equivalentDescriptors (actual, expected) {
	return (actual.conflict && expected.conflict) ||
				 (actual.required && expected.required) ||
				 equalDescriptors(actual, expected);
}

function equalDescriptors (actual, expected) {
	return actual.get === expected.get &&
				 actual.set === expected.set &&
				 actual.value === expected.value &&
				 !!actual.enumerable === !!expected.enumerable &&
				 !!actual.configurable === !!expected.configurable &&
				 !!actual.writable === !!expected.writable;
}

function containsSet (source, target) {
	return some(source, function(element) {
		return 0 > target.indexOf(element);
	});
}

function equivalentSets (source, target) {
	return containsSet(source, target) && containsSet(target, source);
}

function findNonEquivalentPropertyName(source, target) {
	var value = null;
	some(Object.getOwnPropertyNames(source), function(key) {
		var areEquivalent = false;
		if (!equivalentDescriptors(source[key], target[key])) {
			value = key;
			areEquivalent = true;
		}
		return areEquivalent;
	});
	return value;
}

function equalTraits (actual, expected, message) {
	var actualKeys = Object.getOwnPropertyNames(actual)
		, expectedKeys = Object.getOwnPropertyNames(expected)
		, difference;

	if (equivalentSets(actualKeys, expectedKeys)) {
		return false;
	} else if (difference = findNonEquivalentPropertyName(actual, expected)) {
		return false;
	}
	return true;
}

function method() {}

describe('trait', function () {
	describe('trait() factory', function () {
		it('should handle empty trait', function () {
			expect(equalTraits(
				trait({}),
				{}
			)).to.be.ok();
		});
		it('should handle simple trait', function () {
			expect(equalTraits(
				trait({
					a: 0,
					b: method
				}),
				{
					a: Data(0),
					b: Method(method)
				}
			)).to.be.ok();
		});
		it('should handle simple trait with required properties', function () {
			expect(equalTraits(
				trait({
					a: trait.required,
					b: 1
				}),
				{
					a: Required('a'),
					b: Data(1)
				}
			)).to.be.ok();
		});
		it('should ignore trait property ordering', function () {
			expect(equalTraits(
				trait({
					a: 0,
					b: 1,
					c: trait.required
				}),
				trait({
					b: 1,
					c: trait.required,
					a: 0
				})
			)).to.be.ok();
		});
		if (Object.getOwnPropertyDescriptor) {
			it('should handle trait with accessor property', function () {
				var record = { get a() {}, set a(v) {} }
					, get = Object.getOwnPropertyDescriptor(record, 'a').get
					, set = Object.getOwnPropertyDescriptor(record, 'a').set;

				expect(equalTraits(
					trait(record),
					{
						a: Accessor(get, set)
					}
				)).to.be.ok();
			});
		}
	});

	describe('trait.compose()', function () {
		it('should handle simple composition', function () {
			expect(equalTraits(
				trait.compose(
					trait({
						a:0,
						b:1
					}),
					trait({
						c:2,
						d:method
					})
				),
				{
					a: Data(0),
					b: Data(1),
					c: Data(2),
					d: Method(method)
				}
			)).to.be.ok();
		});
		it('should handle composition with conflict', function () {
			expect(equalTraits(
				trait.compose(
					trait({
						a:0,
						b:1
					}),
					trait({
						a:2,
						c:method
					})
				),
				{
					a: Conflict('a'),
					b: Data(1),
					c: Method(method)
				}
			)).to.be.ok();
		});
		it('should handle composition of identical properties without conflict', function () {
			expect(equalTraits(
				trait.compose(
					trait({
						a:0,
						b:1
					}),
					trait({
						a:0,
						c:method
					})
				),
				{
					a: Data(0),
					b: Data(1),
					c: Method(method)
				}
			)).to.be.ok();
		});
		it('should handle composition of identical required properties without conflict', function () {
			expect(equalTraits(
				trait.compose(
					trait({
						a:trait.required,
						b:1
					}),
					trait({
						a:trait.required,
						c:method
					})
				),
				{
					a: Required(),
					b: Data(1),
					c: Method(method)
				}
			)).to.be.ok();
		});
		it('should handle composition of a satisfied required property', function () {
			expect(equalTraits(
				trait.compose(
					trait({
						a:trait.required,
						b:1
					}),
					trait({
						a:method
					})
				),
				{
					a: Method(method),
					b: Data(1)
				}
			)).to.be.ok();
		});
		it('should be neutral with respect to conflicts', function () {
			expect(equalTraits(
				trait.compose(
					trait.compose(trait({a:1}), trait({a: 2})),
					trait({b:0})
				),
				{
					a: Conflict('a'),
					b: Data(0)
				}
			)).to.be.ok();
		});
		it('should handle conflicting property overriding required property', function () {
			expect(equalTraits(
				trait.compose(
					trait.compose(trait({a:1}), trait({a: 2})),
					trait({a:trait.required})
				),
				{
					a: Conflict('a')
				}
			)).to.be.ok();
		});
		it('should be commutative', function () {
			var actual = trait.compose(trait({a:0, b:1}), trait({c:2, d:method}))
				, expected = trait.compose(trait({c:2, d:method}), trait({a:0, b:1}));

			expect(equalTraits(actual, expected)).to.be.ok();
		});
		it('should be commutative, including required/conflicting properties', function () {
			var actual = trait.compose(trait({a:0, b:1, c:3, e:trait.required}),
						trait({c:2, d:method}))
				, expected = trait.compose(trait({c:2, d:method}),
						trait({a:0, b:1, c:3, e:trait.required}));

			expect(equalTraits(actual, expected)).to.be.ok();
		});
		it('should be associative', function () {
			var actual = trait.compose(trait({a:0, b:1, c:3, e:trait.required}),
						trait.compose(trait({c:3, d:trait.required}),
							trait({c:2, d:method, e:'foo'})))
				, expected = trait.compose(
						trait.compose(trait({a:0, b:1, c:3, e:trait.required}),
							trait({c:3, d:trait.required})),
						trait({c:2, d:method, e:'foo'}));

			expect(equalTraits(actual, expected)).to.be.ok();
		});
		it('should handle diamond import of same property without generating conflict', function () {
			var actual = trait.compose(trait.compose(trait({ b: 2 }), trait({ a: 1 })),
																 trait.compose(trait({ c: 3 }), trait({ a: 1 })),
																 trait({ d: 4 }))
				, expected = { a: Data(1), b: Data(2), c: Data(3), d: Data(4) };

			expect(equalTraits(actual, expected)).to.be.ok();
		});
	})

	describe('trait.resolve()', function () {
		it('should handle empty resolutions with no effect', function () {
			expect(equalTraits(
				trait({a:1, b:trait.required, c:method})
					.resolve({}),
				{
					a: Data(1),
					b: Required(),
					c: Method(method)
				}
			)).to.be.ok();
		});
		it('should handle property renaming', function () {
			expect(equalTraits(
				trait({a:1,
					b:trait.required,
					c:method})
						.resolve({
							a: 'A',
							c: 'C'
						}),
				{
					A: Data(1),
					b: Required(),
					C: Method(method),
					a: Required(),
					c: Required()
				}
			)).to.be.ok();
		});
		it('should handle renaming to conflicting name, causing conflict (order 1)', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: 'b'}),
				{
					b: Conflict('b'),
					a: Required()
				}
			)).to.be.ok();
		});
		it('should handle renaming to conflicting name, causing conflict (order 2)', function () {
			expect(equalTraits(
				trait({b:2, a:1}).resolve({a: 'b'}),
				{
					b: Conflict('b'),
					a: Required()
				}
			)).to.be.ok();
		});
		it('should handle simple exclusion', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: undefined}),
				{
					a: Required(),
					b: Data(2)
				}
			)).to.be.ok();
		});
		it('should handle exclusion to empty trait', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: null, b: undefined}),
				{
					a: Required(),
					b: Required()
				}
			)).to.be.ok();
		});
		it('should handle exclusion and renaming of disjoint properties', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: undefined, b: 'c'}),
				{
					a: Required(),
					c: Data(2),
					b: Required()
				}
			)).to.be.ok();
		});
		it('should handle exclusion and renaming of overlapping properties', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: undefined, b: 'a'}),
				{
					a: Data(2),
					b: Required()
				}
			)).to.be.ok();
		});
		it('should handle renaming to a common alias, causing conflict', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: 'c', b: 'c'}),
				{
					c: Conflict('c'),
					a: Required(),
					b: Required()
				}
			)).to.be.ok();
		});
		it('should handle renaming that overrides a required property', function () {
			expect(equalTraits(
				trait({a:trait.required, b:2}).resolve({b: 'a'}),
				{
					a: Data(2),
					b: Required()
				}
			)).to.be.ok();
		});
		it('should handle renaming required property with no effect', function () {
			expect(equalTraits(
				trait({a:2, b:trait.required}).resolve({b: 'a'}),
				{
					a: Data(2),
					b: Required()
				}
			)).to.be.ok();
		});
		it('should handle renaming non-existing property with no effect', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a: 'c', d: 'c'}),
				{
					c: Data(1),
					b: Data(2),
					a: Required()
				}
			)).to.be.ok();
		});
		it('should handle exclusion of non-existing property with no effect', function () {
			expect(equalTraits(
				trait({a:1}).resolve({b:undefined}),
				{
					a: Data(1)
				}
			)).to.be.ok();
		});
		it('should be neutral with respect to required properties', function () {
			var actual = trait({ a: trait.required, b: trait.required, c: 'foo', d: 1 })
				, expected = { a: Required(), b: Required(), c: Data('foo'), d: Data(1) };

			expect(equalTraits(actual, expected)).to.be.ok();
		});
		it('should handle swapping of property names (ordering 1)', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({a:'b', b:'a'}),
				{
					a: Data(2),
					b: Data(1)
				}
			)).to.be.ok();
		});
		it('should handle swapping of property names (ordering 2)', function () {
			expect(equalTraits(
				trait({a:1, b:2}).resolve({b:'a', a:'b'}),
				{
					a: Data(2),
					b: Data(1)
				}
			)).to.be.ok();
		});
		it('should handle swapping of property names (ordering 3)', function () {
			expect(equalTraits(
				trait({b:2, a:1}).resolve({b:'a', a:'b'}),
				{
					a: Data(2),
					b: Data(1)
				}
			)).to.be.ok();
		});
		it('should handle swapping of property names (ordering 4)', function () {
			expect(equalTraits(
				trait({b:2, a:1}).resolve({a:'b', b:'a'}),
				{
					a: Data(2),
					b: Data(1)
				}
			)).to.be.ok();
		});
	});

	describe('trait.create()', function () {
		it('should instantiate a simple object', function () {
			var o1 = trait({
				a: 1,
				b: function () {
					return this.a;
				}
			}).create(Object.prototype);
			expect(Object.getPrototypeOf(o1)).to.equal(Object.prototype);
			expect(o1.a).to.equal(1);
			expect(o1.b()).to.equal(1);
			if (Object.keys) {
				expect(Object.keys(o1)).to.have.length(2);
			}
		});
		it('should instantiate an object that inherits from Array.prototype', function () {
			var o2 = trait({}).create(Array.prototype);
			expect(Object.getPrototypeOf(o2)).to.equal(Array.prototype);
		});
		it('should throw an exception for incomplete required properties', function () {
			try {
				trait({foo: Trait.required})
					.create(Object.prototype);
			} catch (err) {
				expect(err).to.be.a(Error);
			}
		});
		it('should throw an exception for unresolved conflicts', function () {
			try {
				trait.compose(trait({a:0}), trait({a:1}))
					.create({});
			} catch (err) {
				expect(err).to.be.a(Error);
			}
		});
		it('should set required properties to undefined', function () {
			var o4 = Object.create(Object.prototype, trait({foo: trait.required}));
			expect('foo' in o4).to.be.ok();
			try {
				o4.foo;
				expect.fail();
			} catch (err) {
				expect(err).to.be.a(Error);
			}
		});
		it('should ensure that conflicting properties are present', function () {
			var o5 = Object.create(Object.prototype,
				trait.compose(trait({a:0}), trait({a:1})));
			expect('a' in o5).to.be.ok();
			try {
				o5.a;
				expect.fail();
			} catch (err) {
				expect(err).to.be.a(Error);
			}
		});

		describe('inheritance', function () {
			it('should handle custom constructor and inherited toString()', function () {
				function Type () {
					return Object.create(Type.prototype);
				}
				Type.prototype = trait({
					method: function method () {
						return 2;
					}
				}).create(Type.prototype);

				var fixture = Type();

				expect(fixture.constructor).to.equal(Type);
				expect(fixture.toString()).to.equal('[object Type]');
			});
			it('should handle custom toString() and inherited constructor', function () {
				function Type () {
					return Object.create(Type.prototype);
				}
				Type.prototype = trait({
					toString: function toString () {
						return '<toString>';
					}
				}).create();

				var fixture = Type();

				expect(fixture.constructor).to.equal(trait);
				expect(fixture.toString()).to.equal('<toString>');
			});
			it('should handle custom toString() and constructor', function () {
				function Type () {
					return TypeTrait.create(Type.prototype);
				}
				var TypeTrait = trait({
					toString: function toString () {
						return '<toString>';
					}
				});

				var fixture = Type();

				expect(fixture.constructor).to.equal(Type);
				expect(fixture.toString()).to.equal('<toString>');
			});
			it('should handle resolving constructor', function () {
				var T1 = trait({constructor: Type}).resolve({constructor: '_foo'})
					, f1 = T1.create();

				function Type () {}

				expect(f1._foo).to.equal(Type);
				expect(f1.constructor).to.equal(trait);
				expect(f1.toString()).to.equal('[object Trait]');
			});
			it('should handle read-only composition', function () {
				function Type () {}
				Type.prototype = trait.compose(trait({}), {
					constructor: {value: Type},
					a: {
						value: 'b',
						enumerable: true
					}
				}).resolve({a: 'b'}).create({a: 'a'});

				var f1 = new Type();

				expect(Object.getPrototypeOf(f1)).to.equal(Type.prototype);
				expect(f1.constructor).to.equal(Type);
				expect(f1.toString()).to.equal('[object Type]');
				expect(f1.a).to.equal('a');
				expect(f1.b).to.equal('b');
				expect(Object.getOwnPropertyDescriptor(Type.prototype, 'a')).to.not.be.ok();

				var proto = Object.getPrototypeOf(Type.prototype)
					, dc = Object.getOwnPropertyDescriptor(Type.prototype, 'constructor')
					, db = Object.getOwnPropertyDescriptor(Type.prototype, 'b')
					, da = Object.getOwnPropertyDescriptor(proto, 'a');

				expect(dc.writable).to.not.be.ok();
				expect(dc.enumerable).to.not.be.ok();
				expect(dc.configurable).to.be.ok();
				expect(db.writable).to.not.be.ok();
				expect(db.enumerable).to.be.ok();
				expect(db.configurable).to.not.be.ok();
				expect(da.writable).to.be.ok();
				expect(da.enumerable).to.be.ok();
				expect(da.configurable).to.be.ok();
			});
		});
	});

});