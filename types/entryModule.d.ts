declare type ModuleTypes = 'hardware'
declare type DriverOSTypes = {
    'win32-ia32'?: string,
    'win32-x64'?: string,
    'darwin-x64'?: string,
}

declare interface EntryModuleMetadata {
    moduleName: string,
    title: LanguageTemplateObject | string,
    version: number,
    imageFile: string,
    blockFile: string,
    moduleFile: string,
    type: ModuleTypes,
}

declare interface HardwareMetadata {
    platform: string | string[],
    category: string,
    firmware?: string,
    driver?: DriverOSTypes,
}

declare interface HardwareInformation extends HardwareMetadata {
    name: LanguageTemplateObject,
}

declare interface EntryHardwareModuleMetadata extends EntryModuleMetadata {
    hardware: HardwareMetadata
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
