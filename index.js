module.exports = function (origins, visit, finish) {
  var pending = 0
  var finished = false

  function walk (key) {
    pending++

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

      pending--

      if (queue.length > 0) {
        queue.forEach(walk)
      } else {
        if (pending === 0) {
          finish()
        }
      }
    }
  }

  origins.forEach(walk)
}
