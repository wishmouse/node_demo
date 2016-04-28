'use strict'

var test    = require('tape')
var request = require('supertest')
var fs      = require('fs')
var path    = require('path')
var cheerio = require('cheerio')

var app  = require('../index')
var cats = require('../cats')

var CAT_TEST_DB = path.join(__dirname, '../db/test_cats.json')

var TEST_CATS = [
    { id: 1, name: "Fluffy" },
    { id: 2, name: "Muffy" },
    { id: 3, name: "Morris"}
  ]

var BLANK_DB = []

test('saveTheCats', function (t) {

  fs.writeFileSync(CAT_TEST_DB, JSON.stringify(BLANK_DB))
  cats.saveTheCats(CAT_TEST_DB, TEST_CATS, function(err, data) {
    var results = fs.readFileSync(CAT_TEST_DB, 'utf-8')
    t.equal(results, JSON.stringify(TEST_CATS), 'All cats saved!')
    t.error(err)
    t.end()
  })


})

test('findTheCats', function (t) {
  fs.writeFileSync(CAT_TEST_DB, JSON.stringify(TEST_CATS))
  cats.findTheCats(CAT_TEST_DB, function(err, data) {
    t.equal(data && data.length, 3, 'All cats found!')
    t.error(err)
    t.end()

  fs.writeFile(CAT_TEST_DB, JSON.stringify(BLANK_DB), function (err) {
    if (err) { return t.end(err) }
    cats.saveTheCats(CAT_TEST_DB, TEST_CATS, function (err) {
      t.error(err, 'No Error')
      fs.readFile(CAT_TEST_DB, 'utf-8', function (err, results) {
        if (err) { return t.end(err) }
        t.equal(results, JSON.stringify(TEST_CATS), 'All cats saved!')
        t.end()
      })
    })
  })
})

test('findTheCats', function (t) {
  fs.writeFile(CAT_TEST_DB, JSON.stringify(TEST_CATS), function (err) {
    if (err) { return t.end(err) }
    cats.findTheCats(CAT_TEST_DB, function (err, results) {
      t.error(err, 'No error')
      if (results) {
        t.equal(results.cats && results.cats.length, 3, 'All cats found!')
      }
      t.end()
    })
>>>>>>> master:tests/cats.js
  })
})

test('GET /cats/new', function (t) {
  request(app)
    .get('/cats/new')
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .end(function (err, res) {
      // res.text should be the output of your template
      // write a test here to ensure that there are six images representing
      // the six cats in your output. You'll probably want a Regex.
      var $ = cheerio.load(res.text)
      var links = $('img')

      t.equal(links.length, 6, "the number of links in the page is 6")
      t.end()
    })

})
