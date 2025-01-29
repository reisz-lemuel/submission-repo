import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            data-testid ='title'
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author: </label>
          <input
            data-testid ='author'
            id="author"
            type="text"
            name="author"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">URL: </label>
          <input
            data-testid ='url'
            id="url"
            type="text"
            name="url"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button id="create" type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
