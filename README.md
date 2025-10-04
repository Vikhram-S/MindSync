# Realtime Notes 🚀

A full-stack collaborative note-taking application with real-time editing, markdown preview, and mindmap visualization. Built with Next.js, Express, Socket.IO, PostgreSQL, and Redis.

## ✨ Features

### 🔐 Authentication
- JWT-based user authentication
- Secure signup and login
- Protected routes and API endpoints

### 📝 Real-time Collaboration
- **Live Text Editing**: Multiple users can edit notes simultaneously
- **Real-time Cursors**: See other users' cursors with unique colors
- **Instant Sync**: Changes are broadcasted instantly via Redis Pub/Sub
- **Active Users**: See who's currently editing each note

### 🎨 Creative UX Features
- **Split View**: Left side for collaborative editor, right side for live markdown preview
- **Mindmap Mode**: Visualize notes as an interactive graph using react-flow
- **Sticky Notes UI**: Notes list displays as draggable sticky notes on a board
- **Dark/Light Theme**: Smooth theme switching with Tailwind CSS
- **Smooth Animations**: Framer Motion animations for all transitions

### 🛠 Technical Features
- **State Management**: Zustand for efficient state management
- **Real-time Communication**: Socket.IO for WebSocket connections
- **Data Persistence**: PostgreSQL for reliable data storage
- **Caching**: Redis for real-time synchronization
- **Docker Ready**: Full containerization with docker-compose

## 🏗 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Socket.IO Client** - Real-time communication
- **React Markdown** - Markdown rendering
- **React Flow** - Mindmap visualization
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **PostgreSQL** - Relational database
- **Redis** - In-memory data store for pub/sub
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Health Checks** - Service monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-notes
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Option 2: Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd realtime-notes
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start database services**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your configuration
   ```

4. **Start development servers**
   ```bash
   # From project root
   npm run dev
   ```

## 📁 Project Structure

```
realtime-notes/
├── backend/                 # Express.js API server
│   ├── config/             # Database and Redis configuration
│   ├── middleware/          # Authentication middleware
│   ├── routes/             # API routes (auth, notes)
│   ├── socket/             # Socket.IO handlers
│   ├── server.js           # Main server file
│   └── Dockerfile          # Backend container config
├── frontend/               # Next.js React application
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── lib/                # Utilities and stores
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend container config
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=realtime_notes
DB_USER=postgres
DB_PASSWORD=password
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🎯 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with username, email, and password
2. **Create Notes**: Click "New Note" to create your first note
3. **Real-time Editing**: Start typing to see real-time collaboration
4. **Markdown Preview**: Toggle the preview to see rendered markdown
5. **Mindmap View**: Switch to mindmap mode for visual note organization

### Collaboration Features
- **Multiple Users**: Share your notes with others for real-time collaboration
- **Live Cursors**: See where other users are typing
- **Active Users**: View who's currently editing each note
- **Instant Sync**: All changes are synchronized in real-time

### UI Features
- **Theme Toggle**: Switch between light and dark modes
- **Sticky Notes**: Notes appear as colorful sticky notes
- **Smooth Animations**: Enjoy fluid transitions and interactions
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠 Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run build        # Build frontend for production
npm run start        # Start production server

# Backend only
cd backend
npm run dev          # Start backend with nodemon
npm start            # Start backend production server

# Frontend only
cd frontend
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm start            # Start production server
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Clean up volumes
docker-compose down -v
```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### WebSocket Events
- `join-note` - Join a note for collaboration
- `leave-note` - Leave a note
- `text-change` - Broadcast text changes
- `title-change` - Broadcast title changes
- `cursor-move` - Broadcast cursor position

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for security
- **Input Validation**: Express-validator for request validation
- **Helmet**: Security headers middleware

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build and start with Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Configure reverse proxy** (nginx/traefik) for production domains
4. **Set up SSL certificates** for HTTPS
5. **Configure database backups** for PostgreSQL
6. **Monitor logs** and set up alerting

### Environment-Specific Configurations

- **Development**: Hot reloading, debug logging
- **Production**: Optimized builds, security headers, health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **Socket.IO** for real-time communication
- **React Flow** for mindmap visualization
- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Vikhram-S/MindSync/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy Note-Taking! 🎉**

Built with ❤️ by Vikhram S
