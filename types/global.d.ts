declare namespace NodeJS {
    interface Global {
        compressModule: (a: EntryModuleCompressionInfo) => Promise<void>;
        openBuildDirectory: () => void;
        getHardwareJsonInfo: (filePath: string) => { [key: string]: any };
        getBlockJsInfo: (filePath: string) => { [key: string]: any };
        compressLiteModule: (a: EntryLiteModuleCompressionInfo) => Promise<void>;
    }
}
