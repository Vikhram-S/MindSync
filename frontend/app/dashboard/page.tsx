'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import { socketService } from '@/lib/socket'
import toast from 'react-hot-toast'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { 
    isAuthenticated, 
    user, 
    notes, 
    setNotes, 
    setLoading, 
    setCurrentNote,
    token 
  } = useAppStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    const initializeDashboard = async () => {
      try {
        setLoading(true)
        
        // Connect to socket
        if (token) {
          socketService.connect(token)
        }
        
        // Load notes
        const response = await notesAPI.getNotes()
        setNotes(response.notes)
        
        setIsInitialized(true)
      } catch (error: any) {
        console.error('Dashboard initialization error:', error)
        toast.error('Failed to load dashboard')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [isAuthenticated, user, router, setNotes, setLoading, token])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return <Dashboard />
}
