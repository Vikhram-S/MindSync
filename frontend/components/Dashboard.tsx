'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { useDemoStore } from '@/lib/demoStore'
import { notesAPI } from '@/lib/api'
import { socketService } from '@/lib/socket'
import toast from 'react-hot-toast'
import NotesList from './NotesList'
import NoteEditor from './NoteEditor'
import MindmapView from './MindmapView'
import Header from './Header'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
  const { 
    currentNote, 
    setCurrentNote, 
    viewMode, 
    setViewMode,
    user,
    token
  } = useAppStore()
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (currentNote && token && user) {
      socketService.joinNote(currentNote.id, user)
    }

    return () => {
      if (currentNote && user) {
        socketService.leaveNote(currentNote.id, user)
      }
    }
  }, [currentNote, token, user])

  const handleCreateNote = async () => {
    try {
      setIsCreating(true)
      const response = await notesAPI.createNote({
        title: 'Untitled Note',
        content: ''
      })
      
      setCurrentNote(response.note)
      toast.success('Note created successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create note')
    } finally {
      setIsCreating(false)
    }
  }

  const handleNoteSelect = (note: any) => {
    setCurrentNote(note)
  }

  const handleViewModeChange = (mode: 'editor' | 'mindmap') => {
    setViewMode(mode)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Notes List */}
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Notes
              </h2>
              <button
                onClick={handleCreateNote}
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {isCreating ? 'Creating...' : '+ New Note'}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewModeChange('editor')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'editor'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => handleViewModeChange('mindmap')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'mindmap'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                Mindmap
              </button>
            </div>
          </div>
          
          <NotesList onNoteSelect={handleNoteSelect} />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {viewMode === 'editor' ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <NoteEditor />
              </motion.div>
            ) : (
              <motion.div
                key="mindmap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <MindmapView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
