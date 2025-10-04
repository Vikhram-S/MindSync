'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import { socketService } from '@/lib/socket'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Users, Save } from 'lucide-react'

export default function NoteEditor() {
  const { 
    currentNote, 
    updateNote, 
    user, 
    activeUsers, 
    cursors 
  } = useAppStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
    }
  }, [currentNote])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    
    if (currentNote && user) {
      socketService.sendTitleChange(currentNote.id, newTitle, user)
    }
    
    // Auto-save after 2 seconds
    clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      handleSave('title', newTitle)
    }, 2000)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    
    if (currentNote && user) {
      socketService.sendTextChange(currentNote.id, newContent, user)
    }
    
    // Auto-save after 2 seconds
    clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      handleSave('content', newContent)
    }, 2000)
  }

  const handleCursorMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (currentNote && user) {
      const textarea = e.currentTarget
      const position = textarea.selectionStart
      socketService.sendCursorMove(currentNote.id, position, user)
    }
  }

  const handleSave = async (field: 'title' | 'content', value: string) => {
    if (!currentNote) return
    
    try {
      setIsSaving(true)
      const updateData = field === 'title' ? { title: value } : { content: value }
      const response = await notesAPI.updateNote(currentNote.id, updateData)
      updateNote(response.note)
      setLastSaved(new Date())
    } catch (error: any) {
      toast.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = async () => {
    if (!currentNote) return
    
    try {
      setIsSaving(true)
      const response = await notesAPI.updateNote(currentNote.id, { title, content })
      updateNote(response.note)
      setLastSaved(new Date())
      toast.success('Note saved!')
    } catch (error: any) {
      toast.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            📝
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select a note to start editing
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a note from the sidebar or create a new one
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 flex-1"
              placeholder="Untitled Note"
            />
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Active Users */}
            {activeUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: user.color }}
                      title={user.username}
                    >
                      {user.username[0].toUpperCase()}
                    </div>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {isSaving && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="flex-1 relative">
            <textarea
              ref={contentRef}
              value={content}
              onChange={handleContentChange}
              onMouseMove={handleCursorMove}
              onKeyUp={handleCursorMove}
              className="w-full h-full p-6 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm leading-relaxed"
              placeholder="Start writing your note..."
            />
            
            {/* Cursor Indicators */}
            <AnimatePresence>
              {cursors.map((cursor) => (
                <motion.div
                  key={cursor.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${cursor.position * 8}px`, // Approximate character width
                    top: '20px',
                    color: cursor.color
                  }}
                >
                  <div className="w-0.5 h-5 bg-current animate-pulse"></div>
                  <div 
                    className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded"
                    style={{ backgroundColor: cursor.color }}
                  >
                    {cursor.username}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-1/2 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto"
          >
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*No content to preview*'}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
