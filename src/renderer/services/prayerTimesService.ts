import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: Date;
}

export interface NextPrayerInfo {
  prayer: string;
  time: string;
  timeRemaining: string;
  arabicName: string;
}

export class PrayerTimesService {
  private coordinates: Coordinates;
  private calculationMethod: any;

  constructor(latitude: number = 30.0444, longitude: number = 31.2357) {
    this.coordinates = new Coordinates(latitude, longitude);
    this.calculationMethod = CalculationMethod.Egyptian();
  }

  updateLocation(latitude: number, longitude: number): void {
    this.coordinates = new Coordinates(latitude, longitude);
  }

  updateCalculationMethod(method: string): void {
    switch (method) {
      case 'EGYPTIAN_GENERAL_AUTHORITY':
        this.calculationMethod = CalculationMethod.Egyptian();
        break;
      case 'UNIVERSITY_OF_ISLAMIC_SCIENCES_KARACHI':
        this.calculationMethod = CalculationMethod.Karachi();
        break;
      case 'ISLAMIC_SOCIETY_OF_NORTH_AMERICA':
        this.calculationMethod = CalculationMethod.NorthAmerica();
        break;
      case 'MUSLIM_WORLD_LEAGUE':
        this.calculationMethod = CalculationMethod.MuslimWorldLeague();
        break;
      case 'UMM_AL_QURA_UNIVERSITY_MAKKAH':
        this.calculationMethod = CalculationMethod.UmmAlQura();
        break;
      default:
        this.calculationMethod = CalculationMethod.Egyptian();
    }
  }

  getTodayPrayerTimes(): PrayerTimesData | null {
    try {
      const date = new Date();
      const prayerTimes = new PrayerTimes(this.coordinates, date, this.calculationMethod);

      return {
        fajr: this.formatTime(prayerTimes.fajr),
        sunrise: this.formatTime(prayerTimes.sunrise),
        dhuhr: this.formatTime(prayerTimes.dhuhr),
        asr: this.formatTime(prayerTimes.asr),
        maghrib: this.formatTime(prayerTimes.maghrib),
        isha: this.formatTime(prayerTimes.isha),
        date
      };
    } catch (error) {
      console.error('Error calculating prayer times:', error);
      return null;
    }
  }

  getNextPrayer(): NextPrayerInfo | null {
    try {
      const date = new Date();
      const prayerTimes = new PrayerTimes(this.coordinates, date, this.calculationMethod);
      const next = prayerTimes.nextPrayer();

      if (!next) {
        // If no next prayer today, get first prayer of next day
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowPrayers = new PrayerTimes(this.coordinates, tomorrow, this.calculationMethod);
        
        return {
          prayer: 'fajr',
          time: this.formatTime(tomorrowPrayers.fajr),
          timeRemaining: this.calculateTimeRemaining(tomorrowPrayers.fajr),
          arabicName: 'الفجر'
        };
      }

      const prayerName = this.getPrayerName(next);
      const arabicName = this.getArabicPrayerName(next);
      let nextPrayerTime: Date;

      switch (next) {
        case Prayer.Fajr:
          nextPrayerTime = prayerTimes.fajr;
          break;
        case Prayer.Sunrise:
          nextPrayerTime = prayerTimes.sunrise;
          break;
        case Prayer.Dhuhr:
          nextPrayerTime = prayerTimes.dhuhr;
          break;
        case Prayer.Asr:
          nextPrayerTime = prayerTimes.asr;
          break;
        case Prayer.Maghrib:
          nextPrayerTime = prayerTimes.maghrib;
          break;
        case Prayer.Isha:
          nextPrayerTime = prayerTimes.isha;
          break;
        default:
          return null;
      }

      return {
        prayer: prayerName,
        time: this.formatTime(nextPrayerTime),
        timeRemaining: this.calculateTimeRemaining(nextPrayerTime),
        arabicName
      };
    } catch (error) {
      console.error('Error calculating next prayer:', error);
      return null;
    }
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  private calculateTimeRemaining(prayerTime: Date): string {
    const now = new Date();
    const diff = prayerTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'الآن';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `بعد ${hours} ساعة و ${minutes} دقيقة`;
    } else {
      return `بعد ${minutes} دقيقة`;
    }
  }

  private getPrayerName(prayer: any): string {
    switch (prayer) {
      case Prayer.Fajr:
        return 'fajr';
      case Prayer.Sunrise:
        return 'sunrise';
      case Prayer.Dhuhr:
        return 'dhuhr';
      case Prayer.Asr:
        return 'asr';
      case Prayer.Maghrib:
        return 'maghrib';
      case Prayer.Isha:
        return 'isha';
      default:
        return 'unknown';
    }
  }

  private getArabicPrayerName(prayer: any): string {
    switch (prayer) {
      case Prayer.Fajr:
        return 'الفجر';
      case Prayer.Sunrise:
        return 'الشروق';
      case Prayer.Dhuhr:
        return 'الظهر';
      case Prayer.Asr:
        return 'العصر';
      case Prayer.Maghrib:
        return 'المغرب';
      case Prayer.Isha:
        return 'العشاء';
      default:
        return 'غير معروف';
    }
  }
}

// Export a singleton instance
export const prayerTimesService = new PrayerTimesService();
