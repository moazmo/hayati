import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiPlus, FiTrendingUp, FiTarget, FiCalendar, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { RootState, AppDispatch } from '../store';
import { fetchHabits, createHabit, updateHabit, deleteHabit, logHabitCompletion } from '../store/slices/habitsSlice';
import { Habit } from '../../shared/types';

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
    font-size: 28px;
    color: #212121;
    margin: 0;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #45a049;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  
  .icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
    padding: 8px;
    border-radius: 50%;
    background: #e8f5e8;
    color: #4CAF50;
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

const HabitsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const HabitCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #4CAF50;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
`;

const HabitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const HabitTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #212121;
  flex: 1;
`;

const StreakBadge = styled.span`
  background: #4CAF50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const HabitMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #757575;
  margin-bottom: 12px;
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #4CAF50;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 14px;
  color: #666;
  min-width: 50px;
`;

const ActionButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const DescriptionText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

// Modal and Form Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    margin: 0;
    font-size: 20px;
    color: #212121;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #757575;
  padding: 0;
  
  &:hover {
    color: #212121;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #212121;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #4CAF50;
          color: white;
          &:hover { background: #45a049; }
        `;
      case 'danger':
        return `
          background: #f44336;
          color: white;
          &:hover { background: #d32f2f; }
        `;
      default:
        return `
          background: #f5f5f5;
          color: #757575;
          &:hover { background: #eeeeee; color: #212121; }
        `;
    }
  }}
`;

const HabitActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionIconButton = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  color: #757575;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
    color: #212121;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Habits: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { habits, loading, error } = useSelector((state: RootState) => state.habits);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    targetCount: 1,
    category: 'health',
    reminderTime: ''
  });

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      targetCount: 1,
      category: 'health',
      reminderTime: ''
    });
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const habitData = {
      ...formData,
      currentStreak: 0,
      longestStreak: 0,
      isActive: true
    };

    try {
      await dispatch(createHabit(habitData)).unwrap();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleEditHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabit) return;

    try {
      await dispatch(updateHabit({ 
        id: editingHabit.id, 
        updates: formData 
      })).unwrap();
      setShowEditModal(false);
      setEditingHabit(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه العادة؟')) {
      try {
        await dispatch(deleteHabit(habitId)).unwrap();
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const handleMarkDone = async (habitId: string) => {
    try {
      await dispatch(logHabitCompletion({ habitId, count: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to log habit completion:', error);
    }
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      targetCount: habit.targetCount,
      category: habit.category,
      reminderTime: habit.reminderTime || ''
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  // Calculate statistics
  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(h => {
      // This is a simplified check - in real app you'd check today's logs
      return h.currentStreak > 0;
    }).length,
    averageStreak: habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length) : 0,
    longestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak)) : 0
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTodayProgress = (habit: Habit) => {
    // This is a simplified implementation
    // In a real app, you'd check today's habit logs
    return habit.currentStreak > 0 ? habit.targetCount : 0;
  };

  if (error) {
    console.error('Habits error:', error);
  }

  return (
    <PageContainer>
      <Header>
        <h1>{t('habits.title')}</h1>
        <AddButton onClick={openCreateModal}>
          <FiPlus />
          {t('habits.addHabit')}
        </AddButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="icon">
            <FiTarget />
          </div>
          <div className="number">{stats.totalHabits}</div>
          <div className="label">{t('habits.title')}</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiCalendar />
          </div>
          <div className="number">{stats.completedToday}</div>
          <div className="label">مكتملة اليوم</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiTrendingUp />
          </div>
          <div className="number">{stats.averageStreak}</div>
          <div className="label">متوسط السلسلة</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiTrendingUp />
          </div>
          <div className="number">{stats.longestStreak}</div>
          <div className="label">أطول سلسلة</div>
        </StatCard>
      </StatsGrid>

      {loading ? (
        <EmptyState>
          <p>جاري التحميل...</p>
        </EmptyState>
      ) : habits.length === 0 ? (
        <EmptyState>
          <FiTarget />
          <h3>{t('habits.noHabits')}</h3>
          <p>ابدأ ببناء عادات إيجابية لحياة أفضل</p>
        </EmptyState>
      ) : (
        <HabitsGrid>
          {habits.map(habit => {
            const todayProgress = getTodayProgress(habit);
            const isCompleted = todayProgress >= habit.targetCount;
            
            return (
              <HabitCard key={habit.id}>
                <HabitHeader>
                  <HabitTitle>{habit.name}</HabitTitle>
                  <StreakBadge>{habit.currentStreak} أيام</StreakBadge>
                </HabitHeader>
                
                <HabitMeta>
                  <span>الفئة: {habit.category}</span>
                  <span>التكرار: {habit.frequency}</span>
                  <span>أطول سلسلة: {habit.longestStreak} يوم</span>
                </HabitMeta>
                
                <Progress>
                  <ProgressBar>
                    <ProgressFill progress={getProgress(todayProgress, habit.targetCount)} />
                  </ProgressBar>
                  <ProgressText>
                    {todayProgress}/{habit.targetCount}
                  </ProgressText>
                </Progress>
                
                {habit.description && (
                  <DescriptionText>
                    {habit.description}
                  </DescriptionText>
                )}
                
                <HabitActions>
                  <ActionButton 
                    onClick={() => handleMarkDone(habit.id)}
                    disabled={isCompleted}
                  >
                    {isCompleted ? 'مكتمل' : t('habits.markDone')}
                  </ActionButton>
                  
                  <ActionIconButton 
                    onClick={() => openEditModal(habit)}
                    title="تعديل"
                  >
                    <FiEdit2 />
                  </ActionIconButton>
                  
                  <ActionIconButton 
                    onClick={() => handleDeleteHabit(habit.id)}
                    title="حذف"
                  >
                    <FiTrash2 />
                  </ActionIconButton>
                </HabitActions>
              </HabitCard>
            );
          })}
        </HabitsGrid>
      )}

      {/* Create Habit Modal */}
      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>إضافة عادة جديدة</h2>
              <CloseButton onClick={() => setShowCreateModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleCreateHabit}>
              <FormGroup>
                <Label>اسم العادة</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="مثال: قراءة 30 دقيقة يومياً"
                />
              </FormGroup>

              <FormGroup>
                <Label>الوصف (اختياري)</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر للعادة وفوائدها"
                />
              </FormGroup>

              <FormGroup>
                <Label>الفئة</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="health">صحة</option>
                  <option value="spiritual">روحانية</option>
                  <option value="learning">تعلم</option>
                  <option value="productivity">إنتاجية</option>
                  <option value="personal">شخصي</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>التكرار</Label>
                <Select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>الهدف المطلوب</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.targetCount}
                  onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 1 })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>وقت التذكير (اختياري)</Label>
                <Input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setShowCreateModal(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary">
                  إضافة العادة
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Habit Modal */}
      {showEditModal && editingHabit && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>تعديل العادة</h2>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleEditHabit}>
              <FormGroup>
                <Label>اسم العادة</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>الوصف</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>الفئة</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="health">صحة</option>
                  <option value="spiritual">روحانية</option>
                  <option value="learning">تعلم</option>
                  <option value="productivity">إنتاجية</option>
                  <option value="personal">شخصي</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>التكرار</Label>
                <Select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>الهدف المطلوب</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.targetCount}
                  onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 1 })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>وقت التذكير</Label>
                <Input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setShowEditModal(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary">
                  حفظ التغييرات
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Habits;
