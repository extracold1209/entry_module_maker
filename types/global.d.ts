declare namespace NodeJS {
    interface Global {
        compressModule: (a: EntryModuleCompressionInfo) => Promise<string>
        __rootDir: string
    }
}
