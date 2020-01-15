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
    moduleName?: string; // legacy 에는 없을 수 있음
    version?: string; // legacy 에는 없을 수 있음
    firmware?: HardwareFirmware
}

declare type HardwareFirmware = string |
    { name: string; translate: string; } |
    { name: string; translate: string; }[] |
    { type: "copy"; name: string; afterDelay: number; }[]
