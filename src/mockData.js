export const mockUsers = [
  { id: 1, username: 'john_doe', password: 'password123', name: 'John Doe' },
  { id: 2, username: 'jane_smith', password: 'password123', name: 'Jane Smith' },
];

export const mockPosts = [
  {
    id: 1,
    userId: 1,
    content: 'Just had an amazing weekend!',
    image: 'https://source.unsplash.com/random/800x600?nature',
    likes: 15,
    comments: [
      { id: 1, userId: 2, content: 'Looks awesome!' },
      { id: 2, userId: 1, content: 'Thanks!' },
    ],
    timestamp: new Date('2024-02-20T10:00:00'),
  },
  {
    id: 2,
    userId: 2,
    content: 'Learning React is fun!',
    likes: 10,
    comments: [
      { id: 3, userId: 1, content: 'Keep it up!' },
    ],
    timestamp: new Date('2024-02-20T09:30:00'),
  },
];