import { useState, useEffect } from 'react';
import './index.css';
import phonebookService from './services/persons';

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      filter shown with{' '}
      <input value={filter} onChange={handleFilter} />
    </div>
  );
};

const PersonForm = ({ persons, newName, setNewName, newNumber, setNewNumber, setPersons, setErrorMessage }) => {
  const handleNewPerson = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        phonebookService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? response.data : person
              )
            );
            setNewName('');
            setNewNumber('');
            setErrorMessage({
              message: `Updated ${newName}'s number successfully!`,
              type: 'success',
            });
            setTimeout(() => setErrorMessage(null), 5000);
          })
          .catch((error) => {
            setErrorMessage({
              message: `Information of ${newName} has already been removed from the server.`,
              type: 'error',
            });
            setTimeout(() => setErrorMessage(null), 5000);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      phonebookService
        .create(newPerson)
        .then((response) => {
          setPersons([...persons, response.data]);
          setNewName('');
          setNewNumber('');
          setErrorMessage({
            message: `Added ${newName} successfully!`,
            type: 'success',
          });
          setTimeout(() => setErrorMessage(null), 5000);
        })
        .catch((error) => {
          setErrorMessage({
            message: 'Failed to add the contact. Please try again.',
            type: 'error',
          });
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{' '}
        <input value={newName} onChange={handleNewPerson} />
      </div>
      <div>
        number:{' '}
        <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, setPersons, setErrorMessage }) => {
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      phonebookService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setErrorMessage({
            message: 'Contact deleted successfully!',
            type: 'success',
          });
          setTimeout(() => setErrorMessage(null), 5000);
        })
        .catch((error) => {
          setErrorMessage({
            message: 'Failed to delete the contact. It may have already been removed.',
            type: 'error',
          });
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  const notificationClass = message.type === 'error' ? 'notification error' : 'notification success';

  return <div className={notificationClass}>{message.message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((response) => setPersons(response.data));
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const filterNames = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add a new</h2>
      <PersonForm
        persons={persons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage}
      />
      <h2>Numbers</h2>
      <Persons persons={filterNames} setPersons={setPersons} setErrorMessage={setErrorMessage} />
    </div>
  );
};

export default App;
