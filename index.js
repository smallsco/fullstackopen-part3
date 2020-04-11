const express = require('express')
const app = express()

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

app.get('/info', (req, res) => {
  let info = `<p>Phonebook has info for ${phonebook.length} people</p>`
  info += new Date()
  res.send(info)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})