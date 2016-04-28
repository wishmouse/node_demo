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


// Redirect to /cats
app.get('/', function (req, res) {
  res.redirect('/cats')
})


// List all cats [render]
app.get('/cats', function (req, res) {

  cats.findTheCats(cats.dbPath, function(err, allTheCats){
    res.render('cats/index', {cats: allTheCats})
  })
})


// Display the new cat form
app.get('/cats/new', function (req, res) {
  cats.getCatPhotoLinks(function(err, data) {
    res.render('cats/new', {photos: data})
  })
})


// Show detail for cat with id === :id
app.get('/cats/:id', function (req, res) {
  getCatById(req.params.id, function (err, oneCat) {
    reduceCatsLife(req.params.id, function (injuredCat) {
      removeDeadCats(function () {

        if (injuredCat.lives < 1)
              { res.redirect('/cats') }
        else  { res.render("cats/show", injuredCat) }

      })
    })
  })
})


// Display the edit form for cat with id === :id
app.get('/cats/:id/edit', function (req, res) {
  getCatById(req.params.id, function (err, oneCat) {
    res.render('cats/edit', oneCat)
  })
})


// Handle the posted form data
app.post('/cats', function (req, res) {
  cats.findTheCats(cats.dbPath, function(err, allTheCats) {

    var cat = {}
    cat.id = newID(allTheCats)
    cat.name = req.body.name
    cat.life_story = req.body.life_story
    cat.image = req.body.catPhotos
    cat.lives = 10
    allTheCats.push(cat)

    cats.saveTheCats(cats.dbPath, allTheCats, function(err, data) {
      res.redirect('/cats/' + cat.id)
    })
  })
})


// Update the cat with id === :id
app.post('/cats/:id', function (req, res) {
  cats.findTheCats(cats.dbPath, function (err, allTheCats) {

    for (var i in allTheCats) {
      if ( Number(allTheCats[i].id) === Number(req.params.id) ) {
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
app.delete('/cats/:id', function (req, res) {
  killCatByID(req.params.id, function() {
    res.redirect('/cats')
  })
})


// Start the app only when run with npm start
if (require.main === module) {
  server.listen(3000, function () {
    console.log('Meowtown now purring at port 3000!')
  })
}


// For testing purposes
exports = module.exports = app


//helper functions
function getCatById (catId, callback) {
  cats.findTheCats(cats.dbPath, function(err, allTheCats) {

    var oneCat = allTheCats.filter(function(theCat){
      return Number(theCat.id) === Number(catId)
    })

    callback(null, oneCat[0])
  })
}


// Create a new unique id (check no other cat has that id)
function newID(allTheCats) {
  var rdmIDfound = true
  var newRdmID = Math.floor(Math.random()*9000) + 1000

  do {
    rdmIDfound = true
    for (var i in allTheCats) {
      if (allTheCats[i].id === newRdmID) {
        rdmIDfound = false
        newRdmID = Math.floor(Math.random()*9000) + 1000
        break
      }
    }
  } while (!rdmIDfound)

  return newRdmID
}


// Kill one cat which has a particular id
function killCatByID (catsID, callback) {
  cats.findTheCats(cats.dbPath, function (err, allTheCats) {

    var lessCats = allTheCats.filter(function (cat) {
      return cat.id !== Number(catsID)
    })

    cats.saveTheCats(cats.dbPath, lessCats, function (err, savedCats) {
      callback()
    })
  })
}


function reduceCatsLife(catsID, callback) {
  cats.findTheCats(cats.dbPath, function (err, allTheCats) {
    var oneCat = {}

    for (var i in allTheCats) {
      if (allTheCats[i].id === Number(catsID) ) {
        allTheCats[i].lives = allTheCats[i].lives - 1

        oneCat.id = allTheCats[i].id
        oneCat.name = allTheCats[i].name
        oneCat.image = allTheCats[i].image
        oneCat.life_story = allTheCats[i].life_story
        oneCat.lives = allTheCats[i].lives
      }
    }

    cats.saveTheCats(cats.dbPath, allTheCats, function (err, savedCats) {
      callback(oneCat)
    })
  })
}


function removeDeadCats(callback) {
  cats.findTheCats(cats.dbPath, function (err, allTheCats) {

    var lessCats = allTheCats.filter(function (cat) {
      return cat.lives > 0
    })

    cats.saveTheCats(cats.dbPath, lessCats, function (err, savedCats) {
      callback()
    })
  })
}
