const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('dummy', () => {
  test('returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Another Blog',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com',
      likes: 3,
      __v: 0
    }
  ];

  test('when list has multiple blogs, returns total likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 8);
  });
});

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Blog A',
      author: 'Author A',
      url: 'https://example.com',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Blog B',
      author: 'Author B',
      url: 'https://example.com',
      likes: 15,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f0',
      title: 'Blog C',
      author: 'Author A',
      url: 'https://example.com',
      likes: 12,
      __v: 0
    }
  ];

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: 'Blog B',
      author: 'Author B',
      likes: 15
    });
  });
});

describe('most blogs', () => {
  const blogs = [
    { author: 'Author A', title: 'Blog 1', likes: 5 },
    { author: 'Author A', title: 'Blog 2', likes: 2 },
    { author: 'Author B', title: 'Blog 3', likes: 3 },
    { author: 'Author A', title: 'Blog 4', likes: 4 }
  ];

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: 'Author A',
      blogs: 3
    });
  });
});

describe('most likes', () => {
  const blogs = [
    { author: 'Author A', title: 'Blog 1', likes: 10 },
    { author: 'Author A', title: 'Blog 2', likes: 5 },
    { author: 'Author B', title: 'Blog 3', likes: 20 },
    { author: 'Author A', title: 'Blog 4', likes: 5 }
  ];

  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: 'Author A',
      likes: 20
    });
  });
});
