import {ipcRenderer} from 'electron';

process.once('loaded', () => {
    global.compressModule = (a: EntryModuleCompressionInfo) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('compress', a);
            ipcRenderer.on('compress', (event: Electron.Event, error?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };
});
