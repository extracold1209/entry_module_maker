import {ipcRenderer} from 'electron';

process.once('loaded', () => {
    global.compressModule = async (a: EntryModuleCompressionInfo) => {
        ipcRenderer.send('compress', a);
    };
});
