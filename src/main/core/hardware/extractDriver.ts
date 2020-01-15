import path from 'path';
import { unpackedBuildPath } from '../../constants';
import fileUtils from "../../utils/fileUtils";

async function extractDriver(hardwareModulePath: string, driverInfo: HardwareDriver): Promise<string[]> {
    const srcDriverDirPath = path.join(hardwareModulePath, '..', 'drivers');
    const destDriverDirPath = path.join(unpackedBuildPath, 'drivers');
    const driverNames: string[] = [];

    if (Array.isArray(driverInfo)) {
        driverInfo.forEach((driver) => {
            Object.entries(driver).forEach(([key, value]) => {
                if (key === 'translate' || !value) {
                    return;
                }

                driverNames.push(value);
            });
        });
    } else {
        Object.entries(driverInfo).forEach(([key, value]) => {
            if (key === 'translate' || !value) {
                return;
            }

            driverNames.push(value);
        });
    }

    await Promise.all(driverNames.map((firmwareName) => fileUtils.copyFile(
        path.join(srcDriverDirPath, firmwareName),
        path.join(destDriverDirPath, firmwareName),
    )));

    return driverNames;
}

export default extractDriver;
