var test = require('tape')
var walk = require('../index')

test('tree', function (t) {
  var db = {}
  db[0] = {key: 0, value: 1}
  db[1] = {key: 1, value: 2, kids: [0]}
  db[2] = {key: 2, value: 3, kids: [4]}
  db[3] = {key: 3, value: 4, kids: [2]}
  db[4] = {key: 4, value: -1, kids: [0, 1]}

  var seenValues = []

  var expected = [4, 3, -1, 1, 2, 1]

  function visit (key, add, done) {
    lookupKey(key, function (err, node) {
      if (err) return done(err)
      seenValues.push(node.value)
      // console.log('KEY', key, 'VALUE', node.value)
      if (node.kids) {
        node.kids.forEach(add)
      }
      done()
    })
  }

  function lookupKey (key, cb) {
    setTimeout(function () {
      cb(null, db[key])
    }, Math.floor(Math.random() * 100))
  }

  walk([3], visit, function done () {
    // console.log('all done')
    t.deepEqual(seenValues, expected)
    t.end()
  })
})

test('error in traversal', function (t) {
  walk([3], visit, function done (err) {
    t.ok(err)
    t.equal(err.message, 'bogus')
    t.end()
  })

  function visit (key, add, done) {
    done(new Error('bogus'))
  }
})
