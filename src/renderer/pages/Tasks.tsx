import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiCalendar } from 'react-icons/fi';
import { RootState, AppDispatch } from '../store';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/tasksSlice';
import { Task, TaskCategory, Priority } from '../../shared/types';

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
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #1976D2;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const TasksGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const TaskCard = styled.div<{ completed: boolean; priority: Priority }>`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => {
    if (props.completed) return '#4CAF50';
    switch(props.priority) {
      case Priority.URGENT: return '#F44336';
      case Priority.HIGH: return '#FF9800';
      case Priority.MEDIUM: return '#2196F3';
      case Priority.LOW: return '#9E9E9E';
      default: return '#2196F3';
    }
  }};
  opacity: ${props => props.completed ? 0.7 : 1};
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const TaskTitle = styled.h3<{ completed: boolean }>`
  margin: 0;
  font-size: 18px;
  color: ${props => props.completed ? '#757575' : '#212121'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  flex: 1;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  
  &.complete {
    background: #E8F5E8;
    color: #4CAF50;
    &:hover { background: #C8E6C9; }
  }
  
  &.edit {
    background: #E3F2FD;
    color: #2196F3;
    &:hover { background: #BBDEFB; }
  }
  
  &.delete {
    background: #FFEBEE;
    color: #F44336;
    &:hover { background: #FFCDD2; }
  }
`;

const TaskMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
`;

const CategoryBadge = styled.span<{ category: TaskCategory }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch(props.category) {
      case TaskCategory.RELIGIOUS: return '#E8F5E8';
      case TaskCategory.STUDY: return '#E3F2FD';
      case TaskCategory.HEALTH: return '#FFF3E0';
      case TaskCategory.PERSONAL: return '#F3E5F5';
      case TaskCategory.WORK: return '#E0F2F1';
      case TaskCategory.SHOPPING: return '#FFF8E1';
      default: return '#F5F5F5';
    }
  }};
  color: ${props => {
    switch(props.category) {
      case TaskCategory.RELIGIOUS: return '#4CAF50';
      case TaskCategory.STUDY: return '#2196F3';
      case TaskCategory.HEALTH: return '#FF9800';
      case TaskCategory.PERSONAL: return '#9C27B0';
      case TaskCategory.WORK: return '#009688';
      case TaskCategory.SHOPPING: return '#FFC107';
      default: return '#666';
    }
  }};
`;

