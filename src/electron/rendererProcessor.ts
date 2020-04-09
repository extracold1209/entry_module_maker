import { ipcRenderer, shell } from 'electron';
import path from 'path';

process.once('loaded', () => {
    global.compressModule = async(compressionInfo: EntryModuleCompressionInfo) => {
        await ipcRenderer.invoke('compress', compressionInfo);
    };

    global.openBuildDirectory = () => {
        shell.openItem(path.join(__dirname, '..', '..', 'build'));
    };
});
