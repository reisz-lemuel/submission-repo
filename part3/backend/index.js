const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

app.use(express.json());  // For parsing JSON requests
app.use(cors())

let persons = [
  { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
  { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
];


// Request logger middleware
const requestLogger = (request, response, next) => {
  console.log('Method', request.method);
  console.log('Path', request.path);
  console.log('Body', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);  // Using the request logger middleware

// Person routes
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const currentDate = new Date().toString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>${currentDate}`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

// Generate random ID
const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

// Add a new person
app.post('/api/persons', morgan(':method :url :response-time ms'), (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Please fill up all the fields'
    });
  }

  const existingPerson = persons.find(person => person.name === body.name);
  if (existingPerson) {
    return response.status(409).json({
      error: 'Name must be unique'
    });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    };
    persons.push(person);
    console.log(person);
    response.json(person);
    
  }
});

// Middleware for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// Use the unknown endpoint handler at the end (for unmatched routes)
app.use(unknownEndpoint);

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})