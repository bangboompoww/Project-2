//___________________
//Dependencies
//___________________
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const db = mongoose.connection
const session = require('express-session')
const Notes = require('./models/notes.js')
require('dotenv').config()

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
app.get('/info', (req, res) => {
  res.render('index.ejs')
})

app.get('/notes',(req,res) => {
    res.render('notes.ejs')
})




//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('Listening on port:', PORT))