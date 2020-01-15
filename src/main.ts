import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import entryModuleCompress from './main/entryModuleCompress';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'rendererProcessor'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'statics', 'index.html'));
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('compress', async(event: Electron.Event, data: EntryModuleCompressionInfo) => {
    return await entryModuleCompress(data);
});
