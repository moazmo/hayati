import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FiBarChart, 
  FiTrendingUp, 
  FiCalendar, 
  FiTarget, 
  FiClock, 
  FiCheckCircle,
  FiAward,
  FiActivity,
  FiPieChart
} from 'react-icons/fi';
import { RootState, AppDispatch } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchHabits } from '../store/slices/habitsSlice';
import { TaskCategory } from '../../shared/types';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 8px 0;
    font-size: 28px;
    color: #333;
    
    svg {
      color: #2196F3;
    }
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 16px;
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const TimeRangeButton = styled.button<{ active?: boolean }>`
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
    ${props => !props.active && 'background: #f5f5f5;'}
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div<{ color?: string }>`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.color || '#2196F3'};
  
  .metric-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: ${props => props.color ? `${props.color}15` : '#2196F315'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.color || '#2196F3'};
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
    
    .title {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
  
  .metric-value {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin: 8px 0;
  }
  
  .metric-change {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &.positive {
      color: #4CAF50;
    }
    
    &.negative {
      color: #f44336;
    }
    
    &.neutral {
      color: #666;
    }
  }
  
  .metric-details {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    font-size: 12px;
    color: #888;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  h3 {
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    
    svg {
      color: #2196F3;
    }
  }
`;

const TaskCategoryChart = styled.div`
  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .category-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      
      .category-name {
        font-size: 14px;
        color: #333;
      }
    }
    
    .category-count {
      font-weight: bold;
      color: #666;
    }
  }
`;

const HabitStreakChart = styled.div`
  .habit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .habit-info {
      flex: 1;
      
      .habit-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }
      
      .habit-progress {
        width: 100%;
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #66BB6A);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
      }
    }
    
    .habit-streak {
      margin-left: 12px;
      text-align: center;
      
      .streak-number {
        font-size: 18px;
        font-weight: bold;
        color: #4CAF50;
      }
      
      .streak-label {
        font-size: 12px;
        color: #666;
      }
    }
  }
