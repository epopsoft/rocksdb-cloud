const test = require('tape')
const fs = require('fs')
const leveldown = require('..')
const makeTest = require('./make')

test('test argument-less repair() throws', function (t) {
  t.throws(leveldown.repair, {
    name: 'Error',
    message: 'repair() requires `location` and `callback` arguments'
  }, 'no-arg repair() throws')
  t.end()
})

test('test callback-less, 1-arg, repair() throws', function (t) {
  t.throws(leveldown.repair.bind(null, 'foo'), {
    name: 'Error',
    message: 'repair() requires `location` and `callback` arguments'
  }, 'callback-less, 1-arg repair() throws')
  t.end()
})

test('test repair non-existent directory returns error', function (t) {
  leveldown.repair('/1/2/3/4', function (err) {
    t.ok(/^Error:/i.test(err), 'error on callback')
    t.end()
  })
})

// a proxy indicator that RepairDB is being called and doing its thing
makeTest('test repair() compacts', function (db, t, done) {
  const location = db.location

  db.close(function (err) {
    t.ifError(err, 'no error from close()')

    let files = fs.readdirSync(location)
    t.ok(files.some(function (f) { return (/\.log$/).test(f) }), 'directory contains log file(s)')
    t.notOk(files.some(function (f) { return (/\.sst$/).test(f) }), 'directory does not contain sst file(s)')

    leveldown.repair(location, function (err) {
      t.ifError(err, 'no error from repair()')

      files = fs.readdirSync(location)
      t.notOk(files.some(function (f) { return (/\.log$/).test(f) }), 'directory does not contain log file(s)')
      // t.ok(files.some(function (f) { return (/\.sst$/).test(f) }), 'directory contains sst file(s)')

      done(null, false)
    })
  })
})
