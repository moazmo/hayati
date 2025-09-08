import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiCalendar, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheck, 
  FiClock,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';
import { useAppSelector } from '../hooks/redux';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: any[];
  habits: any[];
  completedHabits: number;
  totalHabits: number;
}

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    color: #212121;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .month-year {
    font-size: 24px;
    font-weight: bold;
    color: #212121;
    min-width: 200px;
    text-align: center;
  }
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f5f5f5;
  color: #757575;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #00796B;
    color: white;
    transform: scale(1.1);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
`;

const ViewButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? '#00796B' : 'transparent'};
  color: ${props => props.active ? 'white' : '#757575'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#004D40' : '#E0E0E0'};
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #E0E0E0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const CalendarCell = styled.div<{ 
  isCurrentMonth?: boolean; 
  isToday?: boolean;
  hasEvents?: boolean;
}>`
  background: white;
  min-height: 120px;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.isCurrentMonth ? 1 : 0.4};
  
  ${props => props.isToday && `
    background: #E8F5E8;
    border: 2px solid #00796B;
  `}
  
  &:hover {
    background: ${props => props.isToday ? '#E0F2E0' : '#F8F9FA'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .date-number {
    font-size: 16px;
    font-weight: ${props => props.isToday ? 'bold' : 'normal'};
    color: ${props => props.isToday ? '#00796B' : '#212121'};
    margin-bottom: 8px;
  }
`;

const DayHeader = styled.div`
  background: #00796B;
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
`;

const EventIndicator = styled.div<{ type: 'task' | 'habit' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.type === 'task' ? '#2196F3' : '#FF9800'};
  margin: 2px;
  display: inline-block;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
  
  &:after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    transition: width 0.3s ease;
  }
`;

const StatsBar = styled.div`
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
  
  .icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
    padding: 8px;
    border-radius: 50%;
    background: #E8F5E8;
    color: #00796B;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .number {
    font-size: 24px;
    font-weight: bold;
    color: #212121;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 14px;
    color: #757575;
  }
`;

const EventsContainer = styled.div`
  margin-bottom: 4px;
`;

const MoreIndicator = styled.span`
  font-size: 10px;
  color: #757575;
`;

const TaskList = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  
  .task-item {
    font-size: 11px;
    color: #2196F3;
    background: rgba(33, 150, 243, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    margin: 2px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .habit-item {
    font-size: 11px;
    color: #FF9800;
    background: rgba(255, 152, 0, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    margin: 2px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  // Get data from Redux
  const tasks = useAppSelector(state => state.tasks.tasks);
  const habits = useAppSelector(state => state.habits.habits);

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    
    // Start from the beginning of the week
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      // Filter tasks and habits for this date
      const dayTasks = tasks.filter(task => {
        if (task.dueDate) {
          const taskDate = new Date(task.dueDate);
          return taskDate.toDateString() === date.toDateString();
        }
        return false;
      });
      
      // Get habit completion for this date (mock data for now)
      const dayHabits = habits.map(habit => ({
        ...habit,
        completed: Math.random() > 0.5 // Mock completion status
      }));
      
      const completedHabits = dayHabits.filter(h => h.completed).length;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        tasks: dayTasks,
        habits: dayHabits,
        completedHabits,
        totalHabits: habits.length
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Calculate monthly stats
  const monthlyStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.isCompleted).length,
    totalHabits: habits.length,
    avgHabitCompletion: habits.length > 0 ? 
      Math.round((habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0) / habits.length)) : 0
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiCalendar />
          التقويم - Calendar
        </h1>
      </Header>

      <StatsBar>
        <StatCard>
          <div className="icon">
            <FiCheck />
          </div>
          <div className="number">{monthlyStats.completedTasks}</div>
          <div className="label">مهام مكتملة</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiClock />
          </div>
          <div className="number">{monthlyStats.totalTasks - monthlyStats.completedTasks}</div>
          <div className="label">مهام متبقية</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiTarget />
          </div>
          <div className="number">{monthlyStats.totalHabits}</div>
          <div className="label">عادات نشطة</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiTrendingUp />
          </div>
          <div className="number">{monthlyStats.avgHabitCompletion}</div>
          <div className="label">متوسط الإنجاز</div>
        </StatCard>
      </StatsBar>

      <CalendarHeader>
        <MonthNavigation>
          <NavButton onClick={goToPreviousMonth}>
            <FiChevronLeft />
          </NavButton>
          <div className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <NavButton onClick={goToNextMonth}>
            <FiChevronRight />
          </NavButton>
        </MonthNavigation>

        <ViewToggle>
          <ViewButton 
            active={view === 'month'} 
            onClick={() => setView('month')}
          >
            شهري
          </ViewButton>
          <ViewButton 
            active={view === 'week'} 
            onClick={() => setView('week')}
          >
            أسبوعي
          </ViewButton>
        </ViewToggle>
      </CalendarHeader>

      <CalendarGrid>
        {daysOfWeek.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {calendarDays.map((day, index) => (
          <CalendarCell
            key={index}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            hasEvents={day.tasks.length > 0 || day.habits.length > 0}
            onClick={() => console.log('Selected date:', day.date)}
          >
            <div className="date-number">
              {day.date.getDate()}
            </div>
            
            {day.tasks.length > 0 && (
              <EventsContainer>
                {day.tasks.slice(0, 2).map((_, i) => (
                  <EventIndicator key={i} type="task" />
                ))}
                {day.tasks.length > 2 && (
                  <MoreIndicator>
                    +{day.tasks.length - 2}
                  </MoreIndicator>
                )}
              </EventsContainer>
            )}
            
            {day.totalHabits > 0 && (
              <ProgressBar 
                progress={(day.completedHabits / day.totalHabits) * 100} 
              />
            )}
            
            <TaskList>
              {day.tasks.slice(0, 2).map((task, i) => (
                <div key={i} className="task-item">
                  {task.title}
                </div>
              ))}
              {day.habits.slice(0, 1).map((habit, i) => (
                <div key={i} className="habit-item">
                  {habit.name}
                </div>
              ))}
            </TaskList>
          </CalendarCell>
        ))}
      </CalendarGrid>
    </PageContainer>
  );
};

export default Calendar;
