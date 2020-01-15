declare interface EntryModuleCompressionInfo {
    moduleName: string,
    version: string,
    hardwareModulePath: string;
    blockFilePath: string,
}

declare interface EntryModuleMetadata {
    moduleName: string;
    version: string;
    title: LanguageTemplateObject | string;
    files: {
        image: string;
        block: string;
        [key: string]: string;
    }
    properties?: {
        [key: string]: string
    }
    type: 'hardware';
}

declare interface LanguageTemplateObject {
    ko?: string,
    en?: string,
    jp?: string,
}

declare interface HardwareConfig {
    id: string;
    name: LanguageTemplateObject | string;
    icon: string;
    module: string;
    category: string;
    platform: any;
    firmware?: HardwareFirmware;
    driver?: HardwareDriver;
    moduleName?: string; // legacy 에는 없을 수 있음
    version?: string; // legacy 에는 없을 수 있음
}

declare type HardwareFirmware = string |
    { name: string; translate: string; } |
    { name: string; translate: string; }[] |
    { type: "copy"; name: string; afterDelay: number; }[]

type HardwareDriverElement = {
    'win32-ia32'?: string;
    'win32-x64'?: string;
    'darwin-x64'?: string;
    translate?: string;
};
declare type HardwareDriver = HardwareDriverElement | HardwareDriverElement[];
