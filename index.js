/* Dependencies */
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

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
app.get('/api/persons', (req, res) => {
  res.json(phonebook)
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
app.delete('/api/persons/:id', (req, res) => {
  phonebook = phonebook.filter(person => person.id !== Number(req.params.id))
  res.status(204).end()
})

/* Add a new person */
app.post('/api/persons', (req, res) => {
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
  else if (phonebook.some(person => person.name === req.body.name)) {
    return res.status(400).json({
      error: 'Person already exists'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
    name: req.body.name,
    number: req.body.number
  }
  phonebook = phonebook.concat(newPerson)
  res.json(newPerson)
})

/* Status page */
app.get('/info', (req, res) => {
  let info = `<p>Phonebook has info for ${phonebook.length} people</p>`
  info += new Date()
  res.send(info)
})

/* Runs the server */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})