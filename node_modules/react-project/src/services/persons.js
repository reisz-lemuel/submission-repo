import axios from 'axios'
const baseUrl =  'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson)
}

const update = (id, newPerson) => {
  return axios.put(`${baseUrl}/${id}`, newPerson)
}
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};
export default {
  getAll: getAll,
  create: create,
  update: update,
  deletePerson: deletePerson
}