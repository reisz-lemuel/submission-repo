const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const middleware = require('../utils/middleware')


blogsRouter.get('/',  async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1,})
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  });

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

 const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 });

  response.status(201).json(populatedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const { id } = request.params;
  const user = request.user;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'Unauthorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred while deleting the blog' });
  }
});



blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;

  if (likes === undefined) {
    return response.status(400).json({ error: 'Likes must be provided' });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true }
  );

  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  response.status(200).json(updatedBlog);
});


module.exports = blogsRouter