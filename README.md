# حياتي - Hayati

**نظم حياتك بذكاء** | *Organize your life intelligently*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-26+-green.svg)](https://www.electronjs.org/)

## About

As a Muslim developer, I wanted to create something that would help our community stay organized while keeping our Islamic values at the center. **Hayati** (My Life) is a desktop app I built to manage daily tasks, track positive habits, and never miss prayer times.

The app is designed Arabic-first because I believe our language deserves better representation in technology. Everything from the UI to the notifications respects our culture and values.

**حياتي** هو تطبيق طورته لمساعدة إخواني المسلمين في تنظيم حياتهم اليومية. يدعم اللغة العربية بشكل كامل ويحترم قيمنا الإسلامية في كل جانب من جوانبه.

## Screenshots

<div align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="400">
  <img src="docs/screenshots/tasks.png" alt="Tasks" width="400">
</div>

<div align="center">
  <img src="docs/screenshots/habits.png" alt="Habits" width="400">
  <img src="docs/screenshots/prayers.png" alt="Prayer Times" width="400">
</div>

## Features

**Task Management**
- Create and organize daily tasks in Arabic or English
- Set priorities and due dates  
- Categories and smart reminders

**Habit Tracking**
- Track daily habits like Quran reading, exercise, or dhikr
- Visual streak tracking and progress analytics
- Islamic habit templates included

**Prayer Times**
- Accurate prayer times for your location
- Beautiful prayer reminders and notifications
- Multiple calculation methods supported

**Smart Features**
- Quick Actions panel (Ctrl+K) for fast navigation
- System tray support - runs in background
- Export/import your data anytime
- Dark and light themes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn  
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moazmo/hayati.git
   cd hayati
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
   npm run package
   ```

## Development

### Project Structure

```
hayati/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main entry point
│   │   ├── preload.js  # Preload script
│   │   └── services/   # Database and services
│   ├── renderer/       # React frontend
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Application pages
│   │   ├── services/   # Frontend services
│   │   ├── store/      # Redux store
│   │   └── types/      # TypeScript definitions
│   └── shared/         # Shared types and utilities
├── docs/               # Documentation
├── dist/               # Built application
└── package.json
```

### Available Scripts | الأوامر المتاحة

- `npm run dev` - Start development server
- `npm run build` - Build for production
### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run package` - Package application for distribution
- `npm run lint` - Run ESLint

### Tech Stack

- **Frontend**: React 18, TypeScript, Styled Components
- **Backend**: Electron, Node.js, SQLite
- **State Management**: Redux Toolkit
- **Icons**: React Icons (Feather)
- **Fonts**: Cairo (Arabic), Segoe UI (English)
- **Build Tools**: Vite, Electron Builder

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/moazmo/hayati/issues)
- **Discussions**: [GitHub Discussions](https://github.com/moazmo/hayati/discussions)

---

Built with ❤️ for the Muslim community | صُنع بـ ❤️ للمجتمع المسلم
