import path from "path";
import { unpackedBuildPath } from "../../constants";
import fileUtils, { IArchiverCompression } from "../../utils/fileUtils";

async function compressHardwareModuleFile(
    compressionInfo: EntryModuleCompressionInfo, hardwareInfo: HardwareConfig,
): Promise<void> {
    const { moduleName, hardwareModulePath } = compressionInfo;
    const { icon, module } = hardwareInfo;

    const zipFilePath = path.join(unpackedBuildPath, `${moduleName}.zip`);
    const firmwareDirPath = path.join(unpackedBuildPath, 'firmwares');
    const driverDirPath = path.join(unpackedBuildPath, 'drivers');

    const compressionFilesInfo = prepareExtractFileList(hardwareModulePath, [`${moduleName}.json`, icon, module]);
    [firmwareDirPath, driverDirPath].forEach((dirPath) => {
        fileUtils.isEmptyDir(dirPath) || compressionFilesInfo.push({
            type: 'directory',
            filePath: dirPath,
        });
    });

    await fileUtils.compress(compressionFilesInfo, zipFilePath);
}

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

export default compressHardwareModuleFile;
