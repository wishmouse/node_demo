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
var saveTheCats = function (filename, allTheCats, callback) {
  fs.writeFile(filename, JSON.stringify(allTheCats), function(err, savedCats) {
    if (err) { throw err }
    else     { callback(null, savedCats) }
  })

}

// Complete this function so that it reads the `db/cats.json`
var findTheCats = function (filename, callback) {
  fs.readFile(filename, 'utf8' , function(err, allTheCats) {
    if (err) { throw err }
    else     { callback (null, JSON.parse(allTheCats)) }
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
var getCatPhotoLinks = function (callback) {
  request.get(query, function(err, response, body) {
    if (err) { throw err }
    else     {callback(null, JSON.parse(body).photos.photo) }
  })
}


exports = module.exports = {
  cats: cats,
  dbPath: CAT_DB,
  saveTheCats: saveTheCats,
  findTheCats: findTheCats,
  getCatPhotoLinks: getCatPhotoLinks
}
