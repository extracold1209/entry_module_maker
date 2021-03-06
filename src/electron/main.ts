import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import entryModuleCompress from '../main/entryModuleCompress';
import entryLiteModuleCompress from '../main/entryLiteModuleCompress';
import fileUtils from '../main/utils/fileUtils';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.allowRendererProcessReuse = true;

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

ipcMain.handle('compress', async (event: Electron.Event, data: EntryModuleCompressionInfo) => {
    return await entryModuleCompress(data);
});

ipcMain.handle(
    'compressLite',
    async (event: Electron.Event, data: EntryLiteModuleCompressionInfo) => {
        return await entryLiteModuleCompress(data);
    }
);

ipcMain.handle('getJsonFileInfo', async (event, filePath: string) => {
    try {
        return await fileUtils.readJSONFile(filePath);
    } catch (e) {
        console.warn(e);
    }
});

ipcMain.handle('getBlockFileInfo', async (event, filePath: string) => {
    try {
        return await fileUtils.readJsFile(filePath, ['id', 'name']);
    } catch (e) {
        console.warn(e);
    }
});
