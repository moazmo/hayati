import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiCheckCircle, FiClock, FiTrendingUp, FiTarget, FiCalendar, FiSun } from 'react-icons/fi';
import { RootState, AppDispatch } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchHabits } from '../store/slices/habitsSlice';
import { prayerTimesService, NextPrayerInfo } from '../services/prayerTimesService';
import HayatiLogo from '../components/HayatiLogo';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
  color: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 32px;
  text-align: center;
  
  h1 {
    font-size: 32px;
    margin: 0 0 8px 0;
    font-weight: 600;
  }
  
  p {
    font-size: 16px;
    margin: 0;
    opacity: 0.9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ color?: string }>`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.color || '#2196F3'};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => props.color || '#2196F3'}15;
    color: ${props => props.color || '#2196F3'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  .number {
    font-size: 32px;
    font-weight: bold;
    margin: 0 0 4px 0;
    color: #212121;
  }
  
  .label {
    margin: 0;
    color: #757575;
    font-size: 14px;
    font-weight: 500;
  }
  
  .sublabel {
    margin: 4px 0 0 0;
    color: #9E9E9E;
    font-size: 12px;
  }
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  h3 {
    font-size: 18px;
    margin: 0 0 16px 0;
    color: #212121;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 20px;
      height: 20px;
      color: #2196F3;
    }
  }
`;

const TaskItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${props => props.completed ? '#4CAF50' : '#e0e0e0'};
    background: ${props => props.completed ? '#4CAF50' : 'white'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
  }
  
  .text {
    flex: 1;
    font-size: 14px;
    color: ${props => props.completed ? '#757575' : '#212121'};
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  }
  
  .priority {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      if (props.completed) return '#e0e0e0';
      return '#FF9800'; // Will be dynamic based on priority
    }};
  }
