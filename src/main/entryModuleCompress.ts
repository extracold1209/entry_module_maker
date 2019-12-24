import fs from 'fs';
import {merge, omit} from 'lodash';
import path from 'path';
import {rollup} from 'rollup';
import moduleReplacerPlugin from './entryModuleReplacer';
import FileUtils from './utils/fileUtils';

const getBuildFilePath = () => path.join(global.__rootDir, 'build');
const getUnpackedBuildPath = () => path.join(getBuildFilePath(), 'unpacked');

export default async(compressionInfo: EntryModuleCompressionInfo) => {
    const { blockFilePath, hardwareModulePath, moduleName } = compressionInfo;

    try {
        const moduleMetadata = await appendFromHardwareJsonFile(
            compressionInfo,
            path.join(hardwareModulePath, `${moduleName}.json`),
        );
        await FileUtils.clearBuildDirectory(getBuildFilePath());
        await rollupBlockFile(blockFilePath);
        await writeMetadataFile(moduleMetadata);
        await compressHardwareModuleFile(hardwareModulePath, moduleMetadata);
        await compressModule(moduleMetadata);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

async function appendFromHardwareJsonFile(
    compressionInfo: EntryModuleCompressionInfo, configFilePath: string): Promise<EntryModuleMetadata> {
    if (!await FileUtils.isExist(configFilePath)) {
        throw new Error(`${configFilePath} not exist`);
    }

    const hardwareConfigJson = await FileUtils.readJSONFile(configFilePath);
    return omit(merge(compressionInfo, hardwareConfigJson), ['hardwareModulePath', 'blockFilePath']) as EntryModuleMetadata;
}

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

async function compressHardwareModuleFile(baseHardwareModulePath: string, compressionInfo: EntryModuleMetadata) {
    // const { icon, module } = await forceModifyHardwareModule(compressionInfo);
    const { icon, module } = compressionInfo;
    await Promise.all([icon, module].map(async(file) => {
        const filePath = path.join(baseHardwareModulePath, file);

        if (!await FileUtils.isExist(filePath)) {
            throw new Error(`${filePath} not found`);
        }
        
        await FileUtils.copyFile(filePath, path.join(getUnpackedBuildPath(), file));
    }));
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
async function forceModifyHardwareModule({ hardwareModulePath, version, moduleName }: EntryModuleCompressionInfo): Promise<EntryModuleCompressionInfo> {
    return new Promise((resolve, reject) => {
        const jsonFilePath = path.join(hardwareModulePath, `${moduleName}.json`);

        fs.readFile(jsonFilePath, async(err, data) => {
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
        });
    });
}

async function compressModule(compressionInfo: EntryModuleMetadata) {
    const { moduleName } = compressionInfo;
    const moduleFilePath = path.join(getBuildFilePath(), `${moduleName}.zip`);
    const archiverInformation = {
        type: 'directory',
        filePath: getUnpackedBuildPath(),
    };

    await FileUtils.compress([archiverInformation], moduleFilePath);
}
