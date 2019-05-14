import fs from 'fs';
import path from 'path';
import {rollup} from 'rollup';
import moduleReplacerPlugin from './entryModuleReplacer';
import FileUtils from './utils/fileUtils';

const getBuildFilePath = () => path.join(global.__rootDir, 'build');
const getUnpackedBuildPath = () => path.join(getBuildFilePath(), 'unpacked');

export default async (compressionInfo: EntryModuleCompressionInfo) => {
    const {blockFilePath} = compressionInfo;

    await FileUtils.clearBuildDirectory(getBuildFilePath());
    await rollupBlockFile(blockFilePath);
    await writeMetadataFile(makeMetadata(compressionInfo));
    await compressHardwareModuleFile(compressionInfo);

    return 'hello';
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
        });
    });
}

async function compressHardwareModuleFile(compressionInfo: EntryModuleCompressionInfo) {
    const {hardwareModulePath, hardwareModuleName} = compressionInfo;
    const hardwareRequiredExtensionList = ['.png', '.js', '.json'];

    const zipFilePath = path.join(getUnpackedBuildPath(), `${hardwareModuleName}.zip`);
    const hardwareModuleFilePathList = hardwareRequiredExtensionList.map((extension) => {
        return {
            type: 'file',
            filePath: path.join(hardwareModulePath, `${hardwareModuleName}${extension}`)
        };
    });

    await FileUtils.compress(hardwareModuleFilePathList, zipFilePath);
}
