'use client'

import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { socketService } from '@/lib/socket'
import toast from 'react-hot-toast'
import { LogOut, Sun, Moon, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  const { user, toggleDarkMode, isDarkMode, logout } = useAppStore()
  const router = useRouter()

  const handleLogout = () => {
    socketService.disconnect()
    logout()
    toast.success('Logged out successfully!')
    router.push('/login')
  }

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Realtime Notes
          </h1>
          <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
            Collaborative note-taking made simple
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{user?.username}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
