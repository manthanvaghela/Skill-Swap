# Skill Swap Platform

A modern web application that enables users to list their skills and request others in return. Built with React, Node.js, and Express.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Profile Management**: Users can create and manage their profiles
- **Skill Listing**: List skills you offer and skills you want to learn
- **User Discovery**: Browse and search for users by skills
- **Swap Requests**: Send and manage skill swap requests
- **Rating System**: Rate and review after skill exchanges
- **Admin Panel**: Content moderation and user management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **express-validator** - Input validation
- **helmet** - Security middleware

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skill-swap-platform
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend (recommended)
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🏗️ Project Structure

```
skill-swap-platform/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── models/           # Data models
│   ├── uploads/          # File uploads
│   └── index.js          # Server entry point
├── package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage
- Automatic token refresh
- Protected routes for authenticated users
- Role-based access control (User/Admin)

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Smooth Animations**: CSS transitions and micro-interactions
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: User feedback for actions
- **Loading States**: Visual feedback during API calls

## 📱 Pages

1. **Login Page** (`/login`) - User authentication
2. **Register Page** (`/register`) - User registration
3. **Dashboard** (`/dashboard`) - Main user interface
4. **Profile** (`/profile`) - User profile management
5. **Browse Users** (`/browse`) - Discover other users
6. **Swap Requests** (`/swaps`) - Manage skill exchanges

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
```

## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build
```

### Backend (Node.js)
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ for the Skill Swap Platform** 