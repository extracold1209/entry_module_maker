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
        await writeMetadataFile(await makeMetadata(compressionInfo));
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
    if (!await FileUtils.isExist(blockFilePath)) {
        throw new Error(`${blockFilePath} not exist`);
    }
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
async function makeMetadata(compressionInfo: EntryModuleCompressionInfo): Promise<EntryHardwareModuleMetadata> {
    const { hardwareModulePath, moduleName } = compressionInfo;
    const hardwareInfo = await FileUtils.readJSONFile<HardwareInformation>(path.join(hardwareModulePath, `${moduleName}.json`));

    const hardwareMetadata: HardwareMetadata = {
        category: hardwareInfo.category,
        platform: hardwareInfo.platform
    };
    if (hardwareInfo.driver) {
        hardwareMetadata.driver = hardwareInfo.driver;
    }
    if (hardwareInfo.firmware) {
        hardwareMetadata.firmware = hardwareInfo.firmware;
    }

    return {
        moduleName: compressionInfo.moduleName,
        title: hardwareInfo.name,
        version: compressionInfo.version,
        imageFile: `${compressionInfo.moduleName}.png`,
        blockFile: path.basename(compressionInfo.blockFilePath),
        moduleFile: `${compressionInfo.moduleName}.zip`,
        type: 'hardware',
        hardware: hardwareMetadata,
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
    const {hardwareModulePath, moduleName} = compressionInfo;
    const hardwareRequiredExtensionList = ['.png', '.js', '.json'];

    const zipFilePath = path.join(getUnpackedBuildPath(), `${moduleName}.zip`);
    const hardwareModuleFilePathList = hardwareRequiredExtensionList.map((extension) => {
        const filePath = path.join(hardwareModulePath, `${moduleName}${extension}`);

        if (!FileUtils.isExist(filePath)) {
            throw new Error(`${filePath} not found`);
        }

        return {
            type: 'file',
            filePath: path.join(hardwareModulePath, `${moduleName}${extension}`),
        };
    });

    await FileUtils.compress(hardwareModuleFilePathList, zipFilePath);
}

async function copyImageFile(compressionInfo: EntryModuleCompressionInfo) {
    const {hardwareModulePath, moduleName} = compressionInfo;
    const imageFileName = `${moduleName}.png`;
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
