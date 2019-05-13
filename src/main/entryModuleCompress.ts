import path from 'path';
import {rollup} from 'rollup';

export default async (obj: EntryModuleCompressionInfo) => {
    console.log('a', obj);
    const bundle = await rollup({
        input: obj.blockFile
    });
    await bundle.write({
        format: 'iife',
        file: path.join(__dirname, 'build', 'build.js'),
    });
    return 'hello';
}
