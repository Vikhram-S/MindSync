import { io, Socket } from 'socket.io-client'
import { useAppStore } from './store'

class SocketService {
  private socket: Socket | null = null
  private store = useAppStore.getState()

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    
    this.socket = io(API_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventListeners()
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    this.socket.on('user-joined', (data) => {
      const { user } = data
      this.store.addActiveUser({
        id: user.id,
        username: user.username,
        color: user.color
      })
    })

    this.socket.on('user-left', (data) => {
      const { userId } = data
      this.store.removeActiveUser(userId)
      this.store.removeCursor(userId)
    })

    this.socket.on('active-users', (users) => {
      this.store.setActiveUsers(users)
    })

    this.socket.on('cursor-move', (data) => {
      const { userId, username, position, color } = data
      this.store.addCursor({
        userId,
        username,
        position,
        color
      })
    })

    this.socket.on('note-update', (data) => {
      const { type, content, title, userId, timestamp } = data
      
      if (type === 'content-update' && content !== undefined) {
        const currentNote = this.store.currentNote
        if (currentNote) {
          this.store.updateNote({
            ...currentNote,
            content,
            updated_at: new Date(timestamp).toISOString()
          })
        }
      }
      
      if (type === 'title-update' && title !== undefined) {
        const currentNote = this.store.currentNote
        if (currentNote) {
          this.store.updateNote({
            ...currentNote,
            title,
            updated_at: new Date(timestamp).toISOString()
          })
        }
      }
    })
  }

  joinNote(noteId: number, user: { id: number; username: string }) {
    if (this.socket) {
      this.socket.emit('join-note', { noteId, user })
    }
  }

  leaveNote(noteId: number, user: { id: number; username: string }) {
    if (this.socket) {
      this.socket.emit('leave-note', { noteId, user })
    }
  }

  sendCursorMove(noteId: number, position: number, user: { id: number; username: string }) {
    if (this.socket) {
      this.socket.emit('cursor-move', { noteId, position, user })
    }
  }

  sendTextChange(noteId: number, content: string, user: { id: number; username: string }) {
    if (this.socket) {
      this.socket.emit('text-change', { noteId, content, user })
    }
  }

  sendTitleChange(noteId: number, title: string, user: { id: number; username: string }) {
    if (this.socket) {
      this.socket.emit('title-change', { noteId, title, user })
    }
  }
}

export const socketService = new SocketService()
