//dependencies
const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
// this will be for when we place the users in the database collection
const User = require('../models/users.js')

//sign up and login form



//getting the form from sign up
//this will display the login form
sessions.get('/new', (req,res) => {
    res.render('sessions/new.ejs')})

// sessions.post wil show us the aftermath from logining in

sessions.post('/', (req,res) => {
     //username is found and the password matches
    //sucessful login

    User.findOne({username: req.body.username}, (err, userFound) => {
        // if statement to see if there is an error or match at login
        if(err){
            console.log(err);
            res.send('oops the db had a problem')
        } else if(!userFound) {
            res.send('<a href="/"> Sorry, no user found</a>')
        } else {
            // user is found
            // check to see if passwords match 
            if(bcrypt.compareSync(req.body.password, userFound.password)){
                req.session.currentUser = userFound
                res.redirect('/')
            }else{
               //if the password doesnt match
               res.send('<a href="/notes">Sorry password does not match</a>')
            }

        }
    })
})

//this destroys the cookie we created 
sessions.delete('/', (req,res) => {
    req.session.destory(() => {
        res.redirect('/')
    })
})


module.exports = sessions


