declare interface EntryModuleMetadata {
    name: string,
    title: string,
    description: string,
    version: number,
    blockName: string,
    moduleName: string,
}

declare interface EntryModuleCompressionInfo {
    moduleName: string,
    title: string,
    description: string,
    version: number,
    blockFilePath: string,
    hardwareModulePath: string,
    hardwareModuleName: string,
}

declare interface LanguageTemplateObject {
    ko ?: string,
    en ?: string,
    jp ?: string,
}
