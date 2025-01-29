import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleDelete, handleLikes }) => {
  const [view, setView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleView = () => {
    setView(!view)
  }

  const handleDeleteClick = () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      handleDelete(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={handleView}>{view ? 'hide' : 'view'}</button>
        {view && (
          <div>
            <p>{blog.url}</p>
            <p>
              likes: {blog.likes}{' '}
              <button onClick={() => handleLikes(blog.id, blog.likes)}>like</button>
            </p>
            <p>{blog.user.username}</p>
            {user && user.username === blog.user.username && (
              <button onClick={handleDeleteClick}>remove</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  handleDelete: PropTypes.func.isRequired,
  handleLikes: PropTypes.func.isRequired,
}

export default Blog
