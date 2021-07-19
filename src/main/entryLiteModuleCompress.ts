import { buildFilePath, unpackedBuildPath } from './constants';
import FileUtils from './utils/fileUtils';
import path from 'path';

async function copyFile(original: string, dest: string): Promise<void> {
    await FileUtils.copyFile(original, dest);
}

async function compressModule(moduleName: string): Promise<void> {
    const moduleFilePath = path.join(buildFilePath, `${moduleName}.zip`);
    const archiverInformation = {
        type: 'root',
        filePath: unpackedBuildPath,
    };

    await FileUtils.compress([archiverInformation], moduleFilePath);
}

export default async (compressionInfo: EntryLiteModuleCompressionInfo) => {
    // all path
    console.log(compressionInfo);
    const { imageInfo, blockInfo, metadataInfo, moduleName } = compressionInfo;
    try {
        await FileUtils.clearDirectory(buildFilePath);
        await Promise.all([
            copyFile(imageInfo, path.join(unpackedBuildPath, 'image.png')),
            copyFile(blockInfo, path.join(unpackedBuildPath, 'block.js')),
            copyFile(metadataInfo, path.join(unpackedBuildPath, 'metadata.json')),
        ]);
        await compressModule(moduleName);
    } catch (e) {
        console.error(e);
        throw e;
    }
};
