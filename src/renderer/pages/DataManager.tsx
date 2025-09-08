import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FiDownload, 
  FiUpload, 
  FiDatabase, 
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiTrash2
} from 'react-icons/fi';
import { RootState } from '../store';

const PageContainer = styled.div`
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
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 16px;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ActionCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.card};
  border: 1px solid ${props => props.theme.colors.border};
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .title {
      font-size: 18px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
    }
  }
  
  .description {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 20px;
    line-height: 1.5;
  }
  
  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error};
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
      default:
        return `
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          &:hover { background: ${props.theme.colors.border}; }
        `;
    }
  }}
`;

const StatsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.card};
  margin-bottom: 24px;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.theme.colors.text};
    margin-bottom: 20px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  
  .number {
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
  }
`;

const ImportSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.card};
  border: 2px dashed ${props => props.theme.colors.border};
  text-align: center;
  margin-bottom: 24px;
  
  .upload-area {
    padding: 40px 20px;
    
    .upload-icon {
      font-size: 48px;
      color: ${props => props.theme.colors.textSecondary};
      margin-bottom: 16px;
    }
    
    .upload-text {
      color: ${props => props.theme.colors.text};
      margin-bottom: 8px;
      font-size: 16px;
    }
    
    .upload-hint {
      color: ${props => props.theme.colors.textSecondary};
      font-size: 14px;
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const AlertBox = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: #E8F5E8;
          color: #2E7D32;
          border: 1px solid #4CAF50;
        `;
      case 'error':
        return `
          background: #FFEBEE;
          color: #C62828;
          border: 1px solid #F44336;
        `;
      default:
        return `
          background: #E3F2FD;
          color: #1565C0;
          border: 1px solid #2196F3;
        `;
    }
  }}
`;

const ExportIcon = styled.div`
  background: #E3F2FD;
  color: #2196F3;
`;

const ImportIcon = styled.div`
  background: #E8F5E8;
  color: #4CAF50;
`;

const BackupIcon = styled.div`
  background: #FFF3E0;
  color: #FF9800;
`;

const DeleteIcon = styled.div`
  background: #FFEBEE;
  color: #F44336;
