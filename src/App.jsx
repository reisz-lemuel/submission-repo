import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const blogRef = useRef()

  const addBlog = async (newBlog) => {
    try {
      if (!newBlog.author || !newBlog.title || !newBlog.url) {
        alert('Author, title, and URL are required')
        return
      }
      const addedBlog = await blogService.create(newBlog)
      setBlogs((prevBlogs) => [...prevBlogs, addedBlog])
      setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} is added`)
      setMessageType('success')
      blogRef.current.toggleVisibility()
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error adding blog:', error)
      alert('Failed to add the blog. Please try again later.')
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleLikes = async (id, likes) => {
    try {
      const updatedBlog = await blogService.updateLikes(id, { likes: likes + 1 })
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? { ...blog, likes: updatedBlog.likes } : blog))
      )
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleDeleteBlog = async (id) => {
    try {
      const blogToDelete = blogs.find((blog) => blog.id === id);
  
      if (!blogToDelete) {
        console.error('Blog not found');
        return;
      }
  
      await blogService.deleteBlogs(id);
  
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
  
      setMessage(`${blogToDelete.title} has been removed`);
      setMessageType('success');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p> <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="add new blog" ref={blogRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleDelete={handleDeleteBlog}
          handleLikes={handleLikes}
        />
      ))}
    </div>
  )
}

export default App
