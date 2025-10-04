'use client'

import { useEffect } from 'react'
import { useDemoStore } from '@/lib/demoStore'
import Dashboard from '@/components/Dashboard'

export default function DemoPage() {
  const { setUser, setToken, setAuthenticated, setNotes, setCurrentNote, setActiveUsers, setCursors } = useDemoStore()

  useEffect(() => {
    // Initialize demo data
    setUser({ id: 1, username: 'demo_user', email: 'demo@example.com' })
    setToken('demo-token')
    setAuthenticated(true)
    setNotes([
      {
        id: 1,
        title: 'Welcome to Realtime Notes',
        content: `# Welcome to Realtime Notes! 🚀

This is a **collaborative note-taking** application with real-time editing capabilities.

## Features:
- ✨ **Real-time collaboration** - Multiple users can edit simultaneously
- 🎨 **Beautiful UI** - Sticky notes interface with smooth animations
- 📝 **Markdown support** - Live preview with split view
- 🧠 **Mindmap mode** - Visualize your notes as an interactive graph
- 🌙 **Dark/Light theme** - Toggle between themes
- 👥 **Live cursors** - See other users typing in real-time

## Getting Started:
1. Create your first note
2. Share with others for collaboration
3. Switch to mindmap view for organization
4. Enjoy the smooth animations!`,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        title: 'Project Ideas',
        content: `# Project Ideas 💡

## Web Development
- [ ] Build a task management app
- [ ] Create a portfolio website
- [ ] Develop a chat application

## Mobile Apps
- [ ] Fitness tracking app
- [ ] Recipe organizer
- [ ] Expense tracker`,
        created_at: '2024-01-14T15:45:00Z',
        updated_at: '2024-01-14T15:45:00Z'
      },
      {
        id: 3,
        title: 'Meeting Notes - Q1 Planning',
        content: `# Q1 Planning Meeting 📅

**Date:** January 15, 2024  
**Attendees:** Team Lead, Developers, Designers

## Agenda:
1. Review Q4 performance
2. Plan Q1 objectives
3. Resource allocation`,
        created_at: '2024-01-13T09:15:00Z',
        updated_at: '2024-01-13T09:15:00Z'
      }
    ])
    setCurrentNote({
      id: 1,
      title: 'Welcome to Realtime Notes',
      content: `# Welcome to Realtime Notes! 🚀

This is a **collaborative note-taking** application with real-time editing capabilities.

## Features:
- ✨ **Real-time collaboration** - Multiple users can edit simultaneously
- 🎨 **Beautiful UI** - Sticky notes interface with smooth animations
- 📝 **Markdown support** - Live preview with split view
- 🧠 **Mindmap mode** - Visualize your notes as an interactive graph
- 🌙 **Dark/Light theme** - Toggle between themes
- 👥 **Live cursors** - See other users typing in real-time

## Getting Started:
1. Create your first note
2. Share with others for collaboration
3. Switch to mindmap view for organization
4. Enjoy the smooth animations!`,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    })
    setActiveUsers([
      { id: 2, username: 'alice_dev', color: '#FF6B6B' },
      { id: 3, username: 'bob_designer', color: '#4ECDC4' }
    ])
    setCursors([
      { userId: 2, username: 'alice_dev', position: 150, color: '#FF6B6B' }
    ])
  }, [setUser, setToken, setAuthenticated, setNotes, setCurrentNote, setActiveUsers, setCursors])

  return <Dashboard />
}