`;

const HabitProgress = styled.div`
  margin-bottom: 16px;
  
  .habit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .habit-name {
    font-size: 14px;
    color: #212121;
    font-weight: 500;
  }
  
  .habit-streak {
    font-size: 12px;
    color: #4CAF50;
    background: #E8F5E8;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .progress-bar {
    height: 6px;
    background: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #4CAF50;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const NextPrayerCard = styled.div`
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #00796B 0%, #004D40 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 16px;
  
  .prayer-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .prayer-time {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .time-remaining {
    font-size: 12px;
    opacity: 0.8;
  }
`;

const LocationInfo = styled.div`
  font-size: 12px;
  color: #757575;
  text-align: center;
`;

const PriorityDot = styled.div<{ priorityColor: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.priorityColor};
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
  width: ${props => props.width}%;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: #757575;
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { habits } = useSelector((state: RootState) => state.habits);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchHabits());
    
    // Load prayer times
    const loadPrayerTimes = () => {
      const prayerInfo = prayerTimesService.getNextPrayer();
      setNextPrayerInfo(prayerInfo);
    };

    loadPrayerTimes();
    
    // Update prayer times every minute
    const interval = setInterval(loadPrayerTimes, 60000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Calculate statistics
  const today = new Date();
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  const completedTasks = tasks.filter(task => task.isCompleted);
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < today;
  });

  const todayCompletedTasks = todayTasks.filter(task => task.isCompleted);
  const todayPendingTasks = todayTasks.filter(task => !task.isCompleted);

  // Calculate habit statistics
  const activeHabits = habits.filter(habit => habit.isActive);
  const averageStreak = activeHabits.length > 0 
    ? Math.round(activeHabits.reduce((sum, h) => sum + h.currentStreak, 0) / activeHabits.length)
    : 0;

  // Mock habits data for display (replace with actual daily progress tracking)
  const mockHabitsForDisplay = activeHabits.slice(0, 3).map(habit => ({
    name: habit.name,
    current: habit.currentStreak > 0 ? habit.targetCount : Math.floor(habit.targetCount * 0.7),
    target: habit.targetCount,
    streak: habit.currentStreak
  }));

  const getPriorityColor = (priority: number) => {
    switch(priority) {
      case 4: return '#F44336'; // Urgent
      case 3: return '#FF9800'; // High
      case 2: return '#2196F3'; // Medium
      case 1: return '#9E9E9E'; // Low
      default: return '#2196F3';
    }
  };

  return (
    <PageContainer>
      <WelcomeSection>
        <LogoContainer>
          <HayatiLogo size={60} variant="full" color="white" />
        </LogoContainer>
        <h1>أهلاً وسهلاً بك</h1>
        <p>ابدأ يومك بتنظيم مهامك وتتبع عاداتك الإيجابية</p>
      </WelcomeSection>

      <StatsGrid>
        <StatCard color="#2196F3">
          <div className="icon">
            <FiCalendar />
          </div>
          <div className="number">{todayTasks.length}</div>
          <div className="label">{t('dashboard.todaysTasks')}</div>
          <div className="sublabel">{todayCompletedTasks.length} مكتمل من {todayTasks.length}</div>
        </StatCard>

        <StatCard color="#4CAF50">
          <div className="icon">
            <FiCheckCircle />
          </div>
          <div className="number">{completedTasks.length}</div>
          <div className="label">{t('dashboard.tasksCompleted')}</div>
          <div className="sublabel">من إجمالي {tasks.length} مهمة</div>
        </StatCard>

        <StatCard color="#FF9800">
          <div className="icon">
            <FiClock />
          </div>
          <div className="number">{overdueTasks.length}</div>
          <div className="label">مهام متأخرة</div>
          <div className="sublabel">تحتاج متابعة</div>
        </StatCard>

        <StatCard color="#9C27B0">
          <div className="icon">
            <FiTrendingUp />
          </div>
          <div className="number">{averageStreak}</div>
          <div className="label">متوسط السلسلة</div>
          <div className="sublabel">للعادات النشطة</div>
        </StatCard>
      </StatsGrid>

      <SectionsGrid>
        <SectionCard>
          <h3>
            <FiTarget />
            مهام اليوم
          </h3>
          {loading ? (
            <EmptyState>
              <p>جاري التحميل...</p>
            </EmptyState>
          ) : todayPendingTasks.length === 0 ? (
            <EmptyState>
              <FiCheckCircle />
              <p>لا توجد مهام معلقة لليوم!</p>
            </EmptyState>
          ) : (
            todayPendingTasks.slice(0, 5).map(task => (
              <TaskItem key={task.id} completed={task.isCompleted}>
                <div className="checkbox">
                  {task.isCompleted && '✓'}
                </div>
                <div className="text">{task.title}</div>
                <PriorityDot priorityColor={getPriorityColor(task.priority)} />
              </TaskItem>
            ))
          )}
        </SectionCard>

        <SectionCard>
          <h3>
            <FiTrendingUp />
            تقدم العادات
          </h3>
          {mockHabitsForDisplay.length === 0 ? (
            <EmptyState>
              <p>لا توجد عادات نشطة</p>
            </EmptyState>
          ) : (
            mockHabitsForDisplay.map((habit, index) => (
              <HabitProgress key={index}>
                <div className="habit-header">
                  <div className="habit-name">{habit.name}</div>
                  <div className="habit-streak">{habit.streak} أيام</div>
                </div>
                <div className="progress-bar">
                  <ProgressFill width={(habit.current / habit.target) * 100} />
                </div>
              </HabitProgress>
            ))
          )}
        </SectionCard>

        <SectionCard>
          <h3>
            <FiSun />
            الصلاة القادمة
          </h3>
          {nextPrayerInfo ? (
            <NextPrayerCard>
              <div className="prayer-name">{nextPrayerInfo.arabicName}</div>
              <div className="prayer-time">{nextPrayerInfo.time}</div>
              <div className="time-remaining">{nextPrayerInfo.timeRemaining}</div>
            </NextPrayerCard>
          ) : (
            <NextPrayerCard>
              <div className="prayer-name">العصر</div>
              <div className="prayer-time">--:--</div>
              <div className="time-remaining">جاري التحميل...</div>
            </NextPrayerCard>
          )}
          
          <LocationInfo>
            📍 الموقع: القاهرة، مصر
          </LocationInfo>
        </SectionCard>
      </SectionsGrid>
    </PageContainer>
  );
};

export default Dashboard;
