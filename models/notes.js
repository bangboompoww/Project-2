const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  body: String 
})

const Notes = mongoose.model('Notes', noteSchema)

module.exports = Notes
