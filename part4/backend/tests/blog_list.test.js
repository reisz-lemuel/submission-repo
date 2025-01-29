const { test, after, describe, beforeEach } = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const assert = require('assert');
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = [
    new Blog({ title: 'First blog', author: 'Author1', url: 'http://example.com/1', likes: 5 }),
    new Blog({ title: 'Second blog', author: 'Author2', url: 'http://example.com/2', likes: 8 }),
  ];

  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe('GET /api/blogs', () => {
  test('should return blogs as JSON', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.status, 200);
    assert.ok(response.headers['content-type'].includes('application/json'));
  });

  test('should return the correct number of blogs', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, 2);
  });

  test('should have id property in blog posts', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      assert.ok(blog.id);
    });
  });
});

describe('POST /api/blogs', () => {
  test('should successfully create a new blog', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Author3',
      url: 'http://example.com/3',
      likes: 12
    };

    const initialBlogs = await api.get('/api/blogs');

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await api.get('/api/blogs');
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.body.length + 1);

    const titles = blogsAtEnd.body.map(blog => blog.title);
    assert.ok(titles.includes(newBlog.title));
  });

  test('should default likes to 0 if missing', async () => {
    const newBlog = {
      title: 'Blog with no likes',
      author: 'Author4',
      url: 'http://example.com/4'
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('should respond with 400 if title or url is missing', async () => {
    const newBlogWithoutTitle = {
      author: 'Author5',
      url: 'http://example.com/5',
      likes: 5
    };

    const response1 = await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400);

    const newBlogWithoutUrl = {
      title: 'Blog without url',
      author: 'Author5',
      likes: 5
    };

    const response2 = await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400);
  });
});

describe('DELETE /api/blogs/:id', () => {
  test('should delete a blog post', async () => {
    const blogToDelete = await Blog.findOne();
    
    // Fetch initial blogs
    const initialBlogs = await Blog.find({});

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAfterDelete = await Blog.find({});
    assert.strictEqual(blogsAfterDelete.length, initialBlogs.length - 1);
  });

  test('should return 404 if blog post does not exist', async () => {
    const nonExistingId = '60c72b2f9e64fa2b8d51bdcd';  // Replace with a non-existing ID

    const response = await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(404);

    assert.strictEqual(response.status, 404);
  });
});

describe('PUT /api/blogs/:id', () => {
  test('should update likes of a blog post', async () => {
    const blogToUpdate = await Blog.findOne();
    const updatedLikes = blogToUpdate.likes + 1;

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200);

    assert.strictEqual(response.body.likes, updatedLikes);
  });

  test('should return 404 if blog post does not exist', async () => {
    const nonExistingId = '60c72b2f9e64fa2b8d51bdcd';  // Replace with a non-existing ID

    const response = await api
      .put(`/api/blogs/${nonExistingId}`)
      .send({ likes: 5 })
      .expect(404);

    assert.strictEqual(response.status, 404);
  });

  test('should return 400 if likes is not provided', async () => {
    const blogToUpdate = await Blog.findOne();

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({})
      .expect(400);

    assert.strictEqual(response.status, 400);
  });
});
