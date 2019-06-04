declare type DriverOSTypes = {
    'win32-ia32'?: string,
    'win32-x64'?: string,
    'darwin-x64'?: string,
}

declare interface HardwareMetadata {
    platform: string | string[],
    category: string,
    id?: string,
    firmware?: string,
    driver?: DriverOSTypes,
}

declare interface HardwareInformation extends HardwareMetadata {
    name: LanguageTemplateObject,
    icon: string,
    module: string,
}

declare interface EntryHardwareModuleMetadata extends EntryModuleMetadata {
    hardware: HardwareMetadata
}
