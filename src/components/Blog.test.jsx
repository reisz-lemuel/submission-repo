import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('Blog component', () => {
  let component;
  const blog = {
    id: '321',
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'Test username',
      name: 'Test name'
    }
  };
  const user = {
    id: '123',
    username: 'user@user.com',
    name: 'User',
  };
  const handleLikesMock = vi.fn()
  
  beforeEach(() => {
    component = render(<Blog blog={blog} user={user} handleLikes={handleLikesMock}/>);
  });
  
  test('renders title and author', () => {
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
  });

  test('does not render url and likes by default', () => {
    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });
  test('should show url, number of likes and user when view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    screen.debug()
    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(blog.likes)
    expect(component.container).toHaveTextContent(blog.user.username)
    
  })
  test('should call event handler twice when like button is double clicked', async () => {
    const user = userEvent.setup();
    const viewButton = component.getByText('view');
    await user.click(viewButton);  // Show the like button
    const likeButton = component.getByText('like');
    
    // Double click the like button
    await user.dblClick(likeButton);
  
    // Check if the mock function was called twice
    expect(handleLikesMock.mock.calls).toHaveLength(2);
  
  });
  
});
