const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
  const person = phonebook.find(person => person.id === Number(req.params.id))
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  phonebook = phonebook.filter(person => person.id !== Number(req.params.id))
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const newPerson = {
    id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
    name: req.body.name,
    number: req.body.number
  }
  phonebook = phonebook.concat(newPerson)
  res.json(newPerson)
})

app.get('/info', (req, res) => {
  let info = `<p>Phonebook has info for ${phonebook.length} people</p>`
  info += new Date()
  res.send(info)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})