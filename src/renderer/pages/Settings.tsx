import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiGlobe, FiMapPin, FiBell, FiSave, FiRefreshCw } from 'react-icons/fi';
import { notificationService } from '../services/notificationService';
import NotificationTester from '../components/NotificationTester';
import AboutHayati from '../components/AboutHayati';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
  color: #212121;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #2196F3;
  }
`;

const Subtitle = styled.p`
  color: #757575;
  margin: 0 0 32px 0;
  font-size: 16px;
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 0 0 20px 0;
  color: #212121;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #2196F3;
    width: 20px;
    height: 20px;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
  
  .title {
    font-size: 16px;
    color: #212121;
    margin: 0 0 4px 0;
    font-weight: 500;
  }
  
  .description {
    font-size: 14px;
    color: #757575;
    margin: 0;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #212121;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
  
  &:hover {
    border-color: #bdbdbd;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #212121;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
  
  &:hover {
    border-color: #bdbdbd;
  }
`;

const Toggle = styled.button<{ active: boolean }>`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: ${props => props.active ? '#2196F3' : '#e0e0e0'};
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 4px;
    left: ${props => props.active ? '26px' : '4px'};
    transition: left 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  &:hover {
    background: ${props => props.active ? '#1976D2' : '#bdbdbd'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    }
  ` : `
    background: #f5f5f5;
    color: #757575;
    
    &:hover {
      background: #eeeeee;
      color: #212121;
    }
  `}
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Settings state
  const [settings, setSettings] = useState({
    language: i18n.language,
    theme: localStorage.getItem('appTheme') || 'light',
    location: 'القاهرة، مصر',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    notifications: {
      tasks: true,
      prayers: true,
      habits: true,
      daily: false
    },
    prayerMethod: 'EGYPTIAN_GENERAL_AUTHORITY'
  });

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({ ...prev, language }));
    i18n.changeLanguage(language);
    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
    // Save theme to localStorage and trigger theme change event
    localStorage.setItem('appTheme', theme);
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleNotificationToggle = (type: keyof typeof settings.notifications) => {
    const newValue = !settings.notifications[type];
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: newValue
      }
    }));

    // Update notification service settings
    const notificationSettings = notificationService.getSettings();
    switch (type) {
      case 'tasks':
        notificationService.updateSettings({ 
          tasks: { ...notificationSettings.tasks, enabled: newValue }
        });
        break;
      case 'prayers':
        notificationService.updateSettings({ 
          prayers: { ...notificationSettings.prayers, enabled: newValue }
        });
        break;
      case 'habits':
        notificationService.updateSettings({ 
          habits: { ...notificationSettings.habits, enabled: newValue }
        });
        break;
      case 'daily':
        // This could be a new setting for daily summaries
        break;
    }
  };

  const handleLocationChange = (value: string) => {
    setSettings(prev => ({ ...prev, location: value }));
  };

  const saveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Update notification service with comprehensive settings
    const notificationSettings = notificationService.getSettings();
    notificationService.updateSettings({
      ...notificationSettings,
      tasks: { ...notificationSettings.tasks, enabled: settings.notifications.tasks },
      prayers: { ...notificationSettings.prayers, enabled: settings.notifications.prayers },
      habits: { ...notificationSettings.habits, enabled: settings.notifications.habits }
    });
    
    // Test notification to confirm settings work
    if (settings.notifications.tasks || settings.notifications.prayers || settings.notifications.habits) {
      notificationService.showNotification({
        title: 'تم حفظ الإعدادات - Settings Saved',
        body: 'تم تحديث إعدادات الإشعارات بنجاح',
        tag: 'settings-saved'
      });
    }
    
    console.log('Settings saved:', settings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      language: 'ar',
      theme: 'light',
      location: 'القاهرة، مصر',
      coordinates: { lat: 30.0444, lng: 31.2357 },
      notifications: {
        tasks: true,
        prayers: true,
        habits: true,
        daily: false
      },
      prayerMethod: 'EGYPTIAN_GENERAL_AUTHORITY'
    };
    
    setSettings(defaultSettings);
    i18n.changeLanguage('ar');
    document.documentElement.dir = 'rtl';
  };

  return (
    <PageContainer>
      <Title>
        <FiRefreshCw />
        {t('settings.title')}
      </Title>
      <Subtitle>قم بتخصيص التطبيق ليناسب احتياجاتك</Subtitle>

      <SettingsSection>
        <SectionTitle>
          <FiGlobe />
          اللغة والمظهر
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <div className="title">لغة التطبيق</div>
            <div className="description">اختر اللغة المفضلة للواجهة</div>
          </SettingLabel>
          <Select 
            value={settings.language} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            aria-label="Language selection"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </Select>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <div className="title">مظهر التطبيق</div>
            <div className="description">اختر بين الوضع الفاتح والداكن</div>
          </SettingLabel>
          <Select 
            value={settings.theme} 
            onChange={(e) => handleThemeChange(e.target.value)}
            aria-label="Theme selection"
          >
            <option value="light">
              {settings.language === 'ar' ? '🌞 فاتح' : '🌞 Light'}
            </option>
            <option value="dark">
              {settings.language === 'ar' ? '🌙 داكن' : '🌙 Dark'}
            </option>
            <option value="auto">
              {settings.language === 'ar' ? '🔄 تلقائي' : '🔄 Auto'}
            </option>
          </Select>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiMapPin />
          الموقع والصلاة
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <div className="title">موقعك الحالي</div>
            <div className="description">يستخدم لحساب مواقيت الصلاة</div>
          </SettingLabel>
          <Input
            type="text"
            value={settings.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="أدخل مدينتك"
            aria-label="Location input"
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <div className="title">طريقة حساب الصلاة</div>
            <div className="description">اختر الطريقة المناسبة لبلدك</div>
          </SettingLabel>
          <Select 
            value={settings.prayerMethod}
            onChange={(e) => setSettings(prev => ({ ...prev, prayerMethod: e.target.value }))}
            aria-label="Prayer calculation method"
          >
            <option value="EGYPTIAN_GENERAL_AUTHORITY">الهيئة المصرية العامة للمساحة</option>
            <option value="UNIVERSITY_OF_ISLAMIC_SCIENCES_KARACHI">جامعة العلوم الإسلامية - كراتشي</option>
            <option value="ISLAMIC_SOCIETY_OF_NORTH_AMERICA">الجمعية الإسلامية لأمريكا الشمالية</option>
            <option value="MUSLIM_WORLD_LEAGUE">رابطة العالم الإسلامي</option>
            <option value="UMM_AL_QURA_UNIVERSITY_MAKKAH">جامعة أم القرى - مكة</option>
          </Select>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiBell />
          الإشعارات
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <div className="title">تذكير بالمهام</div>
            <div className="description">إشعارات عند اقتراب موعد المهام</div>
          </SettingLabel>
          <Toggle 
            active={settings.notifications.tasks}
            onClick={() => handleNotificationToggle('tasks')}
            aria-label="Toggle task notifications"
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <div className="title">تذكير بالصلاة</div>
            <div className="description">إشعارات عند دخول وقت الصلاة</div>
          </SettingLabel>
          <Toggle 
            active={settings.notifications.prayers}
            onClick={() => handleNotificationToggle('prayers')}
            aria-label="Toggle prayer notifications"
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <div className="title">تذكير بالعادات</div>
            <div className="description">إشعارات لتتبع العادات اليومية</div>
          </SettingLabel>
          <Toggle 
            active={settings.notifications.habits}
            onClick={() => handleNotificationToggle('habits')}
            aria-label="Toggle habit notifications"
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            <div className="title">ملخص يومي</div>
            <div className="description">إشعار بملخص اليوم في المساء</div>
          </SettingLabel>
          <Toggle 
            active={settings.notifications.daily}
            onClick={() => handleNotificationToggle('daily')}
            aria-label="Toggle daily summary notifications"
          />
        </SettingItem>
      </SettingsSection>

      {/* Notification Testing Section */}
      <NotificationTester />

      {/* About Section */}
      <AboutHayati />

      <ButtonGroup>
        <Button variant="primary" onClick={saveSettings}>
          <FiSave />
          حفظ الإعدادات
        </Button>
        <Button variant="secondary" onClick={resetSettings}>
          <FiRefreshCw />
          استعادة الافتراضي
        </Button>
      </ButtonGroup>
    </PageContainer>
  );
};

export default Settings;
