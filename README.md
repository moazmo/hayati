# حياتي - Hayati

<div align="center">
  
  **نظم حياتك بذكاء**
  
  *Organize your life intelligently*

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/hayati-app/hayati)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
  [![Electron](https://img.shields.io/badge/Electron-26+-green.svg)](https://www.electronjs.org/)
  [![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

</div>

## 🌟 About | عن التطبيق

**Hayati** is a comprehensive Arabic-first desktop application for Islamic life management. Designed specifically for Arabic-speaking users, it combines modern technology with Islamic values to help organize daily tasks, track positive habits, and monitor prayer times.

**حياتي** هو تطبيق سطح المكتب الشامل لإدارة الحياة الإسلامية باللغة العربية. مصمم خصيصاً للمستخدمين الناطقين بالعربية، يجمع بين التكنولوجيا الحديثة والقيم الإسلامية لمساعدتك على تنظيم المهام اليومية وتتبع العادات الإيجابية ومراقبة أوقات الصلاة.

## ✨ Features | المميزات

### 📋 Task Management | إدارة المهام
- Create, organize, and track daily tasks
- Priority levels and categories
- Due date reminders and notifications
- Recurring task patterns
- Arabic RTL support

### 🔄 Habit Tracking | تتبع العادات
- Build and maintain positive habits
- Streak tracking and progress visualization
- Islamic habit templates
- Customizable frequency and goals
- Achievement analytics

### 🕌 Prayer Times | أوقات الصلاة
- Accurate prayer times calculation
- Location-based timing
- Prayer reminders and notifications
- Multiple calculation methods
- Islamic calendar integration

### 📊 Analytics & Insights | التحليلات والرؤى
- Personal productivity dashboard
- Habit success rates
- Task completion trends
- Weekly and monthly reports
- Visual progress charts

### 🔧 Advanced Features | المميزات المتقدمة
- **Quick Actions Panel**: Command palette with keyboard shortcuts (Ctrl+K)
- **Data Export/Import**: Backup and restore with JSON/CSV support
- **Advanced Search**: Global search across tasks and habits
- **Background Mode**: System tray integration
- **Desktop Notifications**: Rich interactive notifications
- **Dark/Light Theme**: Automatic and manual theme switching

## 🚀 Getting Started | البدء السريع

### Prerequisites | المتطلبات

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation | التثبيت

1. **Clone the repository | استنساخ المستودع**
   ```bash
   git clone https://github.com/hayati-app/hayati.git
   cd hayati
   ```

2. **Install dependencies | تثبيت التبعيات**
   ```bash
   npm install
   ```

3. **Start development server | تشغيل خادم التطوير**
   ```bash
   npm run dev
   ```

4. **Build for production | البناء للإنتاج**
   ```bash
   npm run build
   npm run package
   ```

## 🛠️ Development | التطوير

### Project Structure | هيكل المشروع

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
- `npm run build:main` - Build main process only
- `npm run build:renderer` - Build renderer process only
- `npm run package` - Package application for distribution
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Technology Stack | المكدس التقني

- **Frontend**: React 18, TypeScript, Styled Components
- **Backend**: Electron, Node.js, SQLite
- **State Management**: Redux Toolkit
- **UI Components**: Custom styled components
- **Icons**: React Icons (Feather)
- **Fonts**: Cairo (Arabic), Segoe UI (English)
- **Build Tools**: Vite, Electron Builder

## 🌍 Internationalization | التعدد اللغوي

The application is designed with Arabic as the primary language but includes English support:

- **Arabic (العربية)**: Primary language with full RTL support
- **English**: Secondary language for wider accessibility
- **Font Support**: Cairo font family for beautiful Arabic typography
- **Layout**: Right-to-left (RTL) layout with proper Arabic text flow

## 🤝 Contributing | المساهمة

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### How to Contribute | كيفية المساهمة

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines | إرشادات التطوير

- Follow the existing code style and conventions
- Write meaningful commit messages in English
- Add appropriate documentation for new features
- Ensure all tests pass before submitting
- Respect Islamic values and cultural sensitivity

## 📄 License | الترخيص

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments | الشكر والتقدير

- **Islamic Community**: For inspiration and feedback
- **Open Source Contributors**: For their valuable contributions
- **Cairo Font**: For beautiful Arabic typography
- **Electron Team**: For the amazing cross-platform framework
- **React Team**: For the powerful UI library

## 📞 Support | الدعم

- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/hayati-app/hayati/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/hayati-app/hayati/discussions)
- **Email**: contact@hayati-app.com
- **Documentation**: Visit our [Wiki](https://github.com/hayati-app/hayati/wiki)

## 🗺️ Roadmap | خريطة الطريق

### Version 1.1 (Planned)

- [ ] Mobile companion app
- [ ] Cloud synchronization
- [ ] Family sharing features
- [ ] Advanced Islamic calendar

### Version 1.2 (Future)

- [ ] AI-powered insights
- [ ] Voice commands in Arabic
- [ ] Plugin system
- [ ] Multi-platform support

## 💝 Donations | التبرعات

If you find this project helpful, consider supporting its development:

- **GitHub Sponsors**: [Sponsor this project](https://github.com/sponsors/hayati-app)
- **PayPal**: [Make a donation](https://paypal.me/hayatiapp)
- **Sadaqah**: This project is developed as Sadaqah Jariyah for the Muslim community

---

Made with ❤️ for the Muslim community | صُنع بـ ❤️ للمجتمع المسلم

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd f:\\VsCodeFolders\\Life_management_app
   npm install
   ```

2. **Development Mode**
   ```bash
   npm run dev
   ```
   This will start both the Electron main process and the Vite development server.

3. **Build for Production**
   ```bash
   npm run build
   npm run package
   ```

## Database Schema

The app uses SQLite with the following main tables:
- `tasks` - User tasks with categories, priorities, and due dates
- `habits` - Daily/weekly habits with streak tracking
- `habit_logs` - Individual habit completion logs
- `prayer_times` - Cached prayer times for locations
- `prayer_logs` - Prayer completion tracking
- `settings` - User preferences and app configuration

## Key Components

### 1. Task Management
- Create tasks with Arabic/English titles
- Categorize tasks (daily, study, health, religious, etc.)
- Set priorities and due dates
- Mark tasks as complete/incomplete

### 2. Habits Tracking
- Define daily/weekly habits
- Track completion streaks
- Categories for different types of habits
- Visual progress indicators

### 3. Prayer Times
- Automatic prayer time calculation based on location
- Prayer completion logging
- Islamic calendar integration
- Reminder notifications

### 4. Internationalization
- Full Arabic RTL support
- English translation fallback
- Dynamic language switching
- Cultural considerations for Islamic features

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for consistency
- Styled Components for styling
- Component-based architecture

### State Management
- Redux Toolkit for global state
- Async thunks for API calls
- Slice-based state organization

### Database Operations
- All database operations are asynchronous
- Error handling for database failures
- Data validation before storage

## Future Enhancements (Phase 2 & 3)

### Phase 2 - Enhanced Features
- Advanced scheduling and reminders
- Analytics and progress reports
- Custom categories and goals
- Enhanced notification system

### Phase 3 - Advanced Integration
- Cloud synchronization
- Multi-device support
- Data export/import
- Advanced reporting and insights

## Arabic-Specific Features

### RTL Support
- Right-to-left layout for Arabic content
- Arabic font support (Cairo, Noto Sans Arabic)
- Proper text alignment and spacing
- Cultural considerations for Islamic content

### Islamic Features
- Prayer times calculation for any location
- Islamic calendar integration
- Adhkar and religious reminders
- Qibla direction (future enhancement)

## Contributing

1. Follow TypeScript best practices
2. Maintain Arabic/English translation consistency
3. Test RTL layout compatibility
4. Ensure offline-first functionality

## License
MIT License

---

**Note**: This is the MVP version focusing on core functionality. Additional features will be implemented in subsequent phases based on user feedback and requirements.
