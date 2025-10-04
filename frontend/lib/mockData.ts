// Mock data for demo/screenshot purposes
export const mockUser = {
  id: 1,
  username: 'demo_user',
  email: 'demo@example.com'
}

export const mockNotes = [
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
- [ ] Expense tracker

## AI/ML Projects
- [ ] Image recognition system
- [ ] Natural language processor
- [ ] Recommendation engine`,
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
3. Resource allocation
4. Timeline discussion

## Key Decisions:
- ✅ Launch new feature by March
- ✅ Hire 2 additional developers
- ✅ Implement new design system

## Action Items:
- [ ] John: Complete user research by Jan 30
- [ ] Sarah: Design mockups by Feb 5
- [ ] Mike: Set up development environment`,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'Learning Resources',
    content: `# Learning Resources 📚

## Frontend Development
- **React:** Official documentation and tutorials
- **Next.js:** Learn Next.js course
- **TypeScript:** TypeScript handbook
- **Tailwind CSS:** Utility-first CSS framework

## Backend Development
- **Node.js:** Node.js best practices
- **Express:** Express.js guide
- **PostgreSQL:** Database design principles
- **Redis:** Caching strategies

## Tools & Technologies
- **Docker:** Containerization guide
- **Git:** Version control best practices
- **VS Code:** Productivity tips and extensions`,
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-12T14:20:00Z'
  },
  {
    id: 5,
    title: 'Travel Plans',
    content: `# Travel Plans ✈️

## Upcoming Trips
### Europe Tour (March 2024)
- **Cities:** Paris, Rome, Barcelona, Amsterdam
- **Duration:** 2 weeks
- **Budget:** $3,000

### Asia Adventure (June 2024)
- **Cities:** Tokyo, Seoul, Singapore
- **Duration:** 3 weeks
- **Budget:** $4,500

## Packing Lists
- [ ] Passport and documents
- [ ] Camera and accessories
- [ ] Weather-appropriate clothing
- [ ] Travel adapters
- [ ] First aid kit`,
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z'
  }
]

export const mockActiveUsers = [
  {
    id: 2,
    username: 'alice_dev',
    color: '#FF6B6B'
  },
  {
    id: 3,
    username: 'bob_designer',
    color: '#4ECDC4'
  }
]

export const mockCursors = [
  {
    userId: 2,
    username: 'alice_dev',
    position: 150,
    color: '#FF6B6B'
  }
]
