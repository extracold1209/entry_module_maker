declare interface EntryModuleMetadata {
    name: string,
    title: string,
    version: number,
    imageFile: string,
    blockName: string,
    moduleName: string,
}

declare interface EntryModuleCompressionInfo {
    moduleName: string,
    title: string,
    version: number,
    blockFilePath: string,
    hardwareModulePath: string,
}

declare interface LanguageTemplateObject {
    ko ?: string,
    en ?: string,
    jp ?: string,
}
