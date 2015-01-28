A light trait composition library based on `Object.create`. This is a fork of [light-traits](https://github.com/Gozala/light-traits) to improve overall flexibility, as well as add basic polyfills for `Object.create` and property descriptor handling.

## Usage

```js
var Trait = require('trait');

var T = Trait.compose(
  require('../shared/baseTrait'),
  Trait({
    someProp: Trait.required,
    someMethod: function () {
      console.log(this.someProp + ' world!');
    }
  })
);

module.exports = function () {
  return T.create(Object.prototype, {
    someProp: 'hello'
  });
};
```

## Traits

Traits are a simple mechanism for representing reusable and composable functionality. They are more robust alternatives to *mixins* and *multiple inheritance* because name clashes must be explicitly resolved, and because composition is commutative and associative (ie. the order of traits in a composition is irrelevant).

Use traits to share functionality between similar objects without duplicating code or creating complex inheritance chains.

### Trait Creation

To create a trait, call the `Trait` factory function exported by this module, passing it an object that specifies the properties of the trait.

```js
var t = Trait({
  foo: Trait.required,
  bar: function bar () {
    return this.foo;
  },
  baz: 'baz'
});
```

Traits can both provide and require properties. A *provided* property is a property for which the trait itself provides a value. A *required* property is a property that the trait needs in order to function correctly but for which it doesn't provide a value.

Required properties must be provided by another trait or by an object with a trait. Creation of an object with a trait will fail if required properties are not provided. Specify a required property by setting the value of the property to `Trait.required`.

### Object Creation

Create objects with a single trait by calling the trait's `create` method. The method takes two arguments, the object to serve as the new object's prototype, and an optional object defining properties of the new object. If no prototype is specified, the new object's prototype will be `Object.prototype`.

```js
var myTrait = Trait({
  foo: 'foo',
  bar: 2
});
var foo1 = t.create();
var foo2 = t.create(Object.prototype, {
  baz: 'baz'
});
```

### Trait Composition

Traits are designed to be composed with other traits to create objects with the properties of multiple traits. To compose an object with multiple traits, you first create a composite trait and then use it to create the object. A composite trait is a trait that contains all of the properties of the traits from which it is composed.

```js
var tBase = Trait({
  foo: Trait.required,
  id: function () {
    return this.foo;
  }
});
var tBaseFoo = Trait({
  foo: 'foo'
});

var tFoo = Trait.compose(tBase, tBaseFoo);
```

### Trait Resolution

Composite traits have conflicts when two of the traits in the composition provide properties with the same name but different values (when compared using the `===` strict equality operator).

```js
var t1 = Trait({
  foo: 'foo',
  bar: 'bar'
});
var t2 = Trait({
  bar: 'foo',
});

var tc = Trait.compose(t1, t2); => Error 'remaining conflicting property'
```

Attempting to create an object from a composite trait with conflicts throws a `remaining conflicting property` exception. To create objects from such traits, you must first resolve the conflict.

Conflit resolution is achieved by excluding or renaming the conflicting property of one of the traits. Excluding a property removes it from the composition, so the composition only acquires the property from the other trait. Renaming a property gives it a new, non-conflicting name at which it can be accessed.

In both cases, you call the `resolve` method on the trait whose property you want to exclude or rename, passing it an object. Each key in the object is the name of a conflicting property: each value is either `null` to exclude the property, or a string representing the new name of the property.

For example, the conflict in the previous example could be resolved by excluding the `bar` property of the first trait:

```js
var tc = Trait(t1.resolve({bar: null}), t2);
```

It could also be resolved by renaming the `bar` property of the first trait:

```js
var tc = Trait(t1.resolve({bar: 'bar2'}), t2);
```

When you resolve a conflict, the same-named property of the other trait (the one that wasn't excluded or renamed) remains available in the composition under its original name.