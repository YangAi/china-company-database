const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PeopleSchema = new Schema({
}, { strict: false, timestamps: true })

const People = mongoose.model('People', PeopleSchema)

module.exports = People