`;

const DataManager: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { habits } = useSelector((state: RootState) => state.habits);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importType, setImportType] = useState<'success' | 'error' | 'info'>('info');

  // Calculate statistics
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.isCompleted).length,
    totalHabits: habits.length,
    activeHabits: habits.filter(h => h.isActive).length,
    dataSize: Math.round((JSON.stringify({ tasks, habits }).length / 1024) * 100) / 100
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      tasks,
      habits,
      settings: JSON.parse(localStorage.getItem('appSettings') || '{}')
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `life-management-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setImportStatus('تم تصدير البيانات بنجاح بصيغة JSON');
      setImportType('success');
    } else {
      // CSV Export for tasks
      const csvContent = [
        ['Title', 'Description', 'Category', 'Priority', 'Due Date', 'Completed', 'Created Date'].join(','),
        ...tasks.map(task => [
          `"${task.title}"`,
          `"${task.description || ''}"`,
          task.category,
          task.priority,
          task.dueDate || '',
          task.isCompleted,
          task.createdAt
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      setImportStatus('تم تصدير المهام بنجاح بصيغة CSV');
      setImportType('success');
    }

    setTimeout(() => setImportStatus(null), 5000);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate data structure
        if (!data.tasks || !data.habits) {
          throw new Error('Invalid backup file format');
        }

        // Store data to localStorage (in a real app, you'd dispatch to Redux)
        localStorage.setItem('importedTasks', JSON.stringify(data.tasks));
        localStorage.setItem('importedHabits', JSON.stringify(data.habits));
        if (data.settings) {
          localStorage.setItem('appSettings', JSON.stringify(data.settings));
        }

        setImportStatus(`تم استيراد البيانات بنجاح! ${data.tasks.length} مهمة و ${data.habits.length} عادة`);
        setImportType('success');
        
        // Reload page to apply imported data
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        setImportStatus('خطأ في ملف الاستيراد. تأكد من صحة تنسيق الملف.');
        setImportType('error');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
    setTimeout(() => setImportStatus(null), 5000);
  };

  const clearAllData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      localStorage.clear();
      setImportStatus('تم حذف جميع البيانات. سيتم إعادة تحميل التطبيق...');
      setImportType('info');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiDatabase />
          إدارة البيانات - Data Manager
        </h1>
        <p>نسخ احتياطي، استيراد، وإدارة بيانات التطبيق</p>
      </Header>

      {importStatus && (
        <AlertBox type={importType}>
          {importType === 'success' && <FiCheckCircle />}
          {importType === 'error' && <FiAlertCircle />}
          {importType === 'info' && <FiInfo />}
          {importStatus}
        </AlertBox>
      )}

      <StatsSection>
        <h3>
          <FiInfo />
          إحصائيات البيانات
        </h3>
        <StatsGrid>
          <StatItem>
            <div className="number">{stats.totalTasks}</div>
            <div className="label">إجمالي المهام</div>
          </StatItem>
          <StatItem>
            <div className="number">{stats.completedTasks}</div>
            <div className="label">مهام مكتملة</div>
          </StatItem>
          <StatItem>
            <div className="number">{stats.totalHabits}</div>
            <div className="label">إجمالي العادات</div>
          </StatItem>
          <StatItem>
            <div className="number">{stats.activeHabits}</div>
            <div className="label">عادات نشطة</div>
          </StatItem>
          <StatItem>
            <div className="number">{stats.dataSize} KB</div>
            <div className="label">حجم البيانات</div>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <ActionsGrid>
        <ActionCard>
          <div className="card-header">
            <ExportIcon className="icon">
              <FiDownload />
            </ExportIcon>
            <div className="title">تصدير البيانات</div>
          </div>
          <div className="description">
            قم بإنشاء نسخة احتياطية من جميع بياناتك (المهام، العادات، الإعدادات) 
            لحفظها بأمان أو نقلها لجهاز آخر.
          </div>
          <div className="actions">
            <Button variant="primary" onClick={() => exportData('json')}>
              <FiDownload />
              تصدير JSON
            </Button>
            <Button onClick={() => exportData('csv')}>
              <FiDownload />
              تصدير CSV (المهام)
            </Button>
          </div>
        </ActionCard>

        <ActionCard>
          <div className="card-header">
            <ImportIcon className="icon">
              <FiUpload />
            </ImportIcon>
            <div className="title">استيراد البيانات</div>
          </div>
          <div className="description">
            استرد بياناتك من نسخة احتياطية سابقة. يدعم ملفات JSON المُصدرة 
            من التطبيق.
          </div>
          <div className="actions">
            <Button variant="primary" onClick={() => document.getElementById('fileInput')?.click()}>
              <FiUpload />
              اختر ملف
            </Button>
            <HiddenInput
              id="fileInput"
              type="file"
              accept=".json"
              onChange={handleFileImport}
            />
          </div>
        </ActionCard>

        <ActionCard>
          <div className="card-header">
            <BackupIcon className="icon">
              <FiShield />
            </BackupIcon>
            <div className="title">النسخ الاحتياطي التلقائي</div>
          </div>
          <div className="description">
            تفعيل النسخ الاحتياطي التلقائي للبيانات في المستقبل. 
            (قريباً - سيتم إضافة هذه الميزة)
          </div>
          <div className="actions">
            <Button disabled>
              <FiShield />
              قريباً
            </Button>
          </div>
        </ActionCard>

        <ActionCard>
          <div className="card-header">
            <DeleteIcon className="icon">
              <FiTrash2 />
            </DeleteIcon>
            <div className="title">حذف البيانات</div>
          </div>
          <div className="description">
            حذف جميع البيانات المحفوظة في التطبيق. 
            ⚠️ تحذير: لا يمكن التراجع عن هذا الإجراء.
          </div>
          <div className="actions">
            <Button variant="danger" onClick={clearAllData}>
              <FiTrash2 />
              حذف الكل
            </Button>
          </div>
        </ActionCard>
      </ActionsGrid>

      <ImportSection>
        <div className="upload-area">
          <div className="upload-icon">
            <FiUpload />
          </div>
          <div className="upload-text">اسحب وأفلت ملف النسخة الاحتياطية هنا</div>
          <div className="upload-hint">أو انقر على "اختر ملف" أعلاه</div>
        </div>
      </ImportSection>
    </PageContainer>
  );
};

export default DataManager;
