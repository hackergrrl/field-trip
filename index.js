module.exports = function (origins, visit, finish) {
  var pending = 0
  var finished = false

  var theQueue = []

  function walk () {
    var key = theQueue.shift()

    visit(key, add, done)

    var queue = []

    function add (item) {
      queue.push(item)
    }

    function done (err) {
      if (finished) {
        return
      }
      if (err) {
        finished = true
        return finish(err)
      }

      theQueue = queue.concat(theQueue)
      if (theQueue.length === 0) {
        return finish()
      }

      walk()
    }
  }

  theQueue = theQueue.concat(origins)
  walk(theQueue[0])
}