const TaskDescription = styled.p`
  margin: 8px 0 0 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: ${props => props.active ? '#2196F3' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #2196F3;
    color: ${props => props.active ? 'white' : '#2196F3'};
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #2196F3;
    color: white;
    &:hover { background: #1976D2; }
  ` : `
    background: #f5f5f5;
    color: #666;
    &:hover { background: #e0e0e0; }
  `}
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  
  div {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TagsContainer = styled.div`
  margin-top: 8px;
`;

const TagBadge = styled.span`
  font-size: 12px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  margin-right: 4px;
`;

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | TaskCategory>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: TaskCategory.DAILY,
    priority: Priority.MEDIUM,
    dueDate: '',
    tags: [] as string[]
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      isCompleted: false,
      isRecurring: false,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    };
    
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask.id, updates: taskData }));
    } else {
      await dispatch(createTask(taskData));
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: TaskCategory.DAILY,
      priority: Priority.MEDIUM,
      dueDate: '',
      tags: []
    });
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      tags: task.tags
    });
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm(t('tasks.deleteConfirm') || 'Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(taskId));
    }
  };

  const handleToggleComplete = async (task: Task) => {
    await dispatch(updateTask({ 
      id: task.id, 
      updates: { isCompleted: !task.isCompleted } 
    }));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return task.category === filter;
  });

  const getCategoryLabel = (category: TaskCategory) => {
    return t(`tasks.categories.${category}`) || category;
  };

  const getPriorityLabel = (priority: Priority) => {
    const priorityNames = ['', 'low', 'medium', 'high', 'urgent'];
    return t(`tasks.priority.${priorityNames[priority]}`) || priorityNames[priority];
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div />
        </LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h1>{t('tasks.title')}</h1>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <FiPlus />
          {t('tasks.addTask')}
        </AddButton>
      </Header>

      <FilterBar>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          {t('common.all') || 'All'}
        </FilterButton>
        <FilterButton 
          active={filter === 'pending'} 
          onClick={() => setFilter('pending')}
        >
          {t('common.pending')}
        </FilterButton>
        <FilterButton 
          active={filter === 'completed'} 
          onClick={() => setFilter('completed')}
        >
          {t('common.completed')}
        </FilterButton>
        {Object.values(TaskCategory).map(category => (
          <FilterButton 
            key={category}
            active={filter === category} 
            onClick={() => setFilter(category)}
          >
            {getCategoryLabel(category)}
          </FilterButton>
        ))}
      </FilterBar>

      {filteredTasks.length === 0 ? (
        <EmptyState>
          <FiCheck />
          <h3>{filter === 'completed' ? t('tasks.noCompletedTasks') : t('tasks.noTasks')}</h3>
          <p>{filter === 'completed' ? 'Complete some tasks to see them here' : 'Create your first task to get started'}</p>
        </EmptyState>
      ) : (
        <TasksGrid>
          {filteredTasks.map(task => (
            <TaskCard key={task.id} completed={task.isCompleted} priority={task.priority}>
              <TaskHeader>
                <TaskTitle completed={task.isCompleted}>
                  {task.title}
                </TaskTitle>
                <TaskActions>
                  <ActionButton 
                    className="complete"
                    onClick={() => handleToggleComplete(task)}
                    title={task.isCompleted ? t('tasks.markIncomplete') : t('tasks.markComplete')}
                  >
                    {task.isCompleted ? <FiX /> : <FiCheck />}
                  </ActionButton>
                  <ActionButton 
                    className="edit"
                    onClick={() => handleEditTask(task)}
                    title={t('common.edit')}
                  >
                    <FiEdit />
                  </ActionButton>
                  <ActionButton 
                    className="delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title={t('common.delete')}
                  >
                    <FiTrash2 />
                  </ActionButton>
                </TaskActions>
              </TaskHeader>
              
              <TaskMeta>
                <CategoryBadge category={task.category}>
                  {getCategoryLabel(task.category)}
                </CategoryBadge>
                <span>Priority: {getPriorityLabel(task.priority)}</span>
                {task.dueDate && (
                  <span>
                    <FiCalendar style={{ marginRight: '4px' }} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </TaskMeta>
              
              {task.description && (
                <TaskDescription>{task.description}</TaskDescription>
              )}
              
              {task.tags.length > 0 && (
                <TagsContainer>
                  {task.tags.map((tag: string) => (
                    <TagBadge key={tag}>
                      #{tag}
                    </TagBadge>
                  ))}
                </TagsContainer>
              )}
            </TaskCard>
          ))}
        </TasksGrid>
      )}

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>{editingTask ? t('tasks.editTask') : t('tasks.addTask')}</h2>
          
          <Form onSubmit={handleCreateTask}>
            <FormGroup>
              <Label>{t('tasks.taskTitle')}</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter task title..."
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('tasks.taskDescription')}</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter task description..."
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('common.category')}</Label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as TaskCategory})}
                title="Select task category"
                aria-label="Task category selection"
              >
                {Object.values(TaskCategory).map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>{t('common.priority')}</Label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: Number(e.target.value) as Priority})}
                title="Select task priority"
                aria-label="Task priority selection"
              >
                <option value={Priority.LOW}>{getPriorityLabel(Priority.LOW)}</option>
                <option value={Priority.MEDIUM}>{getPriorityLabel(Priority.MEDIUM)}</option>
                <option value={Priority.HIGH}>{getPriorityLabel(Priority.HIGH)}</option>
                <option value={Priority.URGENT}>{getPriorityLabel(Priority.URGENT)}</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>{t('tasks.dueDate')}</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={resetForm}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="primary">
                {editingTask ? t('common.save') : t('common.add')}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Tasks;
