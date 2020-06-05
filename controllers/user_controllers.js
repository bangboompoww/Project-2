const bcrypt = require('bcrypt')
const express = require('express')
const User = require('../models/users.js')

//configurations
const users = express.Router()


//CRUD: Create
//users post route
users.get('/new', (req,res) => {
    res.render('users/new.ejs')
})


users.post('/', (req,res) => {
    console.log('what our user entered', req.body.password);
    // we need to overwrite the users password with the hashed password with hashSync then salt it
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    console.log('what it will be encrypted into', req.body.password);

    // add users to database
    User.create(req.body, (createdUser) => {
        console.log('user is created', createdUser);
        res.redirect('/sessions/new')
    })
})


module.exports = users