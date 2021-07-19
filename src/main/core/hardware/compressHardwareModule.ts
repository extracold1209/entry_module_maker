import path from 'path';
import { unpackedBuildPath } from '../../constants';
import fileUtils, { IArchiverCompression } from '../../utils/fileUtils';
import copyDriver from './extractDriver';
import copyFirmware from './extractFirmware';

function prepareExtractFileList(basePath: string, filenameList: string[]): IArchiverCompression[] {
    return filenameList.map((file) => {
        const filePath = path.join(basePath, file);

        if (!fileUtils.isExist(filePath)) {
            throw new Error(`${filePath} not found`);
        }

        return {
            type: 'file',
            filePath: path.join(basePath, file),
        };
    });
}

async function compressHardwareModuleFile(
    compressionInfo: EntryModuleCompressionInfo,
    hardwareInfo: HardwareConfig
): Promise<void> {
    const { moduleName, hardwareConfigPath } = compressionInfo;
    const { icon, module } = hardwareInfo;

    const hardwareModuleBasePath = path.dirname(hardwareConfigPath);

    const zipFilePath = path.join(unpackedBuildPath, `${moduleName}.zip`);
    const firmwareDirPath = path.join(unpackedBuildPath, 'firmwares');
    const driverDirPath = path.join(unpackedBuildPath, 'drivers');

    if (hardwareInfo.firmware) {
        await copyFirmware(hardwareConfigPath, hardwareInfo.firmware);
    }
    if (hardwareInfo.driver) {
        await copyDriver(hardwareConfigPath, hardwareInfo.driver);
    }

    const compressionFilesInfo = prepareExtractFileList(hardwareModuleBasePath, [
        `${moduleName}.json`,
        icon,
        module,
    ]);
    [firmwareDirPath, driverDirPath].forEach((dirPath) => {
        !fileUtils.isEmptyDir(dirPath) &&
            compressionFilesInfo.push({
                type: 'directory',
                filePath: dirPath,
            });
    });

    await fileUtils.compress(compressionFilesInfo, zipFilePath);
    await fileUtils.clearDirectory(firmwareDirPath);
    await fileUtils.clearDirectory(driverDirPath);
}

export default compressHardwareModuleFile;
