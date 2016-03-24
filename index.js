'use strict'

require('dotenv').config()

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express        = require('express') // import express.js
var hbs            = require('express-hbs') // handlebars
var bodyParser     = require('body-parser') // parse request bodies
var path           = require('path') // work with file paths
var methodOverride = require('method-override') // allow put, delete through post

var app = express() // create the express application
var server = require('http').createServer(app) // create the server

var cats = require('./cats') // import the cat functions

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layout'
}))

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

app.get('/', function (req, res) {
  res.redirect('/cats')
})

// List all cats
app.get('/cats', function (req, res) {
  cats.findTheCats(cats.dbPath, function(err, data){
    var obj = {cats: data}
    res.render('cats/index', obj)
  })
})

// Display the new cat form
app.get('/cats/new', function (req, res) {
  // RELEASE 2
  // Use `cats.getCatPhotoLinks` to get six cat image links
  // then pass them to the `cats/new` template and render it
  cats.getCatPhotoLinks(function(err, data) {
    var obj = {
      photos: data
    }
    res.render('cats/new', obj)
  })
})

// Show detail for cat with id === :id
// Try going to /cats/1
app.get('/cats/:id', function (req, res) {
  catHit(req.params.id, function(err, renderPath, theCat){
    if (theCat) {
      res.render(renderPath, theCat)
    } else {
      res.render(renderPath)
    }
  })
})

// Display the edit form for cat with id === :id
// Try going to /cats/1/edit
app.get('/cats/:id/edit', function (req, res) {
  getCatById(req.params.id, function (err, oneCat) {
    res.render('cats/edit', oneCat)
  })
})

// Update the cat with id === :id
// You can reach this with a PATCH or with a POST passing
// a key-value pair: _method=PATCH
// See the home page for an example
app.post('/cats/:id', function (req, res) {
  cats.findTheCats(cats.dbPath, function (err, allTheCats) {
    for (var i in allTheCats) {
      if (Number(allTheCats[i].id) === Number(req.params.id)) {
        allTheCats[i].name = req.body.name
        allTheCats[i].life_story = req.body.life_story
        allTheCats[i].image = req.body.image
      }
    }
    cats.saveTheCats(cats.dbPath, allTheCats, function (err, data) {
      res.redirect('/cats/' + req.params.id)
    })
  })
})

// Delete the cat with id === :id
// You can reach this with a DELETE or with a POST passing
// a key-value pair: _method=DELETE
// See the home page for an example
app.delete('/cats/:id', function (req, res) {
  killCat(req.params.id, function(){
      res.redirect('/cats')
  })
})

// Handle the posted form data
app.post('/cats', function (req, res) {
  cats.findTheCats(cats.dbPath, function(err, data){
    var cat = {}
    cat.id = newID(data)
    cat.name = req.body.name
    cat.life_story = req.body.life_story
    cat.image = req.body.catPhotos
    cat.lives = 2
    data.push(cat)
    cats.saveTheCats(cats.dbPath, data, function(err, data) {
      res.redirect('/cats/' + cat.id)
    })
  })
})

// Start the app only when run with npm start
// Don't run it when imported into the tests
if (require.main === module) {
  server.listen(3000, function () {
    console.log('Meowtown now purring at port 3000!')
  })
}

// For testing purposes
exports = module.exports = app

//helper functions
function getCatById(catId, callback){
  cats.findTheCats(cats.dbPath, function(err, allTheCats) {
    if (err) {
      callback(err)
      return
    }
    var oneCat = allTheCats.filter(function(theCat){
      return Number(theCat.id) === Number(catId)
    })
    if (oneCat.length < 1)
      callback(null, -1)
    else
      callback(null, oneCat[0])
  })
}

function newID(allTheCats) {
  var rdmIDfound = true
  var newRdmID = Math.floor(Math.random()*9000) + 1000

  do {
    rdmIDfound = true
    for (var i in allTheCats) {
      if ( Number(allTheCats[i].id) === newRdmID) {
        rdmIDfound = false
        console.log(newRdmID)
        newRdmID = Math.floor(Math.random()*9000) + 1000
        console.log(newRdmID)
        break
      }
    }
  } while (!rdmIDfound)

  return newRdmID
}

function catHit(id, callback) {
  cats.findTheCats(cats.dbPath, function(err, allTheCats) {
    var theCat
    console.log("all cats: ", allTheCats)
    console.log("id: ", id, " typeof: " , typeof id)
    for (var i = 0; i < allTheCats.length; i++) {
      if (Number(id) === Number(allTheCats[i].id)){
        theCat = allTheCats[i]
        break
      }
    }
    console.log("the cat", theCat)
    if (theCat.lives <= 1) {
      killCat(id, function(){
        callback(null, 'cats')
      })

    } else {
      theCat.lives--
      cats.saveTheCats(cats.dbPath, allTheCats, function (err, data) {
        callback(null, 'cats/show', theCat)
      })
    }
  })
}

function killCat(id, callback){
  cats.findTheCats(cats.dbPath, function (err, allTheCats) {

    var lessCats = allTheCats.filter(function (oneCat) {
      return Number(oneCat.id) !== Number(id)
    })
    cats.saveTheCats(cats.dbPath, lessCats, function (err, data) {
      callback("done")
    })
  })
}
