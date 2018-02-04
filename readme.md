# callbag-sample

Callbag operator that samples a value from the pullable source only when a listenable source emits, and returns a listenable source.

`npm install callbag-sample`

## example

Sample the next character from a string, every second:

```js
const fromIter = require('callbag-from-iter');
const interval = require('callbag-interval');
const forEach = require('callbag-for-each');
const sample = require('callbag-sample');

const source = sample(interval(1000))(fromIter('hello'));

forEach(x => console.log(x))(source); // h
                                      // e
                                      // l
                                      // l
                                      // o
```
