import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('should call event handler with right details when new blog is created', async () => {
  const createBlogMock = vi.fn()
  render(<BlogForm createBlog={createBlogMock} />)

  const newBlog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  }

  const user = userEvent.setup()

  // Use getByLabelText for better query
  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const createButton = screen.getByText('save')

  // Simulate typing into the input fields
  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)

  // Simulate clicking the submit button
  await user.click(createButton)

  // Check that the mock function was called with the correct arguments
  expect(createBlogMock.mock.calls).toHaveLength(1)
  expect(createBlogMock.mock.calls[0][0]).toEqual(newBlog)
})
