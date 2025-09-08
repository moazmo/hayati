import React from 'react';
import styled from 'styled-components';
import HayatiLogo from './HayatiLogo';

const AboutContainer = styled.div`
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #00796B 0%, #4DB6AC 50%, #80CBC4 100%);
  color: white;
  border-radius: 12px;
  margin: 16px 0;
`;

const Version = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin: 16px 0 8px 0;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin: 16px 0;
  opacity: 0.95;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
  text-align: right;
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
`;

const Developer = styled.p`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 12px;
`;

export const AboutHayati: React.FC = () => {
  return (
    <AboutContainer>
      <HayatiLogo size={80} variant="full" color="white" />
      
      <Version>الإصدار 1.0.0</Version>
      
      <Description>
        حياتي هو تطبيق سطح المكتب المتكامل لإدارة الحياة اليومية باللغة العربية.
        صُمم خصيصاً للمستخدمين العرب لتنظيم المهام، تتبع العادات، ومراقبة أوقات الصلاة.
      </Description>

      <Features>
        <Feature>
          <strong>إدارة المهام</strong><br />
          تنظيم وتتبع المهام اليومية بفعالية
        </Feature>
        <Feature>
          <strong>تتبع العادات</strong><br />
          بناء وتطوير العادات الإيجابية
        </Feature>
        <Feature>
          <strong>أوقات الصلاة</strong><br />
          عرض وتذكير بأوقات الصلاة الدقيقة
        </Feature>
        <Feature>
          <strong>التحليلات</strong><br />
          رؤى وإحصائيات شاملة عن التقدم
        </Feature>
        <Feature>
          <strong>الإشعارات الذكية</strong><br />
          تذكيرات سطح المكتب التفاعلية
        </Feature>
        <Feature>
          <strong>واجهة عربية</strong><br />
          تصميم RTL كامل وخطوط عربية
        </Feature>
      </Features>

      <Developer>
        تم التطوير بـ ❤️ باستخدام Electron + React + TypeScript
      </Developer>
    </AboutContainer>
  );
};

export default AboutHayati;
