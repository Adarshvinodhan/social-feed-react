import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Button, TextField, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import api from '../axios';
import { jwtDecode } from 'jwt-decode';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [username, setUsername] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchPosts();
    getUserFromToken();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`, {});
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  const handleCommentSubmit = async (postId) => {
    if (!newComments[postId]) return;
    try {
      await api.post(`/posts/${postId}/comment`, { content: newComments[postId] });
      setNewComments({ ...newComments, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      await api.post('/posts', newPost);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Blog
          </Typography>
          {username && (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, <strong>{username}</strong>
              </Typography>
              <Button variant="contained" color="secondary" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Add Post Form */}
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Create a New Post</Typography>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newPost.title}
              onChange={handlePostChange}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Content"
              name="content"
              value={newPost.content}
              onChange={handlePostChange}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ mt: 2 }}
              onClick={handlePostSubmit}
            >
              Add Post
            </Button>
          </CardContent>
        </Card>

        {/* Post Feed */}
        {posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography variant="body1" color="textSecondary">
                {post.content}
              </Typography>

              {/* Like Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <IconButton onClick={() => handleLike(post.id)} color="primary">
                  <FavoriteIcon />
                </IconButton>
                <Typography variant="body2">{post.likesCount} Likes</Typography>
              </Box>

              {/* Comments Section */}
              <Box sx={{ mt: 2 }}>
                {post.Comments?.map((comment, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                    <strong>{comment.userId}:</strong> {comment.content}
                  </Typography>
                ))}
              </Box>

              {/* Add a comment */}
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Write a comment..."
                  value={newComments[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                />
                <Button variant="contained" onClick={() => handleCommentSubmit(post.id)}>
                  Post
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    </>
  );
};

export default PostFeed;
