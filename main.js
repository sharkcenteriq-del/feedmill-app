const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path'), fs = require('fs');
if (!app.requestSingleInstanceLock()) app.quit();
function create() {
  const w = new BrowserWindow({
    width: 1280, height: 820, minWidth: 900, minHeight: 600,
    title: 'مخزن معمل العلف', backgroundColor: '#1F3B2E',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  w.loadFile(path.join(__dirname, 'www/index.html'));
  w.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  w.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); } });
  w.on('page-title-updated', e => e.preventDefault());
}
ipcMain.handle('save', async (e, name, data) => {
  const r = await dialog.showSaveDialog({ defaultPath: path.join(app.getPath('documents'), name) });
  if (r.canceled || !r.filePath) return false;
  fs.writeFileSync(r.filePath, typeof data === 'string' ? data : Buffer.from(data));
  return true;
});
ipcMain.on('auto', (e, json) => {
  try {
    const d = path.join(app.getPath('userData'), 'backups');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'auto-' + new Date().toISOString().slice(0, 10) + '.json'), json);
    fs.readdirSync(d).filter(x => x.startsWith('auto-')).sort().reverse().slice(14).forEach(x => fs.unlinkSync(path.join(d, x)));
  } catch (_) {}
});
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
