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
    if (hardwareInfo.id) {
        hardwareMetadata.id = hardwareInfo.id;
    }

    return {
        moduleName: compressionInfo.moduleName,
        name: hardwareInfo.name,
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

    const { icon, module } = await forceModifyHardwareModule(compressionInfo);
    const zipFilePath = path.join(getUnpackedBuildPath(), `${moduleName}.zip`);
    const hardwareModuleFilePathList = [`${moduleName}.json`, icon, module].map((file) => {
        const filePath = path.join(hardwareModulePath, file);

        if (!FileUtils.isExist(filePath)) {
            throw new Error(`${filePath} not found`);
        }

        return {
            type: 'file',
            filePath: path.join(hardwareModulePath, file),
        };
    });

    await FileUtils.compress(hardwareModuleFilePathList, zipFilePath);
}

async function validateAndChangeHardwareFiles(icon: string, module: string) {

}

/**
 * 이전 하드웨어 모듈을 강제로 최신규약으로 수정하는 로직.
 * 아래의 일을 수행한다.
 * - moduleName, version 프로퍼티 주입
 * - icon, module 이 json 파일명과 다른 경우, 파일을 복사하고 강제로 icon, module 을 동일화
 *   (타사의 파일을 참조할 경우가 있을 수 있으므로 동일 코드여도 따로 관리하도록 규정)
 * @param hardwareModulePath 모듈이 존재하는 디렉토리
 * @param version 모듈 버전
 * @param moduleName 모듈명
 */
async function forceModifyHardwareModule({ hardwareModulePath, version, moduleName }:EntryModuleCompressionInfo): Promise<HardwareInformation> {
    return new Promise((resolve, reject) => {
        const jsonFilePath = path.join(hardwareModulePath, `${moduleName}.json`);

        fs.readFile(jsonFilePath, async (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            const configJson = JSON.parse(data.toString());

            configJson.moduleName = moduleName;
            configJson.version = version;

            if (configJson.icon) {
                const [name, extension] = configJson.icon.split('.');
                if (name !== moduleName) {
                    const newIconFileName = `${configJson.moduleName}.${extension}`;
                    await FileUtils.copyFile(
                        path.join(hardwareModulePath, configJson.icon),
                        path.join(hardwareModulePath, newIconFileName)
                    );
                    configJson.icon = newIconFileName;
                }
            }

            if (configJson.icon) {
                const [name, extension] = configJson.icon.split('.');
                if (name !== moduleName) {
                    const newIconFileName = `${configJson.moduleName}.${extension}`;
                    await FileUtils.copyFile(
                        path.join(hardwareModulePath, configJson.icon),
                        path.join(hardwareModulePath, newIconFileName)
                    );
                    configJson.icon = newIconFileName;
                }
            }
            if (configJson.module) {
                const [name, extension] = configJson.module.split('.');
                if (name !== moduleName) {
                    const newModuleFileName = `${configJson.moduleName}.${extension}`;
                    await FileUtils.copyFile(
                        path.join(hardwareModulePath, configJson.icon),
                        path.join(hardwareModulePath, newModuleFileName)
                    );
                    configJson.module = newModuleFileName;
                }
            }

            fs.writeFile(jsonFilePath, JSON.stringify(configJson, null, 4), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(configJson);
                }
            });
        })
    });
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
