import { ipcRenderer, shell } from 'electron';
import path from 'path';

process.once('loaded', () => {
    global.compressModule = async (compressionInfo: EntryModuleCompressionInfo) => {
        await ipcRenderer.invoke('compress', compressionInfo);
    };

    global.openBuildDirectory = () => {
        shell.openItem(path.join(__dirname, '..', '..', 'build'));
    };

    global.getHardwareJsonInfo = async (filePath: string) => {
        return await ipcRenderer.invoke('getJsonFileInfo', filePath);
    };

    global.getBlockJsInfo = async (filePath: string) => {
        return await ipcRenderer.invoke('getBlockFileInfo', filePath);
    };

    global.compressLiteModule = async (compressionInfo: EntryLiteModuleCompressionInfo) => {
        await ipcRenderer.invoke('compressLite', compressionInfo);
    };
});
