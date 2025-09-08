import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiFilter, 
  FiX,
  FiCheckSquare,
  FiRepeat,
  FiTarget,
  FiCalendar,
  FiClock,
  FiTag
} from 'react-icons/fi';
import { RootState } from '../store';
import { TaskCategory, Priority } from '../../shared/types';

const SearchContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 28px;
    color: #212121;
    margin-bottom: 8px;
  }
  
  p {
    color: #757575;
    font-size: 16px;
  }
`;

const SearchBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  background: #f8f9fa;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    background: white;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
  
  &::placeholder {
    color: #757575;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  label {
    font-size: 14px;
    color: #757575;
    font-weight: 500;
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const FilterChip = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => props.active ? '#2196F3' : '#e0e0e0'};
  background: ${props => props.active ? '#e3f2fd' : 'white'};
  color: ${props => props.active ? '#2196F3' : '#757575'};
  
  &:hover {
    border-color: #2196F3;
    color: #2196F3;
  }
`;

const ResultsSection = styled.div`
  margin-top: 24px;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    color: #212121;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .count {
    color: #757575;
    font-size: 14px;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const ResultCard = styled.div<{ type: 'task' | 'habit' | 'goal' }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'task': return '#2196F3';
      case 'habit': return '#4CAF50';
      case 'goal': return '#FF9800';
      default: return '#2196F3';
    }
  }};
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ResultTitle = styled.h4`
  margin: 0;
  color: #212121;
  font-size: 16px;
  font-weight: 600;
`;

const ResultType = styled.div<{ type: 'task' | 'habit' | 'goal' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'task': return '#e3f2fd';
      case 'habit': return '#e8f5e8';
      case 'goal': return '#fff3e0';
      default: return '#e3f2fd';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'task': return '#2196F3';
      case 'habit': return '#4CAF50';
      case 'goal': return '#FF9800';
      default: return '#2196F3';
    }
  }};
`;

const ResultContent = styled.div`
  color: #757575;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const ResultMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #757575;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #757575;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .message {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .hint {
    font-size: 14px;
    opacity: 0.8;
  }
`;

interface SearchResult {
  id: string;
  type: 'task' | 'habit' | 'goal';
  title: string;
  content: string;
  category?: string;
  priority?: string;
  dueDate?: string;
  status?: string;
  matchedFields: string[];
}