`;

const WeeklyProgressChart = styled.div`
  .week-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-top: 16px;
    
    .day-column {
      text-align: center;
      
      .day-label {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .day-progress {
        height: 120px;
        background: #f5f5f5;
        border-radius: 6px;
        position: relative;
        overflow: hidden;
        
        .progress-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #2196F3, #42A5F5);
          border-radius: 0 0 6px 6px;
          transition: height 0.3s ease;
        }
        
        .progress-label {
          position: absolute;
          top: 8px;
          left: 0;
          right: 0;
          font-size: 11px;
          color: #666;
        }
      }
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #666;
`;

const ColorDot = styled.div<{ color: string }>`
  background-color: ${props => props.color};
`;

const ProgressFillStyled = styled.div<{ width: number }>`
  width: ${props => props.width}%;
`;

const DayProgressFill = styled.div<{ height: number }>`
  height: ${props => props.height}%;
`;

type TimeRange = '7days' | '30days' | '90days' | '1year';

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);
  const { habits, loading: habitsLoading } = useSelector((state: RootState) => state.habits);
  
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchHabits());
  }, [dispatch]);

  // Calculate metrics based on selected time range
  const getDaysFromRange = (range: TimeRange): number => {
    switch (range) {
      case '7days': return 7;
      case '30days': return 30;
      case '90days': return 90;
      case '1year': return 365;
      default: return 30;
    }
  };

  const getDateThreshold = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  const days = getDaysFromRange(timeRange);
  const threshold = getDateThreshold(days);

  // Task Analytics
  const recentTasks = tasks.filter(task => new Date(task.createdAt) >= threshold);
  const completedTasks = recentTasks.filter(task => task.isCompleted);
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted
  );

  const completionRate = recentTasks.length > 0 ? 
    Math.round((completedTasks.length / recentTasks.length) * 100) : 0;

  // Category distribution
  const categoryStats = Object.values(TaskCategory).map(category => {
    const categoryTasks = recentTasks.filter(task => task.category === category);
    const completed = categoryTasks.filter(task => task.isCompleted).length;
    
    return {
      category,
      total: categoryTasks.length,
      completed,
      completionRate: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0
    };
  }).filter(stat => stat.total > 0);

  // Habit Analytics
  const activeHabits = habits.filter(habit => habit.isActive);
  const totalStreakDays = activeHabits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0);
  const averageStreak = activeHabits.length > 0 ? 
    Math.round(totalStreakDays / activeHabits.length) : 0;

  // Generate weekly progress data (mock for now)
  const generateWeeklyProgress = () => {
    const weekDays = ['ج', 'س', 'أ', 'ث', 'ث', 'خ', 'ح']; // Arabic day abbreviations
    return weekDays.map((day) => ({
      day,
      tasksCompleted: Math.floor(Math.random() * 10) + 1,
      habitsCompleted: Math.floor(Math.random() * 5) + 1,
      totalTasks: Math.floor(Math.random() * 5) + 5,
      totalHabits: activeHabits.length
    }));
  };

  const weeklyData = generateWeeklyProgress();

  const getCategoryColor = (category: TaskCategory): string => {
    const colors = {
      [TaskCategory.DAILY]: '#2196F3',
      [TaskCategory.WORK]: '#FF9800',
      [TaskCategory.PERSONAL]: '#9C27B0',
      [TaskCategory.HEALTH]: '#4CAF50',
      [TaskCategory.STUDY]: '#F44336',
      [TaskCategory.SHOPPING]: '#795548',
      [TaskCategory.RELIGIOUS]: '#00BCD4'
    };
    return colors[category] || '#2196F3';
  };

  const getCategoryLabel = (category: TaskCategory): string => {
    const labels = {
      [TaskCategory.DAILY]: 'يومية',
      [TaskCategory.WORK]: 'عمل',
      [TaskCategory.PERSONAL]: 'شخصية',
      [TaskCategory.HEALTH]: 'صحة',
      [TaskCategory.STUDY]: 'دراسة',
      [TaskCategory.SHOPPING]: 'تسوق',
      [TaskCategory.RELIGIOUS]: 'دينية'
    };
    return labels[category] || category;
  };

  if (tasksLoading || habitsLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          جاري تحميل البيانات...
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiBarChart />
          التحليلات والتقارير - Analytics
        </h1>
        <p>تحليل مفصل لأدائك وتقدمك في المهام والعادات</p>
      </Header>

      <TimeRangeSelector>
        <TimeRangeButton 
          active={timeRange === '7days'} 
          onClick={() => setTimeRange('7days')}
        >
          آخر 7 أيام
        </TimeRangeButton>
        <TimeRangeButton 
          active={timeRange === '30days'} 
          onClick={() => setTimeRange('30days')}
        >
          آخر 30 يوم
        </TimeRangeButton>
        <TimeRangeButton 
          active={timeRange === '90days'} 
          onClick={() => setTimeRange('90days')}
        >
          آخر 3 شهور
        </TimeRangeButton>
        <TimeRangeButton 
          active={timeRange === '1year'} 
          onClick={() => setTimeRange('1year')}
        >
          آخر سنة
        </TimeRangeButton>
      </TimeRangeSelector>

      <MetricsGrid>
        <MetricCard color="#4CAF50">
          <div className="metric-header">
            <div className="icon">
              <FiCheckCircle />
            </div>
            <div className="title">معدل إنجاز المهام</div>
          </div>
          <div className="metric-value">{completionRate}%</div>
          <div className="metric-change positive">
            <FiTrendingUp />
            +5% من الشهر الماضي
          </div>
          <div className="metric-details">
            {completedTasks.length} مهمة مكتملة من {recentTasks.length}
          </div>
        </MetricCard>

        <MetricCard color="#2196F3">
          <div className="metric-header">
            <div className="icon">
              <FiTarget />
            </div>
            <div className="title">متوسط سلسلة العادات</div>
          </div>
          <div className="metric-value">{averageStreak}</div>
          <div className="metric-change positive">
            <FiTrendingUp />
            تحسن مستمر
          </div>
          <div className="metric-details">
            {activeHabits.length} عادة نشطة
          </div>
        </MetricCard>

        <MetricCard color="#FF9800">
          <div className="metric-header">
            <div className="icon">
              <FiClock />
            </div>
            <div className="title">المهام المتأخرة</div>
          </div>
          <div className="metric-value">{overdueTasks.length}</div>
          <div className="metric-change negative">
            تحتاج متابعة
          </div>
          <div className="metric-details">
            مهام تجاوزت موعدها المحدد
          </div>
        </MetricCard>

        <MetricCard color="#9C27B0">
          <div className="metric-header">
            <div className="icon">
              <FiAward />
            </div>
            <div className="title">أطول سلسلة عادة</div>
          </div>
          <div className="metric-value">
            {activeHabits.length > 0 ? Math.max(...activeHabits.map(h => h.longestStreak || 0)) : 0}
          </div>
          <div className="metric-change positive">
            <FiAward />
            إنجاز رائع!
          </div>
          <div className="metric-details">
            أيام متتالية
          </div>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <h3>
            <FiPieChart />
            توزيع المهام حسب الفئة
          </h3>
          <TaskCategoryChart>
            {categoryStats.map(stat => (
              <div key={stat.category} className="category-item">
                <div className="category-info">
                  <ColorDot 
                    className="color-dot" 
                    color={getCategoryColor(stat.category)}
                  />
                  <div className="category-name">{getCategoryLabel(stat.category)}</div>
                </div>
                <div className="category-count">
                  {stat.completed}/{stat.total} ({stat.completionRate}%)
                </div>
              </div>
            ))}
          </TaskCategoryChart>
        </ChartCard>

        <ChartCard>
          <h3>
            <FiActivity />
            تقدم العادات الحالية
          </h3>
          <HabitStreakChart>
            {activeHabits.slice(0, 6).map(habit => (
              <div key={habit.id} className="habit-item">
                <div className="habit-info">
                  <div className="habit-name">{habit.name}</div>
                  <div className="habit-progress">
                    <ProgressFillStyled 
                      className="progress-fill" 
                      width={Math.min(((habit.currentStreak || 0) / 30) * 100, 100)} 
                    />
                  </div>
                </div>
                <div className="habit-streak">
                  <div className="streak-number">{habit.currentStreak || 0}</div>
                  <div className="streak-label">يوم</div>
                </div>
              </div>
            ))}
          </HabitStreakChart>
        </ChartCard>

        <ChartCard>
          <h3>
            <FiCalendar />
            الأداء الأسبوعي
          </h3>
          <WeeklyProgressChart>
            <div className="week-grid">
              {weeklyData.map((day, index) => (
                <div key={index} className="day-column">
                  <div className="day-label">{day.day}</div>
                  <div className="day-progress">
                    <DayProgressFill 
                      className="progress-fill"
                      height={(day.tasksCompleted / day.totalTasks) * 100}
                    />
                    <div className="progress-label">
                      {day.tasksCompleted}/{day.totalTasks}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </WeeklyProgressChart>
        </ChartCard>
      </ChartsGrid>
    </PageContainer>
  );
};

export default Analytics;
