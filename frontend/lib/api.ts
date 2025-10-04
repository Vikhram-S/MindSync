import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('realtime-notes-storage')
    if (token) {
      try {
        const parsed = JSON.parse(token)
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`
        }
      } catch (error) {
        console.error('Error parsing stored token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage and redirect to login
      localStorage.removeItem('realtime-notes-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  username: string
  email: string
  password: string
}

export interface NoteData {
  title: string
  content?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

export interface NotesResponse {
  notes: Array<{
    id: number
    title: string
    content: string
    created_at: string
    updated_at: string
  }>
}

export interface NoteResponse {
  note: {
    id: number
    title: string
    content: string
    created_at: string
    updated_at: string
  }
}

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

// Notes API
export const notesAPI = {
  getNotes: async (): Promise<NotesResponse> => {
    const response = await api.get('/notes')
    return response.data
  },

  getNote: async (id: number): Promise<NoteResponse> => {
    const response = await api.get(`/notes/${id}`)
    return response.data
  },

  createNote: async (data: NoteData): Promise<NoteResponse> => {
    const response = await api.post('/notes', data)
    return response.data
  },

  updateNote: async (id: number, data: Partial<NoteData>): Promise<NoteResponse> => {
    const response = await api.put(`/notes/${id}`, data)
    return response.data
  },

  deleteNote: async (id: number) => {
    const response = await api.delete(`/notes/${id}`)
    return response.data
  }
}

export default api
