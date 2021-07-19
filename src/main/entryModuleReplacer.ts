import { Plugin } from 'rollup';

/**
 * for only Entry Project.
 * if input file contains 'module.exports', replace it with 'Entry.moduleManager.registerHardware'
 *
 * for example, input file's last line was 'module.exports = Entry.Arduino;',
 * it will be replaced to 'Entry.moduleManager.registerHardware(Entry.Arduino);'
 *
 * but this plugin don't assume 'module.exports' will be repeated over twice
 */
export function BlockModuleReplacer(): Plugin {
    // module.exports = new Module(); -> new Module()
    const cjsRegex = /(module\.exports[ ]*=[ ]*)(.*);/;
    const esRegex = /(export default )(.*);/;
    const targetValue = 'Entry.moduleManager.registerHardwareModule($2);';
    return {
        name: 'EntryBlockModuleReplacer', // this name will show up in warnings and errors
        transform(contents) {
            return contents.replace(cjsRegex, targetValue).replace(esRegex, targetValue);
        },
    };
}

export function hardwareModuleReplacer(): Plugin {
    // module.exports = new Module(); -> new Module()
    const cjsRegex = /const BaseModule = require\('\.\/baseModule'\)/;
    const esRegex = /import BaseModule from '\.\/baseModule'/;
    const targetValue = `class BaseModule {
        constructor() {this.sp = null;this.socket = null;this.handler = null;this.config = null;this.isDraing = false;}
        init(handler, config) {this.handler = handler;this.config = config;}
        requestInitialData() {}
        checkInitialData() {return true;}
        validateLocalData() {return true;}
        requestRemoteData() {}
        handleRemoteData() {}
        requestLocalData() {}
        handleLocalData() {}
    }module.exports = BaseModule;
    `;
    return {
        name: 'EntryHardwareModuleReplacer', // this name will show up in warnings and errors
        transform(contents) {
            return contents.replace(cjsRegex, targetValue).replace(esRegex, targetValue);
        },
    };
}


