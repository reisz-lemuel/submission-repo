import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonsForm from './components/PersonsForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch((error) => {
        console.error('Error fetching persons:', error)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response
              )
            )
            setNotification({
              type: 'success',
              text: `Updated ${response.name}`,
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setNotification({
                type: 'error',
                text: `The person was already removed from the server`,
              })
            } else {
              setNotification({
                type: 'error',
                text: 'Error updating person',
              })
            }
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }

      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({
            type: 'success',
            text: `Added ${returnedPerson.name}`,
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch((error) => {
          setNotification({
            type: 'error',
            text: 'Error adding person',
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const handleRemovePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .eliminate(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          setNotification({
            type: 'success',
            text: `Deleted ${name}`,
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch((error) => {
          setNotification({
            type: 'error',
            text: 'Already been deleted',
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonsForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAddPerson={handleAddPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleRemovePerson={handleRemovePerson} />

      
    </div>
  )
}

export default App