const AdvancedSearch: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { habits } = useSelector((state: RootState) => state.habits);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Perform search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      performSearch();
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType, categoryFilter, priorityFilter, statusFilter]);

  const performSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search tasks
    if (searchType === 'all' || searchType === 'tasks') {
      tasks.forEach(task => {
        const matchedFields: string[] = [];
        
        if (task.title.toLowerCase().includes(query)) {
          matchedFields.push('title');
        }
        if (task.description?.toLowerCase().includes(query)) {
          matchedFields.push('description');
        }
        
        if (matchedFields.length > 0) {
          // Apply filters
          if (categoryFilter !== 'all' && task.category !== categoryFilter) return;
          if (priorityFilter !== 'all' && task.priority.toString() !== priorityFilter) return;
          if (statusFilter !== 'all') {
            if (statusFilter === 'completed' && !task.isCompleted) return;
            if (statusFilter === 'pending' && task.isCompleted) return;
          }

          searchResults.push({
            id: task.id,
            type: 'task',
            title: task.title,
            content: task.description || '',
            category: task.category,
            priority: task.priority.toString(),
            dueDate: task.dueDate?.toISOString().split('T')[0],
            status: task.isCompleted ? 'مكتملة' : 'قيد التنفيذ',
            matchedFields
          });
        }
      });
    }

    // Search habits
    if (searchType === 'all' || searchType === 'habits') {
      habits.forEach(habit => {
        const matchedFields: string[] = [];
        
        if (habit.name.toLowerCase().includes(query)) {
          matchedFields.push('name');
        }
        if (habit.description?.toLowerCase().includes(query)) {
          matchedFields.push('description');
        }
        
        if (matchedFields.length > 0) {
          // Apply status filter for habits
          if (statusFilter !== 'all') {
            if (statusFilter === 'completed' && !habit.isActive) return;
            if (statusFilter === 'pending' && habit.isActive) return;
          }

          searchResults.push({
            id: habit.id,
            type: 'habit',
            title: habit.name,
            content: habit.description || '',
            category: habit.category,
            status: habit.isActive ? 'نشطة' : 'معطلة',
            matchedFields
          });
        }
      });
    }

    // Sort results by relevance (title matches first)
    searchResults.sort((a, b) => {
      const aHasTitle = a.matchedFields.includes('title');
      const bHasTitle = b.matchedFields.includes('title');
      
      if (aHasTitle && !bHasTitle) return -1;
      if (!aHasTitle && bHasTitle) return 1;
      return 0;
    });

    setResults(searchResults);
  };

  const getTypeIcon = (type: 'task' | 'habit' | 'goal') => {
    switch (type) {
      case 'task': return <FiCheckSquare />;
      case 'habit': return <FiRepeat />;
      case 'goal': return <FiTarget />;
      default: return <FiCheckSquare />;
    }
  };

  const getTypeLabel = (type: 'task' | 'habit' | 'goal') => {
    switch (type) {
      case 'task': return 'مهمة';
      case 'habit': return 'عادة';
      case 'goal': return 'هدف';
      default: return 'مهمة';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSearchType('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  return (
    <SearchContainer>
      <Header>
        <h1>
          <FiSearch />
          البحث المتقدم - Advanced Search
        </h1>
        <p>ابحث في جميع بياناتك: المهام، العادات، والأهداف</p>
      </Header>

      <SearchBox>
        <SearchInput
          type="text"
          placeholder="ابحث في المهام، العادات، والأهداف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <FiltersRow>
          <FilterGroup>
            <FiFilter />
            <label>النوع:</label>
            <FilterSelect 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              aria-label="Search type filter"
            >
              <option value="all">الكل</option>
              <option value="tasks">المهام</option>
              <option value="habits">العادات</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FiTag />
            <label>الفئة:</label>
            <FilterSelect 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Category filter"
            >
              <option value="all">الكل</option>
              <option value={TaskCategory.DAILY}>يومية</option>
              <option value={TaskCategory.WORK}>عمل</option>
              <option value={TaskCategory.PERSONAL}>شخصية</option>
              <option value={TaskCategory.HEALTH}>صحة</option>
              <option value={TaskCategory.STUDY}>دراسة</option>
              <option value={TaskCategory.SHOPPING}>تسوق</option>
              <option value={TaskCategory.RELIGIOUS}>دينية</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <label>الأولوية:</label>
            <FilterSelect 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Priority filter"
            >
              <option value="all">الكل</option>
              <option value={Priority.HIGH}>عالية</option>
              <option value={Priority.MEDIUM}>متوسطة</option>
              <option value={Priority.LOW}>منخفضة</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <label>الحالة:</label>
            <FilterSelect 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Status filter"
            >
              <option value="all">الكل</option>
              <option value="completed">مكتمل</option>
              <option value="pending">قيد التنفيذ</option>
            </FilterSelect>
          </FilterGroup>

          {(searchQuery || searchType !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
            <FilterChip onClick={clearFilters}>
              <FiX />
              مسح الفلاتر
            </FilterChip>
          )}
        </FiltersRow>
      </SearchBox>

      {searchQuery && (
        <ResultsSection>
          <ResultsHeader>
            <h3>
              <FiSearch />
              نتائج البحث
            </h3>
            <div className="count">
              {isSearching ? 'جاري البحث...' : `${results.length} نتيجة`}
            </div>
          </ResultsHeader>

          {results.length > 0 ? (
            <ResultsGrid>
              {results.map(result => (
                <ResultCard key={`${result.type}-${result.id}`} type={result.type}>
                  <ResultHeader>
                    <ResultTitle>{result.title}</ResultTitle>
                    <ResultType type={result.type}>
                      {getTypeIcon(result.type)}
                      {getTypeLabel(result.type)}
                    </ResultType>
                  </ResultHeader>
                  
                  {result.content && (
                    <ResultContent>{result.content}</ResultContent>
                  )}
                  
                  <ResultMeta>
                    {result.category && (
                      <div className="meta-item">
                        <FiTag />
                        {result.category}
                      </div>
                    )}
                    {result.priority && (
                      <div className="meta-item">
                        <FiTarget />
                        {result.priority}
                      </div>
                    )}
                    {result.dueDate && (
                      <div className="meta-item">
                        <FiCalendar />
                        {new Date(result.dueDate).toLocaleDateString('ar-EG')}
                      </div>
                    )}
                    {result.status && (
                      <div className="meta-item">
                        <FiClock />
                        {result.status}
                      </div>
                    )}
                  </ResultMeta>
                </ResultCard>
              ))}
            </ResultsGrid>
          ) : !isSearching ? (
            <NoResults>
              <div className="icon">
                <FiSearch />
              </div>
              <div className="message">لم يتم العثور على نتائج</div>
              <div className="hint">جرب تعديل مصطلحات البحث أو الفلاتر</div>
            </NoResults>
          ) : null}
        </ResultsSection>
      )}
    </SearchContainer>
  );
};

export default AdvancedSearch;
