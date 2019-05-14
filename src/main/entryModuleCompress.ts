import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import {rollup} from 'rollup';
import moduleReplacerPlugin from './entryModuleReplacer';

const getBuildFilePath = () => path.join(global.__rootDir, 'build');
const getUnpackedBuildPath = () => path.join(getBuildFilePath(), 'unpacked');

export default async (compressionInfo: EntryModuleCompressionInfo) => {
    const { blockFilePath } = compressionInfo;

    await clearBuildDirectory();
    await rollupBlockFile(blockFilePath);
    await writeMetadataFile(makeMetadata(compressionInfo));

    return 'hello';
}

function clearBuildDirectory() {
    return new Promise((resolve, reject) => {
        rimraf(getBuildFilePath(), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function rollupBlockFile(blockFilePath: string) {
    const blockFileName = path.basename(blockFilePath);
    const bundle = await rollup({
        input: blockFilePath,
        plugins: [moduleReplacerPlugin()]
    });
    await bundle.write({
        format: 'iife',
        file: path.join(getUnpackedBuildPath(), blockFileName),
    });
}

function makeMetadata(compressionInfo: EntryModuleCompressionInfo): EntryModuleMetadata {
    return {
        name: compressionInfo.moduleName,
        title: compressionInfo.title,
        description: compressionInfo.description,
        version: compressionInfo.version,
        blockName: path.basename(compressionInfo.blockFilePath),
        moduleName: `${compressionInfo.hardwareModuleName}.zip`,
    };
}

function writeMetadataFile(metadata: EntryModuleMetadata) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(getUnpackedBuildPath(), 'metadata.json'), JSON.stringify(metadata), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}
