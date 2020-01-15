import { describe, it, after, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import extractFunction from './extractFirmware';
import fileUtils from "../../utils/fileUtils";


describe('extractFirmware 테스트', function() {
    const copyFileStub = sinon.stub(fileUtils, 'copyFile');

    it('string 으로만 있는 펌웨어 복사', async function() {
        const dummyPath = '/Users/user/entry_projects/entry-hw/app/modules';
        const dummyFirmwareName: HardwareFirmware = 'arduino';

        const copiedFirmwares = await extractFunction(dummyPath, dummyFirmwareName);
        sinon.assert.calledOnce(copyFileStub);
        expect(copiedFirmwares).to.eql([dummyFirmwareName]);
    });

    it('coreUtils 정상 파일 넣고 실행', async function() {
        const dummyPath = '/Users/user/entry_projects/entry-hw/app/modules';
        const dummyFirmwareName: HardwareFirmware = [
            {
                translate: 'FirstFirmware',
                name: 'arduino',
            },
            {
                translate: 'FirstFirmware',
                name: 'arduinoExt',
            },
        ];

        const copiedFirmwares = await extractFunction(dummyPath, dummyFirmwareName);
        sinon.assert.calledTwice(copyFileStub);
        expect(copiedFirmwares).to.eql(dummyFirmwareName.map((firmware) => firmware.name));
    });

    afterEach(function() {
        copyFileStub.reset();
    });

    after(function() {
        copyFileStub.restore();
    });
});
