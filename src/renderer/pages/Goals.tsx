import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  FiTarget, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar,
  FiX,
  FiFlag,
  FiClock,
  FiActivity
} from 'react-icons/fi';

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
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 28px;
    color: #333;
    
    svg {
      color: #2196F3;
    }
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
  
  &:hover {
    background: #1976D2;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
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

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const GoalCard = styled.div<{ status: string; priority: string }>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid ${props => {
    if (props.status === 'completed') return '#4CAF50';
    if (props.status === 'in-progress') return '#2196F3';
    if (props.status === 'overdue') return '#f44336';
    return '#FF9800';
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;

const GoalHeader = styled.div`
  padding: 20px 20px 0 20px;
  
  .goal-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .goal-description {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 16px;
  }
`;

const GoalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #888;
  margin-bottom: 16px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ProgressSection = styled.div`
  padding: 0 20px;
  margin-bottom: 16px;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .progress-label {
      font-size: 14px;
      color: #666;
    }
    
    .progress-value {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2196F3, #42A5F5);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
`;

const GoalActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
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
    width: 16px;
    height: 16px;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #e8f5e8;
          color: #4CAF50;
        `;
      case 'in-progress':
        return `
          background: #e3f2fd;
          color: #2196F3;
        `;
      case 'overdue':
        return `
          background: #ffebee;
          color: #f44336;
        `;
      default:
        return `
          background: #fff3e0;
          color: #FF9800;
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.priority) {
      case 'high':
        return `
          background: #ffebee;
          color: #f44336;
        `;
      case 'medium':
        return `
          background: #fff3e0;
          color: #FF9800;
        `;
      default:
        return `
          background: #e8f5e8;
          color: #4CAF50;
        `;
    }
  }}
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

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  
  h2 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  
  &:hover {
    color: #333;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Form = styled.form`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 0 24px 24px 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
  padding-top: 24px;
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #1976D2;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #d0d0d0;
  }
`;

const ProgressInput = styled.input`
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ProgressFill = styled.div<{ width: number }>`
  width: ${props => props.width}%;
`;

const ProgressContainer = styled.div`
  /* No additional styles needed */
`;

