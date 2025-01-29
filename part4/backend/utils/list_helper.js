const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((favorite, current) => {
    return (current.likes > favorite.likes) ? current : favorite;
  }, { likes: 0 });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  };
}
const mostBlogs = (blogs) => {
  const authorBlogCount = blogs.reduce((authorCount, blog) => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1;
    return authorCount;
  }, {});
  
  const mostBlogsAuthor = Object.entries(authorBlogCount).reduce((max, current) => {
    return current[1] > max[1] ? current : max;
  });

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1]
  };
}

const mostLikes = (blogs) => {
  const authorLikesCount = blogs.reduce((authorLikes, blog) => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes;
    return authorLikes;
  }, {});
  
  const mostLikesAuthor = Object.entries(authorLikesCount).reduce((max, current) => {
    return current[1] > max[1] ? current : max;
  });

  return {
    author: mostLikesAuthor[0],
    likes: mostLikesAuthor[1]
  };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
