import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiPlay, 
  FiPause, 
  FiSquare, 
  FiClock, 
  FiSettings,
  FiCoffee,
  FiRepeat,
  FiTarget,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 48px;
  
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 0 16px 0;
    font-size: 32px;
    color: #333;
    
    svg {
      color: #2196F3;
    }
  }
  
  p {
    color: #666;
    font-size: 18px;
    margin: 0;
  }
`;

const TimerCard = styled.div<{ isActive: boolean; mode: string }>`
  background: white;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  margin-bottom: 32px;
  border: 4px solid ${props => {
    if (props.mode === 'break') return '#4CAF50';
    if (props.mode === 'longBreak') return '#FF9800';
    return '#2196F3';
  }};
  
  ${props => props.isActive && `
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
  `}
`;

const ModeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const ModeButton = styled.button<{ active: boolean; mode: string }>`
  padding: 12px 24px;
  border: 2px solid ${props => {
    if (props.mode === 'break') return '#4CAF50';
    if (props.mode === 'longBreak') return '#FF9800';
    return '#2196F3';
  }};
  background: ${props => props.active ? (
    props.mode === 'break' ? '#4CAF50' : 
    props.mode === 'longBreak' ? '#FF9800' : '#2196F3'
  ) : 'white'};
  color: ${props => props.active ? 'white' : (
    props.mode === 'break' ? '#4CAF50' : 
    props.mode === 'longBreak' ? '#FF9800' : '#2196F3'
  )};
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => {
      if (props.mode === 'break') return '#4CAF50';
      if (props.mode === 'longBreak') return '#FF9800';
      return '#2196F3';
    }};
    color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const TimerDisplay = styled.div<{ mode: string }>`
  font-size: 72px;
  font-weight: bold;
  color: ${props => {
    if (props.mode === 'break') return '#4CAF50';
    if (props.mode === 'longBreak') return '#FF9800';
    return '#2196F3';
  }};
  margin: 32px 0;
  font-family: 'Courier New', monospace;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const SessionInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  font-size: 16px;
  color: #666;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #2196F3;
          color: white;
          &:hover { background: #1976D2; }
        `;
      case 'danger':
        return `
          background: #f44336;
          color: white;
          &:hover { background: #d32f2f; }
        `;
      default:
        return `
          background: #e0e0e0;
          color: #333;
          &:hover { background: #d0d0d0; }
        `;
    }
  }}
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const SettingsPanel = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .setting-label {
    font-weight: 500;
    color: #333;
  }
  
  .setting-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const TimeInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#2196F3' : '#ddd'};
  background: ${props => props.active ? '#2196F3' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #2196F3;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  
  .stat-number {
    font-size: 28px;
    font-weight: bold;
    color: #2196F3;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
  }
`;

const TimerTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
`;

const TimerDescription = styled.p`
  margin: 0 0 24px 0;
  color: #666;
  font-size: 16px;
`;

const SettingsTitle = styled.h3`
  margin: 0 0 24px 0;
  text-align: center;
`;

const SettingUnit = styled.span`
  font-size: 14px;
  color: #666;
`;

type PomodoroMode = 'work' | 'break' | 'longBreak';

interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  longBreakInterval: number; // after how many work sessions
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true
  });

  // Load settings and stats from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    const savedStats = localStorage.getItem('pomodoroStats');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setCompletedSessions(stats.completedSessions || 0);
      setTodaySessions(stats.todaySessions || 0);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Update timer based on current mode
  useEffect(() => {
    let duration;
    switch (mode) {
      case 'work':
        duration = settings.workDuration * 60;
        break;
      case 'break':
        duration = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = settings.longBreakDuration * 60;
        break;
    }
    
    if (!isActive) {
      setTimeLeft(duration);
    }
  }, [mode, settings, isActive]);

  // Timer countdown logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (settings.soundEnabled) {
      // Play notification sound (browser notification sound)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LKdSEFJHfH8diXSAAUXrTp66hVFApGn+DyvmwbBDek5PipcxgHL3bJ9NuaTA');
      audio.play().catch(() => {
        // Fallback if audio fails
        console.log('Timer completed!');
      });
    }

    // Update stats
    if (mode === 'work') {
      const newCompleted = completedSessions + 1;
      const newToday = todaySessions + 1;
      
      setCompletedSessions(newCompleted);
      setTodaySessions(newToday);
      
      localStorage.setItem('pomodoroStats', JSON.stringify({
        completedSessions: newCompleted,
        todaySessions: newToday
      }));

      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        const shouldBeLongBreak = newCompleted % settings.longBreakInterval === 0;
        setMode(shouldBeLongBreak ? 'longBreak' : 'break');
        setTimeout(() => setIsActive(true), 1000);
      }
    } else if (settings.autoStartWork) {
      // Auto-start work session after break
      setMode('work');
      setTimeout(() => setIsActive(true), 1000);
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      const title = mode === 'work' ? 'وقت الراحة!' : 'وقت العمل!';
      const body = mode === 'work' 
        ? 'أحسنت! حان وقت أخذ استراحة قصيرة.' 
        : 'انتهت الاستراحة، حان وقت العودة للعمل.';
      
      new Notification(title, {
        body,
        icon: '/icon.png'
      });
    }
  };

  const startTimer = () => {
    setIsActive(true);
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    let duration;
    switch (mode) {
      case 'work':
        duration = settings.workDuration * 60;
        break;
      case 'break':
        duration = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = settings.longBreakDuration * 60;
        break;
    }
    setTimeLeft(duration);
  };

  const switchMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeTitle = (mode: PomodoroMode) => {
    switch (mode) {
      case 'work': return 'وقت العمل';
      case 'break': return 'استراحة قصيرة';
      case 'longBreak': return 'استراحة طويلة';
    }
  };

  const getModeDescription = (mode: PomodoroMode) => {
    switch (mode) {
      case 'work': return 'ركز على مهمة واحدة فقط';
      case 'break': return 'خذ نفساً عميقاً واسترخي';
      case 'longBreak': return 'استمتع بفترة راحة أطول';
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiClock />
          تقنية البومودورو - Pomodoro Timer
        </h1>
        <p>تقنية إدارة الوقت لتحسين التركيز والإنتاجية</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="stat-number">{completedSessions}</div>
          <div className="stat-label">جلسات مكتملة</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{todaySessions}</div>
          <div className="stat-label">جلسات اليوم</div>
        </StatCard>
        <StatCard>
          <div className="stat-number">{Math.floor(completedSessions * settings.workDuration / 60)}h</div>
          <div className="stat-label">إجمالي وقت التركيز</div>
        </StatCard>
      </StatsGrid>

      <ModeSelector>
        <ModeButton 
          active={mode === 'work'} 
          mode="work"
          onClick={() => switchMode('work')}
        >
          <FiTarget />
          عمل ({settings.workDuration}د)
        </ModeButton>
        <ModeButton 
          active={mode === 'break'} 
          mode="break"
          onClick={() => switchMode('break')}
        >
          <FiCoffee />
          راحة ({settings.shortBreakDuration}د)
        </ModeButton>
        <ModeButton 
          active={mode === 'longBreak'} 
          mode="longBreak"
          onClick={() => switchMode('longBreak')}
        >
          <FiRepeat />
          راحة طويلة ({settings.longBreakDuration}د)
        </ModeButton>
      </ModeSelector>

      <TimerCard isActive={isActive} mode={mode}>
        <TimerTitle>
          {getModeTitle(mode)}
        </TimerTitle>
        <TimerDescription>
          {getModeDescription(mode)}
        </TimerDescription>
        
        <TimerDisplay mode={mode}>
          {formatTime(timeLeft)}
        </TimerDisplay>
        
        <SessionInfo>
          <div className="info-item">
            <FiTarget />
            الجلسة {completedSessions + 1}
          </div>
          <div className="info-item">
            <FiRepeat />
            {completedSessions % settings.longBreakInterval} / {settings.longBreakInterval}
          </div>
        </SessionInfo>

        <Controls>
          {!isActive ? (
            <ControlButton variant="primary" onClick={startTimer}>
              <FiPlay />
              بدء
            </ControlButton>
          ) : (
            <ControlButton variant="secondary" onClick={pauseTimer}>
              <FiPause />
              إيقاف مؤقت
            </ControlButton>
          )}
          
          <ControlButton variant="danger" onClick={resetTimer}>
            <FiSquare />
            إعادة تعيين
          </ControlButton>
          
          <ControlButton variant="secondary" onClick={() => setShowSettings(!showSettings)}>
            <FiSettings />
            الإعدادات
          </ControlButton>
        </Controls>
      </TimerCard>

      <SettingsPanel isOpen={showSettings}>
        <SettingsTitle>إعدادات البومودورو</SettingsTitle>
        
        <SettingItem>
          <div className="setting-label">مدة جلسة العمل (دقائق)</div>
          <div className="setting-control">
            <TimeInput
              type="number"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => setSettings({
                ...settings,
                workDuration: Number(e.target.value)
              })}
            />
          </div>
        </SettingItem>

        <SettingItem>
          <div className="setting-label">مدة الاستراحة القصيرة (دقائق)</div>
          <div className="setting-control">
            <TimeInput
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => setSettings({
                ...settings,
                shortBreakDuration: Number(e.target.value)
              })}
            />
          </div>
        </SettingItem>

        <SettingItem>
          <div className="setting-label">مدة الاستراحة الطويلة (دقائق)</div>
          <div className="setting-control">
            <TimeInput
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => setSettings({
                ...settings,
                longBreakDuration: Number(e.target.value)
              })}
            />
          </div>
        </SettingItem>

        <SettingItem>
          <div className="setting-label">الاستراحة الطويلة كل</div>
          <div className="setting-control">
            <TimeInput
              type="number"
              min="2"
              max="10"
              value={settings.longBreakInterval}
              onChange={(e) => setSettings({
                ...settings,
                longBreakInterval: Number(e.target.value)
              })}
            />
            <SettingUnit>جلسات</SettingUnit>
          </div>
        </SettingItem>

        <SettingItem>
          <div className="setting-label">بدء الاستراحات تلقائياً</div>
          <div className="setting-control">
            <ToggleButton
              active={settings.autoStartBreaks}
              onClick={() => setSettings({
                ...settings,
                autoStartBreaks: !settings.autoStartBreaks
              })}
            >
              {settings.autoStartBreaks ? 'مفعل' : 'معطل'}
            </ToggleButton>
          </div>
        </SettingItem>

        <SettingItem>
          <div className="setting-label">بدء العمل بعد الاستراحة تلقائياً</div>
          <div className="setting-control">
            <ToggleButton
              active={settings.autoStartWork}
              onClick={() => setSettings({
                ...settings,
                autoStartWork: !settings.autoStartWork
              })}
            >
              {settings.autoStartWork ? 'مفعل' : 'معطل'}
            </ToggleButton>
          </div>
        </SettingItem>

        <SettingItem>
          <div className="setting-label">تفعيل الأصوات</div>
          <div className="setting-control">
            <ToggleButton
              active={settings.soundEnabled}
              onClick={() => setSettings({
                ...settings,
                soundEnabled: !settings.soundEnabled
              })}
            >
              {settings.soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
              {settings.soundEnabled ? 'مفعل' : 'معطل'}
            </ToggleButton>
          </div>
        </SettingItem>
      </SettingsPanel>
    </PageContainer>
  );
};

export default Pomodoro;
