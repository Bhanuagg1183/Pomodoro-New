# PomodoroTodo - React Productivity Application

A beautiful and comprehensive productivity application that seamlessly combines a to-do list with the Pomodoro time-management technique. Built with React, TypeScript, and modern web technologies.

![PomodoroTodo Preview](https://images.pexels.com/photos/6054359/pexels-photo-6054359.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

### 🍅 Pomodoro Timer
- **Beautiful Tomato-Styled Timer**: Realistic tomato-shaped timer with embossed visual effects
- **Customizable Durations**: Adjustable work/break periods (default: 25min work, 5min break)
- **Smart Session Management**: Automatic break transitions with notifications
- **Visual Progress**: Circular progress indicator with smooth animations

### ✅ Task Management
- **Intuitive Todo List**: Clean, modern interface for task management
- **Drag & Drop Reordering**: Easily reorganize tasks with smooth animations
- **Task Actions**: Add, edit, delete, and complete tasks with visual feedback
- **Pomodoro Integration**: Start timer directly from any task with tomato button
- **Completion Tracking**: Separate completed tasks section with timestamps

### 📊 Progress Dashboard
- **Real-time Statistics**: Track daily tasks, pomodoros, focus time, and streaks
- **Visual Progress Bars**: Beautiful animated progress indicators
- **Weekly Overview**: Chart showing productivity trends over time
- **Achievement Tracking**: Monitor your productivity goals and milestones

### ⚙️ Customization & Settings
- **Multiple Themes**: Choose from Tomato Red, Mint Green, or Midnight Blue themes
- **Timer Preferences**: Customize work, break, and long break durations
- **Notification Controls**: Toggle sounds, browser notifications, and auto-start options
- **Persistent Settings**: All preferences saved automatically in localStorage

### 🎨 Design & UX
- **Apple-Level Aesthetics**: Premium design with attention to detail
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: Keyboard shortcuts and screen reader friendly
- **Modern UI**: Clean typography, proper spacing, and visual hierarchy

### ⌨️ Keyboard Shortcuts
- **Space**: Start/Pause timer
- **N**: Next task
- **S**: Settings
- **Escape**: Close modals

## 🚀 Getting Started

### ✅ Pre-requisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd pomodoro-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── TodoList/        # Task management components
│   ├── PomodoroTimer/   # Timer modal and controls
│   ├── ProgressDashboard/ # Statistics and charts
│   └── Settings/        # Configuration modal
├── context/             # React Context for state management
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Helper functions and utilities
└── styles/              # Global styles and themes
```

## 🔧 Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: CSS3, Flexbox, Grid
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: React Beautiful DnD
- **Charts**: Chart.js, React Chart.js 2
- **Build Tool**: Vite
- **State Management**: React Context API + useReducer

## 📱 Responsive Design

The application is fully responsive with breakpoints optimized for:
- **Mobile**: < 768px (Touch-friendly interface)
- **Tablet**: 768px - 1024px (Adapted layouts)
- **Desktop**: > 1024px (Full feature set)

## 🎯 Core Features Explained

### ✅ Task Management
- **Add Tasks**: Simple input field with instant feedback
- **Edit Tasks**: Double-click or edit button for inline editing
- **Complete Tasks**: Checkbox moves tasks to completed section
- **Delete Tasks**: Remove unwanted tasks with confirmation
- **Reorder Tasks**: Drag and drop to prioritize

### ✅ Pomodoro Technique
- **Work Sessions**: Default 25-minute focused work periods
- **Short Breaks**: 5-minute breaks between work sessions
- **Long Breaks**: 15-minute breaks after 4 work sessions
- **Session Tracking**: Automatic logging of completed sessions

### ✅ Data Persistence
- **localStorage**: All data persists between browser sessions
- **Auto-save**: Changes saved automatically without user action
- **Data Recovery**: Graceful handling of corrupted data

## 🔒 Privacy & Security

- **Local Storage Only**: No data sent to external servers
- **No Tracking**: No analytics or user tracking
- **Offline Capable**: Works completely offline
- **No Account Required**: Immediate use without registration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Pomodoro Technique® by Francesco Cirillo
- Icons by [Lucide](https://lucide.dev/)
- Stock photos by [Pexels](https://pexels.com/)
- Inspiration from modern productivity apps

## 🔮 Future Enhancements

- [ ] Cloud synchronization
- [ ] Team collaboration features
- [ ] Advanced analytics and insights
- [ ] Integration with calendar apps
- [ ] Mobile app version
- [ ] Custom sound library
- [ ] Goal setting and rewards system
---
**Made with ❤️ for productivity enthusiasts...**
