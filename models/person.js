/* Initialize and configure Mongoose */
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

/* Connect to MongoDB */
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

/* Define data model */
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})
phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phonebookSchema)