import { create } from 'zustand'
import { mockUser, mockNotes, mockActiveUsers, mockCursors } from './mockData'

export interface User {
  id: number
  username: string
  email: string
}

export interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface ActiveUser {
  id: number
  username: string
  color: string
}

export interface CursorPosition {
  userId: number
  username: string
  position: number
  color: string
}

interface DemoAppState {
  // Auth state
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Notes state
  notes: Note[]
  currentNote: Note | null
  isLoading: boolean
  
  // Real-time state
  activeUsers: ActiveUser[]
  cursors: CursorPosition[]
  
  // UI state
  viewMode: 'editor' | 'mindmap'
  isDarkMode: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (note: Note) => void
  deleteNote: (noteId: number) => void
  setCurrentNote: (note: Note | null) => void
  setLoading: (isLoading: boolean) => void
  setActiveUsers: (users: ActiveUser[]) => void
  addActiveUser: (user: ActiveUser) => void
  removeActiveUser: (userId: number) => void
  setCursors: (cursors: CursorPosition[]) => void
  addCursor: (cursor: CursorPosition) => void
  removeCursor: (userId: number) => void
  setViewMode: (mode: 'editor' | 'mindmap') => void
  toggleDarkMode: () => void
  logout: () => void
}

export const useDemoStore = create<DemoAppState>((set, get) => ({
  // Initial state with mock data
  user: mockUser,
  token: 'demo-token',
  isAuthenticated: true,
  notes: mockNotes,
  currentNote: mockNotes[0],
  isLoading: false,
  activeUsers: mockActiveUsers,
  cursors: mockCursors,
  viewMode: 'editor',
  isDarkMode: false,

  // Auth actions
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
  // Notes actions
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (note) => set((state) => ({
    notes: state.notes.map(n => n.id === note.id ? note : n),
    currentNote: state.currentNote?.id === note.id ? note : state.currentNote
  })),
  deleteNote: (noteId) => set((state) => ({
    notes: state.notes.filter(n => n.id !== noteId),
    currentNote: state.currentNote?.id === noteId ? null : state.currentNote
  })),
  setCurrentNote: (note) => set({ currentNote: note }),
  setLoading: (isLoading) => set({ isLoading }),
  
  // Real-time actions
  setActiveUsers: (activeUsers) => set({ activeUsers }),
  addActiveUser: (user) => set((state) => ({
    activeUsers: [...state.activeUsers.filter(u => u.id !== user.id), user]
  })),
  removeActiveUser: (userId) => set((state) => ({
    activeUsers: state.activeUsers.filter(u => u.id !== userId)
  })),
  setCursors: (cursors) => set({ cursors }),
  addCursor: (cursor) => set((state) => ({
    cursors: [...state.cursors.filter(c => c.userId !== cursor.userId), cursor]
  })),
  removeCursor: (userId) => set((state) => ({
    cursors: state.cursors.filter(c => c.userId !== userId)
  })),
  
  // UI actions
  setViewMode: (viewMode) => set({ viewMode }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  // Logout
  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
    notes: [],
    currentNote: null,
    activeUsers: [],
    cursors: []
  })
}))
