//___________________
//Dependencies
//___________________
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const db = mongoose.connection
const session = require('express-session')
const Manga = require('./models/manga.js')


require('dotenv').config()

const isAuthinticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/sessions/new')
  }
}
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003
//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
// Error / success
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI))
db.on('disconnected', () => console.log('mongo disconnected'))
//___________________
//Middleware
//___________________
//use public folder for static assets

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false })) // extended: false - does not allow nested objects in query strings
app.use(express.json()) // returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method')) // allow POST, PUT and DELETE from a form

//the first one is for files that arent in a folder in views 
app.use(express.static('public')); 
// the second one is for files that have folders // login and sign up
app.use("/public", express.static(__dirname + '/public'));


//___________________
// Routes
//___________________
const userController = require('./controllers/user_controllers.js')
app.use('/users', userController)


const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
//localhost:3000
app.get('/', (req,res) => {
  res.redirect('/sessions/new')
})

//manga to index route
app.get('/manga', (req,res) => {
  Manga.find({}, (error, allMangas) => {
    res.render(
      'index.ejs',
      {
        mangas: allMangas,
        currentUser: req.session.currentUser

      }
      
      )
  })
  
})
//seed
app.get('/finishedManga', async (req, res) => {
  const newManga =
    [
      {
        title: 'One piece Vol 78',
        description: 'With the fate of the people of Dressrosa on the line, the Straw Hats and their allies enter the final phase of the battle against the evil Doflamingo family. But when Luffy faces off against the toughest enemy he\s ever met, he\'ll have to reveal a brand-new ability!',
        img: 'https://images-na.ssl-images-amazon.com/images/I/61q8KZwNvlL._SX331_BO1,204,203,200_.jpg',

      }, {
        title: 'Death Note, Vol. 1: Boredom',
        description: 'Light tests the boundaries of the Death Note\'s powers as L and the police begin to close in. Luckily Light\'s father is the head of the Japanese National Police Agency and leaves vital information about the case lying around the house. With access to his father\'s files, Light can keep one step ahead of the authorities. But who is the strange man following him, and how can Light guard against enemies whose names he doesn\'t know?',
        img: 'https://images-na.ssl-images-amazon.com/images/I/51CWX6wNoaL._SX331_BO1,204,203,200_.jpg',
       
      }, {
        title: 'Code Geass: Lelouch of the Rebellion, Vol. 1',
        description: 'In the year 2010, the Holy Empire of Brittania declared war on Japan. Powerless to stop them, Japan surrendered in less than a month. Freedom was lost and Japan was renamed "Area 11" and its people became known as "Elevens." Lelouch is a Brittanian and his friend Suzaku, born an eleven, has achieved the status of honorary Brittanian. As a boy Lelouch vowed to crush his own government, but now seven years later and in high school, he\'s accepted that he can\'t change anything. That is until he meets a mysterious girl that gives him the power to control people\'s minds - the power of Geass! He dons a mask and becomes the ruthless terrorist known only as Zero, destroying any who might stand in his path - including his boyhood friend Suzaku!',
        img: 'https://images-na.ssl-images-amazon.com/images/I/517gIIay53L._SX344_BO1,204,203,200_.jpg',
      }
    ]

  try {
    const seedItems = await Manga.create(newManga)
    res.send(seedItems)
  } catch (err) {
    res.send(err.message)
  }
})
//create
app.post('/manga', (req,res) => {
  Manga.create(req.body, (error,createdProduct) => {
    res.redirect('/manga')
  })
})

app.get('/manga/new', (req,res) => {
  res.render(
    'new.ejs',
   { currentUser: req.session.currentUser}
  )
})
//read and show
app.get('/manga/:id', (req,res) => {
  Manga.findById(req.params.id, (error,theManga) => {
    res.render(
      'show.ejs',
      {
        mangas: theManga,
        currentUser: req.session.currentUser

      }
    )
  })
})

//update and edit
app.put('/manga/:id', (req,res) => {
  Manga.findByIdAndUpdate(req.params.id, req.body, (err, updatedManga)=> {
    res.redirect('/manga')
})
})
app.get('/manga/:id/edit', (req,res) => {
  Manga.findById(req.params.id, (error, editMangas) => {
    res.render(
        'edit.ejs',
        {
          manga: editMangas,
          currentUser: req.session.currentUser

        }

    )
  })
})

//delete
app.delete('/manga/:id', (req,res) => {
  Manga.findByIdAndRemove(req.params.id, (err,data) => {
    res.redirect('/manga')
  })
})



//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('Listening on port:', PORT))