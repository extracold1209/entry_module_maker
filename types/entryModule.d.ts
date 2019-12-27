declare type ObjectLike = { [key: string]: string };

declare interface EntryModuleCompressionInfo {
    moduleName: string,
    version: string,
    hardwareModulePath: string;
    blockFilePath: string,
}

declare interface EntryModuleMetadata extends HardwareMetadata {
    moduleName: string,
    version: string,
}

declare interface LanguageTemplateObject {
    ko?: string,
    en?: string,
    jp?: string,
}

declare type DriverOSTypes = {
    'win32-ia32'?: string,
    'win32-x64'?: string,
    'darwin-x64'?: string,
}

declare type IDriverInfo = ObjectLike | [{ translate: string } & ObjectLike]
declare type IFirmwareInfo =
    string
    | [{ name: string; translate: string }]
    | { afterDelay: number, name: string; type: string }

declare interface RequiredHardwareMetadata {
    category: 'board' | 'robot' | 'module';
    entry: { protocol: 'json' };
    id: string;
    name: LanguageTemplateObject | string,
    icon: string;
    module: string;
    platform: any;
    hardware: any; // hardware Info

    block: string; // 모듈화를 위해서는 필수
}

declare interface HardwareMetadata extends RequiredHardwareMetadata {
    // optional
    driver?: IDriverInfo;
    firmware?: IFirmwareInfo;
    url?: string;
    email?: string;
    video?: string | string[];
    reconnect?: boolean;
    select_com_port?: boolean;
    tryFlasherNumber?: number;
}
