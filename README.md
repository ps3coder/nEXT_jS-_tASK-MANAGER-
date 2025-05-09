# Modern Todo App

A high-performance, responsive, and feature-rich todo list application built with Next.js and JavaScript.

## Features

- ✅ **Complete Task Management**
  - Add, edit, delete tasks
  - Mark tasks as complete/incomplete
  - Set due dates and reminders
  - Categorize with labels/tags

- 🎨 **Modern UI/UX**
  - Clean, intuitive design
  - Dark/light mode toggle
  - Responsive across all devices
  - Smooth animations

- ⏱️ **Productivity Tools**
  - Built-in Pomodoro timer
  - Task prioritization (high/medium/low)
  - Support for recurring tasks
  - Search and filter functionality

- 💾 **Data Persistence**
  - MongoDB database storage
  - User authentication with NextAuth.js
  - Data synchronized across devices
  - User settings persistence

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or Yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- **Frontend**: Next.js, React, JavaScript
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Styling**: Material UI, Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Material Icons
- **Date Handling**: date-fns
- **State Management**: React Context API

## Project Structure

```
todo-app/
├── app/               # Next.js app directory
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── context/       # Context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library code (MongoDB connection, etc.)
│   ├── models/        # MongoDB models
│   ├── services/      # API service functions
│   ├── utils/         # Utility functions
│   ├── globals.css    # Global styles
│   ├── layout.js      # Root layout
│   └── page.js        # Home page
├── middleware.js      # NextAuth middleware
├── public/            # Static assets
└── ...                # Config files
```

## MongoDB Setup

1. Install MongoDB Compass from [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Start a local MongoDB server or create a MongoDB Atlas account
3. Create a `.env.local` file in the project root with:

```
MONGODB_URI=mongodb://localhost:27017/todo-app
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo-app

## License

MIT
