import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import PrayerTimes from './pages/PrayerTimes';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Pomodoro from './pages/Pomodoro';
import DataManager from './pages/DataManager';
import AdvancedSearch from './pages/AdvancedSearch';
import Settings from './pages/Settings';
import { QuickActionsPanel } from './components/QuickActionsPanel';

// Navigation wrapper component to handle tray navigation
const AppContent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for navigation events from tray
    const handleTrayNavigation = (event: CustomEvent) => {
      const path = event.detail;
      navigate(path);
    };

    window.addEventListener('electron-navigate', handleTrayNavigation as EventListener);
    return () => window.removeEventListener('electron-navigate', handleTrayNavigation as EventListener);
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/prayers" element={<PrayerTimes />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/data-manager" element={<DataManager />} />
        <Route path="/search" element={<AdvancedSearch />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

// Light theme
const lightTheme = {
  colors: {
    primary: '#2196F3',
    secondary: '#FF9800',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#212121',
    textSecondary: '#757575',
    border: '#e0e0e0',
    islamic: '#00796B'
  },
  fonts: {
    arabic: "'Cairo', sans-serif",
    english: "'Segoe UI', sans-serif"
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: '8px',
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.1)',
    elevated: '0 4px 16px rgba(0,0,0,0.15)'
  }
};

// Dark theme
const darkTheme = {
  colors: {
    primary: '#64B5F6',
    secondary: '#FFB74D',
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    islamic: '#4DB6AC'
  },
  fonts: {
    arabic: "'Cairo', sans-serif",
    english: "'Segoe UI', sans-serif"
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: '8px',
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.3)',
    elevated: '0 4px 16px rgba(0,0,0,0.4)'
  }
};

const GlobalStyle = createGlobalStyle<{ isRtl: boolean; theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.isRtl ? props.theme.fonts.arabic : props.theme.fonts.english};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    direction: ${props => props.isRtl ? 'rtl' : 'ltr'};
  }

  .app-container {
    display: flex;
    height: 100vh;
    direction: ${props => props.isRtl ? 'rtl' : 'ltr'};
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Theme state management
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // Quick Actions Panel state
  const [isQuickActionsPanelOpen, setIsQuickActionsPanelOpen] = useState(false);
  
  // Get theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    setCurrentTheme(savedTheme);
  }, []);
  
  // Listen for theme changes from settings
  useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('appTheme') || 'light';
      setCurrentTheme(newTheme);
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom theme change events
    window.addEventListener('themeChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  // Global keyboard shortcut for Quick Actions Panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsQuickActionsPanelOpen(true);
      }
      
      if (event.key === 'Escape') {
        setIsQuickActionsPanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto theme detection
  const getTheme = () => {
    if (currentTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? darkTheme : lightTheme;
    }
    return currentTheme === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getTheme();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle isRtl={isRtl} theme={theme} />
      <Router>
        <AppContainer className="app-container">
          <Sidebar />
          <MainContent>
            <AppContent />
          </MainContent>
        </AppContainer>
        
        {/* Quick Actions Panel */}
        <QuickActionsPanel 
          isOpen={isQuickActionsPanelOpen} 
          onClose={() => setIsQuickActionsPanelOpen(false)} 
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
