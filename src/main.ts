import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import entryModuleCompress from './main/entryModuleCompress';

global.__rootDir = path.resolve('src', '..');
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

ipcMain.on('compress', async(event: Electron.Event, data: EntryModuleCompressionInfo) => {
    try {
        await entryModuleCompress(data);
        event.sender.send('compress');
    } catch (e) {
        console.error(e);
        event.sender.send('compress', e);
    }
});
