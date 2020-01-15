import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import path from 'path';
import { rollup } from 'rollup';
import { buildFilePath, unpackedBuildPath } from './constants';
import extractFirmware from "./core/hardware/extractFirmware";
import compressHardwareModuleFile from './core/hardware/compressHardwareModule';
import moduleReplacerPlugin from './entryModuleReplacer';
import FileUtils from './utils/fileUtils';

export default async(compressionInfo: EntryModuleCompressionInfo) => {
    const { hardwareModulePath, moduleName, blockFilePath } = compressionInfo;

    try {
        const hardwareJSONPath = path.join(hardwareModulePath, `${moduleName}.json`);
        const hardwareInfo = await FileUtils.readJSONFile<HardwareConfig>(hardwareJSONPath);

        await FileUtils.clearBuildDirectory(buildFilePath);
        await rollupBlockFile(blockFilePath);
        await copyImageFile(hardwareModulePath, hardwareInfo);
        if (hardwareInfo.firmware) {
            await extractFirmware(hardwareModulePath, hardwareInfo.firmware);
        }

        await forceModifyHardwareModule(hardwareJSONPath, hardwareInfo, compressionInfo);
        await compressHardwareModuleFile(compressionInfo, hardwareInfo);

        await writeMetadata(compressionInfo, hardwareInfo);
        await compressModule(moduleName);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

async function rollupBlockFile(blockFilePath: string): Promise<void> {
    const blockFileName = path.basename(blockFilePath);
    if (!await FileUtils.isExist(blockFilePath)) {
        throw new Error(`${blockFilePath} not exist`);
    }
    const bundle = await rollup({
        input: blockFilePath,
        inlineDynamicImports: true,
        plugins: [rollupResolve(), rollupCommonjs(), moduleReplacerPlugin()],
    });
    await bundle.write({
        format: 'iife',
        file: path.join(unpackedBuildPath, blockFileName),
    });
}

async function writeMetadata(compressionInfo: EntryModuleCompressionInfo, hardwareInfo: HardwareConfig): Promise<void> {
    const { moduleName, blockFilePath, version } = compressionInfo;
    const { platform, category, id } = hardwareInfo;
    const metadata: EntryModuleMetadata = {
        moduleName,
        version,
        type: 'hardware',
        title: hardwareInfo.name,
        files: {
            image: hardwareInfo.icon,
            block: path.basename(blockFilePath),
            module: `${moduleName}.zip`,
        },
        properties: { platform, category, id },
    };

    await FileUtils.writeJSONFile(path.join(unpackedBuildPath, 'metadata.json'), metadata);
}

async function copyImageFile(hardwareModulePath: string, hardwareInfo: HardwareConfig): Promise<void> {
    const { icon } = hardwareInfo;
    await FileUtils.copyFile(
        path.join(hardwareModulePath, icon),
        path.join(unpackedBuildPath, icon),
    );
}

/**
 * 이전 하드웨어 모듈을 강제로 최신규약으로 수정하는 로직.
 * 아래의 일을 수행한다.
 * - moduleName, version 프로퍼티 주입
 * - icon, module 이 json 파일명과 다른 경우, 파일을 복사하고 강제로 icon, module 을 동일화
 *   (타사의 파일을 참조할 경우가 있을 수 있으므로 동일 코드여도 따로 관리하도록 규정)
 */
async function forceModifyHardwareModule(
    hardwareJSONPath: string,
    hardwareInfo: HardwareConfig,
    compressionInfo: EntryModuleCompressionInfo,
): Promise<void> {
    const { moduleName, version } = compressionInfo;

    hardwareInfo.moduleName = moduleName;
    hardwareInfo.version = version;
    await FileUtils.writeJSONFile(hardwareJSONPath, hardwareInfo);
}

async function compressModule(moduleName: string): Promise<void> {
    const moduleFilePath = path.join(buildFilePath, `${moduleName}.zip`);
    const archiverInformation = {
        type: 'directory',
        filePath: unpackedBuildPath,
    };

    await FileUtils.compress([archiverInformation], moduleFilePath);
}
