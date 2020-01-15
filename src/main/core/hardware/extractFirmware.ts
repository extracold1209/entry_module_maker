import path from 'path';
import { unpackedBuildPath } from '../../constants';
import fileUtils from "../../utils/fileUtils";

async function extractFirmware(hardwareModulePath: string, firmwareInfo: HardwareFirmware): Promise<string[]> {
    const srcFirmwareDirPath = path.join(hardwareModulePath, '..', 'firmwares');
    const destFirmwareDirPath = path.join(unpackedBuildPath, 'firmwares');
    const firmwareNames: string[] = [];

    if (typeof firmwareInfo === 'string') {
        firmwareNames.push(`${firmwareInfo}.hex`);
    } else if (Array.isArray(firmwareInfo)) {
        //TODO name 외에는 필요없음. 그러나 확실히 잘못된 타입
        firmwareInfo.forEach((firmware: {name: string;}) => {
            firmwareNames.push(`${firmware.name}.hex`);
        });
    } else {
        // {name: string; translate: string;}
        const { name: firmwareName } = firmwareInfo;
        firmwareNames.push(`${firmwareName}.hex`);
    }

    await Promise.all(firmwareNames.map((firmwareName) => fileUtils.copyFile(
        path.join(srcFirmwareDirPath, firmwareName),
        path.join(destFirmwareDirPath, firmwareName),
    )));

    return firmwareNames;
}

export default extractFirmware;
