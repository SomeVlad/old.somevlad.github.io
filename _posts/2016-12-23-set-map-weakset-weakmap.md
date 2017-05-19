---
layout:     post
title:      Set, Map, WeakSet and WeakMap
date:       2016-12-23 18:00:00
summary:    New collection types appeared in ES-2015.
permalink:  /set-map-weakset-and-weakmap/
---

### Map

`Map` is a collection for storing `key: value` pairs.

Unlike objects in which the key can only be a string, in the `Map` 
key can be of other types, for example:

```js
'use strict';

let map = new Map();

map.set('1', 'str1');   // key is a string
map.set(1, 'num1');     // number
map.set(true, 'bool1'); // boolean 

// this would be the same in ordinary object,
// map saves the type
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3
```

As can be seen from the example above, `get` and `set` methods are used for storing and reading values. 
And both keys and values are stored "as is", with no type conversions.

`map.size` property stores the total number of entries in map.

`set` method is chainable:

```js
map
  .set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');
```

When you create a `Map`, you can immediately initialize it with a list of values:

```js
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);
```

`Map`'s argument should be iterable (not necessarily an array). Maximum flexibility, duck typing everywhere.

You can even use objects as keys:

```js
'use strict';

let user = { name: "John" };

// keep visit counts for each user
let visitsCountMap = new Map();

// user object is a key in visitsCountMap
visitsCountMap.set(user, 123);

alert( visitsCountMap.get(user) ); // 123
```

Using objects as keys – is exactly the case when the `Map` cannot be replaced with `Object`.

### How map compares keys

To test for equality map uses [SameValueZero](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-samevaluezero) algorithm. 
It's like `===`, the only difference is that `NaN` is equal to `NaN`, so you can use it as key (don't).  
Also you can't change this algorithm.

How to delete entries:

*   `map.delete(key)` deletes entry with `key` key and returns `true` if that entry existed and `false` otherwise.
*   `map.clear()` – deletes all entries, clears map.

How to check if key exists:

*   `map.has(key)` – returns `true` if key exists and `false` otherwise.

### Iteration

There are three methods for iterating a map:

*   `map.keys()` – returns iterateable object for keys,
*   `map.values()` – returns iterateable object for values,
*   `map.entries()` – returns iterateable object for `[key, value]`, used by default in `for..of`.

Example:

```js
'use strict';

let recipeMap = new Map([
  ['cucumbers',   '500 g'],
  ['tomatoes', '350 g'],
  ['sour cream',   '50 g']
]);

// loop through keys
for(let fruit of recipeMap.keys()) {
  alert(fruit); // cucumbers, tomatoes, sour cream
}

// loop through values [key, value]
for(let amount of recipeMap.values()) {
  alert(amount); // 500 g, 350 g, 50 g
}

// loop through entries
for(let entry of recipeMap) { // same as recipeMap.entries()
  alert(entry); 
// ['cucumbers', '500 g'] and so on, arrays with two values
}
```

Also it's worth noticing that map objects keep ordering (unlike Objects).

Moreover, map objects have built in `forEach` method, like arrays have:

```js
'use strict';

let recipeMap = new Map([
  ['cucumbers',   '500 g'],
  ['tomatoes', '350 g'],
  ['sour cream',   '50 g']
]);

recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumbers: 500 g, and so on
});
```

### Set

`Set` is a collection for keeping multiple unique values.

For example, we have visitors and we would like to save each of them. 
Repeated visits should not be counted, every visitor must be counted only once.

`Set` is perfect for that:

```js
'use strict';

let set = new Set();

let vasya = {name: "Vasya"};
let petya = {name: "Petya"};
let dasha = {name: "Dasha"};

// visits
set.add(vasya);
set.add(petya);
set.add(dasha);
set.add(vasya);
set.add(petya);

// set saves unique values only
alert( set.size ); // 3

set.forEach( user => alert(user.name ) ); // Vasya, Petya, Dasha
```

