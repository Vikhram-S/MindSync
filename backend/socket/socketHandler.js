const { redisClient } = require('../config/redis');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.activeUsers = new Map(); // Map of noteId -> Set of user info
    this.userCursors = new Map(); // Map of userId -> cursor info
    this.setupRedisSubscriber();
  }

  setupRedisSubscriber() {
    // Subscribe to Redis channels for note updates
    redisClient.subscribe('note-updates', (err) => {
      if (err) {
        console.error('Redis subscription error:', err);
      } else {
        console.log('Subscribed to note-updates channel');
      }
    });

    redisClient.on('message', (channel, message) => {
      if (channel === 'note-updates') {
        try {
          const data = JSON.parse(message);
          this.broadcastNoteUpdate(data);
        } catch (error) {
          console.error('Error parsing Redis message:', error);
        }
      }
    });
  }

  handleConnection(socket) {
    console.log('User connected:', socket.id);

    // Join note room
    socket.on('join-note', (data) => {
      const { noteId, user } = data;
      socket.join(`note-${noteId}`);
      
      // Track active user
      if (!this.activeUsers.has(noteId)) {
        this.activeUsers.set(noteId, new Set());
      }
      this.activeUsers.get(noteId).add({
        id: user.id,
        username: user.username,
        socketId: socket.id,
        color: this.getUserColor(user.id)
      });

      // Notify others about new user
      socket.to(`note-${noteId}`).emit('user-joined', {
        user: {
          id: user.id,
          username: user.username,
          color: this.getUserColor(user.id)
        }
      });

      // Send current active users to the new user
      socket.emit('active-users', Array.from(this.activeUsers.get(noteId)));
    });

    // Handle cursor movement
    socket.on('cursor-move', (data) => {
      const { noteId, position, user } = data;
      
      this.userCursors.set(user.id, {
        position,
        color: this.getUserColor(user.id),
        username: user.username,
        timestamp: Date.now()
      });

      // Broadcast cursor position to other users in the same note
      socket.to(`note-${noteId}`).emit('cursor-move', {
        userId: user.id,
        username: user.username,
        position,
        color: this.getUserColor(user.id)
      });
    });

    // Handle text changes
    socket.on('text-change', (data) => {
      const { noteId, content, user } = data;
      
      // Publish to Redis for persistence and broadcasting
      redisClient.publish('note-updates', JSON.stringify({
        type: 'content-update',
        noteId,
        content,
        userId: user.id,
        timestamp: Date.now()
      }));
    });

    // Handle title changes
    socket.on('title-change', (data) => {
      const { noteId, title, user } = data;
      
      redisClient.publish('note-updates', JSON.stringify({
        type: 'title-update',
        noteId,
        title,
        userId: user.id,
        timestamp: Date.now()
      }));
    });

    // Handle user leaving
    socket.on('leave-note', (data) => {
      const { noteId, user } = data;
      socket.leave(`note-${noteId}`);
      
      // Remove user from active users
      if (this.activeUsers.has(noteId)) {
        const users = this.activeUsers.get(noteId);
        for (let activeUser of users) {
          if (activeUser.id === user.id) {
            users.delete(activeUser);
            break;
          }
        }
        
        // Notify others about user leaving
        socket.to(`note-${noteId}`).emit('user-left', {
          userId: user.id,
          username: user.username
        });
      }

      // Remove cursor
      this.userCursors.delete(user.id);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Clean up user from all notes
      for (let [noteId, users] of this.activeUsers.entries()) {
        for (let user of users) {
          if (user.socketId === socket.id) {
            users.delete(user);
            socket.to(`note-${noteId}`).emit('user-left', {
              userId: user.id,
              username: user.username
            });
            break;
          }
        }
      }
    });
  }

  broadcastNoteUpdate(data) {
    const { type, noteId, content, title, userId, timestamp } = data;
    
    this.io.to(`note-${noteId}`).emit('note-update', {
      type,
      content,
      title,
      userId,
      timestamp
    });
  }

  getUserColor(userId) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    // Simple hash to get consistent color for user
    let hash = 0;
    for (let i = 0; i < userId.toString().length; i++) {
      hash = userId.toString().charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }
}

module.exports = SocketHandler;
