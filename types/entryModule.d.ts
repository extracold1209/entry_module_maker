declare type ModuleTypes = 'hardware'

declare interface EntryModuleMetadata {
    moduleName: string,
    name: LanguageTemplateObject | string,
    version: number,
    imageFile: string,
    blockFile: string,
    moduleFile: string,
    type: ModuleTypes,
}

declare interface EntryModuleCompressionInfo {
    moduleName: string,
    version: number,
    blockFilePath: string,
    hardwareModulePath: string,
    type: ModuleTypes
}

declare interface LanguageTemplateObject {
    ko?: string,
    en?: string,
    jp?: string,
}
