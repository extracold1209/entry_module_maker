import fs from 'fs';
import path from 'path';
import {rollup} from 'rollup';
import moduleReplacerPlugin from './entryModuleReplacer';
import FileUtils from './utils/fileUtils';

const getBuildFilePath = () => path.join(global.__rootDir, 'build');
const getUnpackedBuildPath = () => path.join(getBuildFilePath(), 'unpacked');

export default async (compressionInfo: EntryModuleCompressionInfo) => {
    const {blockFilePath} = compressionInfo;

    try {
        await FileUtils.clearBuildDirectory(getBuildFilePath());
        await rollupBlockFile(blockFilePath);
        await writeMetadataFile(makeMetadata(compressionInfo));
        await compressHardwareModuleFile(compressionInfo);
        await copyImageFile(compressionInfo);
        await compressModule(compressionInfo);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

async function rollupBlockFile(blockFilePath: string) {
    const blockFileName = path.basename(blockFilePath);
    const bundle = await rollup({
        input: blockFilePath,
        plugins: [moduleReplacerPlugin()],
    });
    await bundle.write({
        format: 'iife',
        file: path.join(getUnpackedBuildPath(), blockFileName),
    });
}

/**
 * in imageFile's case,
 * default is entry-hw module's image if not set specific image Path.
 * @param compressionInfo
 */
function makeMetadata(compressionInfo: EntryModuleCompressionInfo): EntryModuleMetadata {
    return {
        name: compressionInfo.moduleName,
        title: compressionInfo.title,
        description: compressionInfo.description,
        version: compressionInfo.version,
        imageFile: `${compressionInfo.hardwareModuleName}.png`,
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
        const filePath = path.join(hardwareModulePath, `${hardwareModuleName}${extension}`);

        if (!FileUtils.isExist(filePath)) {
            throw new Error(`${filePath} not found`);
        }

        return {
            type: 'file',
            filePath: path.join(hardwareModulePath, `${hardwareModuleName}${extension}`),
        };
    });

    await FileUtils.compress(hardwareModuleFilePathList, zipFilePath);
}

async function copyImageFile(compressionInfo: EntryModuleCompressionInfo) {
    const {hardwareModulePath, hardwareModuleName } = compressionInfo;
    const imageFileName = `${hardwareModuleName}.png`;
    await FileUtils.copyFile(path.join(hardwareModulePath, imageFileName), path.join(getUnpackedBuildPath(), imageFileName));
}

async function compressModule(compressionInfo: EntryModuleCompressionInfo) {
    const {moduleName} = compressionInfo;
    const moduleFilePath = path.join(getBuildFilePath(), `${moduleName}.zip`);
    const archiverInformation = {
        type: 'directory',
        filePath: getUnpackedBuildPath(),
    };

    await FileUtils.compress([archiverInformation], moduleFilePath);
}
