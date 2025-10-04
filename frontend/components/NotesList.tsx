'use client'

import { useAppStore } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Calendar } from 'lucide-react'

interface NotesListProps {
  onNoteSelect: (note: any) => void
}

export default function NotesList({ onNoteSelect }: NotesListProps) {
  const { notes, currentNote, deleteNote, setNotes } = useAppStore()

  const handleDeleteNote = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(noteId)
        deleteNote(noteId)
        toast.success('Note deleted successfully!')
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete note')
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getStickyColor = (index: number) => {
    const colors = ['yellow', 'pink', 'blue', 'green', 'purple']
    return colors[index % colors.length]
  }

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            📝
          </div>
          <p className="text-sm">No notes yet</p>
          <p className="text-xs mt-1">Create your first note to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-3">
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                rotate: 0,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`sticky-note ${getStickyColor(index)} ${
                currentNote?.id === note.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : ''
              }`}
              onClick={() => onNoteSelect(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-2 flex-1">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                {note.content || 'No content yet...'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(note.updated_at)}</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
