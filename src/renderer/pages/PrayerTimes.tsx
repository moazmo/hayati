import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon, FiMapPin, FiClock } from 'react-icons/fi';
import { prayerTimesService, PrayerTimesData, NextPrayerInfo } from '../services/prayerTimesService';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    color: #212121;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .date {
    font-size: 18px;
    color: #757575;
    margin: 0 0 8px 0;
  }
  
  .location {
    font-size: 14px;
    color: #9E9E9E;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
`;

const NextPrayerCard = styled.div`
  background: linear-gradient(135deg, #00796B 0%, #004D40 100%);
  color: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 121, 107, 0.3);
  
  .label {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 8px;
  }
  
  .prayer-name {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .prayer-time {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .time-remaining {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const PrayerTimesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const PrayerCard = styled.div<{ isNext?: boolean; isPassed?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border-left: 4px solid ${props => 
    props.isNext ? '#00796B' : 
    props.isPassed ? '#9E9E9E' : '#2196F3'
  };
  opacity: ${props => props.isPassed ? 0.6 : 1};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
  
  .prayer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .prayer-name {
    font-size: 20px;
    font-weight: 600;
    color: #212121;
  }
  
  .prayer-icon {
    width: 24px;
    height: 24px;
    color: ${props => 
      props.isNext ? '#00796B' : 
      props.isPassed ? '#9E9E9E' : '#2196F3'
    };
  }
  
  .prayer-time {
    font-size: 28px;
    font-weight: bold;
    color: ${props => 
      props.isNext ? '#00796B' : 
      props.isPassed ? '#9E9E9E' : '#212121'
    };
    margin-bottom: 8px;
  }
  
  .prayer-status {
    font-size: 12px;
    color: ${props => 
      props.isNext ? '#00796B' : 
      props.isPassed ? '#9E9E9E' : '#757575'
    };
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const QiblaSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 32px;
  
  h3 {
    font-size: 20px;
    margin: 0 0 16px 0;
    color: #212121;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .qibla-direction {
    font-size: 36px;
    font-weight: bold;
    color: #00796B;
    margin-bottom: 8px;
  }
  
  .qibla-info {
    font-size: 14px;
    color: #757575;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #757575;
  
  .loading-text {
    font-size: 16px;
    margin-top: 12px;
  }
`;

const PrayerTimes: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadPrayerTimes = () => {
      console.log('Loading prayer times...');
      const times = prayerTimesService.getTodayPrayerTimes();
      const next = prayerTimesService.getNextPrayer();
      
      console.log('Prayer times loaded:', times);
      console.log('Next prayer:', next);
      
      setPrayerTimes(times);
      setNextPrayer(next);
      setCurrentTime(new Date());
    };

    // Load immediately
    loadPrayerTimes();
    
    // Update every minute
    const interval = setInterval(loadPrayerTimes, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPrayerPassed = (prayerTime: string) => {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    return currentTime > prayerDate;
  };

  const isNextPrayer = (prayerName: string) => {
    return nextPrayer?.prayer === prayerName || 
           (prayerName === 'fajr' && nextPrayer?.prayer === 'fajr');
  };

  const getPrayerIcon = (prayerName: string) => {
    switch (prayerName) {
      case 'fajr':
      case 'sunrise':
        return <FiSun />;
      case 'isha':
        return <FiMoon />;
      default:
        return <FiSun />;
    }
  };

  const prayers = prayerTimes ? [
    { name: 'الفجر', time: prayerTimes.fajr, key: 'fajr' },
    { name: 'الشروق', time: prayerTimes.sunrise, key: 'sunrise' },
    { name: 'الظهر', time: prayerTimes.dhuhr, key: 'dhuhr' },
    { name: 'العصر', time: prayerTimes.asr, key: 'asr' },
    { name: 'المغرب', time: prayerTimes.maghrib, key: 'maghrib' },
    { name: 'العشاء', time: prayerTimes.isha, key: 'isha' }
  ] : [];

  if (!prayerTimes) {
    return (
      <PageContainer>
        <LoadingState>
          <FiClock size={48} />
          <div className="loading-text">جاري تحميل مواقيت الصلاة...</div>
        </LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiSun />
          مواقيت الصلاة
        </h1>
        <div className="date">{formatDate(currentTime)}</div>
        <div className="location">
          <FiMapPin />
          القاهرة، مصر
        </div>
      </Header>

      {nextPrayer && (
        <NextPrayerCard>
          <div className="label">الصلاة القادمة</div>
          <div className="prayer-name">{nextPrayer.arabicName}</div>
          <div className="prayer-time">{nextPrayer.time}</div>
          <div className="time-remaining">{nextPrayer.timeRemaining}</div>
        </NextPrayerCard>
      )}

      <PrayerTimesGrid>
        {prayers.map((prayer) => {
          const passed = isPrayerPassed(prayer.time);
          const isNext = isNextPrayer(prayer.key);
          
          return (
            <PrayerCard 
              key={prayer.key} 
              isNext={isNext}
              isPassed={passed}
            >
              <div className="prayer-header">
                <div className="prayer-name">{prayer.name}</div>
                <div className="prayer-icon">
                  {getPrayerIcon(prayer.key)}
                </div>
              </div>
              <div className="prayer-time">{prayer.time}</div>
              <div className="prayer-status">
                {isNext ? 'القادمة' : passed ? 'انتهت' : 'قادمة'}
              </div>
            </PrayerCard>
          );
        })}
      </PrayerTimesGrid>

      <QiblaSection>
        <h3>
          <FiMapPin />
          اتجاه القبلة
        </h3>
        <div className="qibla-direction">🕋 24°</div>
        <div className="qibla-info">شمال شرق من القاهرة</div>
      </QiblaSection>
    </PageContainer>
  );
};

export default PrayerTimes;