In the example above multiple addition of the same object to the set does not result in copies.

Closest alternative to `Set` is using an array and checking for duplicates on each insertion and that's very bad for the performance. 
Or standard objects can be used, if we store some unique id for each visitor as keys in it. But it is not nearly as convenient as `Set`.

Main methods:

*   `set.add(item)` – adds item to the collection, returns set (chainable).
*   `set.delete(item)` – deletes item from set. Returns `true` if item was found in the set and `false` otherwise.
*   `set.has(item)` – returns `true` if set has item and `false` otherwise.
*   `set.clear()` – clears set.

`Set` can be iterated through with `forEach` or `for..of` similarly to `Map`:

```js
'use strict';

let set = new Set(["oranges", "apples", "bananas"]);

// same as for(let value of set)
set.forEach((value, valueAgain, set) => {
  alert(value); // oranges, apples, bananas
});
```

Two value parameters (they are equal) are used for compatibility with `Map`.

### WeakMap and WeakSet

`WeakSet` is a special type of `Set` which doesn't prevent garbage collector from deleting its elements. Same goes for `WeakMap` and `Map`.

So if some object exists in `WeakSet`/`WeakMap` only – it will be erased from memory. 
 
It can be important in situations when you store and use objects somewhere else in the code and here you want to only keep subsidiary data, that is meaningful unless the object doesn't exist.

I guess, there must be an example, so here it is: 

we have some users and we want to store some subsidiary data for them, e.g. event handlers or simply some information. 
This information won't make sense without users. If we store such data in `WeakMap`, it will be erased automagically 
when element is deleted.

```js
// active users right now
let activeUsers = [
  {name: "Vasya"},
  {name: "Petya"},
  {name: "Masha"}
];

// subsidiary info,
// which is not included in user info
// and being stored separately
let weakMap = new WeakMap();

weakMap[activeUsers[0]] = 1;
weakMap[activeUsers[1]] = 2;
weakMap[activeUsers[2]] = 3;

alert( weakMap[activeUsers[0]] ); // 1

activeUsers.splice(0, 1); // Vasya is not an active user anymore

// weakMap now contains 2 elements

activeUsers.splice(0, 1); // Petya is not an active user anymore

// weakMap now contains 1 element
```

That way `WeakMap` saves us from having to manually delete subsidiary data when the main object is deleted.

It wouldn't be JavaScript if `WeakMap` has no special limitations, right?

*   No `size` property.
*   You can't iterate through it.
*   No `clear` method.

In other words, `WeakMap` works with write (set, delete) and read (get, has) methods for elements by a **certain key**, 
so it's not a fully accessible collection. You can not see its contents, there are no methods to do that.

The reason is that `WeakMap`'s contents may be modified by a garbage collector at any time, 
regardless of the programmer. Garbage collector works by itself. It doesn't guarantee that it will clean up an object 
as soon as possible. Also it doesn't guarantee the opposite. 
There is no certain moment when this cleaning happens – 
it is determined by collector's internal algorithms and system information.

So basically `WeakMap`'s contents is not defined at any given moment. 
Maybe garbage collector has already deleted some entries, maybe not. 
That's the reason there are no methods accessing its entire contents.

Same goes for `WeakSet`: you can add elements and check if there are certain ones, 
but you can't get the full list of them and even get the amount of them.

### Conclusion

*   `Map` is the collection of `key: value` pairs. It's better than `Object` because it's iterated through 
in the exact order elements were put there and also it accepts any types of data as its keys.
*   `Set` is a collection of unique elements, it also accepts any type of key.
*   `WeakMap` and `WeakSet` are pared down versions of `Map` and `Set`, which allows to have targeted 
access to certain elements (by key or value). They don't prevent garbage collector from its work, so if the reference 
to object remains only in `WeakSet`/`WeakMap` – it will be destroyed.