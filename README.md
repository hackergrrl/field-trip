# field-trip

> walk a directed graph async without knowing its structure ahead of time

## Background

There are plenty of modules for traversing

1. file systems
2. arrays
3. trees

so long as their structure is known ahead of time. What if you require the asynchronous
process of visiting a node in order to learn of its children?

## Usage

Let's take a field trip through a tree, pretending to be ignorant of its
structure up front:

```js
var fieldtrip = require('field-trip')

var db = {}
db[0] = {key: 0, value: 1, kids: []}
db[1] = {key: 1, value: 2, kids: [0]}
db[2] = {key: 2, value: 3, kids: [4]}
db[3] = {key: 3, value: 4, kids: [2]}
db[4] = {key: 4, value: -1, kids: [0, 1]}

// Begin taking a field trip through this unknown structure!
fieldtrip([3], visit, function () {
  console.log('all done')
})

// Visit a single node. 'add' to add children; 'done' when finished visting.
function visit (key, add, done) {
  lookupKey(key, function (err, node) {
    if (err) return done(err)

    console.log('KEY', key, 'VALUE', node.value)

    node.kids.forEach(add)

    done()
  })
}

// Look up a key through some intensive asynchronous process.
function lookupKey (key, cb) {
  setTimeout(function () {
    cb(null, db[key])
  }, Math.floor(Math.random() * 100))
}
```

This will output

```
KEY 3 VALUE 4
KEY 2 VALUE 3
KEY 4 VALUE -1
KEY 0 VALUE 1
KEY 1 VALUE 2
KEY 0 VALUE 1
all done
```

## API

```js
var fieldtrip = require('field-trip')
```

### fieldtrip(origins, visit, finish)

Calls the function `visit` on each element in the array `origins`.

Each call to visit expects the signature `function (node, add, done)`, where
`add` can be called with another node to visit, and `done` **MUST** be called to
signal that this node's visitation has completed. Call `done(err)` to signal an
error and end the traversal.

`finish` is called when either all nodes have been visited, or an error has
occurred.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install field-trip
```

## Thanks!

Thanks to chrisdickenson's
[walk-dag](https://github.com/chrisdickinson/walk-dag) module, which was the
closest I could find to this. Example and tests are mostly stolen from his work.
:)

## License

ISC
