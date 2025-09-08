const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  task: {
    create: (task) => ipcRenderer.invoke('task:create', task),
    getAll: () => ipcRenderer.invoke('task:getAll'),
    update: (id, updates) => ipcRenderer.invoke('task:update', id, updates),
    delete: (id) => ipcRenderer.invoke('task:delete', id),
  },
  habit: {
    create: (habit) => ipcRenderer.invoke('habit:create', habit),
    getAll: () => ipcRenderer.invoke('habit:getAll'),
    update: (id, updates) => ipcRenderer.invoke('habit:update', id, updates),
    delete: (id) => ipcRenderer.invoke('habit:delete', id),
    log: (habitId, count) => ipcRenderer.invoke('habit:log', habitId, count),
  },
  prayer: {
    getTimes: (date, lat, lng) => ipcRenderer.invoke('prayer:getTimes', date, lat, lng),
    log: (prayerLog) => ipcRenderer.invoke('prayer:log', prayerLog),
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (settings) => ipcRenderer.invoke('settings:update', settings),
  },
  notification: {
    show: (options) => ipcRenderer.invoke('notification:show', options),
    checkPermission: () => ipcRenderer.invoke('notification:permission'),
    onAction: (callback) => ipcRenderer.on('notification-action', callback),
    removeAllListeners: () => ipcRenderer.removeAllListeners('notification-action'),
  },
  navigation: {
    onNavigate: (callback) => ipcRenderer.on('navigate-to', callback),
    removeNavigationListeners: () => ipcRenderer.removeAllListeners('navigate-to'),
  },
});
