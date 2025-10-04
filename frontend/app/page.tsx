'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { authAPI } from '@/lib/api'
import { socketService } from '@/lib/socket'
import toast from 'react-hot-toast'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, setUser, setToken, setAuthenticated } = useAppStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getMe()
        setUser(response.user)
        setAuthenticated(true)
        router.push('/dashboard')
      } catch (error) {
        setAuthenticated(false)
        router.push('/login')
      }
    }

    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      checkAuth()
    }
  }, [isAuthenticated, router, setUser, setAuthenticated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  )
}
