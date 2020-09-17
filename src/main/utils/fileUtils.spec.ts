import {describe, it} from 'mocha';
import {assert} from 'chai';
import path from 'path';
import fileUtils from './fileUtils';

describe('fileUtils 테스트', function () {
    it('js 파일 가져오기', async function () {
        // given
        const dummyJsFilePath = path.join(__dirname, '..', '..', '..', 'test', 'block_arduino_ext.js');

        try {
            //when
            const file = await fileUtils.readJsFile(dummyJsFilePath);

            //then
            assert.isDefined(file);
        } catch (e) {
            assert.fail();
        }
    });

    it('js 파일의 특정 프로퍼티만 가져오기', async function () {
        // given
        const dummyJsFilePath = path.join(__dirname, '..', '..', '..', 'test', 'block_arduino_ext.js');

        try {
            //when
            const file = await fileUtils.readJsFile(dummyJsFilePath, ['id', 'name']);

            //then
            assert.deepEqual(file, {
                id: '1.9',
                name: 'ArduinoExt'
            });
        } catch (e) {
            assert.fail();
        }
    });
});
