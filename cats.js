var fs    = require('fs')
var path  = require('path')

var cats = {
  cats: [
    { id: 1, name: 'Fluffy' },
    { id: 2, name: 'Tick' }
  ]
}

// This is the filename for the cats db
var CAT_DB = path.join(__dirname, 'db/cats.json')

// Complete this function so that it converts the `cats`
// object above to a JSON string and writes it to the
// `db/cats.json` file.
var saveTheCats = function (filename, cats) {
  return false
}

// Complete this function so that it reads the `db/cats.json`
// file and returns its contents *as JSON*
var findTheCats = function (filename) {
  return false
}

exports = module.exports = {
  cats: cats,
  dbPath: CAT_DB,
  saveTheCats: saveTheCats,
  findTheCats: findTheCats
}
