export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  tasks: {
    enabled: boolean;
    dueReminder: number; // minutes before due time
    overdueReminder: number; // minutes after due time
  };
  habits: {
    enabled: boolean;
    dailyReminder: string; // time in HH:MM format
    weeklyProgress: boolean;
  };
  prayers: {
    enabled: boolean;
    beforeTime: number; // minutes before prayer time
    atTime: boolean;
  };
  system: {
    sound: boolean;
    desktop: boolean;
    persistent: boolean;
  };
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private settings: NotificationSettings;
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.settings = this.loadSettings();
    this.initializePermissions();
    this.setupPrayerNotifications();
    this.setupHabitReminders();
  }

  private loadSettings(): NotificationSettings {
    const defaultSettings: NotificationSettings = {
      enabled: true,
      tasks: {
        enabled: true,
        dueReminder: 15,
        overdueReminder: 30
      },
      habits: {
        enabled: true,
        dailyReminder: '20:00',
        weeklyProgress: true
      },
      prayers: {
        enabled: true,
        beforeTime: 5,
        atTime: true
      },
      system: {
        sound: true,
        desktop: true,
        persistent: false
      }
    };

    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  private saveSettings(): void {
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  private async initializePermissions(): Promise<void> {
    // In Electron, we can use both web notifications and native notifications
    if (window.electronAPI?.notification) {
      this.permission = await window.electronAPI.notification.checkPermission();
    } else if ('Notification' in window) {
      this.permission = Notification.permission;
      
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }
  }

  public async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }
    return false;
  }

  public async showNotification(options: NotificationOptions): Promise<Notification | null> {
    if (!this.settings.enabled || !this.settings.system.desktop) {
      return null;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return null;
    }

    try {
      // Use Electron's native notification system if available (better for desktop)
      if (window.electronAPI?.notification) {
        await window.electronAPI.notification.show({
          title: options.title,
          body: options.body,
          tag: options.tag,
          actions: options.actions?.map(action => ({
            action: action.action,
            title: action.title,
            icon: action.icon
          }))
        });
        return null; // Electron notifications don't return a Notification object
      }

      // Fallback to web notifications
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/assets/app-icon.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction || this.settings.system.persistent,
        silent: options.silent || !this.settings.system.sound
      });

      // Auto-close after 5 seconds unless persistent
      if (!this.settings.system.persistent) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  // Task Notifications
  public scheduleTaskReminder(taskId: string, title: string, dueTime: Date): void {
    if (!this.settings.tasks.enabled) return;

    const now = new Date().getTime();
    const dueTimestamp = dueTime.getTime();
    const reminderTime = dueTimestamp - (this.settings.tasks.dueReminder * 60 * 1000);
    const overdueTime = dueTimestamp + (this.settings.tasks.overdueReminder * 60 * 1000);

    // Clear existing timers
    this.clearTaskTimers(taskId);

    // Schedule due reminder
    if (reminderTime > now) {
      const dueTimer = setTimeout(() => {
        this.showNotification({
          title: 'مهمة قادمة - Upcoming Task',
          body: `${title} - مستحقة خلال ${this.settings.tasks.dueReminder} دقيقة`,
          tag: `task-due-${taskId}`,
          requireInteraction: true,
          actions: [
            { action: 'complete', title: 'إكمال - Complete' },
            { action: 'delay', title: 'تأجيل - Delay' }
          ]
        });
      }, reminderTime - now);

      this.activeTimers.set(`task-due-${taskId}`, dueTimer);
    }

    // Schedule overdue reminder
    if (overdueTime > now) {
      const overdueTimer = setTimeout(() => {
        this.showNotification({
          title: 'مهمة متأخرة - Overdue Task',
          body: `${title} - متأخرة ${this.settings.tasks.overdueReminder} دقيقة`,
          tag: `task-overdue-${taskId}`,
          requireInteraction: true,
          actions: [
            { action: 'complete', title: 'إكمال الآن - Complete Now' },
            { action: 'reschedule', title: 'إعادة جدولة - Reschedule' }
          ]
        });
      }, overdueTime - now);

      this.activeTimers.set(`task-overdue-${taskId}`, overdueTimer);
    }
  }

  public clearTaskTimers(taskId: string): void {
    const dueTimer = this.activeTimers.get(`task-due-${taskId}`);
    const overdueTimer = this.activeTimers.get(`task-overdue-${taskId}`);

    if (dueTimer) {
      clearTimeout(dueTimer);
      this.activeTimers.delete(`task-due-${taskId}`);
    }

    if (overdueTimer) {
      clearTimeout(overdueTimer);
      this.activeTimers.delete(`task-overdue-${taskId}`);
    }
  }

  // Prayer Notifications
  private setupPrayerNotifications(): void {
    if (!this.settings.prayers.enabled) return;

    // This would integrate with the prayer times service
    // For now, we'll set up a basic schedule check every minute
    setInterval(() => {
      this.checkPrayerTimes();
    }, 60000); // Check every minute
  }

  private checkPrayerTimes(): void {
    // This would get prayer times from the prayer service
    // and show notifications based on settings
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Mock prayer times for demonstration
    const prayerTimes = {
      fajr: '05:30',
      dhuhr: '12:15',
      asr: '15:45',
      maghrib: '18:30',
      isha: '20:00'
    };

    const prayerNames = {
      fajr: 'الفجر',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء'
    };

    // Check if it's time for any prayer
    Object.entries(prayerTimes).forEach(([key, time]) => {
      if (currentTime === time && this.settings.prayers.atTime) {
        this.showNotification({
          title: 'حان وقت الصلاة - Prayer Time',
          body: `حان الآن وقت صلاة ${prayerNames[key as keyof typeof prayerNames]}`,
          tag: `prayer-${key}`,
          requireInteraction: true,
          actions: [
            { action: 'logged', title: 'تم الأداء - Logged' },
            { action: 'remind', title: 'تذكير لاحقاً - Remind Later' }
          ]
        });
      }

      // Check for before-time notifications
      if (this.settings.prayers.beforeTime > 0) {
        const [hours, minutes] = time.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes - this.settings.prayers.beforeTime, 0, 0);
        
        const reminderTime = `${prayerTime.getHours().toString().padStart(2, '0')}:${prayerTime.getMinutes().toString().padStart(2, '0')}`;
        
        if (currentTime === reminderTime) {
          this.showNotification({
            title: 'تنبيه صلاة - Prayer Reminder',
            body: `صلاة ${prayerNames[key as keyof typeof prayerNames]} خلال ${this.settings.prayers.beforeTime} دقائق`,
            tag: `prayer-reminder-${key}`,
            actions: [
              { action: 'prepare', title: 'التحضير - Prepare' },
              { action: 'snooze', title: 'تأجيل - Snooze' }
            ]
          });
        }
      }
    });
  }

  // Habit Notifications
  private setupHabitReminders(): void {
    if (!this.settings.habits.enabled) return;

    // Daily habit reminder
    setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime === this.settings.habits.dailyReminder) {
        this.showNotification({
          title: 'تذكير العادات اليومية - Daily Habits Reminder',
          body: 'حان وقت مراجعة عاداتك اليومية وتسجيل تقدمك',
          tag: 'daily-habits',
          requireInteraction: true,
          actions: [
            { action: 'review', title: 'مراجعة - Review' },
            { action: 'later', title: 'لاحقاً - Later' }
          ]
        });
      }
    }, 60000);

    // Weekly progress reminder (Sundays at 8 PM)
    if (this.settings.habits.weeklyProgress) {
      setInterval(() => {
        const now = new Date();
        if (now.getDay() === 0 && now.getHours() === 20 && now.getMinutes() === 0) {
          this.showNotification({
            title: 'تقرير العادات الأسبوعي - Weekly Habits Report',
            body: 'اطلع على تقدمك الأسبوعي في العادات وخطط للأسبوع القادم',
            tag: 'weekly-habits',
            requireInteraction: true,
            actions: [
              { action: 'view-report', title: 'عرض التقرير - View Report' },
              { action: 'plan-week', title: 'خطة الأسبوع - Plan Week' }
            ]
          });
        }
      }, 60000);
    }
  }

  public scheduleHabitReminder(habitId: string, habitName: string, reminderTime: string): void {
    // Clear existing timer
    const existingTimer = this.activeTimers.get(`habit-${habitId}`);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Calculate time until reminder
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderDate.getTime() <= now.getTime()) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const timeUntilReminder = reminderDate.getTime() - now.getTime();

    const timer = setTimeout(() => {
      this.showNotification({
        title: 'تذكير عادة - Habit Reminder',
        body: `حان وقت ممارسة عادة: ${habitName}`,
        tag: `habit-${habitId}`,
        actions: [
          { action: 'complete', title: 'تم - Done' },
          { action: 'skip', title: 'تخطي - Skip' },
          { action: 'delay', title: 'تأجيل - Delay' }
        ]
      });

      // Reschedule for next day
      this.scheduleHabitReminder(habitId, habitName, reminderTime);
    }, timeUntilReminder);

    this.activeTimers.set(`habit-${habitId}`, timer);
  }

  // Settings Management
  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    // Restart services if needed
    if (newSettings.prayers) {
      this.setupPrayerNotifications();
    }
    if (newSettings.habits) {
      this.setupHabitReminders();
    }
  }

  public isEnabled(): boolean {
    return this.settings.enabled && this.permission === 'granted';
  }

  public hasPermission(): boolean {
    return this.permission === 'granted';
  }

  // Specific notification methods for better UI
  public async showTaskReminder(taskTitle: string, taskId: string): Promise<void> {
    await this.showNotification({
      title: 'تذكير مهمة - حياتي',
      body: `حان وقت: ${taskTitle}`,
      tag: taskId,
      actions: [
        { action: 'complete-task', title: 'إكمال المهمة' },
        { action: 'view-task', title: 'عرض المهمة' }
      ]
    });
  }

  public async showHabitReminder(habitName: string, habitId: string): Promise<void> {
    await this.showNotification({
      title: 'تذكير عادة - حياتي',
      body: `لا تنس: ${habitName}`,
      tag: habitId,
      actions: [
        { action: 'log-habit', title: 'تسجيل العادة' },
        { action: 'view-habit', title: 'عرض العادة' }
      ]
    });
  }

  public async showPrayerReminder(prayerName: string, timeRemaining: string): Promise<void> {
    await this.showNotification({
      title: 'تذكير الصلاة - حياتي',
      body: `حان وقت صلاة ${prayerName} - ${timeRemaining}`,
      tag: `prayer-${prayerName}`,
      actions: [
        { action: 'view-prayers', title: 'عرض أوقات الصلاة' }
      ]
    });
  }

  public async showSuccessNotification(title: string, body: string): Promise<void> {
    await this.showNotification({
      title,
      body,
      icon: '/assets/success-icon.png'
    });
  }

  public async showErrorNotification(title: string, body: string): Promise<void> {
    await this.showNotification({
      title,
      body,
      icon: '/assets/error-icon.png'
    });
  }

  // Cleanup
  public dispose(): void {
    this.activeTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.activeTimers.clear();
  }
}

// Singleton instance
export const notificationService = new NotificationService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  notificationService.dispose();
});

export default NotificationService;
