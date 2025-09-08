// Shared Types for Life Management App

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  dueDate?: Date;
  isCompleted: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskCategory {
  DAILY = 'daily',
  STUDY = 'study',
  HEALTH = 'health',
  SHOPPING = 'shopping',
  WORK = 'work',
  PERSONAL = 'personal',
  RELIGIOUS = 'religious'
}

export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  reminderTime?: string;
  category: HabitCategory;
  createdAt: Date;
  updatedAt: Date;
}

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom'
}

export enum HabitCategory {
  RELIGIOUS = 'religious',
  HEALTH = 'health',
  STUDY = 'study',
  PERSONAL = 'personal'
}

export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: Date;
  count: number;
}

export interface PrayerTime {
  id: string;
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerLog {
  id: string;
  prayerName: string;
  prayerDate: string;
  completedAt: Date;
  isOnTime: boolean;
  location: string;
}

export enum RecurringPattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  WEEKDAYS = 'weekdays',
  WEEKENDS = 'weekends'
}

export interface User {
  id: number;
  name: string;
  email?: string;
  timezone: string;
  language: 'ar' | 'en';
  createdAt: Date;
}

export interface AppSettings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
  prayerReminders: boolean;
  habitReminders: boolean;
  taskReminders: boolean;
  location: {
    latitude: number;
    longitude: number;
    city: string;
  };
}
