const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :response-time ms'))

const requestLogger = (request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(requestLogger)

// GET all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// GET a person by ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (!result) {
        return response.status(404).send({ error: 'Person not found' })
      }
      response.json(result)
    })
    .catch((error) => next(error))
})
// POST a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

// PUT to update a person's information (specifically their phone number)
app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const { name, number } = request.body

  // Update the person with the new phone number
  Person.findByIdAndUpdate( id, { name, number }, { new: true, runValidators: true, content: 'query' })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return response.status(404).json({ error: 'Person not found' })
      }
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// DELETE a person by ID
app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})
app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
          <p>${new Date()}</p>`
    )
  }).catch((error) => next(error))
})

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
