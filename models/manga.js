const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mangaSchema = new Schema(
  {
  title: String,
  description: String,
  img: String

}
)

const Manga = mongoose.model('Manga', mangaSchema)

module.exports = Manga
