const express = require('express')
const cors = require('cors')  // Import CORS module
const app = express()

app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions)) 

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

// Generate ID for new notes
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
  return String(maxId + 1)
}

// Add new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

// Get single note by ID
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Delete note by ID
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
app.put('/api/notes/:id', (request, response) => {
  const { id } = request.params;
  const { content, important } = request.body;

  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex === -1) {
    return response.status(404).json({ error: 'Note not found' });
  }

  const updatedNote = {
    ...notes[noteIndex],
    content,
    important,
  };

  // Update the note in the array
  notes[noteIndex] = updatedNote;

  response.json(updatedNote);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
