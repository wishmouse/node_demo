var fs      = require('fs')
var path    = require('path')
var request = require('request')
var dotenv = require('dotenv')
dotenv.load()

// This is the filename for the cats db
var CAT_DB = path.join(__dirname, 'db/cats.json')

var cats = []

// ---------- RELEASE 1 ---------- //

// Complete this function so that it converts the `cats`
// object above to a JSON string and writes it to the
// `db/cats.json` file.
var saveTheCats = function (filename, cats, callback) {

  fs.writeFile(filename, JSON.stringify(cats), function(err, data) {
    if (err) {
      callback(err)
      return
    }
    callback(null, data)
  })

}

// Complete this function so that it reads the `db/cats.json`
// file and returns its contents *as JSON*
var findTheCats = function (filename, callback) {
  fs.readFile(filename, 'utf8' , function(err, data) {
    if (err) {
      callback(err)
      return
    }
    callback (null, JSON.parse(data))
  })
}

// ---------- RELEASE 2 ---------- //

// See https://www.flickr.com/services/api/flickr.photos.search.html
var query = [
  'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=',
  process.env.FLICKR_APP_KEY,
  '&tags=cat&per_page=6&format=json&nojsoncallback=1'
].join('')

// Complete this to get the photo links from Flickr.
// Where you gonna call this from? What's the callback for?
var getCatPhotoLinks = function (callback) {
  request.get(query, function(err, response, body) {
    if (err) {
      callback(err)
      return
    }
    callback(null, JSON.parse(body).photos.photo)
  })
}

exports = module.exports = {
  cats: cats,
  dbPath: CAT_DB,
  saveTheCats: saveTheCats,
  findTheCats: findTheCats,
  getCatPhotoLinks: getCatPhotoLinks
}

