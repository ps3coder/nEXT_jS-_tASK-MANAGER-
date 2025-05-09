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
  - Local storage for offline usage
  - Data preserved between sessions

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
- **Styling**: Tailwind CSS, CSS variables
- **Animation**: Framer Motion
- **Icons**: React Icons
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Storage**: localStorage

## Project Structure

```
todo-app/
├── app/               # Next.js app directory
│   ├── components/    # React components
│   ├── context/       # Context providers
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── globals.css    # Global styles
│   ├── layout.js      # Root layout
│   └── page.js        # Home page
├── public/            # Static assets
└── ...                # Config files
```

## License

MIT
