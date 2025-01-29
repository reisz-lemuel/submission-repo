import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log(token)
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  console.log("request config:" ,config)

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateLikes = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}
const deleteBlogs = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log("request config:" ,config)
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, setToken, updateLikes, deleteBlogs }