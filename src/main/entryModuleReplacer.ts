import {Plugin} from 'rollup';

/**
 * for only Entry Project.
 * if input file contains 'module.exports', replace it with 'Entry.moduleManager.registerHardware'
 *
 * for example, input file's last line was 'module.exports = Entry.Arduino;',
 * it will be replaced to 'Entry.moduleManager.registerHardware(Entry.Arduino);'
 *
 * but this plugin don't assume 'module.exports' will be repeated over twice
 */
export default function EntryModuleReplacer(): Plugin {
    // module.exports = new Module(); -> new Module()
    const searchRegex = /(module\.exports[ ]*=[ ]*)(.*);/;
    const targetValue = 'Entry.moduleManager.registerHardwareModule($2);';
    return {
        name: 'EntryModuleReplacer', // this name will show up in warnings and errors
        transform(contents) {
            return contents.replace(searchRegex, targetValue);
        }
    };
}