// Mock data structure for goals
interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed' | 'overdue'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetValue: 100,
    currentValue: 0,
    unit: '',
    startDate: '',
    targetDate: ''
  });

  // Mock goals data
  useEffect(() => {
    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'تعلم 1000 كلمة إنجليزية جديدة',
        description: 'هدف تطوير المفردات الإنجليزية لتحسين مستوى اللغة',
        category: 'education',
        priority: 'high',
        status: 'in-progress',
        progress: 65,
        targetValue: 1000,
        currentValue: 650,
        unit: 'كلمة',
        startDate: '2024-01-01',
        targetDate: '2024-12-31',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15'
      },
      {
        id: '2',
        title: 'خسارة 10 كيلو من الوزن',
        description: 'تحسين الصحة العامة واللياقة البدنية',
        category: 'health',
        priority: 'high',
        status: 'in-progress',
        progress: 40,
        targetValue: 10,
        currentValue: 4,
        unit: 'كيلو',
        startDate: '2024-02-01',
        targetDate: '2024-08-01',
        createdAt: '2024-02-01',
        updatedAt: '2024-03-15'
      },
      {
        id: '3',
        title: 'قراءة 24 كتاب',
        description: 'هدف سنوي لقراءة كتابين شهرياً',
        category: 'personal',
        priority: 'medium',
        status: 'in-progress',
        progress: 25,
        targetValue: 24,
        currentValue: 6,
        unit: 'كتاب',
        startDate: '2024-01-01',
        targetDate: '2024-12-31',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15'
      },
      {
        id: '4',
        title: 'توفير 50,000 جنيه',
        description: 'خطة ادخار للعام القادم',
        category: 'financial',
        priority: 'high',
        status: 'in-progress',
        progress: 30,
        targetValue: 50000,
        currentValue: 15000,
        unit: 'جنيه',
        startDate: '2024-01-01',
        targetDate: '2024-12-31',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15'
      },
      {
        id: '5',
        title: 'إكمال دورة البرمجة',
        description: 'دورة تطوير المواقع الشاملة',
        category: 'education',
        priority: 'medium',
        status: 'completed',
        progress: 100,
        targetValue: 100,
        currentValue: 100,
        unit: '%',
        startDate: '2024-01-01',
        targetDate: '2024-03-01',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-01'
      }
    ];
    setGoals(mockGoals);
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetValue: 100,
      currentValue: 0,
      unit: '',
      startDate: '',
      targetDate: ''
    });
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: 'not-started',
      progress: Math.round((formData.currentValue / formData.targetValue) * 100),
      targetValue: formData.targetValue,
      currentValue: formData.currentValue,
      unit: formData.unit,
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGoals(prev => [newGoal, ...prev]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingGoal) return;

    const updatedGoal: Goal = {
      ...editingGoal,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      progress: Math.round((formData.currentValue / formData.targetValue) * 100),
      targetValue: formData.targetValue,
      currentValue: formData.currentValue,
      unit: formData.unit,
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      updatedAt: new Date().toISOString()
    };

    setGoals(prev => prev.map(goal => goal.id === editingGoal.id ? updatedGoal : goal));
    setIsModalOpen(false);
    setEditingGoal(null);
    resetForm();
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الهدف؟')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      startDate: goal.startDate,
      targetDate: goal.targetDate
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.round((newValue / goal.targetValue) * 100);
        const status = progress >= 100 ? 'completed' : 
                     progress > 0 ? 'in-progress' : 'not-started';
        
        return {
          ...goal,
          currentValue: newValue,
          progress,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return goal;
    }));
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const getStatusLabel = (status: string) => {
    const labels = {
      'not-started': 'لم تبدأ',
      'in-progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'overdue': 'متأخر'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      'low': 'منخفضة',
      'medium': 'متوسطة',
      'high': 'عالية'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiTarget />
          الأهداف - Goals
        </h1>
        <AddButton onClick={openCreateModal}>
          <FiPlus />
          إضافة هدف جديد
        </AddButton>
      </Header>

      <FilterSection>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          الكل ({goals.length})
        </FilterButton>
        <FilterButton 
          active={filter === 'not-started'} 
          onClick={() => setFilter('not-started')}
        >
          لم تبدأ ({goals.filter(g => g.status === 'not-started').length})
        </FilterButton>
        <FilterButton 
          active={filter === 'in-progress'} 
          onClick={() => setFilter('in-progress')}
        >
          قيد التنفيذ ({goals.filter(g => g.status === 'in-progress').length})
        </FilterButton>
        <FilterButton 
          active={filter === 'completed'} 
          onClick={() => setFilter('completed')}
        >
          مكتمل ({goals.filter(g => g.status === 'completed').length})
        </FilterButton>
        <FilterButton 
          active={filter === 'overdue'} 
          onClick={() => setFilter('overdue')}
        >
          متأخر ({goals.filter(g => g.status === 'overdue').length})
        </FilterButton>
      </FilterSection>

      {filteredGoals.length === 0 ? (
        <EmptyState>
          <FiTarget />
          <h3>لا توجد أهداف</h3>
          <p>ابدأ بإضافة هدف جديد لتتبع تقدمك</p>
        </EmptyState>
      ) : (
        <GoalsGrid>
          {filteredGoals.map(goal => {
            const daysRemaining = getDaysRemaining(goal.targetDate);
            
            return (
              <GoalCard key={goal.id} status={goal.status} priority={goal.priority}>
                <GoalHeader>
                  <div className="goal-title">{goal.title}</div>
                  {goal.description && (
                    <div className="goal-description">{goal.description}</div>
                  )}
                  
                  <GoalMeta>
                    <div className="meta-item">
                      <FiFlag />
                      <PriorityBadge priority={goal.priority}>
                        {getPriorityLabel(goal.priority)}
                      </PriorityBadge>
                    </div>
                    <div className="meta-item">
                      <FiActivity />
                      <StatusBadge status={goal.status}>
                        {getStatusLabel(goal.status)}
                      </StatusBadge>
                    </div>
                    <div className="meta-item">
                      <FiCalendar />
                      {formatDate(goal.targetDate)}
                    </div>
                    <div className="meta-item">
                      <FiClock />
                      {daysRemaining > 0 ? `${daysRemaining} يوم متبقي` : 'انتهى الموعد'}
                    </div>
                  </GoalMeta>
                </GoalHeader>

                <ProgressSection>
                  <div className="progress-header">
                    <div className="progress-label">التقدم</div>
                    <div className="progress-value">
                      {goal.currentValue} / {goal.targetValue} {goal.unit} ({goal.progress}%)
                    </div>
                  </div>
                  <div className="progress-bar">
                    <ProgressFill 
                      className="progress-fill" 
                      width={Math.min(goal.progress, 100)}
                    />
                  </div>
                </ProgressSection>

                <GoalActions>
                  <ProgressContainer>
                    <ProgressInput
                      type="number"
                      value={goal.currentValue}
                      onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                      min="0"
                      max={goal.targetValue}
                      title={`تحديث التقدم: ${goal.currentValue} من ${goal.targetValue} ${goal.unit}`}
                      placeholder="0"
                    />
                  </ProgressContainer>
                  
                  <ActionButtonsContainer>
                    <ActionButton 
                      variant="secondary"
                      onClick={() => openEditModal(goal)}
                      title="تعديل الهدف"
                    >
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton 
                      variant="danger"
                      onClick={() => handleDeleteGoal(goal.id)}
                      title="حذف الهدف"
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </ActionButtonsContainer>
                </GoalActions>
              </GoalCard>
            );
          })}
        </GoalsGrid>
      )}

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h2>{editingGoal ? 'تعديل الهدف' : 'إضافة هدف جديد'}</h2>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FiX />
            </CloseButton>
          </ModalHeader>
          
          <Form onSubmit={editingGoal ? handleEditGoal : handleCreateGoal}>
            <FormGroup>
              <Label>عنوان الهدف</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="مثال: تعلم 1000 كلمة إنجليزية"
              />
            </FormGroup>

            <FormGroup>
              <Label>الوصف (اختياري)</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مفصل للهدف..."
              />
            </FormGroup>

            <FormGroup>
              <Label>الفئة</Label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="personal">شخصي</option>
                <option value="health">صحة</option>
                <option value="education">تعليم</option>
                <option value="financial">مالي</option>
                <option value="career">وظيفي</option>
                <option value="family">عائلي</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>الأولوية</Label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>الهدف المطلوب</Label>
              <Input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                required
                min="1"
              />
            </FormGroup>

            <FormGroup>
              <Label>القيمة الحالية</Label>
              <Input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
                min="0"
              />
            </FormGroup>

            <FormGroup>
              <Label>الوحدة</Label>
              <Input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                placeholder="مثال: كتاب، كيلو، جنيه"
              />
            </FormGroup>

            <FormGroup>
              <Label>تاريخ البداية</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>الموعد المستهدف</Label>
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </FormGroup>
          </Form>

          <FormActions>
            <CancelButton 
              type="button" 
              onClick={() => setIsModalOpen(false)}
            >
              إلغاء
            </CancelButton>
            <SubmitButton 
              type="submit" 
              onClick={editingGoal ? handleEditGoal : handleCreateGoal}
            >
              {editingGoal ? 'تحديث الهدف' : 'إضافة الهدف'}
            </SubmitButton>
          </FormActions>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Goals;
