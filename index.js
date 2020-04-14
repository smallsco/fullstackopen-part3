/* Environment Variables */
require('dotenv').config()

/* Third-Party Dependencies */
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

/* Internal Dependencies */
const Person = require('./models/person')

/* Middleware */
app.use(express.static('build'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    req.method === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ')
}))
app.use(express.json())

/* "Database" */
/* DEPRECATED - remove when all endpoints are updated to use MongoDB */
let phonebook = [
  {
    "name": "John Barron",
    "number": "123-555-4567",
    "id": 1
  },
  {
    "name": "John Miller",
    "number": "321-555-7654",
    "id": 2
  },
  {
    "name": "Carolin Gallego",
    "number": "213-555-5467",
    "id": 3
  },
  {
    "name": "David Dennison",
    "number": "231-555-6754",
    "id": 4
  },
]


/* List all people */
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(phonebook => {
    res.json(phonebook.map(person => person.toJSON()))
  }).catch(error => next(error))
})

/* List a specific person by ID */
app.get('/api/persons/:id', (req, res) => {
  const person = phonebook.find(person => person.id === Number(req.params.id))
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

/* Delete a person */
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

/* Add a new person */
app.post('/api/persons', (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'Name is missing'
    })
  }
  else if (!req.body.number) {
    return res.status(400).json({
      error: 'Number is missing'
    })
  }

  /* FIXME: needs to be updated to work with MongoDB */
  /*else if (phonebook.some(person => person.name === req.body.name)) {
    return res.status(400).json({
      error: 'Person already exists'
    })
  }*/

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  newPerson.save().then(response => {
    res.json(response)
  }).catch(error => next(error))
})

/* Status page */
app.get('/info', (req, res) => {
  let info = `<p>Phonebook has info for ${phonebook.length} people</p>`
  info += new Date()
  res.send(info)
})

/* Error Handler */
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.message.includes('ObjectId')) {
    return res.status(400).send({ error: 'Malformed ID' })
  }
  next(error)
}
app.use(errorHandler)

/* Runs the server */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})