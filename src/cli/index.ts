import inquirer from 'inquirer';
import semver from 'semver';
import fs from 'fs';
import path from 'path';
import entryModuleCompress from '../main/entryModuleCompress';

const cliCacheFilePath = path.join(__dirname, '.cache');

(async() => {
    const cachedData: Partial<EntryModuleCompressionInfo> = {};
    if (fs.existsSync(cliCacheFilePath)) {
        const fileBuffer = fs.readFileSync(cliCacheFilePath);
        Object.assign(cachedData, JSON.parse(fileBuffer.toString()));
    }
    const { moduleName, version, blockFilePath, hardwareConfigPath } = cachedData;
    const result = await inquirer.prompt([
        {
            type: 'input',
            name: 'moduleName',
            default: moduleName,
            message: 'input module\'s distinguished name (it used filename)',
            validate: (name) => !!name,
        },
        {
            type: 'input',
            name: 'version',
            default: version,
            message: 'input module\'s version (must be semantic version style)',
            validate: (name) => (semver.valid(name) ? true : 'version is invalid'),
        },
        {
            type: 'input',
            name: 'blockFilePath',
            default: blockFilePath,
            message: 'input entry-js block file path',
            validate: (filePath: string) => (filePath.endsWith('.js') ? true : 'please select js file'),
        },
        {
            type: 'input',
            name: 'hardwareConfigPath',
            default: hardwareConfigPath,
            message: 'input entry-hw device\'s module config file path',
        },

    ]);

    console.log(result);
    const { confirmResult } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmResult',
        message: 'are you sure?',
    }]);

    if (confirmResult) {
        // cache last input
        fs.writeFileSync(cliCacheFilePath, JSON.stringify(result, null, 4));

        try {
            await entryModuleCompress(result);
            console.log('module compress success. check build directory');
        } catch (e) {
            console.log('Module Compression Failed. see below error');
            console.error(e);
        }
    }
})();
