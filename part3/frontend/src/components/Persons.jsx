const Persons = ({ persons, handleRemovePerson }) => {
  return (
    <ul>
      {persons.map((person, index) => (
        <li key={index}>{person.name} {person.number}
          <button onClick={() => handleRemovePerson(person.id, person.name)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Persons
