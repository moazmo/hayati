import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { 
  FiX,
  FiPlus,
  FiSearch,
  FiCalendar,
  FiCheckSquare,
  FiRepeat,
  FiTarget,
  FiClock,
  FiBarChart,
  FiSettings,
  FiDatabase,
  FiSun
} from 'react-icons/fi';
import { AppDispatch } from '../store';
import { createTask } from '../store/slices/tasksSlice';
import { createHabit } from '../store/slices/habitsSlice';
import { 
  TaskCategory, 
  Priority, 
  HabitCategory, 
  HabitFrequency 
} from '../../shared/types';
import HayatiLogo from './HayatiLogo';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: flex-start;
  justify-content: center;
  z-index: 10000;
  padding-top: 100px;
  backdrop-filter: blur(4px);
`;

const Panel = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.2s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #212121;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: #757575;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    
    &:hover {
      background: #f5f5f5;
      color: #212121;
    }
  }
`;

const SearchBox = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #f8f9fa;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    background: white;
  }
  
  &::placeholder {
    color: #757575;
  }
`;

const ActionsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ActionGroup = styled.div`
  padding: 16px 0;
  
  .group-title {
    padding: 0 24px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #757575;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ActionItem = styled.button<{ highlighted?: boolean }>`
  width: 100%;
  padding: 12px 24px;
  border: none;
  background: ${props => props.highlighted ? '#f5f5f5' : 'transparent'};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.1s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  .icon {
    width: 20px;
    height: 20px;
    color: #2196F3;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-size: 14px;
      color: #212121;
      margin-bottom: 2px;
      font-weight: 500;
    }
    
    .description {
      font-size: 12px;
      color: #757575;
    }
  }
  
  .shortcut {
    font-size: 11px;
    color: #757575;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
`;

const Footer = styled.div`
  padding: 12px 24px;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
  font-size: 12px;
  color: #757575;
  text-align: center;
`;

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: string;
  action: () => void;
  keywords: string[];
}

interface QuickActionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #757575;
`;

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const quickActions: QuickAction[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'لوحة التحكم',
      description: 'الانتقال إلى الصفحة الرئيسية',
      icon: <FiCheckSquare />,
      shortcut: 'Ctrl+1',
      category: 'navigation',
      action: () => { navigate('/'); onClose(); },
      keywords: ['dashboard', 'home', 'الرئيسية', 'لوحة']
    },
    {
      id: 'nav-tasks',
      title: 'المهام',
      description: 'إدارة وعرض المهام',
      icon: <FiCheckSquare />,
      shortcut: 'Ctrl+2',
      category: 'navigation',
      action: () => { navigate('/tasks'); onClose(); },
      keywords: ['tasks', 'todo', 'المهام']
    },
    {
      id: 'nav-habits',
      title: 'العادات',
      description: 'تتبع العادات اليومية',
      icon: <FiRepeat />,
      shortcut: 'Ctrl+3',
      category: 'navigation',
      action: () => { navigate('/habits'); onClose(); },
      keywords: ['habits', 'العادات', 'يومية']
    },
    {
      id: 'nav-prayers',
      title: 'مواقيت الصلاة',
      description: 'عرض أوقات الصلاة',
      icon: <FiSun />,
      shortcut: 'Ctrl+4',
      category: 'navigation',
      action: () => { navigate('/prayers'); onClose(); },
      keywords: ['prayers', 'صلاة', 'مواقيت']
    },
    {
      id: 'nav-calendar',
      title: 'التقويم',
      description: 'عرض التقويم والأحداث',
      icon: <FiCalendar />,
      shortcut: 'Ctrl+5',
      category: 'navigation',
      action: () => { navigate('/calendar'); onClose(); },
      keywords: ['calendar', 'تقويم', 'أحداث']
    },
    {
      id: 'nav-goals',
      title: 'الأهداف',
      description: 'إدارة الأهداف والتقدم',
      icon: <FiTarget />,
      category: 'navigation',
      action: () => { navigate('/goals'); onClose(); },
      keywords: ['goals', 'أهداف', 'تقدم']
    },
    {
      id: 'nav-pomodoro',
      title: 'البومودورو',
      description: 'مؤقت البومودورو للإنتاجية',
      icon: <FiClock />,
      category: 'navigation',
      action: () => { navigate('/pomodoro'); onClose(); },
      keywords: ['pomodoro', 'timer', 'بومودورو', 'مؤقت']
    },
    {
      id: 'nav-analytics',
      title: 'التحليلات',
      description: 'عرض إحصائيات الأداء',
      icon: <FiBarChart />,
      category: 'navigation',
      action: () => { navigate('/analytics'); onClose(); },
      keywords: ['analytics', 'statistics', 'تحليلات', 'إحصائيات']
    },
    {
      id: 'nav-search',
      title: 'البحث المتقدم',
      description: 'البحث في جميع البيانات',
      icon: <FiSearch />,
      category: 'navigation',
      action: () => { navigate('/search'); onClose(); },
      keywords: ['search', 'find', 'بحث']
    },
    {
      id: 'nav-data',
      title: 'إدارة البيانات',
      description: 'تصدير واستيراد البيانات',
      icon: <FiDatabase />,
      category: 'navigation',
      action: () => { navigate('/data-manager'); onClose(); },
      keywords: ['data', 'backup', 'export', 'بيانات', 'نسخ احتياطي']
    },
    {
      id: 'nav-settings',
      title: 'الإعدادات',
      description: 'تخصيص التطبيق',
      icon: <FiSettings />,
      shortcut: 'Ctrl+,',
      category: 'navigation',
      action: () => { navigate('/settings'); onClose(); },
      keywords: ['settings', 'preferences', 'إعدادات', 'تخصيص']
    },
    
    // Quick Actions
    {
      id: 'add-task',
      title: 'إضافة مهمة جديدة',
      description: 'إنشاء مهمة سريعة',
      icon: <FiPlus />,
      shortcut: 'Ctrl+N',
      category: 'quick',
      action: () => {
        const title = prompt('عنوان المهمة:');
        if (title) {
          dispatch(createTask({
            title,
            description: '',
            category: TaskCategory.DAILY,
            priority: Priority.MEDIUM,
            dueDate: new Date(),
            isCompleted: false,
            isRecurring: false,
            tags: []
          }));
        }
        onClose();
      },
      keywords: ['new task', 'add', 'create', 'مهمة جديدة', 'إضافة']
    },
    {
      id: 'add-habit',
      title: 'إضافة عادة جديدة',
      description: 'إنشاء عادة للتتبع',
      icon: <FiPlus />,
      category: 'quick',
      action: () => {
        const name = prompt('اسم العادة:');
        if (name) {
          dispatch(createHabit({
            name,
            description: '',
            category: HabitCategory.PERSONAL,
            frequency: HabitFrequency.DAILY,
            targetCount: 1,
            isActive: true,
            currentStreak: 0,
            longestStreak: 0
          }));
        }
        onClose();
      },
      keywords: ['new habit', 'add habit', 'عادة جديدة', 'إضافة عادة']
    }
  ];

  const filteredActions = quickActions.filter(action => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return action.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
           action.title.toLowerCase().includes(query) ||
           action.description.toLowerCase().includes(query);
  });

  const groupedActions = filteredActions.reduce((groups, action) => {
    if (!groups[action.category]) {
      groups[action.category] = [];
    }
    groups[action.category].push(action);
    return groups;
  }, {} as Record<string, QuickAction[]>);

  const categoryNames = {
    navigation: 'التنقل',
    quick: 'إجراءات سريعة',
    recent: 'الأخيرة'
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const totalActions = filteredActions.length;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % totalActions);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + totalActions) % totalActions);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[highlightedIndex]) {
          filteredActions[highlightedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, highlightedIndex, onClose]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setSearchQuery('');
            setHighlightedIndex(0);
            // Toggle panel - if closed, this would be handled by parent
            break;
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  if (!isOpen) return null;

  let actionIndex = 0;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <div className="title">
            <HayatiLogo size={20} variant="icon" />
            الإجراءات السريعة
          </div>
          <button className="close-btn" onClick={onClose} aria-label="إغلاق لوحة الإجراءات السريعة">
            <FiX />
          </button>
        </Header>
        
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="ابحث عن إجراء أو صفحة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </SearchBox>
        
        <ActionsList>
          {Object.entries(groupedActions).map(([category, actions]) => (
            <ActionGroup key={category}>
              <div className="group-title">{categoryNames[category as keyof typeof categoryNames]}</div>
              {actions.map((action) => {
                const currentIndex = actionIndex++;
                return (
                  <ActionItem
                    key={action.id}
                    highlighted={currentIndex === highlightedIndex}
                    onClick={action.action}
                  >
                    <div className="icon">{action.icon}</div>
                    <div className="content">
                      <div className="title">{action.title}</div>
                      <div className="description">{action.description}</div>
                    </div>
                    {action.shortcut && (
                      <div className="shortcut">{action.shortcut}</div>
                    )}
                  </ActionItem>
                );
              })}
            </ActionGroup>
          ))}
          
          {filteredActions.length === 0 && (
            <EmptyState>
              لم يتم العثور على نتائج
            </EmptyState>
          )}
        </ActionsList>
        
        <Footer>
          استخدم ↑ ↓ للتنقل، Enter للتنفيذ، Esc للإغلاق
        </Footer>
      </Panel>
    </Overlay>
  );
};

export default QuickActionsPanel;
