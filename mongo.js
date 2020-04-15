const mongoose = require('mongoose')

/* Validation */
if (process.argv.length < 3) {
  console.log('Password is missing or incorrect')
  process.exit(1)
}
else if (process.argv.length === 4) {
  console.log('Phone number is missing')
  process.exit(1)
}

/* Connect to MongoDB */
const password = process.argv[2]
const url = `mongodb://heroku_n68lzzz3:${password}@ds023593.mlab.com:23593/heroku_n68lzzz3`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

/* Define data model */
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', phonebookSchema)


if (process.argv.length === 3) {
  /* List all people in phone book */
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  /* Add new person to phone book */
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`Added "${process.argv[3]}" with number "${process.argv[4]}" to phone book`)
    mongoose.connection.close()
  })
}