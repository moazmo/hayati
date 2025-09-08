// Type declarations for Electron API

export interface NotificationOptions {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

export interface ElectronAPI {
  task: {
    create: (task: any) => Promise<any>;
    getAll: () => Promise<any[]>;
    update: (id: string, updates: any) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  habit: {
    create: (habit: any) => Promise<any>;
    getAll: () => Promise<any[]>;
    update: (id: string, updates: any) => Promise<void>;
    delete: (id: string) => Promise<void>;
    log: (habitId: string, count: number) => Promise<any>;
  };
  prayer: {
    getTimes: (date: string, lat: number, lng: number) => Promise<any>;
    log: (prayerLog: any) => Promise<any>;
  };
  settings: {
    get: () => Promise<any>;
    update: (settings: any) => Promise<void>;
  };
  notification: {
    show: (options: NotificationOptions) => Promise<void>;
    checkPermission: () => Promise<'granted' | 'denied' | 'default'>;
    onAction: (callback: (event: any, data: { action: string; tag?: string }) => void) => void;
    removeAllListeners: () => void;
  };
  navigation: {
    onNavigate: (callback: (event: any, path: string) => void) => void;
    removeNavigationListeners: () => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
