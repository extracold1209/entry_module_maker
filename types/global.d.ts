declare module NodeJS {
    interface Global {
        compressModule: (a: EntryModuleCompressionInfo) => void
    }
}
