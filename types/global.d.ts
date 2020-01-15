declare namespace NodeJS {
    interface Global {
        compressModule: (a: EntryModuleCompressionInfo) => Promise<void>
        openBuildDirectory: () => void;
    }
}
