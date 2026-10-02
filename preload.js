const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  save: (name, data) => ipcRenderer.invoke('save', name, data),
  auto: json => ipcRenderer.send('auto', json)
});
