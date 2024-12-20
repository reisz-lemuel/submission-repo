const mongoose = require('mongoose');
require('dotenv').config()
if (process.argv.length< 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name:{
    type: String,
    minLength : 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema)