import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { app } from 'electron';
import { Task, Habit, HabitLog, PrayerTime, PrayerLog, AppSettings } from '../../shared/types';
import { Coordinates, Prayer, CalculationMethod, PrayerTimes } from 'adhan';

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'life_management.db');
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.serialize(() => {
      // Users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          timezone TEXT DEFAULT 'Africa/Cairo',
          language TEXT DEFAULT 'ar',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tasks table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          priority INTEGER DEFAULT 2,
          due_date DATETIME,
          is_completed BOOLEAN DEFAULT FALSE,
          is_recurring BOOLEAN DEFAULT FALSE,
          recurring_pattern TEXT,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Habits table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS habits (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          frequency TEXT NOT NULL,
          target_count INTEGER DEFAULT 1,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          reminder_time TEXT,
          category TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Habit logs table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS habit_logs (
          id TEXT PRIMARY KEY,
          habit_id TEXT,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          count INTEGER DEFAULT 1,
          FOREIGN KEY (habit_id) REFERENCES habits (id)
        )
      `);

      // Prayer times table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS prayer_times (
          id TEXT PRIMARY KEY,
          date TEXT,
          fajr TEXT,
          dhuhr TEXT,
          asr TEXT,
          maghrib TEXT,
          isha TEXT
        )
      `);

      // Prayer logs table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS prayer_logs (
          id TEXT PRIMARY KEY,
          prayer_name TEXT,
          prayer_date TEXT,
          completed_at DATETIME,
          is_on_time BOOLEAN DEFAULT FALSE,
          location TEXT
        )
      `);

      // Settings table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          language TEXT DEFAULT 'ar',
          theme TEXT DEFAULT 'light',
          notifications BOOLEAN DEFAULT TRUE,
          prayer_reminders BOOLEAN DEFAULT TRUE,
          habit_reminders BOOLEAN DEFAULT TRUE,
          task_reminders BOOLEAN DEFAULT TRUE,
          latitude REAL DEFAULT 30.0444,
          longitude REAL DEFAULT 31.2357,
          city TEXT DEFAULT 'Cairo'
        )
      `);

      // Insert default settings if not exists
      this.db.run(`
        INSERT OR IGNORE INTO settings (id) VALUES (1)
      `);
    });
  }

  // Task operations
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return new Promise((resolve, reject) => {
      const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      this.db.run(
        `INSERT INTO tasks (id, title, description, category, priority, due_date, is_completed, is_recurring, recurring_pattern, tags, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          task.title,
          task.description,
          task.category,
          task.priority,
          task.dueDate?.toISOString(),
          task.isCompleted ? 1 : 0,
          task.isRecurring ? 1 : 0,
          task.recurringPattern,
          JSON.stringify(task.tags),
          now,
          now
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...task,
              id,
              createdAt: new Date(now),
              updatedAt: new Date(now)
            });
          }
        }
      );
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const tasks = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            priority: row.priority,
            dueDate: row.due_date ? new Date(row.due_date) : undefined,
            isCompleted: row.is_completed === 1,
            isRecurring: row.is_recurring === 1,
            recurringPattern: row.recurring_pattern,
            tags: JSON.parse(row.tags || '[]'),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          }));
          resolve(tasks);
        }
      });
    });
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.category !== undefined) {
        fields.push('category = ?');
        values.push(updates.category);
      }
      if (updates.priority !== undefined) {
        fields.push('priority = ?');
        values.push(updates.priority);
      }
      if (updates.dueDate !== undefined) {
        fields.push('due_date = ?');
        values.push(updates.dueDate?.toISOString());
      }
      if (updates.isCompleted !== undefined) {
        fields.push('is_completed = ?');
        values.push(updates.isCompleted ? 1 : 0);
      }
      if (updates.tags !== undefined) {
        fields.push('tags = ?');
        values.push(JSON.stringify(updates.tags));
      }

      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      this.db.run(
        `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async deleteTask(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Habit operations
  async createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    return new Promise((resolve, reject) => {
      const id = `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      this.db.run(
        `INSERT INTO habits (id, name, description, frequency, target_count, current_streak, longest_streak, is_active, reminder_time, category, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          habit.name,
          habit.description,
          habit.frequency,
          habit.targetCount,
          habit.currentStreak,
          habit.longestStreak,
          habit.isActive ? 1 : 0,
          habit.reminderTime,
          habit.category,
          now,
          now
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...habit,
              id,
              createdAt: new Date(now),
              updatedAt: new Date(now)
            });
          }
        }
      );
    });
  }

  async getAllHabits(): Promise<Habit[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM habits WHERE is_active = 1 ORDER BY created_at DESC', (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const habits = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            frequency: row.frequency,
            targetCount: row.target_count,
            currentStreak: row.current_streak,
            longestStreak: row.longest_streak,
            isActive: row.is_active === 1,
            reminderTime: row.reminder_time,
            category: row.category,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          }));
          resolve(habits);
        }
      });
    });
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];

      Object.keys(updates).forEach(key => {
        if (key === 'id' || key === 'createdAt') return;
        
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = ?`);
        
        let value = (updates as any)[key];
        if (typeof value === 'boolean') {
          value = value ? 1 : 0;
        }
        values.push(value);
      });

      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      this.db.run(
        `UPDATE habits SET ${fields.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async deleteHabit(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE habits SET is_active = 0 WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async logHabit(habitId: string, count: number = 1): Promise<HabitLog> {
    return new Promise((resolve, reject) => {
      const id = `habit_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      this.db.run(
        'INSERT INTO habit_logs (id, habit_id, completed_at, count) VALUES (?, ?, ?, ?)',
        [id, habitId, now, count],
        (err) => {
          if (err) {
            reject(err);
          } else {
            // Update habit streak
            this.updateHabitStreak(habitId);
            resolve({
              id,
              habitId,
              completedAt: new Date(now),
              count
            });
          }
        }
      );
    });
  }

  private async updateHabitStreak(habitId: string): Promise<void> {
    // This is a simplified streak calculation
    // In a real app, you'd implement proper streak logic based on frequency
    this.db.run(
      'UPDATE habits SET current_streak = current_streak + 1 WHERE id = ?',
      [habitId]
    );
  }

  // Prayer operations
  async getPrayerTimes(date: string, latitude: number, longitude: number): Promise<PrayerTime> {
    return new Promise((resolve, reject) => {
      // First check if we have cached prayer times for this date
      this.db.get(
        'SELECT * FROM prayer_times WHERE date = ?',
        [date],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve({
              id: row.id,
              date: row.date,
              fajr: row.fajr,
              dhuhr: row.dhuhr,
              asr: row.asr,
              maghrib: row.maghrib,
              isha: row.isha
            });
          } else {
            // Calculate prayer times using Adhan library
            const coordinates = new Coordinates(latitude, longitude);
            const calculationDate = new Date(date);
            const params = CalculationMethod.Egyptian();
            const prayerTimes = new PrayerTimes(coordinates, calculationDate, params);

            const prayerTimeData: PrayerTime = {
              id: `prayer_${date}`,
              date,
              fajr: prayerTimes.fajr.toTimeString().slice(0, 5),
              dhuhr: prayerTimes.dhuhr.toTimeString().slice(0, 5),
              asr: prayerTimes.asr.toTimeString().slice(0, 5),
              maghrib: prayerTimes.maghrib.toTimeString().slice(0, 5),
              isha: prayerTimes.isha.toTimeString().slice(0, 5)
            };

            // Cache the prayer times
            this.db.run(
              'INSERT INTO prayer_times (id, date, fajr, dhuhr, asr, maghrib, isha) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [prayerTimeData.id, prayerTimeData.date, prayerTimeData.fajr, prayerTimeData.dhuhr, prayerTimeData.asr, prayerTimeData.maghrib, prayerTimeData.isha],
              (cacheErr) => {
                if (cacheErr) {
                  console.warn('Failed to cache prayer times:', cacheErr);
                }
                resolve(prayerTimeData);
              }
            );
          }
        }
      );
    });
  }

  async logPrayer(prayerLog: Omit<PrayerLog, 'id'>): Promise<PrayerLog> {
    return new Promise((resolve, reject) => {
      const id = `prayer_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.db.run(
        'INSERT INTO prayer_logs (id, prayer_name, prayer_date, completed_at, is_on_time, location) VALUES (?, ?, ?, ?, ?, ?)',
        [
          id,
          prayerLog.prayerName,
          prayerLog.prayerDate,
          prayerLog.completedAt.toISOString(),
          prayerLog.isOnTime ? 1 : 0,
          prayerLog.location
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...prayerLog,
              id
            });
          }
        }
      );
    });
  }

  // Settings operations
  async getSettings(): Promise<AppSettings> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM settings WHERE id = 1', (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            language: row.language,
            theme: row.theme,
            notifications: row.notifications === 1,
            prayerReminders: row.prayer_reminders === 1,
            habitReminders: row.habit_reminders === 1,
            taskReminders: row.task_reminders === 1,
            location: {
              latitude: row.latitude,
              longitude: row.longitude,
              city: row.city
            }
          });
        }
      });
    });
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];

      if (settings.language !== undefined) {
        fields.push('language = ?');
        values.push(settings.language);
      }
      if (settings.theme !== undefined) {
        fields.push('theme = ?');
        values.push(settings.theme);
      }
      if (settings.notifications !== undefined) {
        fields.push('notifications = ?');
        values.push(settings.notifications ? 1 : 0);
      }
      if (settings.prayerReminders !== undefined) {
        fields.push('prayer_reminders = ?');
        values.push(settings.prayerReminders ? 1 : 0);
      }
      if (settings.habitReminders !== undefined) {
        fields.push('habit_reminders = ?');
        values.push(settings.habitReminders ? 1 : 0);
      }
      if (settings.taskReminders !== undefined) {
        fields.push('task_reminders = ?');
        values.push(settings.taskReminders ? 1 : 0);
      }
      if (settings.location !== undefined) {
        fields.push('latitude = ?');
        fields.push('longitude = ?');
        fields.push('city = ?');
        values.push(settings.location.latitude, settings.location.longitude, settings.location.city);
      }

      values.push(1); // WHERE id = 1

      this.db.run(
        `UPDATE settings SET ${fields.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
