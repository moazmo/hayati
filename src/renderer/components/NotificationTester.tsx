import React, { useEffect } from 'react';
import styled from 'styled-components';
import { notificationService } from '../services/notificationService';

const TestContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
`;

const TestButton = styled.button`
  padding: 10px 15px;
  margin: 5px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cairo', sans-serif;

  &:hover {
    opacity: 0.9;
  }
`;

const InfoText = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #757575;
`;

export const NotificationTester: React.FC = () => {
  useEffect(() => {
    // Initialize notification service
    notificationService.updateSettings({
      enabled: true,
      system: {
        sound: true,
        desktop: true,
        persistent: false
      }
    });
  }, []);

  const testBasicNotification = async () => {
    await notificationService.showNotification({
      title: 'إشعار تجريبي',
      body: 'هذا إشعار تجريبي للتأكد من عمل النظام',
      tag: 'test-basic'
    });
  };

  const testTaskNotification = async () => {
    await notificationService.showTaskReminder('مراجعة التقرير الشهري', 'task-123');
  };

  const testHabitNotification = async () => {
    await notificationService.showHabitReminder('قراءة القرآن', 'habit-456');
  };

  const testPrayerNotification = async () => {
    await notificationService.showPrayerReminder('العصر', 'خلال 10 دقائق');
  };

  const testSuccessNotification = async () => {
    await notificationService.showSuccessNotification(
      'تم بنجاح!',
      'تم حفظ البيانات بنجاح'
    );
  };

  return (
    <TestContainer>
      <h3>اختبار الإشعارات</h3>
      <div>
        <TestButton onClick={testBasicNotification}>
          إشعار أساسي
        </TestButton>
        <TestButton onClick={testTaskNotification}>
          تذكير مهمة
        </TestButton>
        <TestButton onClick={testHabitNotification}>
          تذكير عادة
        </TestButton>
        <TestButton onClick={testPrayerNotification}>
          تذكير صلاة
        </TestButton>
        <TestButton onClick={testSuccessNotification}>
          إشعار نجاح
        </TestButton>
      </div>
      <InfoText>
        استخدم هذه الأزرار لاختبار نظام الإشعارات. يجب أن تظهر الإشعارات في سطح المكتب.
      </InfoText>
    </TestContainer>
  );
};

export default NotificationTester;
