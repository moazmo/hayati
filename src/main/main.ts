import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } from 'electron';
import * as path from 'path';
import { DatabaseService } from './services/DatabaseService';

class App {
  private mainWindow: BrowserWindow | null = null;
  private databaseService: DatabaseService;
  private tray: Tray | null = null;
  private isQuiting = false;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      height: 800,
      width: 1200,
      minHeight: 600,
      minWidth: 800,
      title: 'حياتي - Hayati',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      titleBarStyle: 'default',
      show: false,
    });

    // Load the renderer
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      // DevTools can be opened manually with F12 or Ctrl+Shift+I
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle window close to minimize to tray instead of quitting
    this.mainWindow.on('close', (event) => {
      if (!this.isQuiting) {
        event.preventDefault();
        this.mainWindow?.hide();
        
        // Show notification on first minimize
        if (process.platform === 'win32') {
          new Notification({
            title: 'حياتي - Hayati',
            body: 'التطبيق يعمل في الخلفية. يمكنك الوصول إليه من شريط المهام.',
            icon: this.createTrayIcon()
          }).show();
        }
      }
    });
  }

  private createTrayIcon(): Electron.NativeImage {
    // Create a simple icon for the tray (16x16 green circle)
    const size = 16;
    const canvas = Buffer.alloc(size * size * 4);
    
    // Simple green circle data (RGBA)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - size / 2;
        const dy = y - size / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const index = (y * size + x) * 4;
        if (distance <= size / 2 - 1) {
          canvas[index] = 76;     // R - Green
          canvas[index + 1] = 175; // G
          canvas[index + 2] = 80;  // B
          canvas[index + 3] = 255; // A
        } else {
          canvas[index + 3] = 0;   // Transparent
        }
      }
    }
    
    return nativeImage.createFromBuffer(canvas, { width: size, height: size });
  }

  private createTray(): void {
    const icon = this.createTrayIcon();
    this.tray = new Tray(icon);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'إظهار التطبيق',
        click: () => {
          this.showWindow();
        }
      },
      {
        label: 'المهام الجديدة',
        click: () => {
          this.showWindow();
          this.mainWindow?.webContents.send('navigate-to', '/tasks');
        }
      },
      {
        label: 'العادات',
        click: () => {
          this.showWindow();
          this.mainWindow?.webContents.send('navigate-to', '/habits');
        }
      },
      {
        label: 'أوقات الصلاة',
        click: () => {
          this.showWindow();
          this.mainWindow?.webContents.send('navigate-to', '/prayers');
        }
      },
      { type: 'separator' },
      {
        label: 'إنهاء التطبيق',
        click: () => {
          this.isQuiting = true;
          app.quit();
        }
      }
    ]);
    
    this.tray.setToolTip('حياتي - Hayati | نظم حياتك بذكاء');
    this.tray.setContextMenu(contextMenu);
    
    // Double click to show window
    this.tray.on('double-click', () => {
      this.showWindow();
    });
  }

  private showWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.show();
      this.mainWindow.focus();
    } else {
      this.createWindow();
    }
  }

  private setupEventHandlers(): void {
    app.whenReady().then(() => {
      this.createWindow();
      this.createTray();
      this.setupIpcHandlers();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      // Keep app running in background on all platforms
      // Only quit when explicitly requested via tray menu
    });

    app.on('before-quit', () => {
      this.isQuiting = true;
    });
  }

  private setupIpcHandlers(): void {
    // Task handlers
    ipcMain.handle('task:create', async (_, task) => {
      return await this.databaseService.createTask(task);
    });

    ipcMain.handle('task:getAll', async () => {
      return await this.databaseService.getAllTasks();
    });

    ipcMain.handle('task:update', async (_, id, updates) => {
      return await this.databaseService.updateTask(id, updates);
    });

    ipcMain.handle('task:delete', async (_, id) => {
      return await this.databaseService.deleteTask(id);
    });

    // Habit handlers
    ipcMain.handle('habit:create', async (_, habit) => {
      return await this.databaseService.createHabit(habit);
    });

    ipcMain.handle('habit:getAll', async () => {
      return await this.databaseService.getAllHabits();
    });

    ipcMain.handle('habit:update', async (_, id, updates) => {
      return await this.databaseService.updateHabit(id, updates);
    });

    ipcMain.handle('habit:delete', async (_, id) => {
      return await this.databaseService.deleteHabit(id);
    });

    ipcMain.handle('habit:log', async (_, habitId, count = 1) => {
      return await this.databaseService.logHabit(habitId, count);
    });

    // Prayer handlers
    ipcMain.handle('prayer:getTimes', async (_, date, latitude, longitude) => {
      return await this.databaseService.getPrayerTimes(date, latitude, longitude);
    });

    ipcMain.handle('prayer:log', async (_, prayerLog) => {
      return await this.databaseService.logPrayer(prayerLog);
    });

    // Settings handlers
    ipcMain.handle('settings:get', async () => {
      return await this.databaseService.getSettings();
    });

    ipcMain.handle('settings:update', async (_, settings) => {
      return await this.databaseService.updateSettings(settings);
    });

    // Notification handlers
    ipcMain.handle('notification:show', async (_, options) => {
      return this.showNotification(options);
    });

    ipcMain.handle('notification:permission', async () => {
      return 'granted'; // Electron apps have notification permission by default
    });
  }

  private showNotification(options: {
    title: string;
    body: string;
    tag?: string;
    icon?: string;
    actions?: Array<{ action: string; title: string; icon?: string }>;
  }): void {
    const notification = new Notification({
      title: options.title,
      body: options.body,
      icon: options.icon ? options.icon : this.createTrayIcon(),
      silent: false,
      urgency: 'normal'
    });

    notification.on('click', () => {
      this.showWindow();
    });

    // Handle action buttons if provided
    if (options.actions) {
      notification.on('action', (event, index) => {
        const action = options.actions![index];
        this.mainWindow?.webContents.send('notification-action', {
          action: action.action,
          tag: options.tag
        });
        this.showWindow();
      });
    }

    notification.show();
  }

  public run(): void {
    this.setupEventHandlers();
  }
}

const application = new App();
application.run();
