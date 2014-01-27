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

var ERR_CONFLICT = "Remaining conflicting property: ";
var ERR_REQUIRED = "Missing required property: ";

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
	describe('trait() instance creation', function () {
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
					a: Required("a"),
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
					, get = Object.getOwnPropertyDescriptor(record, "a").get
					, set = Object.getOwnPropertyDescriptor(record, "a").set;

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
	})
});